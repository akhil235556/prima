from datetime import datetime

import numpy as np

from route_planner.sku_variable_cost_optimization_ai_planner.validator.time_window_validator import TimeWindowValidator
from route_planner.utils import logging

import pandas as pd

from route_planner.sku_variable_cost_optimization_ai_planner.validator.base_validator import BaseValidator
from route_planner.sku_variable_cost_optimization_ai_planner import utils
from solvers.solver_v3.constants import PriorityMap, VALID_PRIORITY_CODES

logger = logging.getLogger(__name__)


class TaskValidator(BaseValidator):

    SHEET = "Task"

    VALID_HEADER = [
        'Order ID*',
        'SKU',
        'From Location*',
        'From Latitude*',
        'From Longitude*',
        'From City',
        'To Location*',
        'To Latitude*',
        'To Longitude*',
        'To City',
        'Loading Time (Hours)',
        'Unloading Time (Hours)',
        'Load (kg)',
        'Volume (cbm)',
        'SLA (Hours)',
        'Operational Hours From',
        'Operational Hours To',
        'Serviceable Vehicles',
        'Tag',
        'Priority'
    ]

    OUT_HEADER = [
        'order_id',
        'task_id',
        'sku',
        'from_location',
        'from_latitude',
        'from_longitude',
        'to_location',
        'to_latitude',
        'to_longitude',
        'load',
        'volume',
        'sla_in_s',
        'loading_time_s',
        'unloading_time_s',
        'operating_hours_from',
        'operating_hours_to',
        'serviceable_vehicles',
        'from_city',
        'to_city',
        'penalty',
        'sku_tag'
    ]

    IN_TO_OUT_HEADER_MAP = {
        'Order ID*': 'task_id',
        'From Location*': 'from_location',
        'From Latitude*': 'from_latitude',
        'From Longitude*': 'from_longitude',
        'To Location*': 'to_location',
        'To Latitude*': 'to_latitude',
        'To Longitude*': 'to_longitude',
        'Load (kg)': 'load',
        'Volume (cbm)': 'volume',
        'Operational Hours From': "operating_hours_from",
        'Operational Hours To': "operating_hours_to",
        'Serviceable Vehicles': 'serviceable_vehicles',
        'Priority': 'penalty'
    }

    MANDATORY_COLS = [
        'Order ID*',
        'From Location*',
        'From Latitude*', 'From Longitude*',
        'To Location*',
        'To Latitude*',
        'To Longitude*'
    ]

    NUMBER_TYPE_COLS = [
        'From Latitude*',
        'From Longitude*',
        'To Latitude*',
        'To Longitude*',
        'Loading Time (Hours)',
        'Unloading Time (Hours)',
        'Load (kg)',
        'Volume (cbm)',
        'SLA (Hours)',
        'Priority'
    ]

    STRING_TYPE_COLS = [
        'Order ID*',
        'From Location*',
        'To Location*',
        'Operational Hours From',
        'Operational Hours To',
        'Serviceable Vehicles',
    ]
    # 'From City', 'To City' handled
    # SKU , Tag handled

    def __init__(self, validator):
        self.problems = []
        logger.info(f"::: Validate Task :::")

        self.df = pd.read_excel(validator.file, self.SHEET, dtype={'SKU': str, 'Tag': str})

        # todo imporove this!
        if self.df.shape[0] > 0:
            self.df = self.df.apply(lambda x: [ele.strip() if isinstance(ele, str) else ele for ele in x])

        self.new_df = pd.DataFrame(index=self.df.index)
        self.header = self.df.columns.to_list()
        self.rid = validator.rid
        self.sku_exclusion_list = list()
        self.valid_load_demands = dict(
            weight=False,
            volume=False
        )

    def process(self):

        self.type_validator()

        # From City and To City Validation i.e. both should  be present
        BaseValidator.from_to_city_validation(self, from_city='From City', to_city='To City')

        self.validate_load_demands()

        # convert to seconds
        self.new_df['loading_time_s'] = utils.convert_time_hour_to_seconds(self.df['Loading Time (Hours)'])
        self.new_df['unloading_time_s'] = utils.convert_time_hour_to_seconds(self.df['Unloading Time (Hours)'])
        # validate sla
        self.new_df['sla_in_s'] = utils.convert_time_hour_to_seconds(self.df['SLA (Hours)'])
        self.new_df['sla_in_s'] = self.new_df['sla_in_s'].fillna(-1)
        # Adding default values for non-existing sku
        self.default_sku_value()

        # validate sku_tag
        self.new_df['sku_tag'] = BaseValidator.validate_comma_sep_string_col(self.df['Tag'])

        # order_id
        self.new_df['order_id'] = self.df.index

        # validate priority
        self.validate_priority()

        # validate time windows
        self.validate_operating_window()

    def type_validator(self):

        BaseValidator.number_type_validator(self)

        BaseValidator.positive_number_validator(self, ['Loading Time (Hours)', 'Unloading Time (Hours)'], fill_na=0)

        BaseValidator.positive_number_validator(self, ['Load (kg)', 'Volume (cbm)', 'SLA (Hours)'], greater_than_zero=True)

        BaseValidator.type_cast_to_str(self.df, self.STRING_TYPE_COLS)

        # latitude & longitude validation
        BaseValidator.validate_coordinate(self, self.df['From Latitude*'], type='latitude')
        BaseValidator.validate_coordinate(self, self.df['From Longitude*'], type='longitude')
        BaseValidator.validate_coordinate(self, self.df['To Latitude*'], type='latitude')
        BaseValidator.validate_coordinate(self, self.df['To Longitude*'], type='longitude')

    def sanitize(self):
        self.new_df = pd.concat((self.df, self.new_df), axis=1)
        self.new_df.rename(columns=self.IN_TO_OUT_HEADER_MAP, inplace=True)
        self.new_df = self.new_df[self.OUT_HEADER]
        logger.info(f"({self.SHEET} sanitize) columns: {self.new_df.columns.to_list()}")

    def validate_operating_window(self):
        from_col_name = "Operational Hours From"
        to_col_name = "Operational Hours To"

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

            self.df[from_col_name] = self.df[from_col_name].replace( np.nan, '')
            self.df[to_col_name] = self.df[to_col_name].replace(np.nan, '')
            return True

    def validate_load_demands(self):
        load = self.df['Load (kg)'].copy()
        vol = self.df['Volume (cbm)'].copy()
        val_l = load.notnull()
        val_v = vol.notnull()

        valid_bool = val_l.all() or val_v.all()
        if not valid_bool:
            print("valid bool ", valid_bool)
            rows = list()
            message = f"Atleast one column is mandatory ('Load (kg)', 'Volume (kg)')"
            self.problems.extend(BaseValidator.add_problem([-2], rows, message, self.SHEET))
            return False

        # set which demand is valid
        self.valid_load_demands['weight'] = val_l.all()
        self.valid_load_demands['volume'] = val_v.all()
        return True

    def default_sku_value(self):
        gen_default_values = list()
        sku = self.df['SKU'].copy()
        null_sku_bool = sku.isna()
        if null_sku_bool.any():
            gen_default_values = [str(utils.generate_request_id()) for _ in range(len(null_sku_bool))]
            sku.loc[null_sku_bool] = pd.Series(gen_default_values)
        self.sku_exclusion_list = gen_default_values
        # post process sku
        self.new_df['sku'] = sku
        BaseValidator.type_cast_to_str(self.new_df, ['sku'], fill=None)

    def validate_priority(self):
        priority = self.df['Priority'].fillna(PriorityMap.HIGHEST.value.code)
        valid_bool = priority.isin(VALID_PRIORITY_CODES)
        if not valid_bool.all():
            indexes = valid_bool[valid_bool == False].index.to_list()
            rows = self.df.loc[indexes].to_dict(orient="records")
            message = f"Invalid Priority Value, should be in range [1-6]"
            self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.SHEET))
            return False

    def validate_header(self):
        return BaseValidator.validate_header(self)
