import pandas as pd
import numpy as np
from geopy.distance import geodesic
from memoization import cached
from route_planner.utils.utils import dataframe_empty


class SolverV1InputDataProcessor(object):

    task_str_header = ['task_id', 'from_location', 'from_city', 'to_city', 'serviceable_vehicles', 'sku',
                       'sku_tag']
    vehicles_str_header = ['vehicle_type', 'from_city', 'to_city']
    products_str_header = ['sku', 'sku_category', 'sku_tag', 'exclusive_tags']

    def __init__(self, orders, vehicles, products, config):
        self.orders = orders
        self.vehicles = vehicles
        self.products = products
        self._solver_config = config

        # typecast string_type columns
        SolverV1InputDataProcessor.type_cast_to_str(self.orders, self.task_str_header)
        SolverV1InputDataProcessor.type_cast_to_str(self.vehicles, self.vehicles_str_header)
        SolverV1InputDataProcessor.type_cast_to_str(self.products, self.products_str_header)

    @staticmethod
    def type_cast_to_str(df: pd.DataFrame, str_type_cols: list) -> None:
        if df is not None:
            df_columns = df.columns.to_list()
            for col_name in str_type_cols:
                if col_name in df_columns:
                    col = df[col_name].copy().dropna()
                    col = col.apply(str)
                    indexes = col.index
                    df[col_name].iloc[indexes] = col

    @staticmethod
    def dataframe_not_empty(df_column):
        empty_list = df_column.isnull().values.any()
        if empty_list:
            # dataframe has nan values
            return False
        else:
            return True

    def dedicated_vehicles(self, vehicles):
        dedicate = self.dataframe_not_empty(vehicles["dedicated"])
        return dedicate

    @staticmethod
    def num_vehicles(vehicles):
        vehicles['No. of vehicles'] = vehicles['No. of vehicles'].fillna(100)
        vehicle_number_list = vehicles['No. of vehicles'].values.tolist()
        return vehicle_number_list

    def get_locations(self, orders):
        locations_df = orders[["to_latitude", "to_longitude"]]
        locations = locations_df.values.tolist()
        depot_lat_long = list()
        lat = orders["from_latitude"].iloc[0]
        long = orders["from_longitude"].iloc[0]
        depot_lat_long.append(lat)
        depot_lat_long.append(long)
        locations.insert(0, depot_lat_long)
        return locations

    @staticmethod
    @cached(ttl=50)
    def get_distance(origin, destination):
        return int(geodesic(origin, destination).meters)

    def create_distance_matrix(self, orders, vehicles, config):
        locations = self.get_locations(orders)
        dedicated = self.dedicated_vehicles(vehicles)

        list1 = []
        matrix = []
        for i in range(len(locations)):

            for x in range(len(locations)):
                origin = locations[i]
                loc = locations[x]

                dist = self.get_distance(origin, loc)

                list1.append(dist)

            matrix.append(list1)
            list1 = []

        # not return to depot ?
        if dedicated:
            pass
        else:
            for k in range(len(matrix)):
                matrix[k][0] = 0

        return matrix

    @staticmethod
    def get_order_id_list(orders):
        o_df = orders["order_id"]
        o_lit = o_df.values.tolist()
        o_lit.insert(0, 0)
        return o_lit

    @staticmethod
    def get_task_id_list(orders):
        o_df = orders["task_id"]
        o_lit = o_df.values.tolist()
        o_lit.insert(0, 0)
        return o_lit

    @staticmethod
    def get_order_demand_list(orders):
        loads_df = orders["load"] * 1000
        load = loads_df.values.tolist()
        if not dataframe_empty(orders["load"]):
            load.insert(0, 0)
        else:
            load.insert(0, np.nan)
        return load

    @staticmethod
    def get_order_volume_list(orders):
        volumes_df = 1000000 * orders["volume"]
        volume = volumes_df.values.tolist()
        if not dataframe_empty(orders["volume"]):
            volume.insert(0, 0)
        else:
            volume.insert(0, np.nan)
        return volume

    @staticmethod
    def get_product_list(orders):
        product_list = orders["sku"].values.tolist()
        product_list.insert(0, '0')
        return product_list

    @staticmethod
    def get_priority_list(orders):
        priority_list = orders["priority"].values.tolist()
        priority_list.insert(0, 0)
        return priority_list

    @staticmethod
    def get_location_name_list(orders):
        location_names = orders["to_location"].values.tolist()
        depot_name = orders["from_location"].iloc[0]
        location_names.insert(0, f'{depot_name} (Depot)')
        return location_names

    @staticmethod
    def get_location_work_windows(orders):
        orders['working_window_from'] = np.floor(
            pd.to_numeric(orders['working_window_from'], errors='coerce')).astype('Int64')
        working_window_from = []
        for i in orders["working_window_from"]:
            working_window_from.append(i)
        # working_window_from = orders["working_window_from"].values.tolist()
        orders['working_window_to'] = np.floor(
            pd.to_numeric(orders['working_window_to'], errors='coerce')).astype('Int64')
        working_window_to = []
        for i in orders["working_window_to"]:
            working_window_to.append(i)
        if orders["working_window_to"].dropna().empty or orders['working_window_to'].isnull().any():
            working_window_list = [[x] + [y] for x, y in zip(working_window_from, working_window_to)]
            working_window_list.insert(0, [0, 0])
        else:
            working_window_list = [[int(x)] + [int(y)] for x, y in zip(working_window_from, working_window_to)]
            working_window_list.insert(0, [0, 0])
        return working_window_list

    @staticmethod
    def get_loading_time(orders):
        loading_time_list = orders["loading_time"].values.tolist()
        return loading_time_list

    @staticmethod
    def get_unloading_time(orders):
        unloading_time_list = orders["unloading_time"].values.tolist()
        return unloading_time_list

    @staticmethod
    def get_vehicle_list(vehicles):
        vehicle_list = vehicles['vehicle_type_name'].values.tolist()
        return vehicle_list

    @staticmethod
    def get_vehicle_capacity_list(vehicles):
        capacity_df = vehicles["capacity"] * 1000
        capacity = capacity_df.values.tolist()
        return capacity

    @staticmethod
    def get_vehicle_volume_capacity_list(vehicles):
        capacity_df = 1000000 * vehicles["volumetric_capacity"]
        capacity = capacity_df.values.tolist()
        return capacity

    @staticmethod
    def get_vehicle_cost_per_km_list(vehicles):
        cost_km_list = vehicles["per_km_charges"].values.tolist()
        for i in range(len(cost_km_list)):
            cost_km_list[i] = cost_km_list[i] / 1000
        return cost_km_list

    @staticmethod
    def get_vehicle_cost_per_kg_list(vehicles):
        cost_kg_list = vehicles["per_kg_charges"].values.tolist()
        return cost_kg_list

    @staticmethod
    def get_vehicle_fixed_cost_list(vehicles):
        fixed_cost_list = vehicles["fixed_charges"].values.tolist()
        return fixed_cost_list

    @staticmethod
    def get_vehicle_average_speed_list(vehicles):
        average_speed_list = vehicles["average_speed"].values.tolist()
        return average_speed_list

    @staticmethod
    def get_vehicle_utilisation_lb(vehicles):
        vehicle_utilisation_lb = vehicles["utilisation_lb"].values.tolist()
        return vehicle_utilisation_lb

    @staticmethod
    def get_vehicle_volume_utilisation_lb(vehicles):
        vehicle_volume_utilisation_lb = vehicles["volume_utilisation_lb"].values.tolist()
        return vehicle_volume_utilisation_lb

    @staticmethod
    def get_vehicle_max_route_length(vehicles):
        vehicles["max_route_length"] = np.floor(
            pd.to_numeric(vehicles["max_route_length"], errors='coerce')).astype('Int64')
        route_length_list = []
        for i in vehicles["max_route_length"]:
            route_length_list.append(i)
        return route_length_list

    @staticmethod
    def get_vehicle_max_drop_distance(vehicles):
        vehicles['max_drop_distance'] = np.floor(
            pd.to_numeric(vehicles['max_drop_distance'], errors='coerce')).astype('Int64')
        max_drop_distance_list = []
        for i in vehicles['max_drop_distance']:
            max_drop_distance_list.append(i)
        return max_drop_distance_list

    @staticmethod
    def get_max_node_visits(vehicles):
        vehicles["max_node_visits"] = np.floor(
            pd.to_numeric(vehicles["max_node_visits"], errors='coerce')).astype('Int64')
        max_node_list = []
        for i in vehicles['max_node_visits']:
            max_node_list.append(i)
        return max_node_list

    @staticmethod
    def get_vehicle_serviceability_locations_list(orders, vehicles):
        vehicles_for_depot = vehicles["vehicle_type_name"].tolist()
        vehicles_for_depot_string = ",".join(vehicles_for_depot)
        orders["serviceable_vehicles"] = orders["serviceable_vehicles"].fillna('')
        serviceable_vehicle_per_location_list = orders["serviceable_vehicles"].map(lambda x: x.split(",")).to_list()
        serviceable_vehicle_per_location_list.insert(0, [])
        return serviceable_vehicle_per_location_list

    @staticmethod
    def convert_service_list(vehicles_serviceable, vehicle_name):
        serviceable_list = list()
        for location in vehicles_serviceable:
            vehicle_type_list = []
            for vehicle_type in location:
                for idx, cap_type in enumerate(vehicle_name):
                    if vehicle_type == cap_type:
                        vehicle_type_list.append(idx)
            serviceable_list.append(vehicle_type_list)
        return serviceable_list

    @staticmethod
    def get_operating_window_from_list(orders):
        orders["operating_window_from"] = np.floor(
            pd.to_numeric(orders["operating_window_from"], errors='coerce')).astype('Int64')
        operating_time_from_list = []
        for i in orders["operating_window_from"]:
            operating_time_from_list.append(i)
        operating_time_from_list.insert(0, 0)
        return operating_time_from_list

    @staticmethod
    def get_operating_window_to_list(orders):
        orders["operating_window_to"] = np.floor(
            pd.to_numeric(orders["operating_window_to"], errors='coerce')).astype('Int64')
        operating_time_to_list = []
        for i in orders["operating_window_to"]:
            operating_time_to_list.append(i)
        if not orders["operating_window_to"].dropna().empty:
            operating_time_to_list.insert(0, 1439)
        return operating_time_to_list

    @staticmethod
    def list_conversion(vehicle_number_list, info_list):
        converted_list = list()
        for idx, vehicle_type in enumerate(info_list):
            converted_list.extend([vehicle_type] * int(vehicle_number_list[idx]))
        return converted_list

    @staticmethod
    def get_sku_type_list(products):
        sku_type_list = products["sku"].values.tolist()
        return sku_type_list

    @staticmethod
    def get_sku_product_class_list(products):
        sku_product_class_list = products["sku_category"].fillna('').tolist()
        return sku_product_class_list

    @staticmethod
    def get_sku_tag_list(products):
        products["sku_tag"] = products["sku_tag"].fillna('')
        sku_tag_list = products["sku_tag"].map(lambda x: x.split(",")).to_list()
        return sku_tag_list

    @staticmethod
    def get_sku_exclusive_tag_list(products):
        products["exclusive_tags"] = products["exclusive_tags"].fillna("")
        sku_exclusive_tag_list = products["exclusive_tags"].map(lambda x: x.split(",")).to_list()
        return sku_exclusive_tag_list

    @staticmethod
    def get_unique_product_list(products):
        unique_product_list = products.sku.unique().tolist()
        return unique_product_list

    @staticmethod
    def get_sku_data(sku_type, sku_class, sku_tags, exclusive_tags):
        sku_data = dict()
        for idx in range(len(sku_tags)):
            data_dict = {
                "tags": sku_tags[idx],
                'product_class': sku_class[idx],
                "exclusive_tags": exclusive_tags[idx]
            }
            sku_data[sku_type[idx]] = data_dict
        return sku_data

    @staticmethod
    def get_dest_addr_to_task_id_map(orders):
        orders['task_id'].copy()
        orders['task_id'].copy()

    @staticmethod
    def get_daily_run(vehicles):
        return vehicles['daily_run'].fillna(-1).values.tolist()

    @staticmethod
    def get_destination_list(vehicles, orders):
        destinations = vehicles["destination"].tolist()
        location_names = orders["to_location"].tolist()
        depot_name = orders["from_location"].iloc[0]
        location_names.insert(0, f'{depot_name} (Depot)')
        destination_idx_list = []
        for destination in destinations:
            idx = location_names.index(destination)
            destination_idx_list.append(idx)
        return destination_idx_list

    @staticmethod
    def get_start_list(vehicles):
        v = 0
        n = len(vehicles['vehicle_type_name'].values.tolist())
        start_list = [v] * n
        return start_list

    def create_data_model(self):
        product_list = list()
        unique_product_list = list()
        sku_type_list = list()
        sku_tags_list = list()
        sku_exclusive_tags_list = list()
        sku_data_dict = list()
        priority_list = list()
        vehicle_volume_capacity_list = list()
        vehicle_volume_utilisation_lb_list = list()
        vehicle_max_route_length_list = list()
        vehicle_max_route_node_list = list()
        order_volume_list = list()
        task_id_list = list()
        order_id_list = list()
        vehicle_daily_run_list = list()
        vehicle_max_drop_distance_list = list()
        destinations_list = list()
        start_list = list()

        distance_matrix = self.create_distance_matrix(self.orders, self.vehicles, self._solver_config)
        order_demand_list = self.get_order_demand_list(self.orders)
        if self._solver_config.vehicle_volume_capacity_constraint:
            order_volume_list = self.get_order_volume_list(self.orders)
        if self._solver_config.order_id:
            order_id_list = self.get_order_id_list(self.orders)
        if self._solver_config.task_id:
            task_id_list = self.get_task_id_list(self.orders)
        location_name_list = self.get_location_name_list(self.orders)
        location_time_window_list = self.get_location_work_windows(self.orders)
        unloading_time_list = self.get_unloading_time(self.orders)
        loading_time_list = self.get_loading_time(self.orders)
        if self._solver_config.products_flag:
            product_list = self.get_product_list(self.orders)
            unique_product_list = self.get_unique_product_list(self.products)
        if self._solver_config.priority_flag:
            priority_list = self.get_priority_list(self.orders)
        if self._solver_config.mid_mile_cost:
            destinations_list = self.get_destination_list(self.vehicles, self.orders)
            start_list = self.get_start_list(self.vehicles)

        vehicle_serviceability_list = self.get_vehicle_serviceability_locations_list(self.orders, self.vehicles)

        vehicles_list = self.get_vehicle_list(self.vehicles)
        vehicle_capacity_list = self.get_vehicle_capacity_list(self.vehicles)
        if self._solver_config.vehicle_volume_capacity_constraint:
            vehicle_volume_capacity_list = self.get_vehicle_volume_capacity_list(self.vehicles)
        vehicle_cost_per_km_list = self.get_vehicle_cost_per_km_list(self.vehicles)
        vehicle_cost_per_kg_list = self.get_vehicle_cost_per_kg_list(self.vehicles)
        vehicle_fixed_cost_list = self.get_vehicle_fixed_cost_list(self.vehicles)
        vehicle_average_speed_list = self.get_vehicle_average_speed_list(self.vehicles)
        vehicle_utilisation_lb_list = self.get_vehicle_utilisation_lb(self.vehicles)
        if self._solver_config.max_drop_distance_constraint:
            vehicle_max_drop_distance_list = self.get_vehicle_max_drop_distance(self.vehicles)
        if self._solver_config.max_length_constraint:
            vehicle_max_route_length_list = self.get_vehicle_max_route_length(self.vehicles)
        if self._solver_config.max_node_visits_constraint:
            vehicle_max_route_node_list = self.get_max_node_visits(self.vehicles)
        if self._solver_config.vehicle_volume_capacity_constraint:
            vehicle_volume_utilisation_lb_list = self.get_vehicle_volume_utilisation_lb(self.vehicles)

        if self._solver_config.products_flag:
            sku_type_list = self.get_sku_type_list(self.products)
            sku_product_class_list = self.get_sku_product_class_list(self.products)
            sku_tags_list = self.get_sku_tag_list(self.products)
            # sku_inclusive_tags_list = self.get_sku_inclusive_tag_list(self.products)
            sku_exclusive_tags_list = self.get_sku_exclusive_tag_list(self.products)
            sku_data_dict = self.get_sku_data(sku_type_list,
                                              sku_product_class_list,
                                              sku_tags_list,
                                              sku_exclusive_tags_list)

        vehicle_data = {
            "cap_name": vehicles_list,
            "num_vehicles": len(vehicles_list),
            "vehicle_capacities": vehicle_capacity_list,
            "vehicle_volume_capacities": vehicle_volume_capacity_list,
            "cost_per_km": vehicle_cost_per_km_list,
            "cost_per_kg": vehicle_cost_per_kg_list,
            "vehicle_average_speed": vehicle_average_speed_list,
            "fixed_charges": vehicle_fixed_cost_list,
            "max_route_length": vehicle_max_route_length_list,
            "max_route_node": vehicle_max_route_node_list,
            "max_drop_distance": vehicle_max_drop_distance_list,
            "destination": destinations_list
        }

        dedicated = self.dedicated_vehicles(self.vehicles)
        vehicle_number_list = self.num_vehicles(self.vehicles)
        locations = self.get_locations(self.orders)

        vehicles_list = self.list_conversion(vehicle_number_list, vehicles_list)
        vehicle_capacity_list = self.list_conversion(vehicle_number_list, vehicle_capacity_list)
        if self._solver_config.vehicle_volume_capacity_constraint:
            vehicle_volume_capacity_list = self.list_conversion(vehicle_number_list, vehicle_volume_capacity_list)
        vehicle_cost_per_km_list = self.list_conversion(vehicle_number_list, vehicle_cost_per_km_list)
        vehicle_cost_per_kg_list = self.list_conversion(vehicle_number_list, vehicle_cost_per_kg_list)
        vehicle_fixed_cost_list = self.list_conversion(vehicle_number_list, vehicle_fixed_cost_list)
        vehicle_average_speed_list = self.list_conversion(vehicle_number_list, vehicle_average_speed_list)
        vehicle_utilisation_lb_list = self.list_conversion(vehicle_number_list, vehicle_utilisation_lb_list)
        if self._solver_config.max_length_constraint:
            vehicle_max_route_length_list = self.list_conversion(vehicle_number_list, vehicle_max_route_length_list)
        if self._solver_config.max_node_visits_constraint:
            vehicle_max_route_node_list = self.list_conversion(vehicle_number_list, vehicle_max_route_node_list)
        if self._solver_config.vehicle_volume_capacity_constraint:
            vehicle_volume_utilisation_lb_list = self.list_conversion(vehicle_number_list, vehicle_volume_utilisation_lb_list)
        if self._solver_config.max_drop_distance_constraint:
            vehicle_max_drop_distance_list = self.list_conversion(vehicle_number_list, vehicle_max_drop_distance_list)
        if self._solver_config.mid_mile_cost:
            destinations_list = self.list_conversion(vehicle_number_list, destinations_list)
            start_list = self.list_conversion(vehicle_number_list, start_list)
        serviceable_list = self.convert_service_list(vehicle_serviceability_list, vehicles_list)
        operating_window_from_list = self.get_operating_window_from_list(self.orders)
        operating_window_to_list = self.get_operating_window_to_list(self.orders)
        if self._solver_config.daily_run:
            daily_run_list = self.get_daily_run(self.vehicles)
            vehicle_daily_run_list = self.list_conversion(vehicle_number_list, daily_run_list)
        data = {
            "distance_matrix": distance_matrix,
            "demands": order_demand_list,
            "products": product_list,
            "unique_products": unique_product_list,
            "volume_demands": order_volume_list,
            "order_id": order_id_list,
            "task_id": task_id_list,
            "order_priority": priority_list,
            "location_name": location_name_list,
            'locations': locations,

            "cap_name": vehicles_list,
            "num_vehicles": len(vehicles_list),
            "vehicle_capacities": vehicle_capacity_list,
            "vehicle_volume_capacities": vehicle_volume_capacity_list,
            "fixed_charges": vehicle_fixed_cost_list,
            "cost_per_km": vehicle_cost_per_km_list,
            "cost_per_kg": vehicle_cost_per_kg_list,
            "vehicle_average_speed": vehicle_average_speed_list,
            "vehicle_daily_run": vehicle_daily_run_list,
            "time_windows": location_time_window_list,
            "utilisation_lb": vehicle_utilisation_lb_list,
            "volume_utilisation_lb": vehicle_volume_utilisation_lb_list,
            "max_route_length": vehicle_max_route_length_list,
            "max_route_node": vehicle_max_route_node_list,
            "max_drop_distance": vehicle_max_drop_distance_list,
            "dedicate_value": dedicated,
            "loading_time": loading_time_list,
            "unloading_time": unloading_time_list,
            "vehicles_allowed": serviceable_list,
            "operating_window_from": operating_window_from_list,
            "operating_window_to": operating_window_to_list,
            "ends": destinations_list,
            "starts": start_list,

            "sku_type": sku_type_list,
            "sku_tags": sku_tags_list,
            "sku_exclusive_tags": sku_exclusive_tags_list,
            "sku_data": sku_data_dict,

            "depot": 0
        }

        return data, vehicle_data
