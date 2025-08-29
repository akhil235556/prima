from route_planner.utils import logging
import pandas as pd
import numpy as np
from route_planner.vrp.mid_mile_cost_planner.validator.base_validator import BaseValidator
from route_planner.vrp.mid_mile_cost_planner.validator.time_window_validator import TimeWindowValidator
from datetime import datetime

LOGGER = logging.getLogger(__name__)

class TaskValidator(BaseValidator):
    SHEET = "Task"
    VALID_HEADER = ['Order ID*', 'From Location*', 'From Latitude*', 'From Longitude*',
                    'To Location*', 'To Latitude*', 'To Longitude*',
                    'Loading Time (Hours)', 'Unloading Time (Hours)', 'Load (kg)', 'Volume (cbm)',
                    'SLA (Hours)', 'Operational Hours From', 'Operational Hours To', 'Serviceable Vehicles']

    OUT_HEADER = ['order_id', 'from_location', 'from_latitude', 'from_longitude', 'to_location', 'to_latitude',
                  'to_longitude', 'load', 'volume', 'working_window_from', 'working_window_to', 'operating_window_from',
                  'operating_window_to', 'loading_time', 'unloading_time', 'serviceable_vehicles']

    IN_TO_OUT_HEADER_MAP = {'Order ID*': 'order_id',
                            'From Location*': 'from_location',
                            'From Latitude*': 'from_latitude',
                            'From Longitude*': 'from_longitude',
                            'To Location*': 'to_location',
                            'To Latitude*': 'to_latitude',
                            'To Longitude*': 'to_longitude',
                            'Load (kg)': 'load',
                            'Volume (cbm)': 'volume',
                            'Serviceable Vehicles': 'serviceable_vehicles'
                            }
    MANDATORY_COLS = ['Order ID*', 'From Location*', 'From Latitude*', 'From Longitude*',
                      'To Location*', 'To Latitude*', 'To Longitude*']

    NUMBER_TYPE_COLS = ['Order ID*', 'From Latitude*', 'From Longitude*', 'To Latitude*', 'To Longitude*',
                        'Loading Time (Hours)', 'Unloading Time (Hours)', 'Load (kg)', 'Volume (cbm)', 'SLA (Hours)']

    # all should be mandatory else handle separately because of np.nan
    STRING_TYPE_COLS = ['From Location*', 'To Location*']


    def __init__(self, Validator):
        self.problems = []
        LOGGER.info(f"::: Validate Task :::")
        self.df = pd.read_excel(Validator.file, self.SHEET)
        if self.df.shape[0] > 0:
            self.df = self.df.apply(lambda x: [ele.strip() if isinstance(ele, str) else ele for ele in x])
        self.new_df = pd.DataFrame(index=self.df.index)
        self.header = self.df.columns.to_list()
        self.rid = Validator.rid
        self.UOM_TYPE = str()


    def sanitize(self):
        self.new_df = pd.concat((self.df, self.new_df), axis=1)
        self.new_df.rename(columns=self.IN_TO_OUT_HEADER_MAP, inplace=True)
        self.new_df = self.new_df[self.OUT_HEADER]
        LOGGER.info(f"(Task sanitize) Cols After Mapping\n{self.new_df}")


    def is_all_row_same(self, col):
        if not (self.df[col] == self.df[col][0] ).all():
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
        BaseValidator.positive_number_validator(self, ['Loading Time (Hours)', 'Unloading Time (Hours)', 'Load (kg)', 'SLA (Hours)'])
        BaseValidator.greater_than_zero_validation(self, ['Load (kg)', 'Volume (cbm)'])
        BaseValidator.string_type_validator(self)

        # Order Id* should be unique
        if not self.df['Order ID*'].is_unique:
            message = "Order ID* should be unique!"
            rows = list()
            rows.append(self.df['Order ID*'].to_dict())
            self.problems.extend(BaseValidator.add_problem([-1], rows, message, self.SHEET))

        # 'From Location*', 'From Latitude*', 'From Longitude*' should consist all same entries
        validate_all_same_cols = ['From Location*', 'From Latitude*', 'From Longitude*']
        for col in validate_all_same_cols:
            self.is_all_row_same(col)

        # latitude & longitude validation
        BaseValidator.validate_coordinate(self, self.df['From Latitude*'], type='latitude')
        BaseValidator.validate_coordinate(self, self.df['From Longitude*'], type='longitude')
        BaseValidator.validate_coordinate(self, self.df['To Latitude*'], type='latitude')
        BaseValidator.validate_coordinate(self, self.df['To Longitude*'], type='longitude')

        # to coordinates should be distinct
        self.to_coordinate_distinct()

        # to and from coordinate should be different
        self.valid_to_and_from_coordinate()

        # UOM should be kg or cbm
        # BaseValidator.validate_uom(self)
        # kg_bool = self.df['UOM* (kg, cbm)'] == 'kg'
        # cbm_bool = self.df['UOM* (kg, cbm)'] == 'cbm'
        # if not (kg_bool ^ cbm_bool).all():
        #     message = "UOM* (kg, cbm) can be all in kg or cbm only"
        #     indexes = (kg_bool ^ cbm_bool) == False
        #     rows = self.df[indexes].to_dict(orient="records")
        #     self.problems.extend(BaseValidator.add_problem(self, indexes, rows, message, self.SHEET))

        # if 'SLA (Hours)' -> ('working_window_from', 'working_window_to')
        if not self.df['SLA (Hours)'].dropna().empty:
            if 'SLA (Hours)' in self.header:
                col = self.df['SLA (Hours)'] * 60
                self.new_df['working_window_from'] = 0
                self.new_df['working_window_to'] = col
                self.new_df['working_window_from'] = self.new_df['working_window_from'].astype('int64')
        else:
            self.new_df['working_window_from'] = np.nan
            self.new_df['working_window_to'] = np.nan

        # Loading Time and Unloading Time
        self.new_df['loading_time'] = self.df['Loading Time (Hours)'].fillna(0)
        self.new_df['unloading_time'] = self.df['Unloading Time (Hours)'].fillna(0)

    def validate_header(self):
        return BaseValidator.validate_header(self)

    def process(self):


        self.type_validator()

        # Operating Window validate format
        self.validate_operating_window()

        # sanitize cols
        self.sanitize()

    def validate_operating_window(self):
        self.new_df["operating_window_from"] = self.df["Operational Hours From"]
        self.new_df["operating_window_to"] = self.df["Operational Hours To"]

        if not self.df["Operational Hours To"].dropna().empty:
            valid = True

            tw_obj = TimeWindowValidator(self.df, self.SHEET, "Operational Hours From", 'Operational Hours To')
            # set instance variable
            tw_obj.DATETIME_FORMAT = "%H:%M"
            tw_obj.now = datetime.strptime('00:00', "%H:%M")

            working_window_bool = tw_obj.if_working_window_condition()
            from_valid_time_bool = tw_obj.is_valid_datetime(tw_obj.FROM)
            to_valid_time_bool = tw_obj.is_valid_datetime(tw_obj.TO)

            if working_window_bool and from_valid_time_bool and to_valid_time_bool:
                self.new_df["operating_window_from"] = tw_obj.convert_time_to_minutes(tw_obj.FROM, np.nan)
                self.new_df["operating_window_to"] = tw_obj.convert_time_to_minutes(tw_obj.TO, np.nan)

            if tw_obj.problems:
                valid = False
                self.problems.extend(tw_obj.problems)
            return valid
