import pandas as pd

from route_planner.utils import logging
from route_planner.sku_variable_cost_optimization_ai_planner.utils import get_eta_for_utc, get_time_taken_for_utc

logger = logging.getLogger(__name__)


class SolverSolutionProviderV3(object):

    def __init__(self, routes_list, solver_response, orders, vehicles, products, valid_load_demands):
        self._solver_routes = routes_list
        self._solver_response = solver_response
        self._orders = orders
        self._vehicles = vehicles
        self._products = products
        self.VALID_LOAD_DEMANDS = valid_load_demands

        self._aggregated_output = None
        self._routes_list = None
        self._output = None

    def get_output(self):
        return self._output

    def get_aggregated_output(self):
        return self._aggregated_output

    def get_routes_list(self):
        return self._routes_list

    @staticmethod
    def _get_aggregated_output(routes_list, orders, vehicles, valid_load_demands):
        response = list()
        for idx, route in enumerate(routes_list):

            resp = dict(
                planning_id=idx + 1,
                veh_type_name="",
                orders="",
                load_carrying=0,
                volume_carrying=0,
                weight_utilization=0,
                volume_utilization=0,
                total_time_taken_hours=0,
                total_distance_km=0,
                cost=0
            )

            resp['total_time_taken_hours'] = route.get('total_duration_s') / 3600
            resp['total_distance_km'] = route.get('total_travel_distance_m') / 1000
            veh_id = route.get('veh_id')
            order_id_list = route.get('drop_order_id_list')

            curr_veh = SolverSolutionProviderV3.filter_values([veh_id], vehicles, col='veh_index')[0]
            curr_orders = orders[orders['order_id'].isin(order_id_list)]

            resp['veh_type_name'] = curr_veh.get('vehicle_type_name')
            resp['cost'] = route.get('cost')
            resp['orders'] = ",".join(curr_orders['task_id'])

            if valid_load_demands.get('weight'):
                load = curr_orders['load'].astype(int).sum()
                veh_weight_cap = int(curr_veh.get('weight_capacity'))
                resp['load_carrying'] = load
                resp['weight_utilization'] = (load / veh_weight_cap) * 100

            if valid_load_demands.get('volume'):
                volume = curr_orders['volume'].astype(int).sum()
                veh_volume_cap = int(curr_veh.get('volume_capacity'))
                resp['volume_carrying'] = volume
                resp['volume_utilization'] = (volume / veh_volume_cap) * 100
            response.append(resp)

        return response

    @staticmethod
    def _get_vehicle_coordinates(curr_veh):
        origin = dict()
        destination = dict()
        if curr_veh.get('veh_origin'):
            # vehicle have origin co-ordinates
            origin['latitude'] = curr_veh.get('veh_origin_lat')
            origin['longitude'] = curr_veh.get('veh_origin_long')

        if curr_veh.get('veh_destination'):
            # vehicle have origin co-ordinates
            destination['latitude'] = curr_veh.get('veh_destination_lat')
            destination['longitude'] = curr_veh.get('veh_destination_long')

        return dict(origin=origin, destination=destination)

    @staticmethod
    def _get_route_origin(curr_veh, solver_route, veh_coordinates, visit_order_ids, visit_orders_dict,
                          valid_load_demands_dict):
        origin = dict()
        transitions = solver_route.get('transitions')

        eta = transitions[0].get('startTime')
        origin['ETA'] = get_eta_for_utc(eta)

        # set vehicle load
        vehicle_loads = transitions[0].get('vehicleLoads', {})
        if 'weight' in vehicle_loads.keys() and valid_load_demands_dict.get('weight'):
            weight_dict = vehicle_loads['weight']
            origin['load'] = (int(weight_dict.get('amount', 0)))

        if 'volume' in vehicle_loads.keys() and valid_load_demands_dict.get('volume'):
            volume_dict = vehicle_loads['volume']
            origin['volume'] = (int(volume_dict.get('amount', 0)))

        # set location and coordinates

        veh_origin = veh_coordinates.get('origin')
        if {'latitude', 'longitude'}.issubset(set(veh_origin.keys())):
            origin['latitude'] = veh_origin.get('latitude')
            origin['longitude'] = veh_origin.get('longitude')
            origin['location_name'] = curr_veh.get('from_city', '')
        else:
            v0 = visit_order_ids[0]
            v0_order = visit_orders_dict.get(v0)
            origin['location_name'] = v0_order.get('from_location')
            origin['latitude'] = v0_order.get('from_latitude')
            origin['longitude'] = v0_order.get('from_longitude')

        return origin

    @staticmethod
    def _get_route_waypoints(visit_order_ids, solver_route, visit_orders_dict, valid_load_demands_dict):
        waypoints = list()
        transitions = solver_route.get('transitions')

        pickup_list = list()
        for visit_idx, visit_order_id in enumerate(visit_order_ids):
            waypoint = dict()
            visit_order = visit_orders_dict.get(visit_order_id)

            # get location and coordinates
            if visit_order_id not in pickup_list:
                pickup_list.append(visit_order_id)
                waypoint['location_name'] = visit_order.get('from_location')
                waypoint['latitude'] = visit_order.get('from_latitude')
                waypoint['longitude'] = visit_order.get('from_longitude')
                waypoint['type'] = 'pickup'
            else:
                # drop order
                waypoint['location_name'] = visit_order.get('to_location')
                waypoint['latitude'] = visit_order.get('to_latitude')
                waypoint['longitude'] = visit_order.get('to_longitude')
                waypoint['type'] = 'delivery'

            # get eta
            start_time = transitions[visit_idx].get('startTime')
            duration = int(transitions[visit_idx].get('totalDuration', 's')[:-1])
            waypoint['ETA'] = get_eta_for_utc(start_time, add_seconds=duration)

            # get load or volume
            if valid_load_demands_dict.get('weight'):
                waypoint['load'] = int(visit_order.get('load'))
            if valid_load_demands_dict.get('volume'):
                waypoint['volume'] = int(visit_order.get('volume'))

            waypoints.append(waypoint)

        return waypoints

    @staticmethod
    def _get_route_destination(curr_veh, solver_route, veh_coordinates, visit_order_ids, visit_orders_dict,
                               valid_load_demands_dict):
        destination = dict()
        transitions = solver_route.get('transitions')

        start_time = transitions[-1].get('startTime')
        duration = int(transitions[-1].get('totalDuration', 's')[:-1])
        destination['ETA'] = get_eta_for_utc(start_time, add_seconds=duration)

        # set vehicle load
        vehicle_loads = transitions[-1].get('vehicleLoads', {})
        if 'weight' in vehicle_loads.keys() and valid_load_demands_dict.get('weight'):
            weight_dict = vehicle_loads['weight']
            destination['load'] = (int(weight_dict.get('amount', 0)))

        if 'volume' in vehicle_loads.keys() and valid_load_demands_dict.get('volume'):
            volume_dict = vehicle_loads['volume']
            destination['volume'] = (int(volume_dict.get('amount', 0)))

        # set location and coordinates

        veh_destination = veh_coordinates.get('destination')
        if {'latitude', 'longitude'}.issubset(set(veh_destination.keys())):
            destination['latitude'] = veh_destination.get('latitude')
            destination['longitude'] = veh_destination.get('longitude')
            location_name = curr_veh.get('from_city', '') if curr_veh.get('return_to_origin') else curr_veh.get(
                'to_city', '')
            destination['location_name'] = location_name
        else:
            v_n_minus_1 = visit_order_ids[-1]
            v_n_minus_1_order = visit_orders_dict.get(v_n_minus_1)
            destination['location_name'] = v_n_minus_1_order.get('to_location')
            destination['latitude'] = v_n_minus_1_order.get('to_latitude')
            destination['longitude'] = v_n_minus_1_order.get('to_longitude')
            if valid_load_demands_dict.get('weight'):
                destination['load'] = int(v_n_minus_1_order.get('load'))
            if valid_load_demands_dict.get('volume'):
                destination['volume'] = int(v_n_minus_1_order.get('volume'))

        return destination

    @staticmethod
    def _get_routes(solver_routes, orders, vehicles, valid_load_demands_dict):
        routes_list = list()

        for solver_route in solver_routes:
            route = dict()

            # get current vehicle
            veh_id = solver_route.get('veh_id')
            curr_veh = vehicles[vehicles['veh_index'] == veh_id]
            curr_veh = curr_veh.to_dict(orient='records')[0]

            # get visit
            visit_order_ids = solver_route.get('visit_order_id_list')
            visit_orders = orders[orders['order_id'].isin(visit_order_ids)]
            visit_orders_dict = visit_orders.to_dict(orient='index')

            # get valid vehicle lat/long
            veh_coordinates = SolverSolutionProviderV3._get_vehicle_coordinates(curr_veh)

            # get origin
            origin_dict = SolverSolutionProviderV3._get_route_origin(curr_veh, solver_route, veh_coordinates,
                                                                     visit_order_ids, visit_orders_dict,
                                                                     valid_load_demands_dict)

            # get waypoints
            waypoints_list = SolverSolutionProviderV3._get_route_waypoints(visit_order_ids, solver_route,
                                                                           visit_orders_dict, valid_load_demands_dict)

            # get destination
            destination_dict = SolverSolutionProviderV3._get_route_destination(curr_veh, solver_route, veh_coordinates,
                                                                               visit_order_ids, visit_orders_dict,
                                                                               valid_load_demands_dict)

            route['origin'] = origin_dict
            route['waypoints'] = waypoints_list
            route['destination'] = destination_dict
            routes_list.append(route)
        return routes_list

    @staticmethod
    def get_route_name(route):
        route_name = list()
        origin = route.get("origin")
        waypoints = route.get("waypoints")
        destination = route.get("destination")
        route_name.append(origin.get("location_name", "") + " (origin)")
        for waypoint in waypoints:
            visit_type = " (pickup)" if waypoint.get("type") == "pickup" else " (drop)"
            route_name.append(waypoint.get("location_name", "") + visit_type)

        route_name.append(destination.get("location_name", "") + " (destination)")
        return " -> ".join(route_name)

    @staticmethod
    def _get_route_trips(visit_order_list, visit_orders_dict):
        trips = list()
        trip = list()

        # first visit coordinates
        first_visit = visit_orders_dict.get(visit_order_list[0])
        first_visit_coord = tuple((first_visit.get('from_latitude'), first_visit.get('from_longitude')))

        pickups = list()

        route_visit_coordinates_list = list()
        trip_visit_coordinates = list()

        trip_visit_coordinates.append(first_visit_coord)
        trip_id = 0
        visit_to_trip_index_map = dict()
        for visit_index, visit_order_id in enumerate(visit_order_list):
            curr_visit_order = visit_orders_dict.get(visit_order_id)

            if visit_order_id not in pickups:
                pickups.append(visit_order_id)
                # pickup visit
                curr_visit_coord = tuple(
                    (curr_visit_order.get('from_latitude'), curr_visit_order.get('from_longitude')))
                trip_visit_coordinates.append(curr_visit_coord)

                if trip_visit_coordinates[-1] == trip_visit_coordinates[0] and not (
                        trip_visit_coordinates[-2] == trip_visit_coordinates[-1]):
                    trips.append(trip)

                    trip = list()
                    trip_id += 1
                    trip_visit_coordinates = list()

                    route_visit_coordinates_list.append(trip_visit_coordinates[:-1])
                    trip_visit_coordinates.append(curr_visit_coord)

            else:
                # drop vist
                curr_visit_coord = tuple(
                    (curr_visit_order.get('to_latitude'), curr_visit_order.get('to_longitude')))
                trip_visit_coordinates.append(curr_visit_coord)

            trip.append(visit_index)
            visit_to_trip_index_map[visit_index] = trip_id
        trips.append(trip)

        return trips, visit_to_trip_index_map

    @staticmethod
    def _get_trip_details(trips, visit_order_list, visit_orders_dict, transitions, valid_load_demands_dict):
        # total load, volume & distance
        visit_index_type_map = SolverSolutionProviderV3._get_visit_index_to_pickup_map(visit_order_list)

        trips_details = list()
        for trip_index, trip in enumerate(trips):
            detail = dict(
                total_distance=0,
                total_load=0,
                total_volume=0
            )
            if valid_load_demands_dict.get('weight'):
                detail['total_load'] = sum(
                    [int(visit_orders_dict[visit_order_list[visit_idx]].get('load', 0)) for visit_idx in trip if
                     visit_index_type_map[visit_idx]])
            if valid_load_demands_dict.get('volume'):
                detail['total_volume'] = sum(
                    [int(visit_orders_dict[visit_order_list[visit_idx]].get('volume', 0)) for visit_idx in trip if
                     visit_index_type_map[visit_idx]])

            trip_distance = sum([transitions[visit_idx + 1].get('travelDistanceMeters', 0) for visit_idx in trip])

            if trip_index == 0:
                # add initial distance to first trip
                trip_distance += int(transitions[0].get('travelDistanceMeters', 0))
            detail['total_distance'] = trip_distance

            trips_details.append(detail)
        return trips_details

    @staticmethod
    def _get_visit_index_to_pickup_map(visit_order_list):
        response = dict()
        pickups = list()
        for visit_index, visit_order in enumerate(visit_order_list):
            if visit_order not in pickups:
                response[visit_index] = True
                pickups.append(visit_order)
            else:
                response[visit_index] = False
        return response

    @staticmethod
    def filter_values(values: list, df: pd.DataFrame, col: str, orient='records'):
        """
        Return filtered rows in DataFrame
        :param values: List of values to filter
        :param df:  DataFrame
        :param col: Column in DataFrame to be filtered
        :param orient: orientation of results
        :return: list of dicts
        """
        filter_bool = df[col].isin(values)
        return df[filter_bool].to_dict(orient=orient)

    @staticmethod
    def get_trip_data(visit_order_ids, visit_orders, transitions, valid_load_demands_dict):
        trips, visit_to_trip_index_map = SolverSolutionProviderV3._get_route_trips(visit_order_ids, visit_orders)
        trips_details = SolverSolutionProviderV3._get_trip_details(trips, visit_order_ids, visit_orders, transitions,
                                                                   valid_load_demands_dict)
        return trips_details, visit_to_trip_index_map

    @staticmethod
    def get_rolling_travel_distance(transitions):
        prev_sum = 0
        rolling_travel_distance = list()
        for idx, transit in enumerate(transitions):
            prev_sum += transitions[idx].get('travelDistanceMeters', 0)
            rolling_travel_distance.append(prev_sum)
        return rolling_travel_distance

    @staticmethod
    def get_route_output(idx, route, route_name, curr_veh, transitions, vehicle_start_time, visit_order_ids,
                         visit_orders, trips_details, visit_to_trip_index_map, rolling_travel_distance,
                         solver_response, valid_load_demands_dict, products):
        response = list()
        pickups = list()
        for visit_idx, visit_order_id in enumerate(visit_order_ids):

            if visit_order_id not in pickups:
                # pickup
                pickups.append(visit_order_id)
                continue
            # delivery
            order = visit_orders.get(visit_order_id)
            sku = order.get('sku', "")
            sku = "" if sku in solver_response.get('extra_product_list') else sku
            sku_class = ""
            if sku:
                curr_prod = SolverSolutionProviderV3.filter_values([sku], products, col='sku')[0]
                sku_class = curr_prod.get('sku_category', '')

            resp = dict(
                planning_id=idx + 1,
                route_name=route_name,
                veh_type_name=curr_veh.get('vehicle_type_name'),
                weight_utilization=0,
                volume_utilization=0,
                order=order.get('task_id'),
                sku=sku,
                sku_class=sku_class,
                from_address=order.get("from_location"),
                to_address=order.get("to_location"),
                load=0,
                volume=0,
                total_distance_km=0,
                time_taken_hours=0,
                cost=0,
                skipped_shipment_code=""
            )

            # trips data
            curr_trip_detail = trips_details[visit_to_trip_index_map[visit_idx]]

            if valid_load_demands_dict.get('weight'):
                resp['load'] = int(order.get('load'))

                # weight utilization
                load = curr_trip_detail.get('total_load')
                veh_weight_cap = int(curr_veh.get('weight_capacity'))
                resp['weight_utilization'] = (load / veh_weight_cap) * 100

            if valid_load_demands_dict.get('volume'):
                resp['volume'] = int(order.get('volume'))

                # Volume Utilization
                volume = curr_trip_detail.get('total_volume')
                veh_volume_cap = int(curr_veh.get('volume_capacity'))
                resp['volume_utilization'] = (volume / veh_volume_cap) * 100

            # get eta
            start_time = transitions[visit_idx].get('startTime')
            duration = int(transitions[visit_idx].get('totalDuration', 's')[:-1])
            resp['time_taken_hours'] = get_time_taken_for_utc(vehicle_start_time, start_time,
                                                              add_seconds=duration) / 3600

            # cost
            resp['cost'] = route.get('cost')

            # Get rolling distance
            resp['total_distance_km'] = rolling_travel_distance[visit_idx] / 1000
            response.append(resp)
        return response

    @staticmethod
    def get_output_skipped_shipments(solver_response, orders):
        response = list()
        skipped_shipments = solver_response.get('skippedShipments')
        skipped_orders_map = SolverSolutionProviderV3.skipped_shipments_parse(skipped_shipments)
        for skip_order_id in skipped_orders_map.keys():
            skip_order = orders[orders['order_id'] == skip_order_id]
            skip_order = skip_order.to_dict(orient='records')[0]
            skip_resp = dict()
            skip_resp['order'] = skip_order.get('task_id')
            sku = skip_order.get('sku', "")
            skip_resp['sku'] = "" if sku in solver_response.get('extra_product_list') else sku
            skip_resp['from_address'] = skip_order.get('from_location')
            skip_resp['to_address'] = skip_order.get('to_location')
            skip_resp['skipped_shipment_code'] = skipped_orders_map[skip_order_id]
            skip_resp['load'] = skip_order.get('load')
            skip_resp['volume'] = skip_order.get('volume')
            response.append(skip_resp)
        return response

    @staticmethod
    def _get_output(solver_routes, solver_response, routes_list, orders, vehicles, products, valid_load_demands_dict):
        response = list()
        for idx, route in enumerate(solver_routes):
            # init
            veh_id = route.get('veh_id')
            curr_veh = SolverSolutionProviderV3.filter_values([veh_id], vehicles, col='veh_index')[0]
            transitions = route.get('transitions')
            vehicle_start_time = transitions[0].get('startTime')

            visit_order_ids = route.get('visit_order_id_list')
            visit_orders = SolverSolutionProviderV3.filter_values(visit_order_ids, orders, col='order_id',
                                                                  orient='index')

            # get trip data
            trips_details, visit_to_trip_index_map = SolverSolutionProviderV3.get_trip_data(visit_order_ids,
                                                                                            visit_orders, transitions,
                                                                                            valid_load_demands_dict)

            rolling_travel_distance = SolverSolutionProviderV3.get_rolling_travel_distance(transitions)

            route_name = SolverSolutionProviderV3.get_route_name(routes_list[idx])

            kwargs = dict(
                idx=idx,
                route=route,
                route_name=route_name,
                curr_veh=curr_veh,
                transitions=transitions,
                vehicle_start_time=vehicle_start_time,
                visit_order_ids=visit_order_ids,
                visit_orders=visit_orders,
                trips_details=trips_details,
                visit_to_trip_index_map=visit_to_trip_index_map,
                rolling_travel_distance=rolling_travel_distance,
                solver_response=solver_response,
                valid_load_demands_dict=valid_load_demands_dict,
                products=products

            )
            route_output = SolverSolutionProviderV3.get_route_output(**kwargs)
            response.extend(route_output)

        # Get Skipped Shipments
        if 'skippedShipments' in solver_response.keys():
            skip_response = SolverSolutionProviderV3.get_output_skipped_shipments(solver_response, orders)
            response.extend(skip_response)
        return response

    @staticmethod
    def skipped_shipments_parse(skipped_shipments):
        response = dict()
        for skip_ship in skipped_shipments:
            codes = "CODE_UNSPECIFIED"
            if skip_ship.get('reasons'):
                code_list = list(set([reason.get('code') for reason in skip_ship.get('reasons')]))
                codes = ",".join(list(set(code_list)))
            label = int(skip_ship.get('label', 0))
            response[label] = codes
        return response

    def solve(self):

        aggregated_output = self._get_aggregated_output(self._solver_routes, self._orders, self._vehicles,
                                                        self.VALID_LOAD_DEMANDS)
        routes_list = self._get_routes(self._solver_routes, self._orders, self._vehicles, self.VALID_LOAD_DEMANDS)
        output = self._get_output(self._solver_routes, self._solver_response, routes_list, self._orders, self._vehicles,
                                  self._products, self.VALID_LOAD_DEMANDS)

        self._output = output
        self._aggregated_output = aggregated_output
        self._routes_list = routes_list
