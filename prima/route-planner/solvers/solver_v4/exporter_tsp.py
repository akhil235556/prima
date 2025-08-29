import copy
import csv
import uuid
import pandas as pd
from route_planner.constants.app_configuration import AppConfig


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


def export_aggregated_details(routes):
    routes_copy = routes.copy()
    output_data = list()

    header_map = {
        'route_id': 'Route ID',
        'load': 'Load Carrying(KG)',
        'volume': 'Volume Carrying(CBM)',
        'distance': 'Total Run(KM)',
        'time_taken': 'Time Taken(hrs)',
        'cost': 'Cost(INR)',
        'vehicle_type': 'Vehicle Type',
        'vehicle_utilisation': 'Weight Utilisation(%)',
        'vehicle_volume_utilisation': 'Volume Utilisation (%)',
        'from_city': 'From Location',
        'to_city': 'To Location'
    }

    csv_header = ['Route ID', 'Vehicle Type', 'Load Carrying(KG)',
                  'Volume Carrying(CBM)', 'Weight Utilisation(%)', 'Volume Utilisation (%)',
                  'Total Run(KM)', 'Time Taken(hrs)', 'Cost(INR)']

    _numeric_cols = ['distance', 'cost', 'vehicle_utilisation', 'vehicle_volume_utilisation']


    for route in routes_copy:
        _new_info = copy.copy(route)
        _new_info = round_csv_values(_new_info, _numeric_cols)
        _new_info = parse_hour_decimal(_new_info, ['time_taken'])
        _new_info = {header_map[k]: v for k, v in _new_info.items() if k in header_map.keys()}
        output_data.append(_new_info)

    ag_df = pd.DataFrame(output_data)

    return ag_df


def export_routes_details(routes):
    routes_copy = routes.copy()
    output_list = list()

    header_map = {
        'route_id': 'Route ID',
        'route': 'Route',
        'load': 'Weight(KG)',
        'volume': 'Volume(CBM)',
        'distance': 'Distance(KM)',
        'time_taken': 'Time Taken(hrs)',
        'cost': 'Cost(INR)',
        'vehicle_type': 'Vehicle Type',
        'vehicle_utilisation': 'Weight Utilisation(%)',
        'vehicle_volume_utilisation': 'Volume Utilisation (%)',
        'sku': 'SKU',
        'from': 'From Address',
        'to': 'To Address',
        'to_city': 'City',
        'sku_class': 'SKU Class',
        'order_id': 'Order No.'
    }

    csv_header = ['Route ID', 'Route', 'Vehicle Type Name', 'Weight Utilisation(%)', 'Volume Utilisation (%)', 'Order No.',
                  'SKU', 'SKU Class', 'From Address', 'To Address', 'Weight(KG)', 'Volume(CBM)',
                  'Distance(KM)', 'Time Taken(hrs)', 'Cost(INR)']

    _numeric_cols = ['distance', 'cost', 'vehicle_utilisation', 'vehicle_volume_utilisation']

    for info in routes_copy:
        _info = copy.copy(info)
        _info = round_csv_values(_info, _numeric_cols)
        _info['from'] = _info.get('origin', dict()).get('location_name', '')[:-8]
        _info = parse_hour_decimal(_info, ['time_taken'])
        sku_list = _info.get('sku_details', [0])[1:]
        if not sku_list:
            _info['sku'] = _info.get('skus', "")
            _info = {header_map[k]: v for k, v in _info.items() if k in header_map.keys()}
            output_list.append(_info)
        else:
            for sku_dict in sku_list:
                _new_info = dict()
                _new_info = copy.copy(_info)
                _new_info['sku'] = sku_dict.get('sku')
                _new_info['sku_class'] = sku_dict.get('product_class')
                _new_info['order_id'] = sku_dict.get('order_id')
                _new_info['to'] = sku_dict.get('location_name')
                _new_info['time_taken'] = sku_dict.get('time_taken')
                _new_info = parse_hour_decimal(_new_info, ['time_taken'])
                _new_info['distance'] = sku_dict.get('distance')
                _new_info['volume'] = sku_dict.get('volume')
                _new_info['load'] = sku_dict.get('weight')
                _new_info = {header_map[k]: v for k, v in _new_info.items() if k in header_map.keys()}
                output_list.append(_new_info)

    output_df = pd.DataFrame(output_list)

    return output_df


def export_confusion_matrix_details(flat_routes):
    _flat_routes = flat_routes.copy()
    output_list = list()
    eta_header, eta_header_map = get_eta_header(_flat_routes)

    def _confusion_matrix_map():
        return {
            'route_id': 'Route ID',
            'route': 'Route',
            'distance': 'Distance (KM)',
            'load': 'Load (KG)',
            'volume': 'Volume (CBM)',
            'vehicle_type': 'Vehicle Type',
            'cost': 'Total Cost (INR)',
            'time_taken': 'Total Time Taken (Hrs)',
            'vehicle_utilisation': 'Vehicle Weight Utilisation (%)',
            'vehicle_volume_utilisation': 'Vehicle Volume Utilisation (%)',
            'selected_vehicle': 'Is Vehicle Selected For Route',
            'skus': 'SKUs'
        }

    _numeric_cols = ['distance', 'cost', 'vehicle_utilisation', 'vehicle_volume_utilisation']

    for flat_route, eta_info in zip(_flat_routes, eta_header_map):
        _flat_route = flat_route.copy()
        _flat_route = round_csv_values(_flat_route, _numeric_cols)
        _flat_route = parse_hour_decimal(_flat_route, ['time_taken'])
        _flat_route = {_confusion_matrix_map()[k]: v for k, v in _flat_route.items() if
                       k in _confusion_matrix_map().keys()}
        _flat_route.update(eta_info)
        output_list.append(_flat_route)

    output_df = pd.DataFrame(output_list)

    return output_df

def export_vehicle_info(vehicle_data, cities):
    v_df = pd.DataFrame(vehicle_data)
    v_df.index = v_df.index + 1
    v_df.loc['Total'] = v_df[cities].sum()
    v_df['Total'] = v_df[cities].sum(axis=1)
    v_df = v_df.rename({'Truck_Type': 'Vehicle Type'}, axis=1)
    return v_df

def export_summary_info(summary, vrp):
    summary_dict = summary.copy()
    if vrp:
        header_map = {
            'city': 'City',
            'objective': 'Overall Objective Function Value',
            'cost': 'Cost (INR)',
            'variables': 'No. of Integer Variables',
            'num_constraints': 'No. of Constraints',
            'solution_time': 'Solution Time (min)',
            'total_wt': 'Total Weight (KG)',
            'total_vol': 'Total Volume (CBM)',
            'avg_wt_ut': 'Avg. Wt Utilization (%)',
            'avg_vol_ut': 'Avg. Vol. Utilization (%)',
            'per_unit_cost': 'Per Unit Wt. Cost',
            'status': 'Status'
        }

        summary_csv_header = ['City', 'Overall Objective Function Value', 'Cost (INR)',
                              'No. of Integer Variables', 'No. of Constraints', 'Solution Time (min)',
                              'Total Weight (KG)', 'Total Volume (CBM)', 'Avg. Wt Utilization (%)',
                              'Avg. Vol. Utilization (%)', 'Per Unit Wt. Cost', 'Status']
    else:
        header_map = {
            'city': 'City',
            'vehicle_type': 'Vehicle Type',
            'objective': 'Overall Objective Function Value',
            'cost': 'Cost (INR)',
            'variables': 'No. of Integer Variables',
            'num_constraints': 'No. of Constraints',
            'solution_time': 'Solution Time (min)',
            'total_wt': 'Total Weight (KG)',
            'total_vol': 'Total Volume (CBM)',
            'avg_wt_ut': 'Avg. Wt Utilization (%)',
            'avg_vol_ut': 'Avg. Vol. Utilization (%)',
            'per_unit_cost': 'Per Unit Wt. Cost',
            'status': 'Status'
        }

        summary_csv_header = ['City', 'Vehicle Type', 'Overall Objective Function Value', 'Cost (INR)',
                              'No. of Integer Variables', 'No. of Constraints', 'Solution Time (min)',
                              'Total Weight (KG)', 'Total Volume (CBM)', 'Avg. Wt Utilization (%)',
                              'Avg. Vol. Utilization (%)', 'Per Unit Wt. Cost', 'Status']

    _summary_numeric_cols = ['Overall Objective Function Value', 'Cost (INR)', 'No. of Integer Variables',
                             'No. of Constraints', 'Total Weight (KG)', 'Solution Time (min)',
                             'Total Volume (CBM)', 'Avg. Wt Utilization (%)', 'Avg. Vol. Utilization (%)',
                             'Per Unit Wt. Cost']

    total_value_columns = ['Overall Objective Function Value', 'Cost (INR)', 'No. of Integer Variables',
                           'No. of Constraints', 'Solution Time (min)', 'Total Weight (KG)',
                           'Total Volume (CBM)']

    average_value_columns = ['Avg. Wt Utilization (%)', 'Avg. Vol. Utilization (%)', 'Per Unit Wt. Cost']

    # remap header
    summary_dict = {header_map[k]: v for k, v in summary_dict.items() if k in header_map.keys()}
    s_df = pd.DataFrame(summary_dict, columns=summary_csv_header)
    s_df.index = s_df.index + 1
    s_df.loc['Total'] = s_df[total_value_columns].sum()
    s_df.loc['Avg'] = s_df[average_value_columns].mean()
    s_df[_summary_numeric_cols] = round_df_values(s_df, _summary_numeric_cols)
    # s_df['Solution Time (min)'] = s_df['Solution Time (min)'].round(4)

    return s_df


def round_csv_values(csv_row: dict, column_names: list) -> dict:
    for column in column_names:
        if csv_row.get(column):
            csv_row[column] = round(csv_row.get(column), 2)
    return csv_row


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


def get_eta_header(routes_list: list) -> (list, list):
    eta_header = list()
    # [{'col_name': 'col_value'}]
    eta_header_map = list()
    for route in routes_list:
        eta_map = dict()
        header_list = list()
        for idx, node_detail in enumerate(route.get('node_details')):
            header = '{0} ETA'.format(node_detail.get('location_name'))
            header_list.insert(idx, header)
            # add values to map
            eta_map[header] = node_detail.get('ETA')
        eta_header.extend([h for h in header_list if h not in eta_header])
        eta_header_map.append(eta_map)

    return eta_header, eta_header_map

def round_df_values(df: pd.DataFrame, column_names: list, decimal=3) -> pd.DataFrame:
    """Round df columns to 'decimal' no. of places"""
    return df[column_names].round(decimal)

