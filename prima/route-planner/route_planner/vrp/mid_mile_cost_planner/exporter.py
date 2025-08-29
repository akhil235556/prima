import copy
import csv
import uuid

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

def export_aggregated_details(routes, rid= None):
    routes_copy = routes.copy()

    header_map = {
        'route_id': 'Route ID',
        'load': 'Load Carrying(KG)',
        'volume': 'Volume Carrying(CBM)',
        'distance': 'Total Run(KM)',
        'time_taken': 'Time Taken(hrs)',
        'cost': 'Cost(INR)',
        'vehicle_type': 'Vehicle Type Name',
        'vehicle_utilisation': 'Weight Utilisation(%)',
        'vehicle_volume_utilisation': 'Volume Utilisation (%)'
    }

    csv_header = ['Route ID', 'Vehicle Type Name', 'Load Carrying(KG)',
                  'Weight Utilisation(%)', 'Volume Carrying(CBM)', 'Volume Utilisation (%)',
                  'Total Run(KM)', 'Time Taken(hrs)', 'Cost(INR)']

    _numeric_cols = ['distance', 'load', 'volume', 'vehicle_utilisation', 'vehicle_volume_utilisation']

    csv_file_path = get_aggregated_csv_file_path(rid)
    with open(csv_file_path, 'w', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=csv_header)
        writer.writeheader()

        for route in routes_copy:
            _new_info = copy.copy(route)
            _new_info = round_csv_values(_new_info, _numeric_cols)
            _new_info = parse_hour_decimal(_new_info, ['time_taken'])
            _new_info = {header_map[k]: v for k, v in _new_info.items() if k in header_map.keys()}
            writer.writerow(_new_info)

    return csv_file_path


def export_routes_details(routes, rid=None):
    routes_copy = routes.copy()

    header_map = {
        'order_id': 'Order ID',
        'route_id': 'Route ID',
        'route': 'Route',
        'load': 'Weight(KG)',
        'volume': 'Volume(CBM)',
        'from': 'From Address',
        'to': 'To Address',
        'distance': 'Distance (KM)',
        'time_taken': 'Time Taken',
        'cost': 'Cost (INR)',
        'vehicle_type': 'Vehicle Type',
        'vehicle_utilisation': 'Weight Utilisation(%)',
        'vehicle_volume_utilisation': 'Volume Utilisation (%)',
    }
    csv_header = ['Order ID', 'Route ID', 'Route', 'Vehicle Type', 'From Address', 'To Address', 'Weight(KG)', 'Weight Utilisation(%)',
                  'Volume(CBM)', 'Volume Utilisation (%)', 'Cost (INR)',
                  'Distance (KM)', 'Time Taken']

    _numeric_cols = ['Weight(KG)', 'Volume(CBM)', 'Distance (KM)', 'Cost (INR)',
                     'Weight Utilisation(%)', 'Volume Utilisation (%)']

    csv_file_path = get_output_csv_file_path(rid)
    with open(csv_file_path, 'w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=csv_header)
        writer.writeheader()
        for info in routes_copy:
            _info = copy.copy(info)
            _info = round_csv_values(_info, _numeric_cols)
            _info['from'] = _info.get('origin', dict()).get('location_name', '')[:-8]
            _info = parse_hour_decimal(_info, ['time_taken'])
            vehicle_node_list = _info.get('node_details', [0])[1:]
            if not vehicle_node_list:
                _info = {header_map[k]: v for k, v in _info.items() if k in header_map.keys()}
                writer.writerow(_info)
            else:
                for node_dict in vehicle_node_list:
                    _new_info = dict()
                    _new_info = copy.copy(_info)
                    _new_info['route_id'] = node_dict.get('route_id')
                    _new_info['order_id'] = node_dict.get('order_id')
                    _new_info['to'] = node_dict.get('location_name')
                    _new_info['vehicle_type'] = node_dict.get('vehicle_type')
                    _new_info['time_taken'] = node_dict.get('time_taken')
                    _new_info = parse_hour_decimal(_new_info, ['time_taken'])
                    _new_info['distance'] = node_dict.get('distance')
                    _new_info['volume'] = node_dict.get('volume')
                    _new_info['load'] = node_dict.get('load')
                    _new_info = {header_map[k]: v for k, v in _new_info.items() if k in header_map.keys()}
                    writer.writerow(_new_info)

        return csv_file_path

def export_confusion_matrix(flat_routes, rid=None):
    _flat_routes = flat_routes.copy()
    eta_header, eta_header_map = get_eta_header(_flat_routes)

    def _columns() -> list:
        csv_header = [
            'Route ID',
            'Route',
            'Distance (KM)',
            'Load (KG)',
            'Volume (CBM)',
            'Vehicle Type',
            'Total Cost (INR)',
            'Total Time Taken',
            'Vehicle Weight Utilisation (%)',
            'Vehicle Volume Utilisation (%)',
            'Is Vehicle Selected For Route'
        ]
        csv_header.extend(eta_header)
        return csv_header

    def _confusion_matrix_map():
        return {
            'route_id': 'Route ID',
            'route': 'Route',
            'distance': 'Distance (KM)',
            'load': 'Load (KG)',
            'volume': 'Volume (CBM)',
            'vehicle_type': 'Vehicle Type',
            'cost': 'Total Cost (INR)',
            'time_taken': 'Total Time Taken',
            'vehicle_utilisation': 'Vehicle Weight Utilisation (%)',
            'vehicle_volume_utilisation': 'Vehicle Volume Utilisation (%)',
            'selected_vehicle': 'Is Vehicle Selected For Route'
        }

    _numeric_cols = ['distance', 'load', 'volume', 'cost', 'vehicle_utilisation', 'vehicle_volume_utilisation']

    csv_file_path = get_confusion_matrix_csv_file_path(rid)
    with open(csv_file_path, 'w', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=_columns())
        writer.writeheader()

        for flat_route, eta_info in zip(_flat_routes, eta_header_map):
            _flat_route = flat_route.copy()
            _flat_route = round_csv_values(_flat_route, _numeric_cols)
            _flat_route = parse_hour_decimal(_flat_route, ['time_taken'])
            _flat_route = {_confusion_matrix_map()[k]: v for k, v in _flat_route.items() if
                           k in _confusion_matrix_map().keys()}
            _flat_route.update(eta_info)
            writer.writerow(_flat_route)
    return csv_file_path


def round_csv_values(csv_row: dict, column_names: list) -> dict:
    for column in column_names:
        if csv_row.get(column):
            csv_row[column] = round(csv_row.get(column), 3)
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
