import json
import pandas as pd


class VehiclesMapper(object):

    df = pd.DataFrame()

    def __init__(self, vehicle_df: pd.DataFrame):
        self.df = vehicle_df

    def get_vehicle(self, vehicle_index: int):
        vehicle = self.df.loc[self.df['index'] == vehicle_index]
        vehicle_dict = vehicle.to_dict('records')[0]
        return Vehicle(vehicle_dict)

    def filter_vehicle_by_type(self, vehicle_type: str, vehicle_indices=None ):
        _df = self.df.copy()
        if vehicle_indices:
            _df = _df.loc[_df['index'].isin(vehicle_indices)]

        _df = _df[_df['vehicle_type_name'] == vehicle_type]
        vehicle_dict_list = _df.to_dict('records')
        return [Vehicle(veh_dict) for veh_dict in vehicle_dict_list]

    def get_vehicle_df(self, vehicle_index: int):
        vehicle_df = self.df.loc[self.df['index'] == vehicle_index]
        return vehicle_df


class Vehicle:
    vehicle = dict()

    def __str__(self):
        return json.dumps(self.vehicle)

    def __init__(self, vehicle: dict):
        self.vehicle = vehicle

    @property
    def vehicle_type(self):
        return self.vehicle.get('vehicle_type_name', '')

    @property
    def load_capacity(self):
        return self.vehicle.get('capacity', 0)

    @property
    def volume_capacity(self):
        return self.vehicle.get('volumetric_capacity', 0)

    @property
    def index(self):
        return self.vehicle.get('index', None)

    @property
    def to_city(self):
        return self.vehicle.get('to_city', '')

    @property
    def fixed_cost(self):
        return self.vehicle.get('fixed_charges', 0)

    @property
    def tp_limit(self):
        return self.vehicle.get('tp_limit', 0)

    @property
    def tp_cost(self):
        return self.vehicle.get('tp_cost', 0)

    @property
    def tp_detour_limit(self):
        return self.vehicle.get('tp_detour', 0)
