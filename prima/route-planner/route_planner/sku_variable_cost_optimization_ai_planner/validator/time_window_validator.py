from route_planner.utils import logging
import pandas as pd
import numpy as np
import pytz
from datetime import datetime, timedelta

from route_planner.sku_variable_cost_optimization_ai_planner.validator.base_validator import BaseValidator
from route_planner.exceptions.exceptions import InvalidTimeWindow

# for validating column type
from pandas.api.types import is_datetime64_any_dtype

from route_planner.constants.app_constants import MAX_INT

LOGGER = logging.getLogger(__name__)


class TimeWindowValidator(object):
    # 1. To Check value should exist in both To and from
    # 2. is_validate_datetime for both
    # 2.1. valid datetime > now()
    # 2.2. from<to
    # 3. sanitize to and from, skip empty rows

    DATETIME_FORMAT = '%d/%m/%Y %H:%M:%S'

    def __init__(self, df, sheet, from_col_name, to_col_name):
        self.df = df
        self.SHEET = sheet
        self.FROM = self.df[from_col_name]
        self.TO = self.df[to_col_name]
        self.problems = list()
        self.check_col_as_str()
        self.now = self.get_now()

    def get_now(self):
        now = datetime.now(pytz.timezone('Asia/Calcutta'))
        now = pd.to_datetime(now).tz_localize(None)
        now = now.strftime(self.DATETIME_FORMAT)
        return now


    def check_col_as_str(self):
        from_bool = is_datetime64_any_dtype(self.FROM.dtype)
        to_bool = is_datetime64_any_dtype(self.TO.dtype)
        if from_bool or to_bool:
            message = f"{self.FROM.name} and {self.TO.name} should be plain text!"
            raise InvalidTimeWindow(message=message)

    def process(self):
        # value should exist in both To and From
        working_window_valid = self.if_working_window_condition()


        # 1. existing values datetime validation
        # 2. existing values > datetime.now()
        datetime_bool = self.is_valid_datetime(self.FROM)
        greater_than_now_bool = self.is_greater_than_now(self.FROM, self.now)
        from_datetime_valid = datetime_bool & greater_than_now_bool

        datetime_bool = self.is_valid_datetime(self.TO)
        greater_than_now_bool = self.is_greater_than_now(self.TO, self.now)
        to_datetime_valid = datetime_bool & greater_than_now_bool

        if working_window_valid and from_datetime_valid and to_datetime_valid:

            # from should be less than to
            from_less_than_to_valid = self.is_from_less_than_to()

            if from_less_than_to_valid:
                # omit the the absolute difference with datetime.now()
                self.sanitize_working_window(self.FROM)
                self.sanitize_working_window(self.TO, fill_na=MAX_INT)

    def if_working_window_condition(self):
        # value should exist in both To and From
        x = self.FROM.notnull()
        y = self.TO.notnull()
        working_window_bool = x ^ y
        if working_window_bool.any():
            # for 01 and 10 case
            indexes = working_window_bool[working_window_bool == True].index.to_list()
            rows = self.df.loc[indexes].to_dict(orient="records")
            message = f"Invalid both {self.FROM.name} and {self.TO.name} should be provided!"
            self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.SHEET))
            return False
        return True

    def is_valid_datetime(self, column):
        # 1. existing values datetime validation
        not_null_col = column[column.notnull()]
        valid_datetime_bool = self.datetime_parser(not_null_col).notna()
        # check valid datetime format for rows with values
        if not valid_datetime_bool.all():
            indexes = valid_datetime_bool[valid_datetime_bool == False].index.to_list()
            rows = self.df.loc[indexes].to_dict(orient="records")
            message = f"Invalid DateTime format provided in {column.name} [valid: {self.DATETIME_FORMAT}]"
            self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.SHEET))
            return False
        return True

    def is_greater_than_now(self, column, now):
        # 2. existing values > datetime.now()
        # check current time < column
        not_null_col = column[column.notnull()]
        valid_datetime = self.datetime_parser(not_null_col)
        datetime_valid_with_now = valid_datetime > now

        if datetime_valid_with_now.all() == False:
            indexes = datetime_valid_with_now[datetime_valid_with_now == False].index.to_list()
            rows = self.df.loc[indexes].to_dict(orient="records")
            message = f"Invalid DateTime provided in {column.name} should be greater than current time ({now.strftime(self.DATETIME_FORMAT)})"
            self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.SHEET))
            return False
        return True

    def is_from_less_than_to(self):
        x = self.FROM[self.FROM.notnull()]
        y = self.TO[self.TO.notnull()]
        x_less_than_y = self.datetime_parser(x) < self.datetime_parser(y)
        if x_less_than_y.all() == False:
            indexes = x[x_less_than_y == False].index.to_list()
            rows = self.df.loc[indexes].to_dict(orient="records")
            message = f"Invalid {self.FROM} should be less than {self.TO}!"
            self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.SHEET))
            return False
        return True

    def sanitize_working_window(self, column, fill_na=0):

        not_null_col = column[column.notnull()]
        valid_datetime_col = self.datetime_parser(not_null_col)
        LOGGER.info("sanitize working window \n")
        LOGGER.info("now", self.now)
        delta = (valid_datetime_col - self.now) / timedelta(minutes=1)

        column.loc[not_null_col.index] = delta
        column.fillna(fill_na, inplace=True)
        self.df[column.name] = column.astype("int64")
        LOGGER.info(f"::Sanitize {column.name} response: {self.df[column.name]}")

    def convert_time_to_minutes(self, column, fill_na):
        column.fillna(fill_na, inplace=True)
        valid_datetime_col = self.datetime_parser(column)
        valid_in_minutes = (valid_datetime_col - self.now) / timedelta(minutes=1)
        column = valid_in_minutes
        column = np.floor(
            pd.to_numeric(column, errors='coerce')).astype('Int64')
        return column



    def datetime_parser(self, col):
        return pd.to_datetime(col, format=self.DATETIME_FORMAT, errors='coerce')
