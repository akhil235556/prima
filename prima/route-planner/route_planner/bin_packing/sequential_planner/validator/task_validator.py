from route_planner.utils import logging
from datetime import datetime

import pandas as pd

from route_planner.constants.app_constants import MAX_INT
from route_planner.vrp.sku_fixed_cost_planner.validator.base_validator import BaseValidator
from route_planner.vrp.sku_fixed_cost_planner.validator.time_window_validator import TimeWindowValidator
from route_planner.utils.utils import generate_request_id

logger = logging.getLogger(__name__)


class TaskValidator(BaseValidator):
    SHEET = "Task"
    VALID_HEADER = ['Order ID*', 'SKU', 'From Location*', 'From Latitude*', 'From Longitude*',
                    'From City*', 'To Location*', 'To Latitude*', 'To Longitude*',
                    'To City*', 'Loading Time (Hours)', 'Unloading Time (Hours)',
                    'Load (kg)*', 'Volume (cbm)*', 'SLA (Hours)', 'Operational Hours From',
                    'Operational Hours To', 'Serviceable Vehicles', 'Tag', 'Priority']

    OUT_HEADER = ['order_id', 'from_location', 'from_latitude', 'from_longitude', 'to_location', 'to_latitude',
                  'to_longitude', 'load', 'volume', 'priority', 'sku', 'sku_tag', 'serviceable_vehicles',
                  'from_city', 'to_city', 'task_id', 'working_window_from', 'working_window_to', 'operating_window_from',
                  'operating_window_to', 'loading_time', 'unloading_time']

    IN_TO_OUT_HEADER_MAP = {'Order ID*': 'task_id',
                            'From Location*': 'from_location',
                            'From Latitude*': 'from_latitude',
                            'From Longitude*': 'from_longitude',
                            'To Location*': 'to_location',
                            'To Latitude*': 'to_latitude',
                            'To Longitude*': 'to_longitude',
                            'Load (kg)*': 'load',
                            'Volume (cbm)*': 'volume',
                            'Serviceable Vehicles': 'serviceable_vehicles',
                            'From City*': 'from_city',
                            'To City*': 'to_city',
                            'Priority': 'priority'
                            }

    MANDATORY_COLS = ['Order ID*', 'Load (kg)*', 'Volume (cbm)*', 'From City*', 'To City*']

    NUMBER_TYPE_COLS = ['Load (kg)*', 'Volume (cbm)*', 'Priority', 'Loading Time (Hours)',
                        'Unloading Time (Hours)', 'SLA (Hours)']

    STRING_TYPE_COLS = ['Order ID*', 'From City*', 'To City*', 'Serviceable Vehicles', 'SKU', 'Tag']

    def __init__(self, Validator):
        self.problems = []
        logger.info(f"::: Validate Task :::")
        self.df = pd.read_excel(Validator.file, self.SHEET, converters={'Tag': str})
        if self.df.shape[0] > 0:
            self.df = self.df.apply(lambda x: [ele.strip() if isinstance(ele, str) else ele for ele in x])
        self.new_df = pd.DataFrame(index=self.df.index)
        self.header = self.df.columns.to_list()
        self.rid = Validator.rid
        self.sku_exclusion_list = list()
        #self.UOM_TYPE = str()

    def sanitize(self):
        self.new_df = pd.concat((self.df, self.new_df), axis=1)
        self.new_df.rename(columns=self.IN_TO_OUT_HEADER_MAP, inplace=True)
        self.new_df = self.new_df[self.OUT_HEADER]
        logger.info(f"({self.SHEET} sanitize) columns: {self.new_df.columns.to_list()}")

    def is_all_row_same(self, col):
        if not (self.df[col] == self.df[col][0]).all():
            indexes = self.df[col] != self.df[col][0]
            message = f"{col} should be same through out"
            rows = self.df[indexes].to_dict(orient="records")
            self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.SHEET))

    def valid_to_and_from_coordinate(self):
        from_lat = self.df['From Latitude*'].copy()
        from_long = self.df['From Longitude*'].copy()
        to_lat = self.df['To Latitude*'].copy()
        to_long = self.df['To Longitude*'].copy()
        lat_bool = to_lat == from_lat
        long_bool = to_long == from_long
        if (lat_bool & long_bool).any():
            indexes = self.df[(lat_bool & long_bool)].index.to_list()
            rows = self.df.loc[indexes].to_dict(orient='records')
            message = f"To Coordinates cannot be similar to From Coordinates"
            self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.SHEET))

    def to_coordinate_distinct(self):
        to_df = self.df[['To Latitude*', 'To Longitude*']].copy()
        index_to = to_df.index.to_list()
        index_drop_duplicates = to_df.drop_duplicates(keep='first').index.to_list()
        invalid_indexes = list(set(index_to) - set(index_drop_duplicates))
        if invalid_indexes:
            rows = self.df.loc[invalid_indexes].to_dict(orient='records')
            message = f"Duplicate To Coordinates found"
            self.problems.extend(BaseValidator.add_problem(invalid_indexes, rows, message, self.SHEET))

    def type_validator(self):

        BaseValidator.number_type_validator(self)
        BaseValidator.positive_number_validator(self, ['Loading Time (Hours)', 'Unloading Time (Hours)', 'Load (kg)*',
                                                       'SLA (Hours)', 'Priority'])
        BaseValidator.greater_than_zero_validation(self, ['Load (kg)*', 'Volume (cbm)*', 'Priority'])
        BaseValidator.type_cast_to_str(self)

        if not self.df['From Latitude*'].isnull().values.any() and not self.df['From Longitude*'].isnull().values.any():
            # latitude & longitude validation
            BaseValidator.validate_coordinate(self, self.df['From Latitude*'], type='latitude')
            BaseValidator.validate_coordinate(self, self.df['From Longitude*'], type='longitude')
            # 'From Location*', 'From Latitude*', 'From Longitude*' should consist all same entries
            validate_all_same_cols = ['From Location*', 'From Latitude*', 'From Longitude*']
            for col in validate_all_same_cols:
                self.is_all_row_same(col)
        # to and from coordinate should be different
        if not self.df['To Latitude*'].isnull().values.any() and not self.df['To Longitude*'].isnull().values.any():
            BaseValidator.validate_coordinate(self, self.df['To Latitude*'], type='latitude')
            BaseValidator.validate_coordinate(self, self.df['To Longitude*'], type='longitude')
            self.valid_to_and_from_coordinate()
            # to coordinates should be distinct
            # self.to_coordinate_distinct()

        # UOM should be kg or cbm
        #BaseValidator.validate_uom(self)
        # kg_bool = self.df['UOM* (kg, cbm)'] == 'kg'
        # cbm_bool = self.df['UOM* (kg, cbm)'] == 'cbm'
        # if not (kg_bool ^ cbm_bool).all():
        #     message = "UOM* (kg, cbm) can be all in kg or cbm only"
        #     indexes = (kg_bool ^ cbm_bool) == False
        #     rows = self.df[indexes].to_dict(orient="records")
        #     self.problems.extend(BaseValidator.add_problem(self, indexes, rows, message, self.SHEET))

        # if 'SLA (Hours)' -> ('working_window_from', 'working_window_to')
        if 'SLA (Hours)' in self.header:
            col = self.df['SLA (Hours)'] * 60
            col = col.fillna(MAX_INT)
            self.new_df['working_window_from'] = 0
            self.new_df['working_window_to'] = col
            self.new_df['working_window_from'] = self.new_df['working_window_from'].astype('int64')
            self.new_df['working_window_to'] = self.new_df['working_window_to'].astype('int64')

        # Loading Time and Unloading Time
        self.new_df['loading_time'] = self.df['Loading Time (Hours)'].fillna(0)
        self.new_df['unloading_time'] = self.df['Unloading Time (Hours)'].fillna(0)

        BaseValidator.check_priority_value(self, 'Priority')

    def validate_header(self):
        return BaseValidator.validate_header(self)

    def process(self):

        self.type_validator()

        # Operating Window validate format
        self.validate_operating_window()

        # For Case Insensitive
        self.df['From City*'] = self.df['From City*'].str.lower()
        self.df['To City*'] = self.df['To City*'].str.lower()

        # Adding default values for non-existing sku
        self.default_sku_value()

        # validate sku_tag
        self.new_df['sku_tag'] = BaseValidator.validate_comma_sep_string_col(self.df['Tag'])

        # order_id
        self.new_df['order_id'] = self.df.index

        # sanitize cols
        self.sanitize()

    def validate_operating_window(self):
        valid = True
        self.new_df["operating_window_from"] = self.df["Operational Hours From"]
        self.new_df["operating_window_to"] = self.df["Operational Hours To"]

        tw_obj = TimeWindowValidator(self.df, self.SHEET, "Operational Hours From", 'Operational Hours To')
        # set instance variable
        tw_obj.DATETIME_FORMAT = "%H:%M"
        tw_obj.now = datetime.strptime('00:00', "%H:%M")

        working_window_bool = tw_obj.if_working_window_condition()
        from_valid_time_bool = tw_obj.is_valid_datetime(tw_obj.FROM)
        to_valid_time_bool = tw_obj.is_valid_datetime(tw_obj.TO)

        if working_window_bool and from_valid_time_bool and to_valid_time_bool:
            self.new_df["operating_window_from"] = tw_obj.convert_time_to_minutes(tw_obj.FROM, "00:00")
            self.new_df["operating_window_to"] = tw_obj.convert_time_to_minutes(tw_obj.TO, "23:59")

        if tw_obj.problems:
            valid = False
            self.problems.extend(tw_obj.problems)
        return valid

    @staticmethod
    def generate_uuid():
        return generate_request_id()

    def default_sku_value(self):
        gen_default_values = list()

        sku = self.df['SKU'].copy()
        self.new_df['sku'] = sku

        null_sku_bool = sku.isna()
        if null_sku_bool.any():
            gen_default_values = [TaskValidator.generate_uuid() for _ in range(len(null_sku_bool))]
            self.new_df['sku'].loc[null_sku_bool] = pd.Series(gen_default_values)
        self.sku_exclusion_list = gen_default_values

