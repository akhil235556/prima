import copy
import json

import numpy as np
from route_planner.constants.app_constants import UploadJobsStatus
from solvers.solver_v3.constants import PriorityMap, PRIORITY_TO_PENALTY_MAP
from route_planner.sku_variable_cost_optimization_ai_planner.validator.solver_json_processor import SolverJsonProcessor

from route_planner.utils import logging
import os

import pandas as pd

from memory_profiler import profile

from route_planner.constants.app_configuration import AppConfig
from route_planner.constants.requests_log_messages import RequestLogMessages
from route_planner.exceptions.exceptions import ValidationError, AppException, RequestTerminationException
from route_planner.gcp.prima_storage_config import PrimaGoogleStorageConfiguration
from route_planner.services.upload_jobs import RequestsServices

from route_planner.sku_variable_cost_optimization_ai_planner.validator.base_validator import BaseValidator
from route_planner.sku_variable_cost_optimization_ai_planner.validator.products_validator import ProductsValidator
from route_planner.sku_variable_cost_optimization_ai_planner.validator.task_validator import TaskValidator
from route_planner.sku_variable_cost_optimization_ai_planner.validator.vehicles_validator import VehiclesValidator
from route_planner.sku_variable_cost_optimization_ai_planner.sku_variable_cost_optimization_ai_solver_configuration import \
    SkuVariableSolverConfigurationV3
from solvers.solver_v3.exporter import export_aggregated_output, export_output
from route_planner.utils.utils import get_current_timestamp
from route_planner.services.requests_log import RequestLog
from collections import defaultdict

logger = logging.getLogger(__name__)


class OptimizationAIUploadValidation(object):

    def __init__(self, file, rid, search_time_limit):
        self.file = file
        self._rid = rid
        self.problems = list()
        self._VALID_VEHICLES_LIST = list()
        self.extra_values_list = list()
        self._product_exclusion_dict = dict()
        self._product_inclusion_dict = dict()
        self.search_time_limit = search_time_limit

        self.base_validator = BaseValidator(self.file, self._rid)

        self.task_validator = TaskValidator(self.base_validator)
        self.vehicles_validator = VehiclesValidator(self.base_validator)
        self.products_validator = ProductsValidator(self.base_validator)
        self.timestamp = get_current_timestamp()

    @staticmethod
    def _valid_vehicle_type(value, valid_vehicle_list, return_list=False):
        valid = False
        vehicles_list = list()
        if isinstance(value, str):
            vehicles_list = [x.strip().lower() for x in value.split(',')]
            valid = set(vehicles_list).issubset(set(valid_vehicle_list))

        if return_list:
            return vehicles_list
        return valid

    def _get_actual_vehicle_case(self, invalid_vehicles, value) -> list:
        vehicle_actual_case = value.split(",")
        vehicle_lower_case = value.lower().split(",")

        invalid_indexes = [vehicle_lower_case.index(veh) for veh in invalid_vehicles]
        valid_vehicles = [vehicle_actual_case[idx] for idx in invalid_indexes]
        return valid_vehicles

    def _filter_error(self, value):
        """
        serviceable_vehicles_validation helper method.

        Filter value

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
        col_name = 'Serviceable Vehicles'
        self._VALID_VEHICLES_LIST = self.vehicles_validator.df['Vehicle Type*'].copy().str.lower().to_list()
        col = self.task_validator.df[col_name].copy().replace('', np.NAN).dropna()

        valid_rows = col.map(lambda x: self._valid_vehicle_type(x, self._VALID_VEHICLES_LIST))
        if not valid_rows.all():
            indexes = valid_rows[valid_rows == False].index.to_list()
            filtered_rows = self.task_validator.df.loc[indexes].copy()
            filtered_rows[col_name] = filtered_rows[col_name].map(
                lambda x: self._filter_error(x))
            rows = filtered_rows.to_dict(orient='records')
            message = f"Vehicle in Serviceable Vehicles not exists in Vehicle Sheet"
            self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.task_validator.SHEET))

    @staticmethod
    def get_order_serviceable_veh_list(serviceable_vehicles_list, veh_index_series, veh_vehicle_type, task_orderid):
        """
        :param serviceable_vehicles_series:  self.task_validator.df['Serviceable Vehicles']
        :param veh_index_series: vehicles df  'veh_index'
        :param veh_vehicle_type: vehicles df  'vehicle_type_name'
        :param valid_vehicle_list: self._VALID_VEHICLES_LIST (OptimizationAIUploadValidation)
        :return:
        """

        col = pd.Series(serviceable_vehicles_list).replace('', np.NAN).dropna()
        valid_vehicle_list = list(set(veh_vehicle_type.copy().str.lower().to_list()))
        valid_rows = col.map(
            lambda x: OptimizationAIUploadValidation._valid_vehicle_type(x, valid_vehicle_list, return_list=True))
        valid_rows_index = task_orderid.loc[valid_rows.index].to_list()

        d = {'veh_index': veh_index_series, 'vehicle_type_name': veh_vehicle_type}
        veh_df = pd.DataFrame(data=d)
        veh_df['vehicle_type_name'] = veh_df['vehicle_type_name'].str.lower()

        order_to_serv_index_map = dict()
        for order_idx, row in zip(valid_rows_index, valid_rows):
            valid_veh_df = veh_df[veh_df['vehicle_type_name'].isin(row)]
            veh_index_list = valid_veh_df['veh_index'].to_list()

            if order_idx not in order_to_serv_index_map.keys():
                order_to_serv_index_map[order_idx] = list()
            order_to_serv_index_map[order_idx] = veh_index_list

        return order_to_serv_index_map

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
        if not self.base_validator.check_mandatory_fields(self.task_validator):
            self.problems.extend(self.task_validator.problems)
            valid = False

        if not self.base_validator.check_mandatory_fields(self.vehicles_validator):
            self.problems.extend(self.vehicles_validator.problems)
            valid = False

        if not self.base_validator.check_mandatory_fields(self.products_validator):
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
                delta = list(set(t) - set(v_tuple))
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
        task_prod_df = task_prod_df[task_prod_df['sku_tag'].notnull()]

        # Combine rows on basis of sku with "," as separator
        task_prod_df['sku_tag'] = task_prod_df.groupby(['sku'])['sku_tag'].transform(lambda x: ','.join(x))
        task_prod_df = task_prod_df.drop_duplicates()
        # logger.info(task_prod_df)

        product_sku_tags_df = self.products_validator.new_df[['sku', 'sku_tag']].copy()

        # Outer join on task and products df
        merge_df = pd.merge(task_prod_df, product_sku_tags_df, on='sku', how='outer')
        # logger.info(merge_df)
        # Merge both product and task sku_tag with ',' as seprator
        merge_df['sku_tag'] = merge_df.drop(columns=['sku']).apply(lambda x: ','.join(x[x.notnull()]), axis=1)
        new_products_df = merge_df[['sku', 'sku_tag']].replace("", np.NAN)
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

        # validate exclusive inclusive tags for updated products sheet
        self.products_validator.new_df['sku_tag'] = BaseValidator.validate_comma_sep_string_col(
            self.products_validator.new_df['sku_tag'])
        self.products_validator.new_df['exclusive_tags'] = BaseValidator.validate_comma_sep_string_col(
            self.products_validator.new_df['exclusive_tags'])

        self.products_validator.new_df['inclusive_tags'] = BaseValidator.validate_comma_sep_string_col(
            self.products_validator.new_df['inclusive_tags'])

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

        self.raise_problems()
        # sanitize after per sheet error raise
        self.task_validator.sanitize()
        self.vehicles_validator.sanitize()
        self.products_validator.sanitize()

        # serviceable vehicle validation
        self.serviceable_vehicles_validation()

        # calculate penalty from priority
        self.get_penalty()

        # append task SKU Tag to Products SKU Tag
        self.append_sku_tags()

        self.get_uncommon_products_from_task()

        # get product combinatorics
        products_exclusion_dict = self.get_product_combinatorics("exclusive_tags")
        products_inclusion_dict = self.get_product_combinatorics("inclusive_tags")

        self.validate_product_combinatorics(products_inclusion_dict, products_exclusion_dict)

        # From City and To City validation
        # self.validate_from_to_city_vehicles()

        # consistent load demands and capacities
        self.validate_consistency_load_demands()

        self.raise_problems()

        logger.info(f"Sheets Validated for rid: {self._rid}")

    @staticmethod
    def map_sku_to_order_id(orders, sku_list) -> list:
        order_id_list = list()
        # contain_bool = orders['sku'].str.contains(sku, regex=True)
        contain_bool = [True if str(s) in sku_list else False for s in orders['sku'].to_list()]
        contain_bool = pd.Series(contain_bool)
        if contain_bool.any():
            order_id_list = orders[contain_bool]['order_id'].to_list()
        return order_id_list

    @staticmethod
    def get_exclusion_inclusion_problems(order, invalid, orders_df):
        rows = orders_df[orders_df['order_id'] == order].to_dict(orient='records')
        sku = rows[0].get('sku')
        invalid_task = orders_df[orders_df['order_id'] == invalid]['sku'].to_list()
        invalid_sku = invalid_task[0]

        indexes = [order]
        message = f"Conflicting!, ('{sku}', '{invalid_sku}') cannot be inclusive and exclusive both"
        return BaseValidator.add_problem(indexes, rows, message, "Task/Products")

    @staticmethod
    def add_to_dict(dictionary, k, v_list):
        for v in v_list:
            if k not in dictionary.keys():
                dictionary[k] = list()
            if v not in dictionary[k]:
                dictionary[k].append(v)
            if v not in dictionary.keys():
                dictionary[v] = list()
            if k not in dictionary[v]:
                dictionary[v].append(k)
        return dictionary

    @staticmethod
    def get_all_exclusion_combinations(exclusion_dict):
        """
        get all possible list of sets of orders which are exclusive
        :param exclusion_dict:
        :return:
        """
        all_combs = list()
        for order, exc_list in exclusion_dict.items():
            for ex in exc_list:
                s = {order, ex}
                if s not in all_combs:
                    all_combs.append(s)
        return all_combs

    @staticmethod
    def merge_common(lists):
        """
        Merge function to  merge all sublist
        having common elements
        :param lists: list of lists
        :return: list
        """
        neigh = defaultdict(set)
        visited = set()
        for each in lists:
            for item in each:
                neigh[item].update(each)

        def comp(node, neigh=neigh, visited=visited, vis=visited.add):
            nodes = set([node])
            next_node = nodes.pop
            while nodes:
                node = next_node()
                vis(node)
                nodes |= neigh[node] - visited
                yield node

        for node in neigh:
            if node not in visited:
                yield sorted(comp(node))

    @staticmethod
    def get_all_inclusion_combinations(inclusion_dict):
        """
        get all possible list of sets of orders which are inclusive
        """
        # all_combs: list of lists of inclusive orders
        all_combs = list()
        for k, in_list in inclusion_dict.items():
            z = in_list.copy()
            z.append(k)
            all_combs.append(z)
        # merge list if two list have common element
        merged_all_combs = list(OptimizationAIUploadValidation.merge_common(all_combs))
        merged_all_combs = [set(comb) for comb in merged_all_combs]
        return merged_all_combs

    @staticmethod
    def ex_set_issubset_inc_combs(ex_set, in_combs):
        """
        To check if exclusion set is a subset of any 
        inclusion sets
        :param ex_set: exclusion set
        :param in_combs: list of inclusion sets
        :return: True if is a subset else False
        """""
        for comb_set in in_combs:
            if ex_set.issubset(comb_set):
                return True
        return False

    def validate_product_combinatorics(self, prod_inc_dict, prod_exc_dict):
        valid = True
        orders = self.task_validator.new_df.copy()

        # a sku cannot have same sku as exclusion and inclusion simultaneously
        ex_combs = self.get_all_exclusion_combinations(prod_exc_dict)
        in_combs = self.get_all_inclusion_combinations(prod_inc_dict)

        for ex_set in ex_combs:
            if self.ex_set_issubset_inc_combs(ex_set, in_combs):
                order = list(ex_set)[0]
                invalid_list = list(ex_set)[1]
                problems = self.get_exclusion_inclusion_problems(order, invalid_list, orders)
                self.problems.extend(problems)
                valid = False

        if valid:
            self._product_exclusion_dict = prod_exc_dict
            self._product_inclusion_dict = prod_inc_dict

    def get_product_combinatorics(self,  rule_col: str):
        """
        To apply exclusion or inclusion on products

        :param rule_col: products rule column name
        :return:
        """

        orders = self.task_validator.new_df.copy()
        products = self.products_validator.new_df.copy()

        rule_dict = dict()
        # filter products which are required in orders
        products = products[products['sku'].isin(orders['sku'])]

        prod_with_rule = products.loc[products[rule_col].dropna().index]

        if not prod_with_rule.empty:

            # convert csv to nested list
            prod_with_rule['exc_tags'] = prod_with_rule[rule_col].map(
                lambda x: x.split(",")).to_list()

            prod_with_rule_tags = prod_with_rule[['sku', 'exc_tags']].copy()

            # sku_to_rule_tags_dict ->  sku : [rule_tag1, rule_tag2, rule_tag3]
            sku_to_rule_tags_dict = prod_with_rule_tags.set_index('sku').T.to_dict(orient='index')['exc_tags']

            # sku_to_rule_sku_dict -> sku -> [rule_sku1, rule_sku2]
            sku_to_rule_sku_dict = dict()

            prod_with_tag = products.copy()
            prod_with_tag = prod_with_tag[prod_with_tag['sku_tag'].isna() == False]

            prod_with_tag['tags'] = prod_with_tag['sku_tag'].map(lambda x: x.split(",")).to_list()

            sku_tag_tuple = prod_with_tag[['sku', 'tags']].to_records(index=False).tolist()
            for rule_sku, rule_tags in sku_to_rule_tags_dict.items():
                for sku, tags in sku_tag_tuple:
                    if sku != rule_sku and set(tags).intersection(set(rule_tags)):
                        if rule_sku not in sku_to_rule_sku_dict.keys():
                            sku_to_rule_sku_dict[rule_sku] = list()
                        sku_to_rule_sku_dict[rule_sku].append(sku)

            # rule_dict order_id : [rule_order_id1, rule_order_id2, rule_order_id3]

            for order_sku, rule_skus_list in sku_to_rule_sku_dict.items():
                order_id = OptimizationAIUploadValidation.map_sku_to_order_id(orders, [order_sku])
                rule_orders = OptimizationAIUploadValidation.map_sku_to_order_id(orders, rule_skus_list)
                rules = {k: rule_orders for k in order_id}
                rule_dict.update(rules)

        return rule_dict

    def get_penalty(self):
        priority = self.task_validator.df['Priority'].copy().fillna(PriorityMap.HIGHEST.value.code)
        veh_fc = self.vehicles_validator.df['Fixed Cost'].min() or 0
        logger.info(f"Fixed Cost considered for Penalty: {veh_fc}")
        mapped_priority = priority.map(PRIORITY_TO_PENALTY_MAP)
        penalty = mapped_priority * veh_fc
        self.task_validator.new_df['penalty'] = penalty

    @staticmethod
    def get_order_to_vehicles_map(_veh_df, _task_df):
        # self.vehicles_validator.df['Vehicle Type*'].copy().str.lower().to_list()
        veh_df = _veh_df.copy()
        task_df = _task_df.copy()
        sv = task_df['serviceable_vehicles'].copy().replace('', np.NAN)
        task_orderid = task_df['order_id']
        order_to_serviceable_veh = OptimizationAIUploadValidation.get_order_serviceable_veh_list(sv,
                                                                                                 veh_df['veh_index'],
                                                                                                 veh_df[
                                                                                                     'vehicle_type_name'],
                                                                                                 task_orderid)
        all_vehicles = veh_df['veh_index'].tolist()
        return order_to_serviceable_veh, all_vehicles

    def validate_consistency_load_demands(self):

        task_load_demands_dict = self.task_validator.valid_load_demands
        w_bool = task_load_demands_dict.get('weight')
        v_bool = task_load_demands_dict.get('volume')
        w_c = self.vehicles_validator.new_df['weight_capacity']
        v_c = self.vehicles_validator.new_df['volume_capacity']

        if w_bool:
            # all vehicles should have weight capacities
            valid_bool = w_c.notnull().all()
            if not valid_bool:
                rows = list()
                message = f"'Weight Capacity (kg)' is mandatory as orders have 'Load (kg)')"
                self.problems.extend(BaseValidator.add_problem([-2], rows, message, self.vehicles_validator.SHEET))
        if v_bool:
            # all vehicles should have volume capacities
            valid_bool = v_c.notnull().all()
            if not valid_bool:
                rows = list()
                message = f"'Volume Capacity (cbm)' is mandatory as orders have 'Volume (cbm)')"
                self.problems.extend(BaseValidator.add_problem([-2], rows, message, self.vehicles_validator.SHEET))

    @profile
    def process_main(self):
        from solvers.solver_v3.solver import SolverV3
        RequestLog(self._rid).write_log(RequestLogMessages.REQUEST_INIT)
        resp = None
        errors = list()

        _task_df = self.task_validator.new_df.copy()
        _vehicles_df = self.vehicles_validator.new_df.copy()
        _products_df = self.products_validator.new_df.copy()

        # Repeat Vehicles DF by 'vehicle_repeat_factor'
        _vehicles_df = self.vehicles_validator.repeat_df_by_col(_vehicles_df, 'veh_repeat_factor')
        _vehicles_df = self.vehicles_validator.set_veh_index(_vehicles_df)

        # get serviceable vehicles for order and all vehicles
        order_to_serv_veh, all_vehicles = self.get_order_to_vehicles_map(_vehicles_df, _task_df)
        valid_load_demands = self.task_validator.valid_load_demands

        try:
            RequestsServices.is_valid_request_to_continue(self._rid)
        except AppException as e:
            raise RequestTerminationException(str(e))
        msg = RequestLogMessages.SOLVER_INIT.format(
            from_city='',
            to_city='',
            total_task=_task_df.shape[0],
            total_vehicles=_vehicles_df.shape[0],
            total_products=_products_df.shape[0]
        )
        RequestLog(self._rid).write_log(msg)

        try:
            configuration = SkuVariableSolverConfigurationV3.get_default_sku_variable_optimization_ai_configuration()
            logger.info(f"solver config: {str(configuration)}")
            solver_json_processor = SolverJsonProcessor(orders=_task_df, vehicles=_vehicles_df, products=_products_df,
                                                        order_to_serv_veh=order_to_serv_veh, all_vehicles=all_vehicles,
                                                        valid_load_demands=valid_load_demands,
                                                        exclusion_dict=self._product_exclusion_dict,
                                                        inclusion_dict=self._product_inclusion_dict,
                                                        config=configuration)
            model_dict = solver_json_processor.process()

            solver = SolverV3(model_dict, _task_df, _vehicles_df,
                              products=_products_df,
                              valid_load_demands=valid_load_demands,
                              extra_products=self.extra_values_list)
            routes_list, agg_output, output = solver.execute()

            resp = self.get_response(routes_list, agg_output, output)

            RequestsServices.update(self._rid, dict(response=json.dumps(resp)))
            msg = RequestLogMessages.SOLVER_SUCCESS.format(
                from_city='',
                to_city=''
            )
            RequestLog(self._rid).write_log(msg)

        except AppException as e:
            logger.error(e, exc_info=True)
            errors.append(str(e))
            msg = RequestLogMessages.SOLVER_FAIL.format(
                from_city='',
                to_city='',
                error_message=str(e)
            )
            RequestLog(self._rid).write_log(msg)

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
        #
        resp['details']['error_details'] = errors
        return resp, UploadJobsStatus.SUCCESS

    def get_response(self, routes_list, agg_output, output):

        ag_path = export_aggregated_output(agg_output, rid=self._rid)
        o_path = export_output(output, rid=self._rid)
        # Get Download Link
        storage_client = PrimaGoogleStorageConfiguration.get_storage_client()
        aggregated_link = storage_client.get_download_link(self._rid, ag_path)
        output_link = storage_client.get_download_link(self._rid, o_path)

        # return the response
        response = dict(
            message="Success",
            code=str(200),
            details=dict(
                output_link=output_link,
                aggregated_link=aggregated_link,
                routes=routes_list
            ))

        os.system(f"rm {ag_path}")
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
        rid, path = OptimizationAIUploadValidation.get_path(validator.SHEET, validator.rid, idx)
        df.to_csv(path, index=False)
        return rid, path

    @staticmethod
    def merge_dicts(a, b):
        new_dict = copy.deepcopy(a)
        for key, value in b.items():
            new_dict.setdefault(key, []).extend(value)
        return new_dict
