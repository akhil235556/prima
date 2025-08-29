import copy
import uuid
import pandas as pd

from route_planner.constants.app_configuration import AppConfig


def get_dummy_output_csv_file_path(rid):
    if not rid:
        rid = str(uuid.uuid4())
    return f"{AppConfig().temp_dir}/{rid}_dummy_output.csv"

def get_summary_csv_file_path(rid):
    if not rid:
        rid = str(uuid.uuid4())
    return f"{AppConfig().temp_dir}/{rid}_summary.csv"

def get_vehicle_csv_file_path(rid):
    if not rid:
        rid = str(uuid.uuid4())
    return f"{AppConfig().temp_dir}/{rid}_vehicles.csv"

def get_output_csv_file_path(rid):
    if not rid:
        rid = str(uuid.uuid4())
    return f"{AppConfig().temp_dir}/{rid}_output.csv"


def get_aggregated_csv_file_path(rid):
    if not rid:
        rid = str(uuid.uuid4())
    return f"{AppConfig().temp_dir}/{rid}_aggregated_output.csv"


def get_confusion_matrix_csv_file_path(rid):
    if not rid:
        rid = str(uuid.uuid4())
    return f"{AppConfig().temp_dir}/{rid}_confusion_matrix.csv"


def export_dummy_output(response, rid=None):
    csv_file_path = get_dummy_output_csv_file_path(rid)
    output_dict = response.get('output')
    pd.DataFrame.from_dict(output_dict).to_csv(csv_file_path, index=False)
    return csv_file_path

def export_summary_output(summary):
    summary_dict = summary.copy()

    header_map = {
        'city': 'City',
        'obj': 'Overall Objective Function Value (Total Cost INR)',
        'discrete_var': 'No. of Discrete Variables',
        'num_constraints': 'No. of Constraints',
        'solution_time': 'Solution Time (min)',
        'status': 'Solver Status',
        'opt_gap': '% Optimality Gap',
        'total_wt': 'Total Weight (KG)',
        'total_vol': 'Total Volume (CBM)',
        'avg_wt_utilization': 'Avg. Wt Utilization (%)',
        'avg_vol_utilization': 'Avg. Vol. Utilization (%)',
        'per_unit_wt_cost': 'Per Unit Wt. Cost'
    }

    summary_csv_header = ['City', 'Overall Objective Function Value (Total Cost INR)', 'No. of Discrete Variables',
                          'No. of Constraints', 'Solution Time (min)', 'Solver Status', '% Optimality Gap',
                          'Total Weight (KG)', 'Total Volume (CBM)', 'Avg. Wt Utilization (%)',
                          'Avg. Vol. Utilization (%)', 'Per Unit Wt. Cost']

    _summary_numeric_cols = ['Overall Objective Function Value (Total Cost INR)', 'No. of Discrete Variables',
                             'No. of Constraints', 'Solution Time (min)', '% Optimality Gap', 'Total Weight (KG)',
                             'Total Volume (CBM)', 'Avg. Wt Utilization (%)', 'Avg. Vol. Utilization (%)',
                             'Per Unit Wt. Cost']

    total_value_columns = ['Overall Objective Function Value (Total Cost INR)', 'No. of Discrete Variables',
                           'No. of Constraints', 'Solution Time (min)', 'Total Weight (KG)',
                           'Total Volume (CBM)']

    average_value_columns = ['Avg. Wt Utilization (%)', 'Avg. Vol. Utilization (%)', '% Optimality Gap',
                             'Per Unit Wt. Cost']


    # remap header
    summary_dict = {header_map[k]: v for k, v in summary_dict.items() if k in header_map.keys()}
    s_df = pd.DataFrame(summary_dict, columns=summary_csv_header)
    s_df.index = s_df.index + 1
    s_df.loc['Total'] = s_df[total_value_columns].sum()
    s_df.loc['Avg'] = s_df[average_value_columns].mean()
    s_df[_summary_numeric_cols] = round_df_values(s_df, _summary_numeric_cols)

    return s_df

def export_vehicle_output(vehicle_data, cities):
    v_df = pd.DataFrame(vehicle_data)
    v_df.index = v_df.index + 1
    v_df.loc['Total'] = v_df[cities].sum()
    v_df['Total'] = v_df[cities].sum(axis=1)
    v_df = v_df.rename({'Truck_Type': 'Vehicle Type'}, axis=1)
    return v_df


def export_aggregated_output(solver_output):
    data_dict = solver_output.copy()

    header_map = {
        'planning_id': 'Planning ID',
        'vehicle_type': 'Vehicle Type Name',
        'from_city': 'From City',
        'to_city': 'To City',
        'vehicle_load': 'Load Carrying(KG)',
        'vehicle_volume': 'Volume Carrying(CBM)',
        'weight_utilization': 'Weight Utilisation(%)',
        'volume_utilization': 'Volume Utilisation (%)',
        'cost': 'Cost(INR)'
    }

    csv_header = ['Planning ID', 'Vehicle Type Name', 'From City', 'To City', 'Load Carrying(KG)',
                  'Volume Carrying(CBM)', 'Weight Utilisation(%)', 'Volume Utilisation (%)', 'Cost(INR)']

    _numeric_cols = ['Load Carrying(KG)', 'Volume Carrying(CBM)', 'Weight Utilisation(%)', 'Volume Utilisation (%)',
                     'Cost(INR)']

    # remap header
    data_dict = {header_map[k]: v for k, v in data_dict.items() if k in header_map.keys()}
    ag_df = pd.DataFrame(data_dict, columns=csv_header)
    ag_df[_numeric_cols] = round_df_values(ag_df, _numeric_cols)
    # df to csv

    return ag_df


def export_output(output_dict):
    data_dict = output_dict.copy()

    header_map = {
        'planning_id': 'Planning ID',
        'vehicle_type': 'Vehicle Type Name',
        'weight_utilization': 'Weight Utilisation(%)',
        'volume_utilization': 'Volume Utilisation (%)',
        'order': 'Order No.',
        'sku': 'SKU',
        'sku_class': 'SKU Class',
        'from_address': 'From Address',
        'to_address': 'To Address',
        'load': 'Weight(KG)',
        'volume': 'Volume(CBM)',
        'cost': 'Cost(INR)',
    }

    csv_header = ['Planning ID', 'Vehicle Type Name', 'Weight Utilisation(%)', 'Volume Utilisation (%)', 'Order No.',
                  'SKU', 'SKU Class', 'From Address', 'To Address', 'Weight(KG)', 'Volume(CBM)', 'Cost(INR)']

    _numeric_cols = ['Cost(INR)', 'Weight Utilisation(%)', 'Volume Utilisation (%)']

    # remap header
    data_dict = {header_map[k]: v for k, v in data_dict.items() if k in header_map.keys()}
    output_df = pd.DataFrame(data_dict, columns=csv_header)
    output_df[_numeric_cols] = round_df_values(output_df, _numeric_cols)
    # df to csv

    return output_df

def export_confusion_matrix(cm_dict):
    data_dict = copy.copy(cm_dict)

    header_map = {
        'planning_id': 'Planning ID',
        'skus': 'SKUs',
        'vehicle_load': 'Load (KG)',
        'vehicle_volume': 'Volume (CBM)',
        'vehicle_type': 'Vehicle Type',
        'cost': 'Total Cost (INR)',
        'weight_utilization': 'Vehicle Weight Utilisation (%)',
        'volume_utilization': 'Vehicle Volume Utilisation (%)',
        'is_selected': 'Is Vehicle Selected For Route',
    }

    csv_header = ['Planning ID', 'SKUs', 'Load (KG)', 'Volume (CBM)', 'Vehicle Type', 'Total Cost (INR)',
                  'Vehicle Weight Utilisation (%)', 'Vehicle Volume Utilisation (%)',  'Is Vehicle Selected For Route']

    _numeric_cols = ['Total Cost (INR)', 'Vehicle Weight Utilisation (%)',
                     'Vehicle Volume Utilisation (%)']

    # remap header
    data_dict = {header_map[k]: v for k, v in data_dict.items() if k in header_map.keys()}
    output_df = pd.DataFrame(data_dict, columns=csv_header)
    output_df[_numeric_cols] = round_df_values(output_df, _numeric_cols)
    # df to csv

    return output_df


def round_df_values(df: pd.DataFrame, column_names: list, decimal=3) -> pd.DataFrame:
    """Round df columns to 'decimal' no. of places"""
    return df[column_names].round(decimal)

def parse_hour_decimal(csv_row: dict, column_names: list) -> dict:
    for column in column_names:
        if csv_row.get(column):
            time = csv_row.get(column)
            hours = int(time)
            minutes = (time * 60) % 60
            if minutes < 10:
                csv_row[column] = f"{hours}:0{int(minutes)}"
            else:
                csv_row[column] = f"{hours}:{int(minutes)}"
    return csv_row

def round_csv_values(csv_row: dict, column_names: list) -> dict:
    for column in column_names:
        if csv_row.get(column):
            csv_row[column] = round(csv_row.get(column), 3)
    return csv_row
