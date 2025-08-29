import pandas as pd
import numpy as np
import uuid
from geopy.distance import geodesic
from memoization import cached
from route_planner.utils.utils import dataframe_empty, coordinates_to_matrix


class SolverInputDataProcessor(object):

    def __init__(self, orders, vehicles, agg, all_vehicles, config):
        self.orders = orders
        self.vehicles = vehicles
        self.agg = agg
        self.all_vehicles = all_vehicles
        self._solver_config = config

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

    @staticmethod
    def dedicated_vehicles():
        dedicate = False
        return dedicate

    @staticmethod
    def num_vehicles(vehicles):
        vehicles['num_vehicles'] = 1
        vehicle_number_list = vehicles['num_vehicles'].values.tolist()
        return vehicle_number_list

    def get_locations(self, orders):
        locations_df = orders[["to_longitude", "to_latitude"]]
        locations = locations_df.values.tolist()
        depot_lat_long = list()
        lat = orders["from_latitude"].iloc[0]
        long = orders["from_longitude"].iloc[0]
        depot_lat_long.append(long)
        depot_lat_long.append(lat)
        locations.insert(0, depot_lat_long)
        return locations

    @staticmethod
    @cached(ttl=50)
    def get_distance(origin, destination):
        return int(geodesic(origin, destination).meters)

    def create_distance_matrix(self, orders, vehicles):
        locations = self.get_locations(orders)

        return coordinates_to_matrix(locations)
        # dedicated = self.dedicated_vehicles(vehicles)
        #
        # list1 = []
        # matrix = []
        # for i in range(len(locations)):
        #     for x in range(len(locations)):
        #         origin = locations[i]
        #         loc = locations[x]
        #
        #         dist = self.get_distance(origin, loc)
        #
        #         list1.append(dist)
        #
        #     matrix.append(list1)
        #     list1 = []
        #
        # # not return to depot ?
        # if dedicated:
        #     pass
        # else:
        #     for k in range(len(matrix)):
        #         matrix[k][0] = 0
        #
        # return matrix

    @staticmethod
    def get_order_id_list(orders):
        if 'order_id' in orders.columns:
            o_df = orders["order_id"]
            o_lit = o_df.values.tolist()
            o_lit.insert(0, 0)
        else:
            o_df = orders.index
            o_lit = o_df.values.tolist()
        return o_lit

    @staticmethod
    def get_task_id_list(orders):
        o_df = orders["task_id"]
        o_lit = o_df.values.tolist()
        o_lit.insert(0, 0)
        return o_lit

    @staticmethod
    def get_group_id_list(orders):
        group_id = orders['to_location'].rank(method='dense').astype(int)
        group_id_list = group_id.values.tolist()
        group_id_list.insert(0, 0)
        return group_id_list

    @staticmethod
    def get_consignee_name_list(orders):
        consignee_name = orders['consignee_name']
        consignee_name_list = consignee_name.values.tolist()
        consignee_name_list.insert(0, ' ')
        return consignee_name_list

    @staticmethod
    def get_date_time_list(orders):
        pd.set_option('display.max_columns', None)
        date_time = orders['order_date_time']
        date_time_list = date_time.values.tolist()
        date_time_list.insert(0, 0)
        return date_time_list

    @staticmethod
    def get_material_list(orders):
        material = orders['mat_code']
        material_list = material.values.tolist()
        material_list.insert(0, ' ')
        return material_list

    @staticmethod
    def get_material_count_list(orders):
        material_count = orders['count']
        material_count_list = material_count.values.tolist()
        material_count_list.insert(0, 0)
        return material_count_list

    @staticmethod
    def get_order_request_id(orders):
        o_df = orders["request_id"]
        o_list = o_df.values.tolist()
        o_list.insert(0, str(uuid.uuid4()).replace('-', ''))
        return o_list

    @staticmethod
    def get_vehicle_request_id(vehicles):
        v_df = vehicles["request_id"]
        v_list = v_df.values.tolist()
        return v_list

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
    def get_from_city(orders):
        from_city = orders["from_city"].values.tolist()
        depot_city = orders["from_city"].iloc[0]
        from_city.insert(0, depot_city)
        return from_city

    @staticmethod
    def get_to_city(orders):
        to_city = orders["to_city"].values.tolist()
        depot_city = orders["from_city"].iloc[0]
        to_city.insert(0, depot_city)
        return to_city

    @staticmethod
    def get_all_vehicle_list(all_vehicles):
        vehicle_list = all_vehicles['vehicle_type_name'].values.tolist()
        return vehicle_list

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
    def get_vehicle_contract_id_list(vehicles):
        contract_id = vehicles["contract_id"]
        contract_id_list = contract_id.values.tolist()
        return contract_id_list

    @staticmethod
    def get_lane_code_list(vehicles):
        lane_code = vehicles["lane_code"]
        lane_code_list = lane_code.values.tolist()
        return lane_code_list

    @staticmethod
    def get_all_vehicle_capacity_list(all_vehicles):
        capacity_df = all_vehicles["capacity"] * 1000
        capacity = capacity_df.values.tolist()
        return capacity

    @staticmethod
    def get_all_vehicle_tp_cost_list(all_vehicles):
        all_vehicles["tp_cost"] = all_vehicles["tp_cost"].fillna(0)
        tp_cost_df = all_vehicles["tp_cost"]
        tp_cost = tp_cost_df.values.tolist()
        return tp_cost

    @staticmethod
    def get_all_vehicle_volume_capacity_list(all_vehicles):
        capacity_df = 1000000 * all_vehicles["volumetric_capacity"]
        capacity = capacity_df.values.tolist()
        return capacity

    @staticmethod
    def get_vehicle_volume_capacity_list(vehicles):
        capacity_df = 1000000 * vehicles["volumetric_capacity"]
        capacity = capacity_df.values.tolist()
        return capacity

    @staticmethod
    def get_vehicle_fixed_cost_list(vehicles):
        vehicles["fixed_charges"] = vehicles["fixed_charges"].fillna(0)
        fixed_cost_list = vehicles["fixed_charges"].values.tolist()
        return fixed_cost_list

    @staticmethod
    def get_all_vehicle_fixed_cost_list(all_vehicles):
        all_vehicles["fixed_charges"] = all_vehicles["fixed_charges"].fillna(0)
        fixed_cost_list = all_vehicles["fixed_charges"].values.tolist()
        return fixed_cost_list

    @staticmethod
    def get_vehicle_average_speed_list(vehicles):
        average_speed_list = vehicles["average_speed"].values.tolist()
        return average_speed_list

    @staticmethod
    def get_all_vehicle_average_speed_list(all_vehicles):
        average_speed_list = all_vehicles["average_speed"].values.tolist()
        return average_speed_list

    @staticmethod
    def get_vehicle_utilisation_lb(vehicles):
        vehicles["utilisation_lb"] = vehicles["utilisation_lb"].fillna(0)
        vehicle_utilisation_lb = vehicles["utilisation_lb"].values.tolist()
        return vehicle_utilisation_lb

    @staticmethod
    def get_vehicle_volume_utilisation_lb(vehicles):
        vehicles["volume_utilisation_lb"] = vehicles["volume_utilisation_lb"].fillna(0)
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
    def list_conversion(vehicle_number_list, info_list):
        converted_list = list()
        for idx, vehicle_type in enumerate(info_list):
            converted_list.extend([vehicle_type] * int(vehicle_number_list[idx]))
        return converted_list

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

    @staticmethod
    def get_touch_point_cost(agg):
        tp_cost = list()
        tp_cost.append(int(agg['Touch Point Cost(INR)']))
        return tp_cost

    @staticmethod
    def get_num_touch_points(agg):
        tp_num = list()
        tp_num.append(int(agg['Number of Touch Points']))
        return tp_num

    def create_data_model(self):
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

        distance_matrix = self.create_distance_matrix(self.orders, self.vehicles)
        order_demand_list = self.get_order_demand_list(self.orders)
        order_request_id_list = self.get_order_request_id(self.orders)
        if self._solver_config.vehicle_volume_capacity_constraint:
            order_volume_list = self.get_order_volume_list(self.orders)
        if self._solver_config.order_id:
            order_id_list = self.get_order_id_list(self.orders)
        if self._solver_config.task_id:
            task_id_list = self.get_task_id_list(self.orders)
        group_id_list = self.get_group_id_list(self.orders)
        date_time_list = self.get_date_time_list(self.orders)
        location_name_list = self.get_location_name_list(self.orders)
        consignee_name_list = self.get_consignee_name_list(self.orders)
        material_code_list = self.get_material_list(self.orders)
        material_count_list = self.get_material_count_list(self.orders)
        from_cities_list = self.get_from_city(self.orders)
        to_cities_list = self.get_to_city(self.orders)
        location_time_window_list = self.get_location_work_windows(self.orders)
        if self._solver_config.priority_flag:
            priority_list = self.get_priority_list(self.orders)
        if self._solver_config.mid_mile_cost:
            destinations_list = self.get_destination_list(self.vehicles, self.orders)
            start_list = self.get_start_list(self.vehicles)

        vehicles_list = self.get_vehicle_list(self.vehicles)
        vehicle_request_id = self.get_vehicle_request_id(self.vehicles)
        all_vehicles_list = self.get_all_vehicle_list(self.all_vehicles)
        vehicle_capacity_list = self.get_vehicle_capacity_list(self.vehicles)
        contract_id_list = self.get_vehicle_contract_id_list(self.vehicles)
        lane_code_list = self.get_lane_code_list(self.vehicles)
        all_vehicle_capacity_list = self.get_all_vehicle_capacity_list(self.all_vehicles)
        all_vehicle_tp_cost_list = self.get_all_vehicle_tp_cost_list(self.all_vehicles)
        if self._solver_config.vehicle_volume_capacity_constraint:
            vehicle_volume_capacity_list = self.get_vehicle_volume_capacity_list(self.vehicles)
            all_vehicle_volume_capacity_list = self.get_all_vehicle_volume_capacity_list(self.all_vehicles)
        vehicle_fixed_cost_list = self.get_vehicle_fixed_cost_list(self.vehicles)
        tp_cost_list = self.get_touch_point_cost(self.agg)
        tp_num_list = self.get_num_touch_points(self.agg)
        all_vehicle_fixed_cost_list = self.get_all_vehicle_fixed_cost_list(self.all_vehicles)
        vehicle_average_speed_list = self.get_vehicle_average_speed_list(self.vehicles)
        all_vehicle_average_speed_list = self.get_all_vehicle_average_speed_list(self.all_vehicles)
        vehicle_utilisation_lb_list = self.get_vehicle_utilisation_lb(self.vehicles)
        if self._solver_config.max_drop_distance_constraint:
            vehicle_max_drop_distance_list = self.get_vehicle_max_drop_distance(self.vehicles)
        if self._solver_config.max_length_constraint:
            vehicle_max_route_length_list = self.get_vehicle_max_route_length(self.vehicles)
        if self._solver_config.max_node_visits_constraint:
            vehicle_max_route_node_list = self.get_max_node_visits(self.vehicles)
        if self._solver_config.vehicle_volume_capacity_constraint:
            vehicle_volume_utilisation_lb_list = self.get_vehicle_volume_utilisation_lb(self.vehicles)

        vehicle_data = {
            "cap_name": vehicles_list,
            "num_vehicles": len(vehicles_list),
            "vehicle_capacities": vehicle_capacity_list,
            "vehicle_volume_capacities": vehicle_volume_capacity_list,
            "vehicle_average_speed": vehicle_average_speed_list,
            "fixed_charges": vehicle_fixed_cost_list,
            "max_route_length": vehicle_max_route_length_list,
            "max_route_node": vehicle_max_route_node_list,
            "max_drop_distance": vehicle_max_drop_distance_list,
            "destination": destinations_list
        }

        all_vehicle_data = {
            "cap_name": all_vehicles_list,
            "num_vehicles": len(all_vehicles_list),
            "vehicle_capacities": all_vehicle_capacity_list,
            "vehicle_volume_capacities": all_vehicle_volume_capacity_list,
            "vehicle_average_speed": all_vehicle_average_speed_list,
            "fixed_charges": all_vehicle_fixed_cost_list,
            "tp_cost": all_vehicle_tp_cost_list,
            # "max_route_length": vehicle_max_route_length_list,
            # "max_route_node": vehicle_max_route_node_list,
            # "max_drop_distance": vehicle_max_drop_distance_list,
            # "destination": destinations_list
        }

        dedicated = self.dedicated_vehicles()
        vehicle_number_list = self.num_vehicles(self.vehicles)
        locations = self.get_locations(self.orders)

        vehicles_list = self.list_conversion(vehicle_number_list, vehicles_list)
        vehicle_request_id_list = self.list_conversion(vehicle_number_list, vehicle_request_id)
        vehicle_capacity_list = self.list_conversion(vehicle_number_list, vehicle_capacity_list)
        contract_id_list = self.list_conversion(vehicle_number_list, contract_id_list)
        lane_code_list = self.list_conversion(vehicle_number_list, lane_code_list)
        if self._solver_config.vehicle_volume_capacity_constraint:
            vehicle_volume_capacity_list = self.list_conversion(vehicle_number_list, vehicle_volume_capacity_list)
        vehicle_fixed_cost_list = self.list_conversion(vehicle_number_list, vehicle_fixed_cost_list)
        tp_cost_list = self.list_conversion(vehicle_number_list, tp_cost_list)
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
        if self._solver_config.daily_run:
            daily_run_list = self.get_daily_run(self.vehicles)
            vehicle_daily_run_list = self.list_conversion(vehicle_number_list, daily_run_list)
        data = {
            "distance_matrix": distance_matrix,
            "demands": order_demand_list,
            "volume_demands": order_volume_list,
            "order_request_id": order_request_id_list,
            "order_id": order_id_list,
            "task_id": task_id_list,
            "group_id": group_id_list,
            "date_time": date_time_list,
            "material_code": material_code_list,
            "material_count": material_count_list,
            "order_priority": priority_list,
            "location_name": location_name_list,
            "consignee_name": consignee_name_list,
            'locations': locations,
            'from_city': from_cities_list,
            'to_city': to_cities_list,
            "time_windows": location_time_window_list,

            "cap_name": vehicles_list,
            "contract_id": contract_id_list,
            "lane_code": lane_code_list,
            "vehicle_request_id": vehicle_request_id_list,
            "num_vehicles": len(vehicles_list),
            "vehicle_capacities": vehicle_capacity_list,
            "vehicle_volume_capacities": vehicle_volume_capacity_list,
            "fixed_charges": vehicle_fixed_cost_list,
            "tp_cost": tp_cost_list,
            "tp_num": tp_num_list,
            "vehicle_average_speed": vehicle_average_speed_list,
            "vehicle_daily_run": vehicle_daily_run_list,
            "utilisation_lb": vehicle_utilisation_lb_list,
            "volume_utilisation_lb": vehicle_volume_utilisation_lb_list,
            "max_route_length": vehicle_max_route_length_list,
            "max_route_node": vehicle_max_route_node_list,
            "max_drop_distance": vehicle_max_drop_distance_list,
            "dedicate_value": dedicated,
            "ends": destinations_list,
            "starts": start_list,

            "depot": 0
        }

        return data, vehicle_data, all_vehicle_data
