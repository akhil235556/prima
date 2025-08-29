from route_planner.utils import logging
import re

import pandas as pd
from route_planner.vrp.sku_variable_cost_planner.validator.base_validator import BaseValidator

LOGGER = logging.getLogger(__name__)


class ProductsValidator(BaseValidator):
    SHEET = "Products"
    VALID_HEADER = [
        "SKU*",
        "SKU Category",
        "SKU Tag",
        "Exclusive Tags"
    ]

    OUT_HEADER = [
        "sku",
        "sku_category",
        "sku_tag",
        "exclusive_tags"
    ]

    IN_TO_OUT_HEADER_MAP = {
        "SKU*": "sku",
        "SKU Category": "sku_category"
    }

    MANDATORY_COLS = []

    NUMBER_TYPE_COLS = []

    STRING_TYPE_COLS = [
        "SKU*",
        "SKU Category",
        "SKU Tag",
        "Exclusive Tags"
    ]

    def __init__(self, Validator):
        self.problems = []
        LOGGER.info(f"::: Validate {self.SHEET} :::")

        self.df = pd.read_excel(Validator.file, self.SHEET)

        # remove whitespace
        if self.df.shape[0] > 0:
            self.df = self.df.apply(lambda x: [ele.strip() if isinstance(ele, str) else ele for ele in x])

        self.new_df = pd.DataFrame(index=self.df.index)
        self.header = self.df.columns.to_list()
        self.rid = Validator.rid

    def sanitize(self):
        self.new_df = pd.concat((self.df, self.new_df), axis=1)
        self.new_df.rename(columns=self.IN_TO_OUT_HEADER_MAP, inplace=True)
        self.new_df = self.new_df[self.OUT_HEADER]
        LOGGER.info(f":: ({self.SHEET} sanitize) Cols After Mapping ::")
        LOGGER.info(self.new_df)

    def is_col_distinct(self, col_name):
        col = self.df[col_name].copy()
        if not col.is_unique:
            message = f"{col_name} should be unique!"
            rows = list()
            rows.append(col.to_dict())
            self.problems.extend(BaseValidator.add_problem([-1], rows, message, self.SHEET))
            return False
        return True

    def type_validator(self):

        # BaseValidator.number_type_validator(self)
        # BaseValidator.positive_number_validator(self, [])
        BaseValidator.type_cast_to_str(self)

        # SKU should be unique
        self.is_col_distinct("SKU*")

    def validate_header(self):
        return BaseValidator.validate_header(self)

    @staticmethod
    def strip_whitespace(string):
        string = re.sub(r"\s+", "", string, flags=re.UNICODE)
        return string

    def validate_column_multiple_string(self, col):
        self.df[col] = self.df[col].fillna('')
        self.df[col] = self.df[col].apply(lambda x: self.strip_whitespace(x))

    def process(self):

        self.type_validator()

        self.validate_column_multiple_string("SKU Tag")
        self.validate_column_multiple_string("Exclusive Tags")

        # validate case insensitive distinct comma sep. values
        self.new_df['sku_tag'] = BaseValidator.parse_case_insensitive_distinct(self.df["SKU Tag"])
        self.new_df['exclusive_tags'] = BaseValidator.parse_case_insensitive_distinct(self.df["Exclusive Tags"])

        # sanitize cols
        self.sanitize()
