from route_planner.utils import logging
import pandas as pd

from route_planner.constants.app_constants import AVERAGE_VEHICLE_SPEED
from route_planner.vrp.mid_mile_cost_planner.validator.base_validator import BaseValidator
from route_planner.utils.utils import get_column_letter_by_index

LOGGER = logging.getLogger(__name__)


class VehiclesValidator(BaseValidator):
    SHEET = "Vehicles"

    VALID_HEADER_NON_DEDICATED = ['Vehicle Type*',
                                  'Weight Capacity (kg)*',
                                  'Volume Capacity (cbm)*',
                                  'Fixed charges',
                                  'Per KM Charges',
                                  'Per KG Charges',
                                  'Weight Utilisation % Lower Bound',
                                  'Volume Utilisation % Lower Bound',
                                  'Max Route Length (km)',
                                  'Max Node Visits',
                                  'Daily Vehicle Run (km)',
                                  'Max Drop Distance (km)',
                                  'Destination*'
                                  ]

    VALID_HEADER_DEDICATED = ['Vehicle Type*',
                              'Weight Capacity (kg)*',
                              'Volume Capacity (cbm)*',
                              'Fixed charges',
                              'Per KM Charges',
                              'Per KG Charges',
                              'Weight Utilisation % Lower Bound',
                              'Volume Utilisation % Lower Bound',
                              'Max Route Length (km)',
                              'Max Node Visits',
                              'Daily Vehicle Run (km)',
                              'Max Drop Distance (km)',
                              'No. of vehicles*'
                              ]

    OUT_HEADER = ['vehicle_type_name', 'From', 'To', 'capacity', 'volumetric_capacity', 'SLA (hours)',
                  'average_speed', 'fixed_charges', 'per_km_charges', 'per_kg_charges',
                  'Per unit charges', 'utilisation_lb', 'volume_utilisation_lb', 'Driving window_from',
                  'Driving window_To', 'dedicated', 'max_route_length', 'max_node_visits', 'daily_run',
                  'max_drop_distance', 'destination', 'No. of vehicles']

    IN_TO_OUT_HEADER_MAP = {'Vehicle Type*': 'vehicle_type_name',
                            'Weight Capacity (kg)*': 'capacity',
                            'Volume Capacity (cbm)*': 'volumetric_capacity',
                            'Fixed charges': 'fixed_charges',
                            'Per KM Charges': 'per_km_charges',
                            'Per KG Charges': 'per_kg_charges',
                            'Weight Utilisation % Lower Bound': 'utilisation_lb',
                            'Volume Utilisation % Lower Bound': 'volume_utilisation_lb',
                            'Max Route Length (km)': 'max_route_length',
                            'Max Node Visits': 'max_node_visits',
                            'No. of vehicles*': 'No. of vehicles',
                            'Daily Vehicle Run (km)': 'daily_run',
                            'Max Drop Distance (km)': 'max_drop_distance',
                            'Destination*': 'destination'
                            }

    MANDATORY_COLUMNS = ['Vehicle Type*', 'Weight Capacity (kg)*', 'Volume Capacity (cbm)*', 'Destination*']

    NUMBER_TYPE_COLUMNS = [
        'Weight Capacity (kg)*',
        'Volume Capacity (cbm)*',
        'Fixed charges',
        'Per KM Charges',
        'Per KG Charges',
        'Max Route Length (km)',
        'Max Node Visits',
        'Daily Vehicle Run (km)',
        'Max Drop Distance (km)',
        'Weight Utilisation % Lower Bound',
        'Volume Utilisation % Lower Bound']

    STRING_TYPE_COLS = ['Vehicle Type*']

    def __init__(self, Validator):
        self.problems = list()
        LOGGER.info(f"::: Validate Vehicles :::")
        self.df = pd.read_excel(Validator.file, self.SHEET)
        if self.df.shape[0] > 0:
            self.df = self.df.apply(lambda x: [ele.strip() if isinstance(ele, str) else ele for ele in x])
        self.new_df = pd.DataFrame(index=self.df.index)
        self.header = self.df.columns.to_list()
        self.dedicated = False
        self.MANDATORY_COLS = self.MANDATORY_COLUMNS.copy()
        self.NUMBER_TYPE_COLS = self.NUMBER_TYPE_COLUMNS.copy()
        self.VALID_HEADER = list()
        self.rid = Validator.rid
        self.UOM_TYPE = str()


    def if_sla_validation(self):
        sla_not_null = self.df["SLA (hours)"].notnull()
        from_null = self.df[sla_not_null]["From"].isnull()
        to_null = self.df[sla_not_null]["To"].isnull()
        check_sla = from_null | to_null
        if check_sla.any():
            indexes = check_sla[check_sla == True].index.to_list()
            rows = self.df.loc[indexes].to_dict(orient="records")
            message = f"Fields ('From', 'To') mandatory if 'SLA (hours)' is provided"
            self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.SHEET))

    def if_dedicated_validation(self):
        dedicated_invalid = self.df['dedicated'].astype(str).str.lower() != "true"
        no_of_vehicles_invalid = self.df['No. of vehicles'].isna()
        rows = []
        if dedicated_invalid.all() and no_of_vehicles_invalid.all() == False:
            # no of vehicles validation all dedicated should be true
            # no_of_vehicles_col = self.df['No. of vehicles'].to_list()
            # formated_header =  dict(zip(range(len(no_of_vehicles_col)), no_of_vehicles_col )) 
            # rows.append(formated_header) 
            indexes = no_of_vehicles_invalid[no_of_vehicles_invalid == False].index.to_list()
            col = self.df['No. of vehicles'].loc[indexes].to_dict()
            rows.append(col)
            message = f"Validation Error value in No. of vehicles column cannot exist if dedicated False"
            # self.problems.append(dict(row_number=1, row=rows, message=message,  sheet=self.SHEET))
            self.problems = BaseValidator.add_problem([-1], rows, message, self.SHEET)

        elif dedicated_invalid.any() == True and dedicated_invalid.all() == False:
            # dedicated validation if not all true
            # dedicated_col = self.df['dedicated'].to_list()
            # formated_header =  dict(zip(range(len(dedicated_col)), dedicated_col ))
            # rows.append(formated_header)
            indexes = dedicated_invalid[dedicated_invalid == True].index.to_list()
            col = self.df['dedicated'].loc[indexes].to_dict()
            rows.append(col)
            message = f"Validation Error dedicated column should be all True/true"
            # self.problems.append(dict(row_number=1, row=rows, message=message,  sheet=self.SHEET))
            self.problems = BaseValidator.add_problem([-1], rows, message, self.SHEET)

    def validate_charges(self):
        df = self.df.copy()
        km_col = self.df['Per KM Charges'].copy()
        kg_col = self.df['Per KG Charges'].copy()
        fix_col = self.df['Fixed charges'].copy()
        km_bool = km_col.notnull()
        kg_bool = kg_col.notnull()
        fix_bool = fix_col.notnull()
        xor_bool = (km_bool.any() ^ kg_bool.any())

        self.df['Fixed charges'] = self.df['Fixed charges'].fillna(0)

        if not xor_bool:
            message = f"Atmost one column should be provided {kg_col.name, km_col.name}"
            rows = list()

            row_dict = df[['Per KM Charges', 'Per KG Charges', 'Fixed charges']].fillna("").to_dict(orient='index')
            row_dict = {k + 2: v for k, v in row_dict.items()}
            rows.append(row_dict)
            self.problems.extend(BaseValidator.add_problem([-2], rows, message, self.SHEET))
        elif km_bool.any():
            index_bool = km_bool == False
            indexes = self.df.loc[index_bool].index.to_list()
            rows = self.df.loc[indexes].to_dict(orient="records")
            message = f"Value not provided for {km_col.name}"
            self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.SHEET))
        elif kg_bool.any():
            index_bool = kg_bool == False
            indexes = self.df.loc[index_bool].index.to_list()
            rows = self.df.loc[indexes].to_dict(orient="records")
            message = f"Value not provided for {kg_col.name}"
            self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.SHEET))
        else:
            index_bool = fix_bool == False
            indexes = self.df.loc[index_bool].index.to_list()
            rows = self.df.loc[indexes].to_dict(orient="records")
            message = f"Value not provided for {fix_col.name}"
            self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.SHEET))

    def validate_header(self) -> bool:
        if set(self.header) != set(self.VALID_HEADER_DEDICATED) and \
                set(self.header) != set(self.VALID_HEADER_NON_DEDICATED):
            rows = self._header_error_response()
            message = f"Invalid {self.SHEET} Headers!"
            self.problems.extend(BaseValidator.add_problem([-1], rows, message, self.SHEET))
            return False
        elif set(self.header) == set(self.VALID_HEADER_DEDICATED):
            self.VALID_HEADER = self.VALID_HEADER_DEDICATED.copy()
            self.dedicated = True
            self.MANDATORY_COLS.append('No. of vehicles*')
            self.NUMBER_TYPE_COLS.append('No. of vehicles*')
            return True
        else:
            self.VALID_HEADER = self.VALID_HEADER_NON_DEDICATED.copy()
            return True

    def sanitize(self):
        LOGGER.info(f"header\n{self.VALID_HEADER}")
        self.new_df['dedicated'] = False
        if not self.dedicated:
            self.new_df['dedicated'] = ""
            self.new_df['No. of vehicles*'] = ""

        self.new_df = pd.concat((self.df, self.new_df), axis=1)
        self.new_df.rename(columns=self.IN_TO_OUT_HEADER_MAP, inplace=True)

        remove_header = ['From', 'To', 'SLA (hours)', 'Per unit charges', 'Driving window_from', 'Driving window_To']
        format_header = [x for x in self.OUT_HEADER if x not in remove_header]
        self.new_df = self.new_df[format_header]
        LOGGER.info(f"(Vehicles sanitize) Cols After Mapping\n{self.new_df}")

    def type_validator(self):

        BaseValidator.number_type_validator(self) # raise
        BaseValidator.positive_number_validator(self, self.NUMBER_TYPE_COLS)
        BaseValidator.greater_than_zero_validation(self, ['Weight Capacity (kg)*', 'Volume Capacity (cbm)*'])
        BaseValidator.string_type_validator(self) # raise

        # Vehicle Type* should be unique
        col = self.df['Vehicle Type*']
        check_col = col.copy().str.lower()
        drop_duplicate = check_col.drop_duplicates(keep='first')
        invalid_indexes = list(set(check_col.index.to_list()) - set(drop_duplicate.index.to_list()))

        if invalid_indexes:
            rows = self.df.loc[invalid_indexes].to_dict(orient='records')
            message = f"Duplicate Vehicle Type* found!"
            self.problems.extend(BaseValidator.add_problem(invalid_indexes, rows, message, self.SHEET))




    def process(self):

        self.type_validator()

        # validate flow
        self.validate_charges()
        # self.if_sla_validation()
        # self.if_dedicated_validation()

        # average speed
        self.new_df['average_speed'] = AVERAGE_VEHICLE_SPEED

        # 'Utilisation % Lower Bound' default 0 and range(0-100)
        self.utilization_validation('Weight Utilisation % Lower Bound')
        self.utilization_validation('Volume Utilisation % Lower Bound')

        self.atmost_one_validation()

        self.decimal_value_validation()

        self.sanitize()
        # save dataframe to csv
        # BaseValidator.df_to_csv(self)

    def _header_error_response(self) -> list:
        valid_header_dedicated = self.VALID_HEADER_DEDICATED.copy()
        valid_header_non_dedicated = self.VALID_HEADER_NON_DEDICATED.copy()
        actual_header = self.header.copy()

        response = list()
        headers_list = list([valid_header_dedicated, valid_header_non_dedicated, actual_header])

        headers_len = [len(header) for header in headers_list]

        sorted_headers = [h for _, h in sorted(zip(headers_len, headers_list), reverse=True)]

        index_map = {idx: sorted_headers.index(header) for idx, header in enumerate(headers_list)}

        n_max = len(sorted_headers[0])
        for header in sorted_headers:
            if len(header) != n_max:
                delta = n_max - len(header)
                header.extend([""] * delta)

        valid_header_dedicated = sorted_headers[index_map[0]]
        valid_header_non_dedicated = sorted_headers[index_map[1]]
        actual_header = sorted_headers[index_map[2]]

        response_dict = dict()
        headers_zip = zip(valid_header_dedicated, valid_header_non_dedicated, actual_header)
        for idx, (valid_dedicated_value, valid_non_dedicated_value, actual_value) in enumerate(headers_zip):
            temp_dict = dict()
            temp_dict["Actual Header"] = actual_value
            index = get_column_letter_by_index(idx)

            if actual_value != valid_non_dedicated_value or actual_value != valid_dedicated_value:
                if valid_dedicated_value == valid_non_dedicated_value:
                    temp_dict["Valid Header"] = valid_dedicated_value
                else:
                    temp_dict["Valid Dedicated Header"] = valid_dedicated_value
                    temp_dict["Valid Non-Dedicated Header"] = valid_non_dedicated_value
                response_dict[index] = temp_dict

        response.append(response_dict)
        return response

    def decimal_value_validation(self):
        extra_df = self.df['Max Node Visits'].copy().fillna(0)
        for idx, values in enumerate(extra_df):
            if values % 1 != 0:
                indexes = extra_df[extra_df % 1 != 0].index.to_list()
                rows = self.df.loc[indexes].to_dict(orient='records')
                message = "Field in Max Node Visits cannot be in decimal!"
                self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.SHEET))
                return False
        return True

    def utilization_validation(self, col_name):
        col = self.df[col_name].copy().copy().fillna(0)
        col_upper_bound = col > 100
        col_lower_bound = col < 0
        if (col_lower_bound | col_upper_bound).any():
            indexes = self.df[(col_lower_bound | col_upper_bound)].index.to_list()
            rows = self.df.loc[indexes].to_dict(orient='records')
            message = f"Field in {col_name} breaches range (0-100)"
            self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.SHEET))
            return False

        self.df[col_name] = self.df[col_name].fillna(0)
        return True

    def atmost_one_validation(self):
        km_bool = self.df['Per KM Charges'].notnull()
        kg_bool = self.df['Per KG Charges'].notnull()
        fc_bool = self.df['Fixed charges'].notnull()
        if not (km_bool ^ kg_bool).all():
            index_bool = (km_bool ^ kg_bool ^ fc_bool) == False
            indexes = self.df.loc[index_bool].index.to_list()
            rows = self.df.loc[indexes].to_dict(orient="records")
            message = f"Atmost one field should be provided ('Fixed charges', 'Per KM Charges', 'Per KG Charges')"
            self.problems.extend(BaseValidator.add_problem(indexes, rows, message, self.SHEET))

