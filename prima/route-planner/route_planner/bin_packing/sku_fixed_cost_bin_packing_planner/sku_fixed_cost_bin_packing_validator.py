import copy
import json

import numpy as np
import uuid
from route_planner.constants.app_constants import UploadJobsStatus

from route_planner.utils import logging
import os

import pandas as pd

from memory_profiler import profile

from route_planner.constants.app_configuration import AppConfig
from route_planner.constants.requests_log_messages import RequestLogMessages
from route_planner.exceptions.exceptions import ValidationError, AppException, RequestTerminationException
from route_planner.gcp.prima_storage_config import PrimaGoogleStorageConfiguration
from route_planner.services.upload_jobs import RequestsServices
from route_planner.bin_packing.sku_fixed_cost_bin_packing_planner.validator.base_validator import BaseValidator
from route_planner.bin_packing.sku_fixed_cost_bin_packing_planner.validator.products_validator import ProductsValidator
from route_planner.bin_packing.sku_fixed_cost_bin_packing_planner.validator.task_validator import TaskValidator
from route_planner.bin_packing.sku_fixed_cost_bin_packing_planner.validator.vehicles_validator import VehiclesValidator
from route_planner.bin_packing.sku_fixed_cost_bin_packing_planner.sku_fixed_cost_bin_packing_solver_configuration import SkuFixedSolverConfigurationV4
from solvers.solver_v4.exporter import export_output, export_aggregated_output, export_confusion_matrix, export_summary_output, export_vehicle_output
from solvers.solver_v4.solver import SolverV4
from route_planner.utils.utils import get_current_timestamp
from route_planner.services.requests_log import RequestLog

logger = logging.getLogger(__name__)


class BinPackingUploadValidation(object):

    def __init__(self, file, rid, search_time_limit):
        self.file = file
        self._rid = rid
        self.problems = list()
        self._VALID_VEHICLES_LIST = list()
        self.extra_values_list = list()
        self.search_time_limit = search_time_limit

        self.base_validator = BaseValidator(self.file, self._rid)

        self.task_validator = TaskValidator(self.base_validator)
        self.vehicles_validator = VehiclesValidator(self.base_validator)
        self.products_validator = ProductsValidator(self.base_validator)
        self.timestamp = get_current_timestamp()

    def _valid_vehicle_type(self, value):
        if isinstance(value, str):
            vehicles_list = value.lower().split(',')
            return set(vehicles_list).issubset(set(self._VALID_VEHICLES_LIST))
        return False

    def _get_actual_vehicle_case(self, invalid_vehicles, value) -> list:
        vehicle_actual_case = value.split(",")
        vehicle_lower_case = value.lower().split(",")

        invalid_indexes = [vehicle_lower_case.index(veh) for veh in invalid_vehicles]
        valid_vehicles = [vehicle_actual_case[idx] for idx in invalid_indexes]
        return valid_vehicles

    def _filter_error(self, value):
        """
        serviceable_vehicles_validation helper method.

        Filter valu

        Parameters:
        ----------
         value : str
            Comma separated string
        """
        if isinstance(value, str):
            vehicles_list = value.lower().split(',')
            invalid_vehicles = list(set(vehicles_list) - (set(self._VALID_VEHICLES_LIST)))
            if invalid_vehicles:
                return ",".join(self._get_actual_vehicle_case(invalid_vehicles, value))
        return value

    @staticmethod
    def _sanitize_serviceable_vehicles(value, valid_vehicle_map):
        vehicles_list = value.lower().split(',')
        vehicles_list = [valid_vehicle_map.get(v) for v in vehicles_list]
        return ",".join(vehicles_list)

    def serviceable_vehicles_validation(self):
        """
        Validate Serviceable Vehicles col. in Task by Valid Vehicles
        """
        self._VALID_VEHICLES_LIST = self.vehicles_validator.df['Vehicle Type*'].copy().str.lower().to_list()
        error = False
        col = self.task_validator.df['Serviceable Vehicles'].dropna().copy()
        valid_rows = col.map(lambda x: self._valid_vehicle_type(x))
        if not valid_rows.all():
            indexes = valid_rows[valid_rows == False].index.to_list()
            filtered_rows = self.task_validator.df.loc[indexes].copy()
            filtered_rows['Serviceable Vehicles'] = filtered_rows['Serviceable Vehicles'].map(lambda x: self._filter_error(x))
            rows = filtered_rows.to_dict(orient='records')
            message = f"Vehicle in Serviceable Vehicles not exists in Vehicle Sheet"
            self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.task_validator.SHEET))
            error = True

        col = self.task_validator.new_df['serviceable_vehicles'].copy().dropna()

        if not error:
            indexes = col.index.to_list()
            _VALID_VEHICLES = self.vehicles_validator.df['Vehicle Type*'].copy().to_list()
            _valid_vehicle_map = {str(v).lower(): v for v in _VALID_VEHICLES}
            # col = col.map(lambda x: MultiProductUploadValidation._sanitize_serviceable_vehicles(x, _valid_vehicle_map))
            # self.task_validator.new_df['serviceable_vehicles'].loc[indexes] = col.values

    def raise_problems(self):
        if self.problems:
            raise ValidationError(problems=self.problems)

    def validate_headers(self):
        valid = True
        if not self.task_validator.validate_header():
            self.problems.extend(self.task_validator.problems)
            valid = False

        if not self.vehicles_validator.validate_header():
            self.problems.extend(self.vehicles_validator.problems)
            valid = False

        if not self.products_validator.validate_header():
            self.problems.extend(self.products_validator.problems)
            valid = False

        return valid

    def validate_mandatory_fields(self):
        valid = True
        if not self.base_validator.check_MandatoryField(self.task_validator):
            self.problems.extend(self.task_validator.problems)
            valid = False

        if not self.base_validator.check_MandatoryField(self.vehicles_validator):
            self.problems.extend(self.vehicles_validator.problems)
            valid = False

        if not self.base_validator.check_MandatoryField(self.products_validator):
            self.problems.extend(self.products_validator.problems)
            valid = False

        return valid

    def get_uncommon_products_from_task(self):
        sku_task = self.task_validator.new_df.copy()
        sku_product = self.products_validator.new_df.copy()
        df = sku_task[~sku_task["sku"].isin(sku_product["sku"])]
        self.extra_values_list = self.task_validator.sku_exclusion_list
        product_new_values = df[['sku', 'sku_tag']].to_records(index=False).tolist()
        for sku, sku_tag in product_new_values:
            sku_product = sku_product.append([{'sku': sku, 'sku_tag': sku_tag}], ignore_index=True)
        self.products_validator.new_df = sku_product

    def validate_from_to_city_vehicles(self):
        """
        Validate if From City & To City vehicle is present
        for all task
        """
        task = self.task_validator.new_df.copy()
        t = task[['from_city', 'to_city']].copy().apply(tuple, axis=1).to_list()
        v = self.vehicles_validator.new_df[['from_city', 'to_city']].copy()
        v_f = self.vehicles_validator.new_df['from_city'].copy()
        v_t = self.vehicles_validator.new_df['to_city'].copy()

        v_bool = v_f.isnull() & v_t.isnull()

        if not (v_bool.any()):
            # no vehicles with all from city to city service (Null values)
            valid_bool = v_f.notnull() & v_t.notnull()
            v_tuple = v[valid_bool].apply(tuple, axis=1).to_list()
            if not (set(t)).issubset(set(v_tuple)):
                delta = list(set(t)-set(v_tuple))
                indexes = [t.index(d) for d in delta]
                indexes.sort()
                rows = task.loc[indexes].to_dict(orient='records')
                message = f" No valid Vehicle found for following task (From City, To City)"
                self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.task_validator.SHEET))

    @staticmethod
    def filter_vehicle(_vehicles_df, from_city, to_city):
        filter_vehicles_df = pd.DataFrame()
        df = _vehicles_df.copy()
        df_null_bool = df['from_city'].isnull() & df['to_city'].isnull()
        all_vehicles_df = df[df_null_bool]

        not_null_df = df[['from_city', 'to_city']].dropna()
        if not not_null_df.empty:
            fc = not_null_df['from_city'].str.match(from_city)
            tc = not_null_df['to_city'].str.match(to_city)
            if (fc & tc).any():
                filter_vehicles_df = df.loc[not_null_df[fc & tc].index]

        df = pd.concat([all_vehicles_df, filter_vehicles_df], ignore_index=True)

        # Todo Validate vehicle list beforehand
        if df.empty:
            raise ValidationError(message=f"Vehicle not found for [From City: {from_city}, To City: {to_city}]")
        return df

    def append_sku_tags(self):

        task_prod_df = self.task_validator.new_df[['sku', 'sku_tag']].copy()

        # Remove rows where sku not present
        task_prod_df = task_prod_df[task_prod_df['sku_tag'] != ""]

        # Combine rows on basis of sku with "," as separator
        task_prod_df['sku_tag'] = task_prod_df.groupby(['sku'])['sku_tag'].transform(lambda x: ','.join(x))
        task_prod_df = task_prod_df.drop_duplicates()
        # logger.info(task_prod_df)

        product_sku_tags_df = self.products_validator.new_df[['sku', 'sku_tag']].copy().replace('', np.NAN)

        # Outer join on task and products df
        merge_df = pd.merge(task_prod_df, product_sku_tags_df, on='sku', how='outer')
        # logger.info(merge_df)
        # Merge both product and task sku_tag with ',' as seprator
        merge_df['sku_tag'] = merge_df.drop(columns=['sku']).apply(lambda x: ','.join(x[x.notnull()]), axis=1)
        new_products_df = merge_df[['sku', 'sku_tag']]
        # logger.info(new_products_df)

        products_df = self.products_validator.new_df.copy()
        # logger.info(products_df)

        # new_product index that is present in products sheet
        product_sku_isin_bool = new_products_df['sku'].isin(products_df['sku'])

        # replace products sheet value
        new_products_replace_df = new_products_df[product_sku_isin_bool]
        dict_lookup = dict(zip(new_products_replace_df['sku'], new_products_replace_df['sku_tag']))
        self.products_validator.new_df['sku_tag'] = products_df['sku'].replace(dict_lookup)
        # logger.info(self.products_validator.new_df)

        # append the skus not present in products sheet
        new_products_append_df = new_products_df[~product_sku_isin_bool]
        self.products_validator.new_df = pd.concat([self.products_validator.new_df, new_products_append_df], sort=False)
        # logger.info(self.products_validator.new_df)

        # validate exclusive inclusive tags for updated products sheet
        self.products_validator.new_df['sku_tag'] = BaseValidator.validate_comma_sep_string_col(
            self.products_validator.new_df['sku_tag'])
        self.products_validator.new_df['exclusive_tags'] = BaseValidator.validate_comma_sep_string_col(
            self.products_validator.new_df['exclusive_tags'])
        # self.products_validator.new_df['inclusive_tags'] = BaseValidator.validate_comma_sep_string_col(self.products_validator.new_df['inclusive_tags'])

        # make sku tag distinct in products sheet
        self.products_validator.new_df['sku_tag'] = BaseValidator.parse_case_insensitive_distinct(
            self.products_validator.new_df['sku_tag'])

    def validate_sheets(self):
        if not self.validate_headers():
            self.raise_problems()

        if not self.validate_mandatory_fields():
            self.raise_problems()

        self.task_validator.process()
        self.vehicles_validator.process()
        self.products_validator.process()

        self.problems.extend(self.task_validator.problems)
        self.problems.extend(self.vehicles_validator.problems)
        self.problems.extend(self.products_validator.problems)

        # serviceable vehicle validation
        self.serviceable_vehicles_validation()

        # append task SKU Tag to Products SKU Tag
        self.append_sku_tags()

        self.get_uncommon_products_from_task()

        # From City and To City validation
        self.validate_from_to_city_vehicles()

        # raise problems
        self.raise_problems()
        logger.info(f"Sheets Validated for rid: {self._rid}")

    # @profile
    def process_main(self):
        RequestLog(self._rid).write_log(RequestLogMessages.REQUEST_INIT)
        errors = list()
        confusion_matrix_dict = dict()
        output_dict = dict()
        aggregated_data_dict = dict()
        summary_dict = dict()
        vehicle_dict = dict()
        temp_file_path_list = list()

        _task_df = self.task_validator.new_df.copy()
        _vehicles_df = self.vehicles_validator.new_df.copy()
        _products_df = self.products_validator.new_df.copy()

        # groupby df on 'From City*' and 'To City*'
        task_groupby = _task_df.groupby(['from_city', 'to_city'])
        task_df_list = [task_groupby.get_group(x) for x in task_groupby.groups]
        # planning_id intial offset
        curr_plan_id = 0

        for idx, task_df in enumerate(task_df_list):
            from_city = task_df['from_city'].to_list()[0]
            to_city = task_df['to_city'].to_list()[0]

            logger.info(f" ::: Executing {from_city} -> {to_city}")
            # Execute Solver
            try:
                # Todo filter vehicles sheet by from_city and to_city
                vehicles_df = BinPackingUploadValidation.filter_vehicle(_vehicles_df, from_city, to_city)

                # For solver reset order id
                # todo bug
                task_df['order_id'] = range(len(task_df['order_id']))

                rid, temp_path = self.df_to_csv(idx, task_df, self.task_validator)
                orders = pd.read_csv(temp_path)
                temp_file_path_list.append(temp_path)

                rid, temp_path = self.df_to_csv(idx, vehicles_df, self.vehicles_validator)
                vehicles = pd.read_csv(temp_path)

                temp_file_path_list.append(temp_path)

                products_filter_bool = _products_df['sku'].isin(task_df['sku'])
                products = _products_df[products_filter_bool]

                rid, temp_path = self.df_to_csv(idx, products, self.products_validator)
                products = pd.read_csv(temp_path)

                temp_file_path_list.append(temp_path)

                # check if request is valid to execute
                try:
                    RequestsServices.is_valid_request_to_continue(self._rid)
                except AppException as e:
                    raise RequestTerminationException(str(e))
                msg = RequestLogMessages.SOLVER_INIT.format(
                        from_city=from_city,
                        to_city=to_city,
                        total_task=orders.shape[0],
                        total_vehicles=vehicles.shape[0],
                        total_products=products.shape[0]
                    )
                RequestLog(self._rid).write_log(msg)
                configuration = SkuFixedSolverConfigurationV4.get_default_sku_fixed_configuration()
                logger.info(f"solver config: {str(configuration)}")
                planner = SolverV4(
                    orders, vehicles, products=products, timestamp=self.timestamp,
                    request_id=self._rid, config=configuration, extra_products=self.extra_values_list,
                    from_city=from_city, to_city=to_city, planning_id_init=curr_plan_id)
                agg_output, output, cm, stat, summary = planner.execute()
                if agg_output:
                    vehicle_dict[to_city] = agg_output['vehicle_type']
                    aggregated_data_dict = self.merge_dicts(aggregated_data_dict, agg_output)
                    summary_dict = self.merge_dicts(summary_dict, summary)
                    output_dict = self.merge_dicts(output_dict, output)
                    confusion_matrix_dict = self.merge_dicts(confusion_matrix_dict, cm)
                curr_plan_id = planner.get_planning_id_init()

            except AppException as e:
                logger.error(e, exc_info=True)
                errors.append(str(e))
                msg = RequestLogMessages.SOLVER_FAIL.format(
                    from_city=from_city,
                    to_city=to_city,
                    error_message=str(e)
                )
                RequestLog(self._rid).write_log(msg)

        sheet_path = self.get_sheet(aggregated_data_dict, output_dict, confusion_matrix_dict, summary_dict, vehicle_dict)
        resp = self.response_bin_packing(sheet_path)
        RequestsServices.update(self._rid, dict(response=json.dumps(resp)))
        msg = RequestLogMessages.SOLVER_SUCCESS.format(
            from_city=from_city,
            to_city=to_city
        )
        RequestLog(self._rid).write_log(msg)

        RequestsServices.update(self._rid, dict(response=json.dumps(resp)))

        msg = RequestLogMessages.REQUEST_FINISH.format(
            rid=self._rid,
            count_errors=len(errors)
        )
        RequestLog(self._rid).write_log(msg)
        if not resp:
            # return failure response
            resp = dict(
                message="Failed",
                code=str(500),
                details=dict(error_details=errors)
            )
            return resp, UploadJobsStatus.FAIL

        resp['details']['error_details'] = errors
        return resp, UploadJobsStatus.SUCCESS

    def get_sheet(self, agg_output, output, cm, summary, vehicles):
        vehicle_data_dict = dict(
            Truck_Type=list()
        )
        if agg_output:
            unique_vehicles = list(set(agg_output['vehicle_type']))
            for vehicle in unique_vehicles:
                vehicle_data_dict['Truck_Type'].append(vehicle)
                for key, value in vehicles.items():
                    num_vehicle = value.count(vehicle)
                    if key not in vehicle_data_dict:
                        vehicle_data_dict[key] = []
                    vehicle_data_dict[key].append(num_vehicle)
        cities = list(vehicles.keys())
        o_df = export_output(output)
        ag_df = export_aggregated_output(agg_output)
        cm_df = export_confusion_matrix(cm)
        sum_df = export_summary_output(summary)
        veh_df = export_vehicle_output(vehicle_data_dict, cities)

        excel_file_path = self.get_output_excel_file_path(rid=self._rid)

        with pd.ExcelWriter(excel_file_path) as writer:
            sum_df.to_excel(writer, sheet_name="Summary")
            ag_df.to_excel(writer, index=False, sheet_name="Aggregated")
            o_df.to_excel(writer, index=False, sheet_name="Output")
            veh_df.to_excel(writer, sheet_name="Vehicles")
            cm_df.to_excel(writer, index=False, sheet_name="Confusion Matrix")

        # writer.save(path=excel_file_path)

        return excel_file_path

    def response_bin_packing(self, o_path):
        # Get Download Link
        storage_client = PrimaGoogleStorageConfiguration.get_storage_client()
        output_link = storage_client.get_download_link(self._rid, o_path)

        # return response
        response = dict(
            message="Success",
            code=str(200),
            details=dict(
                output_link=output_link,
            ))


        os.system(f"rm {o_path}")

        return response

    def process(self):
        self.validate_sheets()
        return self.process_main()

    @staticmethod
    def get_path(sheet, rid, idx):
        config = AppConfig()
        rid = f"{rid}_{idx}"
        path = f"{config.temp_dir}/{rid}_{sheet}.csv"
        return rid, path

    @staticmethod
    def df_to_csv(idx, df, validator):
        rid, path = BinPackingUploadValidation.get_path(validator.SHEET, validator.rid, idx)
        df.to_csv(path, index=False)
        return rid, path

    @staticmethod
    def merge_dicts(a, b):
        new_dict = copy.deepcopy(a)
        for key, value in b.items():
            new_dict.setdefault(key, []).extend(value)
        return new_dict

    @staticmethod
    def get_data(list_of_dicts):
        a = []
        for lists in list_of_dicts:
            for list_data in lists:
                a.append(list_data)
        return a

    @staticmethod
    def get_output_excel_file_path(rid):
        if not rid:
            rid = str(uuid.uuid4())
        return f"{AppConfig().temp_dir}/{rid}_output.xlsx"
