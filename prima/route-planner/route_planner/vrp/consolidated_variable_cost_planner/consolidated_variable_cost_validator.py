import json
from route_planner.utils import logging
import os

import pandas as pd

from route_planner.utils.utils import get_current_timestamp
from route_planner.constants.app_configuration import AppConfig
from route_planner.exceptions.exceptions import ValidationError, SolverException, AppException, RequestTerminationException
from route_planner.gcp.prima_storage_config import PrimaGoogleStorageConfiguration
from route_planner.services.upload_jobs import RequestsServices
from route_planner.vrp.consolidated_variable_cost_planner.exporter import export_routes_details, export_aggregated_details, export_confusion_matrix
from route_planner.vrp.consolidated_variable_cost_planner.consolidated_variable_solver_configuration import ConsolidatedSolverConfigurationV1
from solvers.solver_v1.solver import SolverV1

from route_planner.vrp.consolidated_variable_cost_planner.validator.base_validator import BaseValidator
from route_planner.vrp.consolidated_variable_cost_planner.validator.task_validator import TaskValidator
from route_planner.vrp.consolidated_variable_cost_planner.validator.vehicles_validator import VehiclesValidator

from route_planner.constants.app_constants import UploadJobsStatus

logger = logging.getLogger(__name__)

class VariableUploadValidation(object):

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

        if not error:
            # sanitize serviceable vehicles
            col = self.task_validator.new_df['serviceable_vehicles'].copy().dropna()
            indexes = col.index.to_list()
            _VALID_VEHICLES = self.vehicles_validator.df['Vehicle Type*'].copy().to_list()
            _valid_vehicle_map = {str(v).lower(): v for v in _VALID_VEHICLES}
            col = col.map(lambda x: VariableUploadValidation._sanitize_serviceable_vehicles(x, _valid_vehicle_map))
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

        # raise problems
        self.raise_problems()

        # self.base_validator.df_to_csv(self.task_validator)
        # self.base_validator.df_to_csv(self.vehicles_validator)

    def process_main(self):
        resp = None
        errors = list()
        temp_file_path_list = list()

        _task_df = self.task_validator.new_df.copy()
        _vehicles_df = self.vehicles_validator.new_df.copy()

        try:
            rid, temp_path = self.df_to_csv(_task_df, self.task_validator)
            orders = pd.read_csv(temp_path)
            temp_file_path_list.append(temp_path)

            rid, temp_path = self.df_to_csv(_vehicles_df, self.vehicles_validator)
            vehicles = pd.read_csv(temp_path)
            temp_file_path_list.append(temp_path)

            try:
                RequestsServices.is_valid_request_to_continue(self._rid)
            except AppException as e:
                raise RequestTerminationException(str(e))

            configuration = ConsolidatedSolverConfigurationV1.get_default_consolidated_variable_configuration()
            planner = SolverV1(
                orders, vehicles, timestamp=self.timestamp,
                request_id=self._rid, config=configuration,
                search_time_limit=self.search_time_limit)
            routes, cm, aggregated_output = planner.execute()
            resp = self.get_response(routes_list=routes, aggregated_data_list=aggregated_output,
                                     confusion_matrix_list=cm)
            RequestsServices.update(self._rid, dict(response=json.dumps(resp)))

        except AppException as e:
            logger.error(e, exc_info=True)
            errors.append(str(e))

        finally:
            for file_path in temp_file_path_list:
                os.system(f"rm {file_path}")

        if not resp:
            raise SolverException(str(errors))

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

    def process(self):
        self.validate_sheets()
        return self.process_main()

    @staticmethod
    def get_path(sheet, rid):
        config = AppConfig()
        rid = f"{rid}"
        path = f"{config.temp_dir}/{rid}_{sheet}.csv"
        return rid, path

    @staticmethod
    def df_to_csv(df, validator):
        rid, path = VariableUploadValidation.get_path(validator.SHEET, validator.rid)
        df.to_csv(path, index=False)
        return rid, path


    def validate_mandatory_fields(self):
        valid = True
        if not self.base_validator.check_MandatoryField(self.task_validator):
            self.problems.extend(self.task_validator.problems)
            valid = False

        if not self.base_validator.check_MandatoryField(self.vehicles_validator):
            self.problems.extend(self.vehicles_validator.problems)
            valid = False
        return valid

