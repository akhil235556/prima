
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
from route_planner.kohler.bin_packing_mid_mile.validator.base_validator import BaseValidator
from route_planner.kohler.bin_packing_mid_mile.validator.task_validator import TaskValidator
from route_planner.kohler.bin_packing_mid_mile.validator.vehicles_validator import VehiclesValidator
from route_planner.kohler.bin_packing_mid_mile.bin_packing_mid_mile_configuration import BPMidMileSolverConfiguration
from solvers.solver_v4.exporter import export_output, export_aggregated_output, export_confusion_matrix, export_summary_output, export_vehicle_output
from solvers.solver_v4.utils import vehicle_multiplier
from route_planner.utils.utils import get_current_timestamp, pincode_to_latlong
from solvers.solver_v5.solver import SolverV5
from route_planner.services.requests_log import RequestLog

logger = logging.getLogger(__name__)


class BPMidMileUploadValidation(object):

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
        self.timestamp = get_current_timestamp()

    def _valid_vehicle_type(self, value):
        if isinstance(value, str):
            vehicles_list = value.lower().split(",")
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
            vehicles_list = value.lower().split(",")
            invalid_vehicles = list(set(vehicles_list) - (set(self._VALID_VEHICLES_LIST)))
            if invalid_vehicles:
                return ",".join(self._get_actual_vehicle_case(invalid_vehicles, value))
        return value

    def demand_with_capacity_validation(self):
        task = self.task_validator.df.copy()
        vehicles = self.vehicles_validator.df.copy()

        if not task["Load (kg)"].replace(r"^\s*$", np.nan, regex=True).isna().all():
            if vehicles["Weight Capacity (kg)"].replace(r"^\s*$", np.nan, regex=True).isna().all():
                message = "If load is present in Task sheet, then vehicle weight capacity is required."
                self.problems.extend(BaseValidator.add_problem([-1], dict(), message, self.task_validator.SHEET))
            elif vehicles[vehicles["Weight Capacity (kg)"].isnull()].index.tolist():
                indexes = vehicles[vehicles["Weight Capacity (kg)"].isnull()].index.tolist()
                rows = vehicles.loc[indexes].to_dict(orient="records")
                message = "If load is present in Task sheet, then vehicle weight capacity is required."
                self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.vehicles_validator.SHEET))

        if not task["Volume (cbm)"].replace(r"^\s*$", np.nan, regex=True).isna().all():
            if vehicles["Volume Capacity (cbm)"].replace(r"^\s*$", np.nan, regex=True).isna().all():
                message = "If volume is present in Task sheet, then vehicle volume capacity is required."
                self.problems.extend(BaseValidator.add_problem([-1], dict(), message, self.task_validator.SHEET))
            elif vehicles[vehicles["Volume Capacity (cbm)"].isnull()].index.tolist():
                indexes = vehicles[vehicles["Volume Capacity (cbm)"].isnull()].index.tolist()
                rows = vehicles.loc[indexes].to_dict(orient="records")
                message = "If volume is present in Task sheet, then vehicle volume capacity is required."
                self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.vehicles_validator.SHEET))

    @staticmethod
    def _sanitize_serviceable_vehicles(value, valid_vehicle_map):
        vehicles_list = value.lower().split(",")
        vehicles_list = [valid_vehicle_map.get(v) for v in vehicles_list]
        return ",".join(vehicles_list)

    def serviceable_vehicles_validation(self):
        """
        Validate Serviceable Vehicles col. in Task by Valid Vehicles
        """
        self._VALID_VEHICLES_LIST = self.vehicles_validator.df["Vehicle Type*"].copy().str.lower().to_list()
        error = False
        col = self.task_validator.df["Serviceable Vehicles"].dropna().copy()
        valid_rows = col.map(lambda x: self._valid_vehicle_type(x))
        if not valid_rows.all():
            indexes = valid_rows[valid_rows == False].index.to_list()
            filtered_rows = self.task_validator.df.loc[indexes].copy()
            filtered_rows["Serviceable Vehicles"] = filtered_rows["Serviceable Vehicles"].map(lambda x: self._filter_error(x))
            rows = filtered_rows.to_dict(orient="records")
            message = f"Vehicle in Serviceable Vehicles not exists in Vehicle Sheet"
            self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.task_validator.SHEET))
            error = True

        col = self.task_validator.new_df["serviceable_vehicles"].copy().dropna()

        if not error:
            indexes = col.index.to_list()
            _VALID_VEHICLES = self.vehicles_validator.df["Vehicle Type*"].copy().to_list()
            _valid_vehicle_map = {str(v).lower(): v for v in _VALID_VEHICLES}
            # col = col.map(lambda x: MultiProductUploadValidation._sanitize_serviceable_vehicles(x, _valid_vehicle_map))
            # self.task_validator.new_df["serviceable_vehicles"].loc[indexes] = col.values

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
        self.task_validator.df["From City*"] = self.task_validator.df["From City*"].str.lower()
        self.task_validator.df["To City*"] = self.task_validator.df["To City*"].str.lower()
        self.vehicles_validator.df["From City*"] = self.vehicles_validator.df["From City*"].str.lower()
        self.vehicles_validator.df["To City*"] = self.vehicles_validator.df["To City*"].str.lower()

        task = self.task_validator.df.copy()
        t = task[["From City*", "To City*" ]].copy().apply(tuple, axis=1).to_list()
        v = self.vehicles_validator.df[["From City*", "To City*" ]].copy()
        v_f = self.vehicles_validator.df["From City*"].copy()
        v_t = self.vehicles_validator.df["To City*"].copy()

        v_bool = v_f.isnull() & v_t.isnull()

        if not (v_bool.any()):
            # no vehicles with all from city to city service (Null values)
            valid_bool = v_f.notnull() & v_t.notnull()
            v_tuple = v[valid_bool].apply(tuple, axis=1).to_list()
            if not (set(t)).issubset(set(v_tuple)):
                delta = list(set(t)-set(v_tuple))
                indexes = [t.index(d) for d in delta]
                indexes.sort()
                rows = task.loc[indexes].to_dict(orient="records")
                message = f"No valid Vehicle found for following task (From City, To City)"
                self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.task_validator.SHEET))
    def check_shipment_size(self):
        """
        Validate if shipment weight and volume for a lane is less than maximum capacity available for that lane
        """

        task = self.task_validator.df.copy()
        vehicle = self.vehicles_validator.df.copy()
        #wt_v = {k: max(g["Weight Capacity (kg)"].tolist()) for k, g in vehicle.groupby(["From City*", "To City*"])})
        #vol_v = {k: max(g["Volume Capacity (cbm)"].tolist()) for k, g in vehicle.groupby(["From City*", "To City*"])})
        wt_v = vehicle.groupby(["From City*","To City*"], sort=False)["Weight Capacity (kg)"].max()
        vol_v = vehicle.groupby(["From City*","To City*"], sort=False)["Volume Capacity (cbm)"].max()

        col1 = task[["Load (kg)", "From City*", "To City*" ]].copy().dropna()
        col2 = task[["Volume (cbm)", "From City*", "To City*" ]].copy().dropna()

        new1 = pd.merge(col1, wt_v, how="left", left_on=["From City*", "To City*" ], right_on=["From City*","To City*" ]).dropna()
        new2 = pd.merge(col2, vol_v, how="left", left_on=["From City*", "To City*" ], right_on=["From City*","To City*" ]).dropna()

        if not new1["Load (kg)"].isnull().values.any():
            invalid_bool1 = new1["Load (kg)"] > new1["Weight Capacity (kg)"]
            if invalid_bool1.any():
                indexes = col1[invalid_bool1].index.to_list()
                rows = task.loc[indexes].to_dict(orient="records")
                message = f" weight of the shipments should be less than vehicle weight capacity"
                self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.task_validator.SHEET))

        if not new2["Volume (cbm)"].isnull().values.any():
            invalid_bool2 = new2["Volume (cbm)"] > new2["Volume Capacity (cbm)"]
            if invalid_bool2.any():
                indexes = col2[invalid_bool2].index.to_list()
                rows = task.loc[indexes].to_dict(orient="records")
                message = f" volume of the shipments should be less than vehicle volume capacity"
                self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.task_validator.SHEET))

    @staticmethod
    def filter_vehicles(orders, vehicles):
        from_city_list = orders["from_city"].values.tolist()
        to_city_list = orders["to_city"].values.tolist()

        cities_list = list(zip(from_city_list, to_city_list))

        vehicles = vehicles.merge(pd.DataFrame(list(set(cities_list)), columns=["from_city", "to_city"]))
        if vehicles.empty:
            raise ValidationError(message=f"Vehicle not found for [From City, To City]")
        return vehicles

    def validate_sheets(self):
        if not self.validate_headers():
            self.raise_problems()

        if not self.validate_mandatory_fields():
            self.raise_problems()

        self.task_validator.process()
        self.vehicles_validator.process()

        self.problems.extend(self.task_validator.problems)
        self.problems.extend(self.vehicles_validator.problems)

        # From City and To City validation
        self.validate_from_to_city_vehicles()

        # Load and Volume with Capacities Validation
        self.demand_with_capacity_validation()

        #  Check shipment size
        self.check_shipment_size()

        # Raise problems
        self.raise_problems()

        self.task_validator.sanitize()
        # Raise problems
        self.problems.extend(self.task_validator.problems)
        self.raise_problems()

        self.vehicles_validator.sanitize()

        # Filter Vehicles
        _vehicles = self.filter_vehicles(
            orders=self.task_validator.new_df.copy(),
            vehicles=self.vehicles_validator.new_df.copy())

        self.vehicles_validator.new_df = _vehicles

        logger.info(f"Sheets Validated for rid: {self._rid}")

    # @profile
    def process_main(self):
        RequestLog(self._rid).write_log(RequestLogMessages.REQUEST_INIT)
        errors = list()
        summary_df = pd.DataFrame()
        aggregated_df = pd.DataFrame()
        output_df = pd.DataFrame()
        vehicles_df = pd.DataFrame()
        temp_file_path_list = list()

        # Call process() on validators to ensure dataframes are sanitized and columns are renamed
        self.task_validator.process()
        self.vehicles_validator.process()

        _task_df = self.task_validator.new_df.copy()
        _vehicles_df = self.vehicles_validator.new_df.copy()

        print(f"_task_df shape: {_task_df.shape}")
        print(f"_vehicles_df shape: {_vehicles_df.shape}")

        #Pincodes to coordinates
# self.pincode_to_coordinates(_task_df)
        # groupby df on "From City*" and "To City*"
        # task_df_list = self.task_grouping_city(_task_df)

        # planning_id intial offset
        try:
            from_city = _task_df["from_city"].to_list()[0]
            to_city = _task_df["to_city"].to_list()[0]

            rid, temp_path = self.base_validator.df_to_csv(self.task_validator)
            orders = pd.read_csv(temp_path)
            temp_file_path_list.append(temp_path)

            rid, temp_path = self.base_validator.df_to_csv(self.vehicles_validator)
            vehicles = pd.read_csv(temp_path)
            temp_file_path_list.append(temp_path)

            vehicles = self.filter_vehicles(orders, vehicles)

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
                )
            RequestLog(self._rid).write_log(msg)
            configuration = BPMidMileSolverConfiguration.get_default_bp_mid_mile_configuration()
            logger.info(f"solver config: {str(configuration)}")
            planner = SolverV5(orders=orders, vehicles=vehicles, config=configuration)
            # Corrected unpacking to handle 7 return values
            sequential_data, summary_df, output_df, aggregated_df, vehicles_df, confusion_matrix_df, status = planner.execute()

        except AppException as e:
            logger.error(e, exc_info=True)
            errors.append(str(e))
            msg = RequestLogMessages.SOLVER_FAIL.format(
                from_city=from_city,
                to_city=to_city,
                error_message=str(e)
            )
            RequestLog(self._rid).write_log(msg)
            return [], pd.DataFrame(), pd.DataFrame(), pd.DataFrame(), pd.DataFrame(), pd.DataFrame(), -1 # Return default values

        finally:
            for file_path in temp_file_path_list:
                os.system(f"rm {file_path}")

        sheet_path = self.get_bin_packing_sheet(aggregated_df, output_df, summary_df, vehicles_df, confusion_matrix_df)
        resp = self.response_bin_packing(sheet_path)
        print(f"Output saved to: {resp['details']['output_file']}")
        msg = RequestLogMessages.SOLVER_SUCCESS.format(
            from_city=from_city,
            to_city=to_city
        )
        RequestLog(self._rid).write_log(msg)

        return sequential_data, summary_df, output_df, aggregated_df, vehicles_df, confusion_matrix_df, status

    def get_output_excel_file_path(self, rid):
        return f"/tmp/{rid}_output.xlsx"

    def get_bin_packing_sheet(self, ag_df, o_df, sum_df, veh_df, cm_df):
        excel_file_path = self.get_output_excel_file_path(rid=self._rid)

        with pd.ExcelWriter(excel_file_path) as writer:
            sum_df.to_excel(writer, index_label="Index", sheet_name="Summary")
            ag_df.to_excel(writer, index=False, sheet_name="Aggregated")
            o_df.to_excel(writer, index=False, sheet_name="Output")
            veh_df.to_excel(writer, index_label="Index", sheet_name="Vehicles")
            cm_df.to_excel(writer, index=False, sheet_name="Confusion Matrix")

        return excel_file_path

    def response_bin_packing(self, o_path):
        # return response
        response = dict(
            message="Success",
            code=str(200),
            details=dict(
                output_file=o_path
            ))
        return response


