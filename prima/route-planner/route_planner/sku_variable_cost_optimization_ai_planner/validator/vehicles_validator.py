import numpy as np

from route_planner.sku_variable_cost_optimization_ai_planner.validator.time_window_validator import TimeWindowValidator
from route_planner.utils import logging

import pandas as pd

from route_planner.constants.app_constants import AVERAGE_VEHICLE_SPEED
from route_planner.sku_variable_cost_optimization_ai_planner import utils
from route_planner.sku_variable_cost_optimization_ai_planner.validator.base_validator import BaseValidator

from datetime import datetime

logger = logging.getLogger(__name__)


class VehiclesValidator(BaseValidator):
    SHEET = "Vehicles"

    VALID_HEADER = [
        'Vehicle Type*',
        'Weight Capacity (kg)',
        'Volume Capacity (cbm)',
        'Fixed Cost',
        'Per KM Charges',
        'Per Hour Charges',
        'Driving Hours From',
        'Driving Hours To',
        'From Latitude',
        'From Longitude',
        'From City',
        'To Latitude',
        'To Longitude',
        'To City',
        'Weight Utilisation % Lower Bound',
        'Volume Utilisation % Lower Bound',
        'Return to Origin',
        'No of Vehicles',
        'Maximum Route Length (KM)'
        ]

    OUT_HEADER = [
        'veh_index',
        'vehicle_type_name',
        'weight_capacity',
        'volume_capacity',
        'fixed_charges',
        'per_km_charges',
        'per_hour_charges',
        'driving_hours_from',
        'driving_hours_to',
        'weight_util_lb',
        'volume_util_lb',
        'no_of_vehicles',
        'from_city',
        'to_city',
        'return_to_origin',
        'max_route_length',
        'veh_repeat_factor',
        'veh_origin',
        'veh_origin_lat',
        'veh_origin_long',
        'veh_destination',
        'veh_destination_lat',
        'veh_destination_long'
    ]

    IN_TO_OUT_HEADER_MAP = {
        'Vehicle Type*': 'vehicle_type_name',
        'Weight Capacity (kg)': 'weight_capacity',
        'Volume Capacity (cbm)': 'volume_capacity',
        'Fixed Cost': 'fixed_charges',
        'Per KM Charges': 'per_km_charges',
        'Per Hour Charges': 'per_hour_charges',
        'Weight Utilisation % Lower Bound': 'utilisation_lb',
        'Volume Utilisation % Lower Bound': 'volume_utilisation_lb',
        'No of Vehicles': 'no_of_vehicles',
        'Driving Hours From': 'driving_hours_from',
        'Driving Hours To': 'driving_hours_to'
    }

    MANDATORY_COLUMNS = [
        'Vehicle Type*'
    ]

    NUMBER_TYPE_COLUMNS = [
        'Weight Capacity (kg)',
        'Volume Capacity (cbm)',
        'Fixed Cost',
        'Per KM Charges',
        'Per Hour Charges',
        'From Latitude',
        'From Longitude',
        'To Latitude',
        'To Longitude',
        'Weight Utilisation % Lower Bound',
        'Volume Utilisation % Lower Bound',
        'No of Vehicles',
        'Maximum Route Length (KM)'
    ]

    STRING_TYPE_COLS = [
        'Vehicle Type*'
    ]

    def __init__(self, validator):
        self.problems = list()
        logger.info(f"::: Validate Vehicles :::")
        self.df = pd.read_excel(validator.file, self.SHEET)
        # todo improve this!
        if self.df.shape[0] > 0:
            self.df = self.df.apply(lambda x: [ele.strip() if isinstance(ele, str) else ele for ele in x])

        self.new_df = pd.DataFrame(index=self.df.index)
        self.header = self.df.columns.to_list()

        self.MANDATORY_COLS = self.MANDATORY_COLUMNS.copy()
        self.NUMBER_TYPE_COLS = self.NUMBER_TYPE_COLUMNS.copy()
        self.rid = validator.rid

    def validate_header(self) -> bool:
        return BaseValidator.validate_header(self)

    def sanitize(self, filter_cols=True):
        self.new_df = pd.concat((self.df, self.new_df), axis=1)
        self.get_col_veh_repeat_factor()
        self.new_df = self.set_veh_index(self.new_df)
        self.get_veh_coordinates()
        self.new_df.rename(columns=self.IN_TO_OUT_HEADER_MAP, inplace=True)
        if filter_cols:
            self.new_df = self.new_df[self.OUT_HEADER]
        logger.info(f"({self.SHEET} sanitize) columns: {self.new_df.columns.to_list()}")

    def type_validator(self):

        BaseValidator.number_type_validator(self)
        BaseValidator.positive_number_validator(self, ['Fixed Cost', 'Per KM Charges', 'Per Hour Charges'], fill_na=0)
        BaseValidator.positive_number_validator(self, ['No of Vehicles', 'Maximum Route Length (KM)', 'Weight Capacity (kg)', 'Volume Capacity (cbm)'], greater_than_zero=True)

        # handeled 'Weight Utilisation % Lower Bound', 'Volume Utilisation % Lower Bound'

        BaseValidator.type_cast_to_str(self.df, ['Vehicle Type*'], fill=None)
        BaseValidator.type_cast_to_str(self.df, ['Return to Origin'], fill="no")
        BaseValidator.type_cast_to_str(self.df, ['Driving Hours From', 'Driving Hours To'])
        # latitude & longitude validation
        BaseValidator.validate_coordinate(self, self.df['From Latitude'], type='latitude', mandatory_col=False)
        BaseValidator.validate_coordinate(self, self.df['From Longitude'], type='longitude', mandatory_col=False)
        BaseValidator.validate_coordinate(self, self.df['To Latitude'], type='latitude', mandatory_col=False)
        BaseValidator.validate_coordinate(self, self.df['To Longitude'], type='longitude', mandatory_col=False)

    @staticmethod
    def get_global_average_speed():
        """
        solver global average speed in meter per second
        :return float:
        """
        return utils.convert_kmph_to_mps(AVERAGE_VEHICLE_SPEED)

    @staticmethod
    def get_vehicle_repeat_factor():
        return 5

    def process(self):
        self.type_validator()

        BaseValidator.from_to_city_validation(self, from_city='From City', to_city='To City')

        # 'Utilisation % Lower Bound' default 0 and range(0-100)
        self.utilization_validation('Weight Utilisation % Lower Bound', 'weight_util_lb')
        self.utilization_validation('Volume Utilisation % Lower Bound', 'volume_util_lb')

        # convert distance to meters
        self.new_df['max_route_length'] = utils.convert_distance_km_to_meter(self.df['Maximum Route Length (KM)'])
        self.new_df['max_route_length'] = self.new_df['max_route_length'].fillna(-1)
        # validate return to origin
        self.validate_return_to_origin()

        # validate coordinates
        self.validate_vehicle_coordinates()

        # validate time windows
        self.validate_driving_window()

    def validate_driving_window(self):
        from_col_name = "Driving Hours From"
        to_col_name = "Driving Hours To"

        if not self.df[from_col_name].dropna().empty or not self.df[to_col_name].dropna().empty:
            self.df[from_col_name] = self.df[from_col_name].replace('', np.nan)
            self.df[to_col_name] = self.df[to_col_name].replace('', np.nan)

            tw_obj = TimeWindowValidator(self.df, self.SHEET, from_col_name, to_col_name)
            # set instance variable
            tw_obj.DATETIME_FORMAT = "%H:%M"
            tw_obj.now = datetime.strptime('00:00', "%H:%M")

            tw_obj.if_working_window_condition()
            tw_obj.is_valid_datetime(tw_obj.FROM)
            tw_obj.is_valid_datetime(tw_obj.TO)

            if tw_obj.problems:
                self.problems.extend(tw_obj.problems)
                return False

            self.df[from_col_name] = self.df[from_col_name].replace(np.nan, '')
            self.df[to_col_name] = self.df[to_col_name].replace(np.nan, '')
            return True

    def validate_vehicle_coordinates(self):
        error = False

        # from co-ordinate validation
        fc = self.df['From City'].copy()
        rto = self.df['Return to Origin'].copy().str.lower()
        f_lat = self.df['From Latitude'].copy()
        f_long = self.df['From Longitude'].copy()

        valid_fc = fc.notnull()
        valid_rto = rto == 'yes'
        valid_bool = np.logical_or(valid_fc, valid_rto)
        valid_cor_bool = np.logical_and(f_lat.notnull(), f_long.notnull())
        check_bool_xor = np.logical_xor(valid_bool, valid_cor_bool)
        check_bool = np.logical_and(check_bool_xor, valid_bool)
        if check_bool.any():
            indexes = valid_bool[check_bool].index.to_list()
            rows = self.df.loc[indexes].to_dict(orient="records")
            message = f"From coordinates (lat/long) mandatory if return_to_origin is 'yes' or 'From City' given"
            self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.SHEET))
            error = True

        # to coordinate validation
        tc = self.df['To City'].copy()
        t_lat = self.df['To Latitude'].copy()
        t_long = self.df['To Longitude'].copy()

        valid_tc = tc.notnull()
        valid_cor_bool = np.logical_and(t_lat.notnull(), t_long.notnull())
        check_bool_xor = np.logical_xor(valid_tc, valid_cor_bool)
        check_bool = np.logical_and(check_bool_xor, valid_tc)
        if check_bool.any():
            indexes = valid_tc[check_bool].index.to_list()
            rows = self.df.loc[indexes].to_dict(orient="records")
            message = f"To coordinates (lat/long) mandatory if 'To City' given"
            self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.SHEET))
            error = True
        return error

    def validate_return_to_origin(self):
        valid = True
        rto = self.df['Return to Origin'].copy()
        rto = rto.str.lower()

        invalid_values = rto.isin(['yes', 'no']) == False
        if invalid_values.any():
            # consist invalid values
            indexes = rto[invalid_values == True].index.to_list()
            rows = self.df.loc[indexes].to_dict(orient="records")
            message = f"Return to Origin can only consist 'yes' or 'no' (Case Insensitive)"
            self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.SHEET))
            valid =  False

        rto_valid = rto.replace({'no': False, 'yes': True})
        rto.loc[rto_valid.index] = rto_valid

        # if return to origin true then No of Vehicles mandatory
        true_bool = rto.copy() == True
        no_of_v_col = self.df[true_bool].loc[:, 'No of Vehicles']
        invalid_bool = no_of_v_col.isna()

        if invalid_bool.any():
            # consist invalid values
            indexes = no_of_v_col[invalid_bool == True].index.to_list()
            rows = self.df.loc[indexes].to_dict(orient="records")
            message = f"No of Vehicles mandatory if return_to_origin is 'yes'"
            self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.SHEET))
            valid = False

        if valid:
            self.new_df['return_to_origin'] = rto
        return valid


    def utilization_validation(self, col_name, out_col_name):
        col = self.df[col_name].copy().fillna(0)
        col_upper_bound = col > 100
        col_lower_bound = col < 0
        if (col_lower_bound | col_upper_bound).any():
            indexes = self.df[(col_lower_bound | col_upper_bound)].index.to_list()
            rows = self.df.loc[indexes].to_dict(orient='records')
            message = f"Field in {col_name} breaches range (0-100)"
            self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.SHEET))
            return False

        self.new_df[out_col_name] = col
        return True

    def get_col_veh_repeat_factor(self):
        self.new_df['veh_repeat_factor'] = self.df['No of Vehicles']
        self.new_df['veh_repeat_factor'] = self.new_df['veh_repeat_factor'].fillna(self.get_vehicle_repeat_factor())

    @staticmethod
    def set_veh_index(df: pd.DataFrame, col_name='veh_index', reset_index=True):
        if reset_index:
            df.reset_index(drop=True, inplace=True)
        df[col_name] = df.index
        return df


    def get_veh_coordinates(self):
        # from co-ordinate validation
        fc = self.df['From City'].copy()
        tc = self.df['To City'].copy()
        rto = self.df['Return to Origin'].copy().str.lower()

        valid_fc = fc.notnull()
        valid_rto = rto == 'yes'
        valid_tc = tc.notnull()
        valid_bool = np.logical_or(valid_tc, valid_rto)
        self.new_df['veh_origin'] = valid_fc
        self.new_df['veh_destination'] = valid_bool

        valid_origin_index = self.new_df['veh_origin'][self.new_df['veh_origin'] == True].index.tolist()
        valid_dest_index = self.new_df['veh_destination'][self.new_df['veh_destination'] == True].index.tolist()
        valid_rto_index = rto[valid_rto == True].index.tolist()

        self.new_df['veh_origin_lat'] = self.df.loc[valid_origin_index]['From Latitude']
        self.new_df['veh_origin_long'] = self.df.loc[valid_origin_index]['From Longitude']

        self.new_df['veh_destination_lat'] = self.df.loc[valid_dest_index]['To Latitude']
        self.new_df['veh_destination_long'] = self.df.loc[valid_dest_index]['To Longitude']

        # # # if return to origin case
        self.new_df['veh_origin_lat'].loc[valid_rto_index] = self.df.loc[valid_rto_index]['From Latitude']
        self.new_df['veh_origin_long'].loc[valid_rto_index] = self.df.loc[valid_rto_index]['From Longitude']
        self.new_df['veh_destination_lat'].loc[valid_rto_index] = self.df.loc[valid_rto_index]['From Latitude']
        self.new_df['veh_destination_long'].loc[valid_rto_index] = self.df.loc[valid_rto_index]['From Longitude']
        self.new_df['veh_origin'].loc[valid_rto_index] = True

    @staticmethod
    def repeat_df_by_col(df, col_name):
        return df.reindex(df.index.repeat(df[col_name])).reset_index(drop=True)






