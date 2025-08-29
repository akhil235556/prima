import copy
import logging
import math
import numpy as np

from solvers.solver_v1.config import SolverConfigurationV1
from route_planner.utils.utils import get_now, get_eta, generate_request_id
from route_planner.utils.utils import nan_check
logger = logging.getLogger(__name__)


class SolverSolutionProviderV1(object):

    def __init__(self, routing, manager, solution, data, config, from_city=None, to_city=None):
        self._routing = routing
        self._manager = manager
        self._solution = solution
        self._data = data
        self._solver_config = config
        self._routes = []
        self._confusion_matrix = []
        self._aggregated_output = []
        self._solver_config = config
        self.from_city = from_city
        self.to_city = to_city

    def get_routes(self):
        return self._routes

    def get_confusion_matrix(self):
        return self._confusion_matrix

    def get_aggregated_output(self):
        return self._aggregated_output

    @staticmethod
    def get_vehicle_details(data, config):
        vehicle_type_data = data['vehicles']
        vehicle_types = data['vehicles']['num_vehicles']
        vehicles_data_list = []
        for vehicle_id in range(vehicle_types):
            vehicle_info_dict = dict()
            vehicle_info_dict['vehicle_type'] = vehicle_type_data['cap_name'][vehicle_id]
            vehicle_info_dict['cost_per_kg'] = vehicle_type_data['cost_per_kg'][vehicle_id]
            vehicle_info_dict['cost_per_km'] = (vehicle_type_data['cost_per_km'][vehicle_id]) * 1000
            vehicle_info_dict['capacity'] = vehicle_type_data['vehicle_capacities'][vehicle_id] / 1000
            if config.vehicle_volume_capacity_constraint:
                vehicle_info_dict['volume_capacity'] = vehicle_type_data['vehicle_volume_capacities'][vehicle_id] / 1000000
            vehicle_info_dict['average_speed'] = vehicle_type_data['vehicle_average_speed'][vehicle_id]
            vehicle_info_dict['fixed_charges'] = vehicle_type_data['fixed_charges'][vehicle_id]
            vehicles_data_list.append(vehicle_info_dict)
        return vehicles_data_list

    @staticmethod
    def generate_uuid():
        return generate_request_id()

    @staticmethod
    def calculate_time_taken(node_distance_list, node_absolute_time_list, node_service_time_list, vehicles_avg_speed_list, vehicles_daily_limit_list):
        def_dist = vehicles_daily_limit_list[-1]
        # AVG_SPEED = route_planner.constants.app_constants.AVERAGE_VEHICLE_SPEED
        AVG_SPEED = vehicles_avg_speed_list[-1]

        calculate_time_list = list()
        for idx, d in enumerate(node_distance_list):

            temp_time_taken = node_absolute_time_list[idx]*60

            if d > def_dist:
                temp_time_taken = 0
                mod_distance = d % def_dist
                div_distance = d // def_dist
                if div_distance > 0:
                    # complete days
                    temp_time_taken += div_distance*(24*60)
                if mod_distance:
                    # add remainder time
                    delta_time = mod_distance / AVG_SPEED
                    temp_time_taken += delta_time*60

            logger.info(f"Average Speed: {AVG_SPEED}")
            logger.info(f"Daily Distance Limit: {def_dist}")
            logger.info(f"Node Distance: {node_distance_list[idx]}")
            logger.info(f"Absolute Time: {node_absolute_time_list[idx]}")
            logger.info(f"Augmented Time: {temp_time_taken / 60}")

            if not calculate_time_list:
                calculate_time_list.append(round((temp_time_taken / 60), 2) + node_service_time_list[idx])
            else:
                calculate_time_list.append(round((temp_time_taken / 60), 2) + (calculate_time_list[-1]) + node_service_time_list[idx])
            logger.info(f"Service Time: {node_service_time_list[idx]}")
            logger.info(f"Rolling Time: {calculate_time_list}")

        if calculate_time_list:
            logger.info(f"Service Time Added: {calculate_time_list}")
        return calculate_time_list

    @staticmethod
    def _get_routes(data, manager, routing, solution, config, from_city, to_city):
        # TODO: set extra_products_list in data
        extra_products_list = data.get('extra_products_list')

        _now = get_now()
        routes_data_list = list()
        vehicles_data_list = list()

        if config.welded_weight_capacity_constraint and not nan_check(data['demands'][0]):
            welded_weight_dimension = routing.GetDimensionOrDie('weldedWeight')
        if config.welded_volume_capacity_constraint and not nan_check(data['volume_demands'][0]):
            welded_volume_dimension = routing.GetDimensionOrDie('weldedVolume')
        distance_dimension = routing.GetDimensionOrDie('Distance')
        vehicle_time_dimension = routing.GetDimensionOrDie('VehicleTimeWithServiceTime')

        logger.info(f'Objective: {solution.ObjectiveValue()}')
        # Display dropped nodes.
        dropped_nodes = 'Dropped nodes:'
        for node in range(routing.Size()):
            if routing.IsStart(node) or routing.IsEnd(node):
                continue
            if solution.Value(routing.NextVar(node)) == node:
                dropped_nodes += ' {}'.format(manager.IndexToNode(node))

        # FOR EACH VEHICLE
        to_location_list = list()

        for vehicle_id in range(data['num_vehicles']):
            vehicle_node_details_list = list()
            sku_details_list = list()
            skus = list()
            welded_weight_quantity = None
            welded_volume_quantity = None

            product = ""

            route = ''
            route_id = ''
            task_id = 0
            order_id = 0
            route_cost = 0
            route_load = 0
            route_volume = 0
            route_service_time = 0
            node_distance_list = list()
            node_time_list = list()
            node_absolute_time_list = list()
            node_service_time_list = list()
            vehicles_avg_speed_list = list()
            vehicles_daily_limit_list = list()

            vehicle_type = data['cap_name'][vehicle_id]

            vehicle_route_index = routing.Start(vehicle_id)
            vehicle_route_node = manager.IndexToNode(vehicle_route_index)

            # iterate on each node visited by vehicle
            route_id = SolverSolutionProviderV1.generate_uuid()
            while not routing.IsEnd(vehicle_route_index):
                sku_details = dict()
                location_id = vehicle_route_node
                if config.task_id:
                    task_id = data['task_id'][vehicle_route_node]
                if config.order_id:
                    order_id = int(data['order_id'][vehicle_route_node])
                location_name = data['location_name'][manager.IndexToNode(vehicle_route_index)]
                if config.vehicle_weight_capacity_constraint and not nan_check(data['demands'][vehicle_route_node]):
                    load = data['demands'][vehicle_route_node]/1000
                elif config.vehicle_weight_capacity_constraint and nan_check(data['demands'][vehicle_route_node]):
                    load = ""
                else:
                    load = 0
                if config.vehicle_volume_capacity_constraint and not nan_check(data['volume_demands'][vehicle_route_node]):
                    volume = data['volume_demands'][vehicle_route_node]/1000000
                elif config.vehicle_volume_capacity_constraint and nan_check(data['volume_demands'][vehicle_route_node]):
                    volume = ""
                else:
                    volume = 0
                latitude = data['locations'][vehicle_route_node][0]
                longitude = data['locations'][vehicle_route_node][1]
                if config.vehicle_weight_capacity_constraint and not nan_check(data['demands'][vehicle_route_node]):
                    route_load += data['demands'][vehicle_route_node]
                elif config.vehicle_weight_capacity_constraint and nan_check(data['demands'][vehicle_route_node]):
                    route_load = ""
                else:
                    route_load += 0
                if config.vehicle_volume_capacity_constraint and not nan_check(data['volume_demands'][vehicle_route_node]):
                    route_volume += data['volume_demands'][vehicle_route_node]
                elif config.vehicle_volume_capacity_constraint and nan_check(data['volume_demands'][vehicle_route_node]):
                    route_volume = ""
                else:
                    route_volume += 0
                if config.products_flag:
                    product = data['products'][vehicle_route_node]
                if vehicle_route_node == 0:
                    pass
                else:
                    route_service_time += data['loading_time'][vehicle_route_node - 1]
                    route_service_time += data['unloading_time'][vehicle_route_node - 1]

                dist_var = distance_dimension.CumulVar(vehicle_route_index)
                node_distance = solution.Value(dist_var)
                time_var = vehicle_time_dimension.CumulVar(vehicle_route_index)
                time_taken = round((solution.Value(time_var)) / 60, 2)
                eta = get_eta(_now, time_taken)
                route += ' {0} ->'.format(location_name)
                #  avg speed and daily_limit
                if config.daily_run:
                    vehicles_daily_limit_list.append(data['vehicle_daily_run'][vehicle_id])
                    vehicles_avg_speed_list.append(data['vehicle_average_speed'][vehicle_id])

                    # calculate node absolute distance
                    if not node_distance_list:
                        if not vehicle_route_node == 0:
                            node_distance_list.append(node_distance / 1000)
                    else:
                        node_distance_list.append((node_distance / 1000) - sum(node_distance_list))

                    # calculate node absolute time
                    if not node_time_list:
                        if not vehicle_route_node == 0:
                            node_time_list.append(time_taken)
                            node_absolute_time_list.append(time_taken - data['loading_time'][vehicle_route_node - 1])
                            node_service_time_list.append(data['loading_time'][vehicle_route_node - 1])
                    else:
                        node_service_time = data['loading_time'][vehicle_route_node - 1] + data['unloading_time'][vehicle_route_node - 1]

                        node_time_list.append((( time_taken) - sum(node_time_list)))
                        node_absolute_time_list.append(node_time_list[-1] - node_service_time)
                        node_service_time_list.append(node_service_time)


                previous_index = vehicle_route_index
                vehicle_route_index = solution.Value(routing.NextVar(vehicle_route_index))
                vehicle_route_node = manager.IndexToNode(vehicle_route_index)

                node_cost = routing.GetArcCostForVehicle(
                    previous_index, vehicle_route_index, vehicle_id)
                route_cost += node_cost

                vehicle_node_details = {
                    'route_id': route_id,
                    'order_id': order_id,
                    'location_id': int(location_id),
                    'location_name': location_name,
                    'load': load,
                    'volume': volume,
                    'time_taken': time_taken,
                    'ETA': eta,
                    'vehicle_type': vehicle_type,
                    'cost': node_cost,
                    'latitude': latitude,
                    'longitude': longitude,
                    'distance': node_distance / 1000
                }
                if config.products_flag and product != '0':
                    if product in extra_products_list:
                        product = ''
                        product_class = ''
                    elif product in data['sku_data'].keys():
                        product_class = data['sku_data'][product].get('product_class', "")
                    else:
                        product_class = None
                    sku_details = {
                        'route_id': route_id,
                        'order_id': task_id,
                        'location_name': location_name,
                        'sku': product,
                        'product_class': product_class,
                        'weight': load,
                        'volume': volume,
                        'time_taken': time_taken,
                        'distance': node_distance / 1000
                    }
                    skus.append(product)

                _sla = data['time_windows'][vehicle_node_details['location_id']][1]
                vehicle_node_details_list.append(vehicle_node_details)
                sku_details_list.append(sku_details)

            if config.daily_run and not vehicles_daily_limit_list[-1] < 1:
                # Modify ETA

                cal_node_time_list = SolverSolutionProviderV1.calculate_time_taken(node_distance_list,
                                                                                   node_absolute_time_list,
                                                                                   node_service_time_list,
                                                                                   vehicles_avg_speed_list,
                                                                                   vehicles_daily_limit_list)

                cal_node_time_list.insert(0, 0)
                cal_node_timestamp_list = [get_eta(_now, t) for t in cal_node_time_list]

                # Modify ETA in vehicle_node_details_list

                for idx, vehicle_node in enumerate(vehicle_node_details_list):
                    vehicle_node['ETA'] = cal_node_timestamp_list[idx]
                    vehicle_node['time_taken'] = cal_node_time_list[idx]

                # Modify time taken in sku_details
                for idx, sku_detail in enumerate(sku_details_list):
                    if idx == 0:
                        # depot case empty dict
                        continue
                    sku_detail['time_taken'] = cal_node_time_list[idx]

            distance_var = distance_dimension.CumulVar(vehicle_route_index)
            route_distance = solution.Value(distance_var)
            if config.welded_weight_capacity_constraint and not nan_check(data['demands'][vehicle_route_node]):
                welded_var = welded_weight_dimension.CumulVar(vehicle_route_index)
                welded_weight_quantity = solution.Value(welded_var)
            if config.welded_volume_capacity_constraint and not nan_check(data['volume_demands'][vehicle_route_node]):
                welded_vol_var = welded_volume_dimension.CumulVar(vehicle_route_index)
                welded_volume_quantity = solution.Value(welded_vol_var)

            if data['dedicate_value']:
                depot_name = data['location_name'][0]
                route += f' {depot_name}'

            time_var = vehicle_time_dimension.CumulVar(vehicle_route_index)
            route_time = round(solution.Value(time_var) / 60, 2)

            if not route_distance:
                continue

            if config.sku_planning:
                skus = ",".join(skus) if len(skus) > 1 else skus[0]

            if config.vehicle_weight_capacity_constraint and not nan_check(data['demands'][vehicle_route_node]):
                welded_load_weight = (welded_weight_quantity / 1000) if welded_weight_quantity else 0
            if config.vehicle_volume_capacity_constraint and not nan_check(data['volume_demands'][vehicle_route_node]):
                welded_load_volume = (welded_volume_quantity / 1000000) if welded_volume_quantity else 0

            if config.mid_mile_cost:
                if config.order_id:
                    order_id = int(data['order_id'][vehicle_route_node])
                route += ' {0}'.format(data['location_name'][vehicle_route_node])
                if not nan_check(data['demands'][vehicle_route_node]):
                    route_load += data['demands'][vehicle_route_node]
                if not nan_check(data['volume_demands'][vehicle_route_node]):
                    route_volume += data['volume_demands'][vehicle_route_node]
                location_id = vehicle_route_node
                location_name = data['location_name'][vehicle_route_node]
                if config.vehicle_weight_capacity_constraint and not nan_check(data['demands'][vehicle_route_node]):
                    load = data['demands'][vehicle_route_node] / 1000
                elif config.vehicle_weight_capacity_constraint and nan_check(data['demands'][vehicle_route_node]):
                    load = ""
                else:
                    load = 0
                if config.vehicle_volume_capacity_constraint and not nan_check(
                        data['volume_demands'][vehicle_route_node]):
                    volume = data['volume_demands'][vehicle_route_node] / 1000000
                elif config.vehicle_volume_capacity_constraint and nan_check(
                        data['volume_demands'][vehicle_route_node]):
                    volume = ""
                else:
                    volume = 0
                time_var = vehicle_time_dimension.CumulVar(vehicle_route_index)
                route_time = round(solution.Value(time_var) / 60, 2)
                eta = get_eta(_now, route_time)
                latitude = data['locations'][vehicle_route_node][0]
                longitude = data['locations'][vehicle_route_node][1]
                dist_var = distance_dimension.CumulVar(vehicle_route_index)
                node_distance = solution.Value(dist_var)

                if config.daily_run:
                    vehicles_daily_limit_list.append(data['vehicle_daily_run'][vehicle_id])
                    vehicles_avg_speed_list.append(data['vehicle_average_speed'][vehicle_id])

                    # calculate node absolute distance
                    if not node_distance_list:
                        if not vehicle_route_node == 0:
                            node_distance_list.append(node_distance / 1000)
                    else:
                        node_distance_list.append((node_distance / 1000) - sum(node_distance_list))

                    # calculate node absolute time
                    if not node_time_list:
                        if not vehicle_route_node == 0:
                            node_time_list.append(route_time)
                            node_absolute_time_list.append(route_time - data['loading_time'][vehicle_route_node - 1])
                            node_service_time_list.append(data['loading_time'][vehicle_route_node - 1])
                    else:
                        node_service_time = data['loading_time'][vehicle_route_node - 1] + data['unloading_time'][vehicle_route_node - 1]

                        node_time_list.append(((route_time) - sum(node_time_list)))
                        node_absolute_time_list.append(node_time_list[-1] - node_service_time)
                        node_service_time_list.append(node_service_time)

                vehicle_node_details = {
                    'route_id': route_id,
                    'order_id': order_id,
                    'location_id': int(location_id),
                    'location_name': location_name,
                    'load': load,
                    'volume': volume,
                    'time_taken': route_time,
                    'ETA': eta,
                    'vehicle_type': vehicle_type,
                    'cost': node_cost,
                    'latitude': latitude,
                    'longitude': longitude,
                    'distance': node_distance / 1000
                }
                vehicle_node_details_list.append(vehicle_node_details)

            if config.daily_run and not vehicles_daily_limit_list[-1] < 1 and config.mid_mile_cost:
                # Modify ETA

                cal_node_time_list = SolverSolutionProviderV1.calculate_time_taken(node_distance_list,
                                                                                   node_absolute_time_list,
                                                                                   node_service_time_list,
                                                                                   vehicles_avg_speed_list,
                                                                                   vehicles_daily_limit_list)

                cal_node_time_list.insert(0, 0)
                cal_node_timestamp_list = [get_eta(_now, t) for t in cal_node_time_list]

                # Modify ETA in vehicle_node_details_list

                for idx, vehicle_node in enumerate(vehicle_node_details_list):
                    vehicle_node['ETA'] = cal_node_timestamp_list[idx]
                    vehicle_node['time_taken'] = cal_node_time_list[idx]

            if config.vehicle_weight_capacity_constraint and not nan_check(data['demands'][vehicle_route_node]):
                route_load = route_load
                vehicle_utilization_percentage = (route_load / data['vehicle_capacities'][vehicle_id]) * 100
            else:
                vehicle_utilization_percentage = ""

            if config.vehicle_volume_capacity_constraint and not nan_check(data['volume_demands'][vehicle_route_node]):
                route_volume = route_volume
                vehicle_volume_utilization_percentage = ((route_volume / data['vehicle_volume_capacities'][vehicle_id]) * 100)
            else:
                vehicle_volume_utilization_percentage = ""

            if not nan_check(data['cost_per_km'][vehicle_id]):
                routing_cost = route_distance * data['cost_per_km'][vehicle_id] + data['fixed_charges'][vehicle_id]
            elif not nan_check(data['cost_per_kg'][vehicle_id]):
                routing_cost = route_load * data['cost_per_kg'][vehicle_id] / 1000 + data['fixed_charges'][vehicle_id]
            else:
                routing_cost = data['fixed_charges'][vehicle_id]
            depot_name = data['location_name'][0]
            router = f' {depot_name} -> {location_name}'
            if np.isnan(data['demands']).all():
                demands = route_volume/1000000
            else:
                demands = route_load /1000
            if next((item for item in routes_data_list if item["route"] == route), None) and config.mid_mile_cost:
                pass
            elif not next((item for item in routes_data_list if item["route"] == route), None) \
                    and location_name in to_location_list \
                    and route == router \
                    and config.mid_mile_cost:
                pass
            else:
                if route == router and demands < 1:
                    pass
                else:
                    to_location_list.append(location_name)
                    route_info_dict = dict()
                    route_info_dict['route_id'] = route_id
                    route_info_dict['route'] = route
                    route_info_dict['distance'] = route_distance / 1000
                    route_info_dict['vehicle_type'] = vehicle_type
                    route_info_dict['cost'] = routing_cost
                    route_info_dict['time_taken'] = vehicle_node_details_list[-1]['time_taken']
                    if config.vehicle_weight_capacity_constraint and not nan_check(data['demands'][vehicle_route_node]):
                        route_info_dict['vehicle_utilisation'] = round(vehicle_utilization_percentage, 3)
                    if config.vehicle_volume_capacity_constraint and not nan_check(data['volume_demands'][vehicle_route_node]):
                        route_info_dict['vehicle_volume_utilisation'] = round(vehicle_volume_utilization_percentage, 3)
                    if config.vehicle_weight_capacity_constraint and not nan_check(data['demands'][vehicle_route_node]):
                        route_info_dict['load'] = route_load/1000
                    if config.vehicle_volume_capacity_constraint and not nan_check(data['volume_demands'][vehicle_route_node]):
                        route_info_dict['volume'] = route_volume/1000000
                    route_info_dict['service_time'] = route_service_time
                    route_info_dict['skus'] = skus
                    route_info_dict['sku_details'] = sku_details_list
                    route_info_dict['node_details'] = vehicle_node_details_list
                    route_info_dict['origin'] = vehicle_node_details_list[0]
                    route_info_dict['destination'] = vehicle_node_details_list[-1]
                    route_info_dict['waypoints'] = vehicle_node_details_list[1:-1]
                    if config.vehicle_weight_capacity_constraint and not nan_check(data['demands'][vehicle_route_node]):
                        route_info_dict['welded_load_weight'] = welded_load_weight
                    if config.vehicle_volume_capacity_constraint and not nan_check(data['volume_demands'][vehicle_route_node]):
                        route_info_dict['welded_load_volume'] = welded_load_volume
                    route_info_dict['to_city'] = to_city
                    route_info_dict['from_city'] = from_city
                    routes_data_list.append(route_info_dict)
        if config.mid_mile_cost:
            for location in to_location_list:
                if to_location_list.count(location) > 1:
                    depot_name = data['location_name'][0]
                    routing = f' {depot_name} -> {location_name}'
                    routes_data_list[:] = [d for d in routes_data_list if d.get('route') != routing]

        return routes_data_list

    @staticmethod
    def _get_confusion_matrix(routes1, vehicles, config):
        def _flat(routes):
            _flat_route = []
            for routed in routes:
                for vehicle in routed.get('other_vehicles'):
                    _dict = {}
                    _dict.update(**routed)
                    _dict.update(**vehicle)
                    if vehicle.get('vehicle_type') == routed.get('vehicle_type'):
                        _dict['selected_vehicle'] = "CHECK"
                    _dict.pop("other_vehicles")
                    _flat_route.append(_dict)
            return _flat_route

        matrix = copy.deepcopy(routes1)
        for route in matrix:
            route['other_vehicles'] = []
            if route.get('distance') != 0:
                for vehicle in vehicles:
                    _vt = copy.copy(vehicle)
                    if config.products_flag:
                        _vt['skus'] = route.get('skus')
                    if route.get('vehicle_type') != vehicle.get('vehicle_type'):
                        # travel_time = (route.get('distance') / vehicle.get('average_speed')) + route.get('service_time')
                        if not math.isnan(vehicle.get('cost_per_km')):
                            _vt['cost'] = route.get('distance') * vehicle.get('cost_per_km') + vehicle.get('fixed_charges')
                        elif not math.isnan(vehicle.get('cost_per_kg')):
                            _vt['cost'] = route.get('load') * vehicle.get('cost_per_kg') + vehicle.get('fixed_charges')
                        else:
                            _vt['cost'] = vehicle.get('fixed_charges')
                        _vt['time_taken'] = route.get('time_taken')
                        _vt['route_id'] = route.get('route_id')
                        # _vt['time_taken'] = round(route.get('distance') / vehicle.get('average_speed'), 2)
                        if config.vehicle_weight_capacity_constraint and route.get('load') is not None:
                            _vt['vehicle_utilisation'] = (route.get('load') / vehicle.get('capacity')) * 100
                        if config.vehicle_volume_capacity_constraint and route.get('volume') is not None:
                            _vt['vehicle_volume_utilisation'] = (route.get('volume') / vehicle.get('volume_capacity')) * 100
                    else:
                        _vt['cost'] = route.get('cost')
                        _vt['route_id'] = route.get('route_id')
                        _vt['time_taken'] = route.get('time_taken')
                        _vt['vehicle_utilisation'] = route.get('vehicle_utilisation')
                        if config.vehicle_volume_capacity_constraint:
                            _vt['vehicle_volume_utilisation'] = route.get('vehicle_volume_utilisation')

                    _vt["sla"] = route.get('sla')
                    route['other_vehicles'].append(_vt)
            else:
                continue
        return _flat(matrix)

    @staticmethod
    def _get_aggregated_output(routes, config):
        aggregated_data_list = []
        for i, route in enumerate(routes):
            if config.vehicle_volume_capacity_constraint:
                volume = route.get('volume')
                vol_ut = route.get("vehicle_volume_utilisation")
            else:
                volume = 0
                vol_ut = 0
            route_data_dict = {
                'route_id': route.get('route_id'),
                'vehicle_type': route.get('vehicle_type'),
                'load': route.get('load'),
                'volume': volume,
                'vehicle_utilisation': route.get('vehicle_utilisation'),
                'vehicle_volume_utilisation': vol_ut,
                'distance': route.get('distance'),
                'time_taken': route.get('time_taken'),
                'cost': route.get('cost'),
                'from_city': route.get('from_city'),
                'to_city': route.get('to_city'),
            }
            aggregated_data_list.append(route_data_dict)
        return aggregated_data_list

    def get_configuration(self):
        return self._solver_config

    def set_configuration(self, config: SolverConfigurationV1):
        self._solver_config = config

    def solve(self):
        config = self.get_configuration()
        routes = self._get_routes(self._data, self._manager, self._routing, self._solution, config, self.from_city, self.to_city)
        vehicles = self.get_vehicle_details(self._data, config)
        cm = self._get_confusion_matrix(routes, vehicles, config)
        aggregated_output = self._get_aggregated_output(routes, config)

        self._routes = routes
        self._confusion_matrix = cm
        self._aggregated_output = aggregated_output
