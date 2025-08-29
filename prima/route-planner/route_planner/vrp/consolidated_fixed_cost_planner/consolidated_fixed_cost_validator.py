import json
from route_planner.utils import logging
import os

import pandas as pd

from route_planner.constants.app_configuration import AppConfig
from route_planner.exceptions.exceptions import ValidationError, AppException, RequestTerminationException
from route_planner.gcp.prima_storage_config import PrimaGoogleStorageConfiguration
from route_planner.services.upload_jobs import RequestsServices
from route_planner.vrp.consolidated_fixed_cost_planner.consolidated_fixed_solver_configurations import ConsolidatedFixedCostSolverConfigurationV1
from route_planner.vrp.consolidated_fixed_cost_planner.validator.base_validator import BaseValidator
from route_planner.vrp.consolidated_fixed_cost_planner.validator.task_validator import TaskValidator
from route_planner.vrp.consolidated_fixed_cost_planner.validator.vehicles_validator import VehiclesValidator
from route_planner.vrp.consolidated_fixed_cost_planner.exporter import export_routes_details, export_confusion_matrix, export_aggregated_details
from solvers.solver_v1.solver import SolverV1
from route_planner.utils.utils import get_current_timestamp
from route_planner.constants.app_constants import UploadJobsStatus

logger = logging.getLogger(__name__)


class FixedCostUploadValidation(object):

    def __init__(self, file, rid, search_time_limit):
        self.file = file
        self._rid = rid
        self.problems = list()
        self._VALID_VEHICLES_LIST = list()
        self.search_time_limit = search_time_limit
        self.base_validator = BaseValidator(self.file, self._rid)

        self.task_validator = TaskValidator(self.base_validator)
        self.vehicles_validator = VehiclesValidator(self.base_validator)
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
            col = col.map(lambda x: FixedCostUploadValidation._sanitize_serviceable_vehicles(x, _valid_vehicle_map))
            self.task_validator.new_df['serviceable_vehicles'].loc[indexes] = col.values

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
        return valid

    def process(self):

        self.validate_sheets()
        return self.process_main()

    def validate_mandatory_fields(self):
        valid = True
        if not self.base_validator.check_MandatoryField(self.task_validator):
            self.problems.extend(self.task_validator.problems)
            valid = False

        if not self.base_validator.check_MandatoryField(self.vehicles_validator):
            self.problems.extend(self.vehicles_validator.problems)
            valid = False
        return valid

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

    def validate_sheets(self):
        if not self.validate_headers():
            self.raise_problems()

        if not self.validate_mandatory_fields():
            self.raise_problems()

        self.task_validator.process()
        self.vehicles_validator.process()

        self.problems.extend(self.task_validator.problems)
        self.problems.extend(self.vehicles_validator.problems)

        # serviceable vehicle validation
        self.serviceable_vehicles_validation()

        # From City and To City validation
        self.validate_from_to_city_vehicles()

        # raise problems
        self.raise_problems()

        logger.info("Sheets Validated!")

    def process_main(self):
        resp = None
        errors = list()
        confusion_matrix_list = list()
        routes_list = list()
        aggregated_data_list = list()
        temp_file_path_list = list()

        _task_df = self.task_validator.new_df.copy()
        _vehicles_df = self.vehicles_validator.new_df.copy()

        # groupby df on 'From City*' and 'To City*'
        task_groupby = _task_df.groupby(['from_city', 'to_city'])
        task_df_list = [task_groupby.get_group(x) for x in task_groupby.groups]

        # confusion_matrix_list = list()
        # output_list = list()
        # routes_list = list()
        # temp_file_path_list = list()

        for idx, task_df in enumerate(task_df_list):
            from_city = task_df['from_city'].to_list()[0]
            to_city = task_df['to_city'].to_list()[0]

            # Execute Solver
            try:

                # Todo filter vehicles sheet by from_city and to_city
                vehicles_df = FixedCostUploadValidation.filter_vehicle(_vehicles_df, from_city, to_city)

                # For solver reset order id
                # todo bug
                task_df['order_id'] = range(len(task_df['order_id']))

                rid, temp_path = self.df_to_csv(idx, task_df, self.task_validator)
                orders = pd.read_csv(temp_path)
                temp_file_path_list.append(temp_path)

                rid, temp_path = self.df_to_csv(idx, vehicles_df, self.vehicles_validator)
                vehicles = pd.read_csv(temp_path)
                temp_file_path_list.append(temp_path)

                # check if request is valid to execute
                try:
                    RequestsServices.is_valid_request_to_continue(self._rid)
                except AppException as e:
                    raise RequestTerminationException(str(e))

                configuration = ConsolidatedFixedCostSolverConfigurationV1.get_default_consolidated_fixed_configuration()
                planner = SolverV1(
                    orders, vehicles, products=None, timestamp=self.timestamp, request_id=self._rid, config=configuration,
                    extra_products=list(), search_time_limit=self.search_time_limit
                )
                routes, cm, aggregated_output = planner.execute()

                aggregated_data_list.extend(aggregated_output)
                routes_list.extend(routes)
                confusion_matrix_list.extend(cm)

                resp = self.get_response(routes_list, aggregated_data_list, confusion_matrix_list)
                RequestsServices.update(self._rid, dict(response=json.dumps(resp)))
            except AppException as e:
                logger.error(e, exc_info=True)
                error_dict = dict(from_city=from_city, to_city=to_city, error_message=str(e))
                errors.append(error_dict)
            finally:
                for file_path in temp_file_path_list:
                    os.system(f"rm {file_path}")

        if not resp:
            # return failure response
            resp = dict(
                rid=self._rid,
                message="Failed",
                code=str(500),
                details=dict(error_details=errors)
                )
            return resp, UploadJobsStatus.FAIL

        resp['details']['error_details'] = errors
        return resp, UploadJobsStatus.SUCCESS

    def get_response(self, routes_list, aggregated_data_list, confusion_matrix_list):
        ad_path = export_aggregated_details(aggregated_data_list, rid=self._rid)
        o_path = export_routes_details(routes_list, rid=self._rid)
        cm_path = export_confusion_matrix(confusion_matrix_list, rid=self._rid)

        # Get Download Link
        storage_client = PrimaGoogleStorageConfiguration.get_storage_client()
        aggregated_link = storage_client.get_download_link(self._rid, ad_path)
        confusion_matrix_link = storage_client.get_download_link(self._rid, cm_path)
        output_link = storage_client.get_download_link(self._rid, o_path)

        # return response
        response = dict(
            rid=self._rid,
            message="Success",
            code=str(200),
            details=dict(
                aggregated_link=aggregated_link,
                confusion_matrix_link=confusion_matrix_link,
                output_link=output_link, routes=routes_list
            ))
        os.system(f"rm {ad_path}")
        os.system(f"rm {o_path}")
        os.system(f"rm {cm_path}")
        return response

    @staticmethod
    def get_path(sheet, rid, idx):
        config = AppConfig()
        rid = f"{rid}_{idx}"
        path = f"{config.temp_dir}/{rid}_{sheet}.csv"
        return rid, path

    @staticmethod
    def df_to_csv(idx, df, validator):
        rid, path = FixedCostUploadValidation.get_path(validator.SHEET, validator.rid, idx)
        df.to_csv(path, index=False)
        return rid, path

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

