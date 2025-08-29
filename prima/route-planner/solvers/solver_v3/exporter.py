import uuid
import pandas as pd

from route_planner.constants.app_configuration import AppConfig
from datetime import timedelta


def get_output_csv_file_path(rid):
    if not rid:
        rid = str(uuid.uuid4())
    return f"{AppConfig().temp_dir}/{rid}_output.csv"


def get_aggregated_csv_file_path(rid):
    if not rid:
        rid = str(uuid.uuid4())
    return f"{AppConfig().temp_dir}/{rid}_aggregated_output.csv"


def export_aggregated_output(routes, rid=None):
    routes_copy = routes.copy()
    routes_df = pd.DataFrame(routes_copy)

    # keys of header_map are in order of csv header
    header_map = {
        'planning_id': 'Route ID',
        'veh_type_name': 'Vehicle Type Name',
        'load_carrying': 'Load Carrying (KG)',
        'volume_carrying': 'Volume Carrying (CBM)',
        'weight_utilization': 'Weight Utilisation (%)',
        'volume_utilization': 'Volume Utilisation (%)',
        'total_distance_km': 'Total Run (KM)',
        'total_time_taken_hours': 'Time Taken (hrs)',
        'cost': 'Cost (INR)',
        'orders': 'Packed Orders'
    }

    header = header_map.keys()

    _numeric_cols = ['total_distance_km', 'cost', 'weight_utilization', 'volume_utilization', 'load_carrying',
                     'volume_carrying']

    csv_file_path = get_aggregated_csv_file_path(rid)

    df = pd.DataFrame(routes_df, columns=header)

    # typecast numeric cols to float
    df[_numeric_cols] = convert_df_cols_to_numeric(df, _numeric_cols)

    df[_numeric_cols] = round_df_values(df, _numeric_cols)

    df[['total_time_taken_hours']] = convert_df_cols_to_numeric(df, ['total_time_taken_hours'])
    df[['total_time_taken_hours']] = parse_hour_df(df, ['total_time_taken_hours'])

    # Rename df header
    df.rename(columns=header_map, inplace=True)

    # df to csv
    df.to_csv(csv_file_path, index=False)
    return csv_file_path


def export_output(routes, rid=None):
    routes_copy = routes.copy()
    routes_df = pd.DataFrame(routes_copy)

    # keys of header_map are in order of csv header
    header_map = {
        'planning_id': 'Route ID',
        'route_name': 'Route',
        'veh_type_name': 'Vehicle Type Name',
        'weight_utilization': 'Weight Utilisation (%)',
        'volume_utilization': 'Volume Utilisation (%)',
        'order': 'Order No.',
        'sku': 'SKU',
        'sku_class': 'SKU Class',
        'from_address': 'From Address',
        'to_address': 'To Address',
        'load': 'Weight (KG)',
        'volume': 'Volume (CBM)',
        'total_distance_km': 'Distance (KM)',
        'time_taken_hours': 'Time Taken (hrs)',
        'cost': 'Cost (INR)',
        'skipped_shipment_code': 'Skipped Shipment'
    }

    _header = header_map.keys()

    _numeric_cols = ['total_distance_km', 'cost', 'weight_utilization', 'volume_utilization', 'load', 'volume']

    csv_file_path = get_output_csv_file_path(rid)

    df = pd.DataFrame(routes_df, columns=_header)

    # typecast numeric cols to float
    df[_numeric_cols] = convert_df_cols_to_numeric(df, _numeric_cols)

    df[_numeric_cols] = round_df_values(df, _numeric_cols)

    df[['time_taken_hours']] = convert_df_cols_to_numeric(df, ['time_taken_hours'])
    df[['time_taken_hours']] = parse_hour_df(df, ['time_taken_hours'])

    # Rename df header
    df.rename(columns=header_map, inplace=True)

    # df to csv
    df.to_csv(csv_file_path, index=False)

    return csv_file_path


def round_df_values(df: pd.DataFrame, column_names: list, decimal=3) -> pd.DataFrame:
    """Round df columns to 'decimal' no. of places"""
    return df[column_names].round(decimal)


def strf_seconds(seconds, fmt="{hours}:{minutes}"):
    """parse seconds to time string format"""
    delta = timedelta(seconds=seconds)

    days = delta.days
    hours, rem = divmod(delta.seconds, 3600)
    minutes, seconds = divmod(rem, 60)

    d = dict()
    d['hours'] = (days * 24) + hours
    d["minutes"] = f"0{minutes}" if minutes < 10 else minutes
    return fmt.format(**d)


def parse_hour_df(df: pd.DataFrame, cols: list):
    """parse hours to string"""
    for col in cols:
        seconds = df[col].fillna(0)*3600
        df[col] = seconds.apply(lambda x: strf_seconds(x)).astype(str)
    return df[cols]


def convert_df_cols_to_numeric(df, cols, downcast="float", errors='coerce'):
    return df[cols].apply(pd.to_numeric, downcast=downcast, errors=errors)
