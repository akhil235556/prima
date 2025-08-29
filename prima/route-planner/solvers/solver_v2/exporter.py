import copy
import uuid
import pandas as pd

from route_planner.constants.app_configuration import AppConfig


def get_dummy_output_csv_file_path(rid):
    if not rid:
        rid = str(uuid.uuid4())
    return f"{AppConfig().temp_dir}/{rid}_dummy_output.csv"


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


def export_aggregated_output(solver_output, rid= None):
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

    csv_file_path = get_aggregated_csv_file_path(rid)
    # remap header
    data_dict = {header_map[k]: v for k, v in data_dict.items() if k in header_map.keys()}
    ag_df = pd.DataFrame(data_dict, columns=csv_header)
    # typecast numeric cols to float
    ag_df[_numeric_cols] = ag_df[_numeric_cols].apply(pd.to_numeric, downcast="float", errors='coerce')
    ag_df[_numeric_cols] = round_df_values(ag_df, _numeric_cols)
    # df to csv
    ag_df.to_csv(csv_file_path, index=False)

    return csv_file_path


def export_output(output_dict, rid=None):
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

    _numeric_cols = ['Weight(KG)', 'Volume(CBM)', 'Cost(INR)', 'Weight Utilisation(%)', 'Volume Utilisation (%)']

    csv_file_path = get_output_csv_file_path(rid)
    # remap header
    data_dict = {header_map[k]: v for k, v in data_dict.items() if k in header_map.keys()}
    output_df = pd.DataFrame(data_dict, columns=csv_header)
    # typecast numeric cols to float
    output_df[_numeric_cols] = output_df[_numeric_cols].apply(pd.to_numeric, downcast="float", errors='coerce')
    output_df[_numeric_cols] = round_df_values(output_df, _numeric_cols)
    # df to csv
    output_df.to_csv(csv_file_path, index=False)

    return csv_file_path


def export_confusion_matrix(cm_dict, rid=None):
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
        'status': 'Solution Strategy'
    }

    csv_header = ['Planning ID', 'SKUs', 'Load (KG)', 'Volume (CBM)', 'Vehicle Type', 'Total Cost (INR)',
                  'Vehicle Weight Utilisation (%)', 'Vehicle Volume Utilisation (%)',  'Is Vehicle Selected For Route',
                  'Solution Strategy']

    _numeric_cols = ['Load (KG)', 'Volume (CBM)', 'Total Cost (INR)', 'Vehicle Weight Utilisation (%)',
                     'Vehicle Volume Utilisation (%)']

    csv_file_path = get_confusion_matrix_csv_file_path(rid)
    # remap header
    data_dict = {header_map[k]: v for k, v in data_dict.items() if k in header_map.keys()}
    output_df = pd.DataFrame(data_dict, columns=csv_header)
    # typecast numeric cols to float
    output_df[_numeric_cols] = output_df[_numeric_cols].apply(pd.to_numeric, downcast="float", errors='coerce')
    output_df[_numeric_cols] = round_df_values(output_df, _numeric_cols)
    # df to csv
    output_df.to_csv(csv_file_path, index=False)

    return csv_file_path


def round_df_values(df: pd.DataFrame, column_names: list, decimal=3) -> pd.DataFrame:
    """Round df columns to 'decimal' no. of places"""
    return df[column_names].round(decimal)

