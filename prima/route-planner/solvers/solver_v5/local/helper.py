import pandas as pd


class SolverV5Validator:

    def __init__(self, file):
        self.task_df = pd.read_excel(file, "Task")
        self.vehicles_df = pd.read_excel(file, "Vehicles")
        self.new_task = None
        self.new_vehicles = None

    @property
    def vehicles(self):
        return self.new_vehicles

    @property
    def orders(self):
        return self.new_task

    def map_task_columns(self):
        task_df = self.task_df
        OUT_HEADER = ['order_id', 'from_location', 'from_latitude', 'from_longitude', 'to_location', 'to_latitude',
                      'to_longitude', 'load', 'volume', 'priority', 'sku', 'sku_tag', 'serviceable_vehicles',
                      'from_city', 'to_city', 'task_id', 'working_window_from', 'working_window_to',
                      'operating_window_from',
                      'operating_window_to', 'loading_time', 'unloading_time']

        IN_TO_OUT_HEADER_MAP = {'Order ID*': 'task_id',
                                'From Location*': 'from_location',
                                'From Latitude*': 'from_latitude',
                                'From Longitude*': 'from_longitude',
                                'To Location*': 'to_location',
                                'To Latitude*': 'to_latitude',
                                'To Longitude*': 'to_longitude',
                                'Load (kg)*': 'load',
                                'Volume (cbm)*': 'volume',
                                'Serviceable Vehicles': 'serviceable_vehicles',
                                'From City*': 'from_city',
                                'To City*': 'to_city',
                                'Priority': 'priority'
                                }
        return task_df.rename(columns=IN_TO_OUT_HEADER_MAP, inplace=False)

    def map_vehicles_columns(self):
        vehicles_df = self.vehicles_df
        OUT_HEADER = ['vehicle_type_name', 'From', 'To', 'capacity', 'volumetric_capacity', 'SLA (hours)',
                      'average_speed', 'fixed_charges', 'per_km_charges', 'per_kg_charges',
                      'Per unit charges', 'utilisation_lb', 'volume_utilisation_lb', 'Driving window_from',
                      'Driving window_To', 'dedicated', 'No. of vehicles', 'from_city', 'to_city']

        IN_TO_OUT_HEADER_MAP = {'Vehicle Type*': 'vehicle_type_name',
                                'Weight Capacity (kg)*': 'capacity',
                                'Volume Capacity (cbm)*': 'volumetric_capacity',
                                'Fixed Cost': 'fixed_charges',
                                'Per KG Charges': 'per_kg_charges',
                                'From City': 'from_city',
                                'To City': 'to_city',
                                'Weight Utilisation % Lower Bound': 'utilisation_lb',
                                'Volume Utilisation % Lower Bound': 'volume_utilisation_lb',
                                'No. of vehicles*': 'No. of vehicles',
                                }
        return vehicles_df.rename(columns=IN_TO_OUT_HEADER_MAP, inplace=False)

    def process(self):
        self.new_task = self.map_task_columns()
        self.new_vehicles = self.map_vehicles_columns()


from solvers.solver_v5.models.classifier import PincodeClassifier
from solvers.solver_v5.models.order_mapper import OrderMapper
import numpy as np
from geopy.distance import geodesic

def get_distance_bw_coordinates(origin, destination):
    return geodesic(origin, destination).kilometers

class DistanceMatrix:
    # _city_distance_matrix = TestData.Dis
    city_to_coordinate_map = dict(
        depot_delhi=(28.632398690338135, 77.22040319222626),
        delhi=(28.62461061567698, 77.13669978122562),
        jaipur=(26.912767846659975, 75.78871172050289),
        kota=(25.215614806507798, 75.86333814777034),
        jodhpur=(26.244116744526565, 73.01747853852822),
        chandigarh=(30.733453689000314, 76.76284179678885),
        allahabad=(25.43976703147613, 81.8341980954708),
        kanpur=(26.456685406351994, 80.32258780377887),
        lucknow=(26.85755749438465, 80.94182401047004),
        mohali=(30.702452182392292, 76.70235812189372),
        panchkula=(30.70338584624441, 76.85229423258356),
        panipat=(29.39155689186679, 76.96858204207696),
        siliguri=(26.714060215930417, 88.41977061443289),
        sonipat=(28.9896101534904, 77.02885461265032),
        varanasi=(25.315159874516663, 82.96810420992944)

    )
    @staticmethod
    def get_pincode_to_coordinate_map(order_classifier: PincodeClassifier, orders: OrderMapper):

        pincode_to_coordinate_map = dict()

        pincodes_tuple = order_classifier.pincodes

        for pincode_tuple in pincodes_tuple:
            v = order_classifier.get_df_indices_by_key(pincode_tuple)
            pincode_to_coordinate_map[pincode_tuple[1]] = orders.get_order(v[0]).to_coordinate
        return pincode_to_coordinate_map


    def __init__(self, order_classifier, orders):
        pincode_to_coordinate_map = self.get_pincode_to_coordinate_map(order_classifier, orders)

        self.pincode_to_coordinate_map = pincode_to_coordinate_map
        pincodes = list(self.pincode_to_coordinate_map.keys())
        index = range(len(pincodes))
        self.pincode_to_dm_index_map = dict(zip(pincodes, list(index)))
        self.pincode_distance_matrix = DistanceMatrix.get_pincode_distance_matrix(pincode_to_coordinate_map)

        self.city_distance_matrix = DistanceMatrix.get_city_distance_matrix(DistanceMatrix.city_to_coordinate_map)
        cities = list(DistanceMatrix.city_to_coordinate_map.keys())
        index = range(len(cities))
        self.city_to_dm_index_map = dict(zip(cities, list(index)))

    def get_distance_pincode(self, pincode_a, pincode_b):
        origin_index = self.pincode_to_dm_index_map[pincode_a]
        destination_index = self.pincode_to_dm_index_map[pincode_b]
        return self.pincode_distance_matrix[origin_index, destination_index]

    def get_distance_city(self, city_a, city_b):
        # hardcoded city distance matrix
        # city_to_dm_index_map = dict(
        #                             delhi=0,
        #                             jaipur=1,
        #                             kota=2,
        #                             jodhpur=3
        #                         )

        origin_index = self.city_to_dm_index_map[city_a]
        destination_index = self.city_to_dm_index_map[city_b]
        return self.city_distance_matrix[origin_index, destination_index]

    def get_distance_city_pincode(self, city, pincode):
        city_cord = DistanceMatrix.city_to_coordinate_map[city]
        pincode_coord = self.pincode_to_coordinate_map[pincode]
        return get_distance_bw_coordinates(city_cord, pincode_coord)

    @staticmethod
    def get_pincode_distance_matrix(pincode_to_coordinate_map):
        pincodes = list(pincode_to_coordinate_map.keys())
        N = len(pincodes)
        distance_matrix = np.zeros((N, N))

        for i in range(N):
            for j in range(i, N):
                origin = pincode_to_coordinate_map.get(pincodes[i])
                destination = pincode_to_coordinate_map[pincodes[j]]

                distance_matrix[i, j] = get_distance_bw_coordinates(origin, destination)
                distance_matrix[j, i] = distance_matrix[i, j]
                # print(f"[{i},{j}] : [{origin},{destination}] : [{(distance_matrix[i, j])}] ")
        return distance_matrix

    @staticmethod
    def get_city_distance_matrix(city_to_coordinate_map):
        cities = list(city_to_coordinate_map.keys())
        N = len(cities)
        distance_matrix = np.zeros((N, N))

        for i in range(N):
            for j in range(i, N):
                origin = city_to_coordinate_map.get(cities[i])
                destination = city_to_coordinate_map[cities[j]]

                distance_matrix[i, j] = get_distance_bw_coordinates(origin, destination)
                distance_matrix[j, i] = distance_matrix[i, j]
                # print(f"[{i},{j}] : [{origin},{destination}] : [{(distance_matrix[i, j])}] ")

        return distance_matrix


