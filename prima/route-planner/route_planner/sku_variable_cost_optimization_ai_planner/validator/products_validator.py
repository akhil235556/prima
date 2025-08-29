from route_planner.utils import logging
import re

import pandas as pd
from route_planner.sku_variable_cost_optimization_ai_planner.validator.base_validator import BaseValidator

LOGGER = logging.getLogger(__name__)


class ProductsValidator(BaseValidator):
    SHEET = "Products"

    VALID_HEADER = [
        "SKU",
        "SKU Category",
        "SKU Tag",
        "Exclusive Tags",
        "Inclusive Tags"
    ]

    OUT_HEADER = [
        "sku",
        "sku_category",
        "sku_tag",
        "exclusive_tags",
        "inclusive_tags"
    ]

    IN_TO_OUT_HEADER_MAP = {
        "SKU": "sku",
        "SKU Category": "sku_category"
    }

    MANDATORY_COLS = []

    NUMBER_TYPE_COLS = []

    STRING_TYPE_COLS = [
        "SKU",
        "SKU Category",
        "SKU Tag",
        "Exclusive Tags",
        "Inclusive Tags"
    ]

    def __init__(self, validator):
        self.problems = []
        LOGGER.info(f"::: Validate {self.SHEET} :::")

        self.df = pd.read_excel(validator.file, self.SHEET, dtype=str)

        # remove whitespace
        if self.df.shape[0] > 0:
            self.df = self.df.apply(lambda x: [ele.strip() if isinstance(ele, str) else ele for ele in x])

        self.new_df = pd.DataFrame(index=self.df.index)
        self.header = self.df.columns.to_list()
        self.rid = validator.rid

    def sanitize(self):
        self.new_df = pd.concat((self.df, self.new_df), axis=1)
        self.new_df.rename(columns=self.IN_TO_OUT_HEADER_MAP, inplace=True)
        self.new_df = self.new_df[self.OUT_HEADER]
        LOGGER.info(f"({self.SHEET} sanitize) columns: {self.new_df.columns.to_list()}")

    def is_col_distinct(self, col_name):
        col = self.df[col_name].copy().dropna()
        if not col.is_unique:
            message = f"{col_name} should be unique!"
            rows = list()
            rows.append(col.to_dict())
            self.problems.extend(BaseValidator.add_problem([-1], rows, message, self.SHEET))
            return False
        return True

    def type_validator(self):

        # SKU should be unique
        self.is_col_distinct("SKU")
        # SKU Col cannot be null if any other value provided
        self.sku_validation()

    def sku_validation(self):
        if self.df.empty:
            return

        sku = self.df['SKU']
        check_null = sku.isna()
        if check_null.any():
            idx = self.df[check_null].index.to_list()
            rows = self.df.loc[idx].to_dict(orient="records")
            message = f"Mandatory field SKU not provided"
            self.problems.extend(BaseValidator.add_problem(idx, rows, message, self.SHEET))

    def validate_header(self):
        return BaseValidator.validate_header(self)

    @staticmethod
    def strip_whitespace(string):
        string = re.sub(r"\s+", "", string, flags=re.UNICODE)
        return string

    def validate_column_multiple_string(self, col):
        self.df[col] = self.df[col].apply(lambda x: self.strip_whitespace(x) if type(x) == str else x)

    def process(self):

        self.type_validator()

        self.validate_column_multiple_string("SKU Tag")
        self.validate_column_multiple_string("Exclusive Tags")
        self.validate_column_multiple_string("Inclusive Tags")

        # validate case insensitive distinct comma sep. values
        self.new_df['sku_tag'] = BaseValidator.parse_case_insensitive_distinct(self.df["SKU Tag"])
        self.new_df['exclusive_tags'] = BaseValidator.parse_case_insensitive_distinct(self.df["Exclusive Tags"])
        self.new_df['inclusive_tags'] = BaseValidator.parse_case_insensitive_distinct(self.df["Inclusive Tags"])

