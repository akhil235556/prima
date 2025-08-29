import copy
import csv
import uuid
import pandas as pd
from route_planner.constants.app_configuration import AppConfig
from route_planner.utils.utils import remove_suffix


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
        'from_city': 'From City',
        'to_city': 'To City',
        'delivery_locations': 'Delivery Locations',
        'delivery_cities': 'Delivery Cities'
    }

    csv_header = ['Route ID', 'From City', 'To City', 'Vehicle Type', 'Load Carrying(KG)',
                  'Volume Carrying(CBM)', 'Weight Utilisation(%)', 'Volume Utilisation (%)',
                  'Total Run(KM)', 'Time Taken(hrs)', 'Cost(INR)', 'Delivery Locations', 'Delivery Cities']

    _numeric_cols = ['distance', 'cost', 'vehicle_utilisation', 'vehicle_volume_utilisation']


    for route in routes_copy:
        _new_info = copy.copy(route)
        _new_info = round_csv_values(_new_info, _numeric_cols)
        _new_info = parse_hour_decimal(_new_info, ['time_taken'])
        _new_info = {header_map[k]: v for k, v in _new_info.items() if k in header_map.keys()}
        output_data.append(_new_info)

    ag_df = pd.DataFrame(output_data, columns=csv_header)

    return ag_df

def export_indent_details(routes):
    routes_copy = routes.copy()
    indent_output_list = list()

    header_map = {
        'route_id': 'IndentGroupId',
        'order_group_id': 'OrderGroupId',
        'shipment_group_id': 'ShipmentGroupId',
        'freight_type': 'FreightType',
        'mode_of_transport': 'ModeOfTransport',
        'lane_code': 'LaneCode',
        'vehicle_type': 'VehicleTypeName',
        'contract_id': 'ContractID',
        'pick_up_location': 'PickupPointName',
        'location_name': 'DropPointName',
        'date_time': 'PlacementDatetime(DD-MM-YYYY hh:mm)*',
        'shipment_sequence_number': 'ShipmentSequenceNumber',
        'consignee_name': 'ConsigneeCode',
        'time_taken': 'TAT (hrs)',
        'load': 'ShipmentWeight (Kg)',
        'volume': 'ShipmentVolume (m^3)',
        'material_code': 'MaterialCode',
        'material_count': 'MaterialCount',
        'UOM': 'UOM'
    }

    csv_header = ['IndentGroupId', 'OrderGroupId', 'ShipmentGroupId', 'FreightType', 'ModeOfTransport', 'LaneCode',
                  'VehicleTypeCode', 'VehicleTypeName', 'ContractID', 'PickupPointCode', 'PickupPointName',
                  'DropPointCode', 'DropPointName', 'PlacementDatetime(DD-MM-YYYY hh:mm)*', 'ShipmentSequenceNumber',
                  'ShipmentRefId', 'ReferenceID', 'LR-Number', 'WaybillNumber', 'ConsigneeCode',
                  'AppointmentDatetime(DD-MM-YYYY hh:mm)', 'TAT (hrs)', 'ShipmentWeight (Kg)', 'ShipmentVolume (m^3)',
                  'ShipmentQuantity', 'ShipmentLength (m)', 'ShipmentWidth (m)', 'ShipmentHeight (m)', 'MaterialCode',
                  'MaterialCount', 'ProductQuantity', 'UOM', 'ShipmentRemarks', 'ShipmentTag', 'RefDocketNumber',
                  'IndentRemarks']

    _numeric_cols = ['ShipmentWeight (Kg)', 'ShipmentVolume (m^3)']

    for route in routes_copy:
        _route = copy.copy(route)
        node_data = _route.get('node_details', [0])[1:]
        _route = parse_hour_decimal(_route, ['time_taken'])
        for idx, node in enumerate(node_data):
            _indent_dict = dict()
            node['pick_up_location'] = remove_suffix(node['pick_up_location'], ' (Depot)')
            node['shipment_sequence_number'] = idx+1
            _indent_dict = copy.copy(node)
            _indent_dict = {header_map[k]: v for k, v in _indent_dict.items() if k in header_map.keys()}
            indent_output_list.append(_indent_dict)

    indent_output_df = pd.DataFrame(indent_output_list)
    if not indent_output_df.empty:
        check_contract_id(indent_output_df, 'ContractID', 'LaneCode')
        indent_output_df['IndentGroupId'] = indent_output_df['IndentGroupId'].rank(method='dense', ascending=True).astype(int)
        indent_output_df.sort_values(['IndentGroupId', 'ShipmentSequenceNumber'], inplace=True)
        df1 = indent_output_df.groupby(['IndentGroupId', 'ShipmentGroupId']).agg({'ShipmentWeight (Kg)': 'sum'})
        indent_output_df = indent_output_df.merge(df1, how='left', left_on=['IndentGroupId', 'ShipmentGroupId'], right_index=True, suffixes=('_x', ''))
        df1 = indent_output_df.groupby(['IndentGroupId', 'ShipmentGroupId']).agg({'ShipmentVolume (m^3)': 'sum'})
        indent_output_df = indent_output_df.merge(df1, how='left', left_on=['IndentGroupId', 'ShipmentGroupId'], right_index=True, suffixes=('_x', ''))
        indent_output_df[_numeric_cols] = round_df_values(indent_output_df, _numeric_cols, 2)

    indent_output_df = indent_output_df.reindex(csv_header, axis=1)

    return indent_output_df

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
        'vehicle_type': 'Vehicle Type Name',
        'vehicle_utilisation': 'Weight Utilisation(%)',
        'vehicle_volume_utilisation': 'Volume Utilisation (%)',
        'from': 'From Node (Location Name)',
        'to': 'RDC/Consignee (Location Name)',
        'to_city': 'To City',
        'from_city': 'From City',
        'order_id': 'Order No.'
    }

    csv_header = ['Route ID', 'Route', 'From City', 'To City', 'Vehicle Type Name', 'Distance(KM)', 'Cost(INR)',
                  'Time Taken(hrs)', 'Weight Utilisation(%)', 'Volume Utilisation (%)', 'Weight(KG)', 'Volume(CBM)',
                  'Order No.', 'From Node (Location Name)', 'RDC/Consignee (Location Name)']

    _numeric_cols = ['distance', 'cost', 'vehicle_utilisation', 'vehicle_volume_utilisation']

    for info in routes_copy:
        _info = copy.copy(info)
        _info = round_csv_values(_info, _numeric_cols)
        _info['from'] = _info.get('origin', dict()).get('location_name', '')[:-8]
        _info = parse_hour_decimal(_info, ['time_taken'])
        node_list = _info.get('node_details', [0])[1:]
        if not node_list:
            _info['sku'] = _info.get('skus', "")
            _info = {header_map[k]: v for k, v in _info.items() if k in header_map.keys()}
            output_list.append(_info)
        else:
            for sku_dict in node_list:
                _new_info = dict()
                _new_info = copy.copy(_info)
                _new_info['order_id'] = sku_dict.get('order_id')
                _new_info['to'] = sku_dict.get('location_name')
                _new_info['time_taken'] = sku_dict.get('time_taken')
                _new_info = parse_hour_decimal(_new_info, ['time_taken'])
                _new_info['distance'] = sku_dict.get('distance')
                _new_info['volume'] = sku_dict.get('volume')
                _new_info['load'] = sku_dict.get('load')
                _new_info['from_city'] = sku_dict.get('from_city')
                _new_info['to_city'] = sku_dict.get('to_city')
                _new_info = {header_map[k]: v for k, v in _new_info.items() if k in header_map.keys()}
                output_list.append(_new_info)

    output_df = pd.DataFrame(output_list)
    output_df = output_df.reindex(csv_header, axis=1)

    return output_df


def export_confusion_matrix_details(flat_routes):
    _flat_routes = flat_routes.copy()
    output_list = list()
    eta_header, eta_header_map = get_eta_header(_flat_routes)

    csv_header = ['Route ID', 'Route', 'From City', 'To City', 'Vehicle Type Name', 'Distance (KM)', 'Cost (INR)',
                  'Total Time Taken (Hrs)', 'Weight Utilisation (%)', 'Volume Utilisation (%)', 'Weight (KG)',
                  'Volume (CBM)', 'Is Vehicle Selected For Route']

    def _confusion_matrix_map():
        return {
            'route_id': 'Route ID',
            'route': 'Route',
            'to_city': 'To City',
            'from_city': 'From City',
            'distance': 'Distance (KM)',
            'load': 'Weight (KG)',
            'volume': 'Volume (CBM)',
            'vehicle_type': 'Vehicle Type Name',
            'cost': 'Cost (INR)',
            'time_taken': 'Total Time Taken (Hrs)',
            'vehicle_utilisation': 'Weight Utilisation (%)',
            'vehicle_volume_utilisation': 'Volume Utilisation (%)',
            'selected_vehicle': 'Is Vehicle Selected For Route',
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

    output_df = pd.DataFrame(output_list, columns=csv_header)

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
            'to_city': 'To City',
            'from_city': 'From City',
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

        summary_csv_header = ['From City', 'To City', 'Overall Objective Function Value', 'Cost (INR)',
                              'No. of Integer Variables', 'No. of Constraints', 'Solution Time (min)',
                              'Total Weight (KG)', 'Total Volume (CBM)', 'Avg. Wt Utilization (%)',
                              'Avg. Vol. Utilization (%)', 'Per Unit Wt. Cost', 'Status']
    else:
        header_map = {
            'to_city': 'To City',
            'from_city': 'From City',
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

        summary_csv_header = ['From City', 'To City', 'Vehicle Type', 'Overall Objective Function Value', 'Cost (INR)',
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

def export_vehicles_data(agg_output):
    header_map = {'vehicle_type': 'Vehicle Type',
                  'from_city': 'From City',
                  'to_city': 'To City'}

    csv_header = ['Vehicle Type', 'From City', 'To City']

    vehicle_data_dict = dict(
        vehicle_type=list(),
        from_city=list(),
        to_city=list(),
        num_vehicles=0
    )

    for route in agg_output:
        vehicle_data_dict['vehicle_type'].append(route.get('vehicle_type'))
        vehicle_data_dict['from_city'].append(route.get('from_city'))
        vehicle_data_dict['to_city'].append(route.get('to_city'))

    vehicle_data_dict = {header_map[k]: v for k, v in vehicle_data_dict.items() if k in header_map.keys()}
    df = pd.DataFrame(vehicle_data_dict, columns=csv_header)
    df.index = df.index + 1
    df['Number of Vehicles'] = df.groupby(csv_header)['Vehicle Type'].transform('size')
    df = df.drop_duplicates()
    df.loc['Total'] = df[['Number of Vehicles']].sum()
    df.fillna('', inplace=True)
    return df


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


def check_contract_id(df, c1, c2):
    df1 = df[c1].str.len() > 1
    df2 = df.loc[df1].index
    if not df2.empty:
        df.drop([c2], axis=1, inplace=True)
        df[c2] = ''

