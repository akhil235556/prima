import logging

from ortools.constraint_solver import pywrapcp, routing_enums_pb2
import numpy as np
import pandas as pd
from route_planner.constants.app_constants import WELDED_TAG_NAME, WELDED_TAG_UTILISATION_PERCENTAGE_UB, \
    MINIMUM_DISTANCE_BETWEEN_DROPS
from route_planner.exceptions.exceptions import SolverException
from route_planner.vrp.sku_fixed_cost_planner.sku_fixed_solver_configuration import SkuFixedSolverConfigurationV1
from solvers.solver_v1.config import SolverConfigurationV1
from solvers.solver_v1.input_processor import SolverV1InputDataProcessor
from solvers.solver_v1.solution import SolverSolutionProviderV1
from route_planner.utils.utils import generate_request_id, get_current_timestamp, dataframe_empty


logger = logging.getLogger(__name__)


class SolverV1(object):

    _orders = None
    _vehicles = None
    _products = None
    _request_id = None

    _solver_config = None
    _solver_init_data = None

    _routing_manager = None
    _routing_model = None

    def __init__(self, orders, vehicles, products=None, request_id=None, timestamp=None, config=None,
                 extra_products=None, search_time_limit=None, from_city=None, to_city=None):
        self._orders = orders
        self._vehicles = vehicles
        self._products = products
        self._request_id = request_id or generate_request_id()
        self.timestamp = timestamp or get_current_timestamp()
        self.extra_products = extra_products
        self.from_city = from_city
        self.to_city = to_city

        if not config:
            config = SkuFixedSolverConfigurationV1.get_default_sku_fixed_configuration()
        self._solver_config = config

        # override search time limit
        if search_time_limit:
            self._solver_config.search_time_limit = search_time_limit

    def get_configuration(self):
        return self._solver_config

    def set_configuration(self, config: SolverConfigurationV1):
        self._solver_config = config

    @staticmethod
    def _init_solver_data(orders, vehicles, products, extra_products, config):
        if config.mid_mile_cost:
            destinations = vehicles['destination'].values.tolist()
            dummy_orders = orders[orders.to_location.isin(destinations)]
            dummy_orders['to_location'] = dummy_orders['to_location'].astype(str) + ' (Destination)'
            column_list = ['order_id', 'from_location', 'from_latitude', 'from_longitude', 'to_location',
                           'to_latitude', 'to_longitude']
            dummy_orders.drop(dummy_orders.columns.difference(column_list), 1, inplace=True)
            if orders['load'].isnull().values.any():
                dummy_orders.loc[:,'load'] = np.nan
            else:
                dummy_orders.loc[:, 'load'] = 0
            if orders['volume'].isnull().values.any():
                dummy_orders.loc[:,'volume'] = np.nan
            else:
                dummy_orders.loc[:, 'volume'] = 0
            dummy_orders.loc[:, 'loading_time'] = 0
            dummy_orders.loc[:, 'unloading_time'] = 0
            orders = orders.append(dummy_orders)
            vehicles['destination'] = vehicles['destination'].astype(str) + ' (Destination)'
        data, vehicle_data_model = SolverV1InputDataProcessor(orders, vehicles, products, config).create_data_model()
        data['vehicles'] = vehicle_data_model
        data['extra_products_list'] = extra_products
        return data

    @staticmethod
    def _init_routing_manager(data, config):
        if config.mid_mile_cost:
            manager = pywrapcp.RoutingIndexManager(len(data['distance_matrix']),
                                                   data['num_vehicles'], data['starts'],
                                                   data['ends'])
        else:
            manager = pywrapcp.RoutingIndexManager(
                len(data['distance_matrix']), data['num_vehicles'], data['depot']
            )
        return manager

    @staticmethod
    def _init_routing_model(manager):
        model = pywrapcp.RoutingModel(manager)
        return model

    def set_routing_params(self):
        self._solver_init_data = self._init_solver_data(self._orders, self._vehicles, self._products, self.extra_products, self._solver_config)
        self._routing_manager = self._init_routing_manager(self._solver_init_data, self._solver_config)
        self._routing_model = self._init_routing_model(self._routing_manager)

    def serviceable_vehicles_constraint(self):
        if any(self._solver_init_data['vehicles_allowed']):
            """Sets constraint on the vehicle serviceable locations"""
            for location_node, loc in enumerate(self._solver_init_data['locations']):
                allowed_vehicles = list(self._solver_init_data['vehicles_allowed'][location_node])
                if allowed_vehicles:
                    self._routing_model.VehicleVar(self._routing_manager.NodeToIndex(location_node)).SetValues(
                        allowed_vehicles)

    def distance_callback(self, from_index, to_index):
        """Returns the distance between the two nodes."""
        # Convert from routing variable Index to distance matrix NodeIndex.
        from_node = self._routing_manager.IndexToNode(from_index)
        to_node = self._routing_manager.IndexToNode(to_index)
        return self._solver_init_data['distance_matrix'][from_node][to_node]

    def add_vehicle_distance_dimension(self):
        dimension_name = "Distance"
        distance_callback_index = self._routing_model.RegisterTransitCallback(self.distance_callback)
        slack_max = 0
        capacity = 5000000
        fix_start_cumulative_to_zero = True
        self._routing_model.AddDimension(
            distance_callback_index, slack_max, capacity, fix_start_cumulative_to_zero, dimension_name)

    def add_vehicle_max_length_constraint(self, dimension_name):
        max_len = dataframe_empty(self._vehicles['max_route_length'])
        if not max_len:
            counter_dimension = self._routing_model.GetDimensionOrDie(dimension_name)
            for vehicle_id in range(self._solver_init_data['num_vehicles']):
                if pd.isna(self._solver_init_data['max_route_length'][vehicle_id]):
                    continue
                counter_dimension.SetSpanUpperBoundForVehicle((int(self._solver_init_data['max_route_length'][vehicle_id]))*1000,
                                                              vehicle_id)
    def drop_distance_callback(self, from_index, to_index):
        from_node = self._routing_manager.IndexToNode(from_index)
        to_node = self._routing_manager.IndexToNode(to_index)
        return 0 if from_node == 0 or to_node == 0 else self._solver_init_data['distance_matrix'][from_node][to_node]

    def add_vehicle_drop_distance_dimension(self):
        dimension_name = "DropDistance"
        distance_callback_index = self._routing_model.RegisterTransitCallback(self.drop_distance_callback)
        slack_max = 0
        capacity = 5000000
        fix_start_cumulative_to_zero = True
        self._routing_model.AddDimension(
            distance_callback_index, slack_max, capacity, fix_start_cumulative_to_zero, dimension_name)

    def add_vehicle_max_drop_distance_constraint(self, dimension_name):
        max_dist = dataframe_empty(self._vehicles['max_drop_distance'])
        if not max_dist:
            counter_dimension = self._routing_model.GetDimensionOrDie(dimension_name)
            for vehicle_id in range(self._solver_init_data['num_vehicles']):
                if pd.isna(self._solver_init_data['max_drop_distance'][vehicle_id]):
                    continue
                counter_dimension.SetSpanUpperBoundForVehicle(
                    (int(self._solver_init_data['max_drop_distance'][vehicle_id])) * 1000,
                    vehicle_id)

    def number_of_visits_callback(self, from_index, to_index):
        from_node = self._routing_manager.IndexToNode(from_index)
        to_node = self._routing_manager.IndexToNode(to_index)
        distance = self._solver_init_data['distance_matrix'][from_node][to_node]
        return 1 if distance > MINIMUM_DISTANCE_BETWEEN_DROPS * 1000 else 0

    def add_vehicle_max_route_node_visits_dimension(self):
        max_route = dataframe_empty(self._vehicles['max_node_visits'])
        if not max_route:
            plus_one_callback_index = self._routing_model.RegisterTransitCallback(self.number_of_visits_callback)
            dimension_name = 'Counter'
            self._routing_model.AddDimension(
                plus_one_callback_index,
                0,  # null capacity slack
                10000000,  # vehicle maximum capacities
                True,  # start cumul to zero
                dimension_name)

    def add_vehicle_max_route_node_visits_constraint(self, dimension_name):
        max_route = dataframe_empty(self._vehicles["max_node_visits"])
        if not max_route:
            counter_dimension = self._routing_model.GetDimensionOrDie(dimension_name)
            for vehicle_id in range(self._solver_init_data['num_vehicles']):
                if pd.isna(self._solver_init_data['max_route_node'][vehicle_id]):
                    continue
                if self._solver_init_data['dedicate_value']:
                    upper_bound = int(self._solver_init_data['max_route_node'][vehicle_id] + 1)
                else:
                    upper_bound = int(self._solver_init_data['max_route_node'][vehicle_id])
                counter_dimension.SetSpanUpperBoundForVehicle(upper_bound,
                                                              vehicle_id)

    def add_vehicle_fixed_cost_dimension(self):
        fixed_costing = dataframe_empty(self._vehicles['fixed_charges'])
        if not fixed_costing:
            for vehicle_id in range(self._solver_init_data['num_vehicles']):
                self._routing_model.SetFixedCostOfVehicle(int(self._solver_init_data['fixed_charges'][vehicle_id]), vehicle_id)

    def vehicle_cost_per_km_callback(self, distance_matrix, vehicle_cost_per_km, vehicle_fixed_charges):
        def _vehicle_cost_per_km_callback(from_index, to_index):
            from_node = self._routing_manager.IndexToNode(from_index)
            to_node = self._routing_manager.IndexToNode(to_index)
            cost = int(distance_matrix[from_node][to_node] * vehicle_cost_per_km)
            if from_node == 0:
                cost += vehicle_fixed_charges
            return cost

        return _vehicle_cost_per_km_callback

    def add_vehicle_cost_per_km_dimension(self):
        km_costing = dataframe_empty(self._vehicles['per_km_charges'])
        if not km_costing:
            for vehicle_id in range(self._solver_init_data['num_vehicles']):
                _vehicle_cost_per_km_callback_method = self.vehicle_cost_per_km_callback(
                    self._solver_init_data['distance_matrix'], self._solver_init_data['cost_per_km'][vehicle_id],
                    self._solver_init_data['fixed_charges'][vehicle_id])
                _vehicle_cost_per_km_callback_method_index = self._routing_model.RegisterTransitCallback(
                    _vehicle_cost_per_km_callback_method
                )
                self._routing_model.SetArcCostEvaluatorOfVehicle(
                    _vehicle_cost_per_km_callback_method_index, vehicle_id
                )

    def create_cost_callback(self, data, vehindex):
        """Created call back to get total cost between locations """

        def service_cost(node):
            from_node = self._routing_manager.IndexToNode(node)
            """ Gets the service cost for the specified location."""
            cost = data["demands"][from_node] * data['cost_per_kg'][vehindex]
            return cost

        def cost_callback(from_node, to_node):  # Changed this
            """ Returns the total costs between the two nodes """
            serv_cost = service_cost(from_node)
            from_node = self._routing_manager.IndexToNode(from_node)
            if from_node == 0:
                serv_cost += data['fixed_charges'][vehindex]
            return serv_cost

        return cost_callback

    def add_vehicle_cost_per_kg_dimension(self):
        kg_costing = dataframe_empty(self._vehicles['per_kg_charges'])
        if not kg_costing:
            for vehicle_index in range(self._solver_init_data['num_vehicles']):
                cost_callback_index = self.create_cost_callback(self._solver_init_data, vehicle_index)
                indices = self._routing_model.RegisterTransitCallback(cost_callback_index)
                self._routing_model.SetArcCostEvaluatorOfVehicle(indices, vehicle_index)

    def vehicle_time_with_service_time_callback(self, data, vehindex):
        """Created call back to get total time between locations """
        def service_time(from_node, to_node):
            unloading_time = 0
            if from_node != 0:
                unloading_time = data['unloading_time'][from_node-1] * 60

            loading_time = 0
            if to_node != 0:
                loading_time = data['loading_time'][to_node-1] * 60

            return loading_time + unloading_time

        def travel_time(from_node, to_node):
            travel_time = (data['distance_matrix'][from_node][to_node] / 1000) / data['vehicle_average_speed'][vehindex] * 60
            return travel_time

        def transit_time(from_index, to_index):
            """ Returns the total time between the two nodes """
            from_node = self._routing_manager.IndexToNode(from_index)
            to_node = self._routing_manager.IndexToNode(to_index)
            serv_time = service_time(from_node, to_node)
            trav_time = travel_time(from_node, to_node)
            total_time = serv_time + trav_time
            return total_time

        return transit_time

    def add_vehicle_time_dimension_with_service_time(self):

        _vehicle_time_callback_method_indexes = []
        for vehicle_id in range(self._solver_init_data['num_vehicles']):
            _vehicle_time_callback_method = self.vehicle_time_with_service_time_callback(self._solver_init_data, vehicle_id)
            _vehicle_time_callback_method_index = self._routing_model.RegisterTransitCallback(
                _vehicle_time_callback_method)
            _vehicle_time_callback_method_indexes.append(_vehicle_time_callback_method_index)

        dimension_name = "VehicleTimeWithServiceTime"
        slack_max = 0
        capacity = 5000000
        fix_start_cumulative_to_zero = False

        self._routing_model.AddDimensionWithVehicleTransits(
            _vehicle_time_callback_method_indexes,
            slack_max,  # null capacity slack
            capacity,  # vehicle maximum capacities
            fix_start_cumulative_to_zero,  # start cumul to zero
            dimension_name
        )

    def add_time_window_constraint(self):
        sla = dataframe_empty(self._orders['working_window_to'])
        if not sla:
            time_dimension = self._routing_model.GetDimensionOrDie("VehicleTimeWithServiceTime")

            # Add time window constraints for each location except depot.
            for location_idx, time_window in enumerate(self._solver_init_data['time_windows']):
                if location_idx == self._solver_init_data['depot']:
                    continue
                if pd.isna(time_window[1]):
                    continue
                index = self._routing_manager.NodeToIndex(location_idx)
                time_dimension.CumulVar(index).SetRange(int(time_window[0]), int(time_window[1]))

            # Add time window constraints for each vehicle start node.
            depot_idx = self._solver_init_data['depot']
            for vehicle_id in range(self._solver_init_data['num_vehicles']):
                index = self._routing_model.Start(vehicle_id)
                time_dimension.CumulVar(index).SetRange(
                    self._solver_init_data['time_windows'][depot_idx][0],
                    self._solver_init_data['time_windows'][depot_idx][1])

            # Instantiate route start and end times to produce feasible times.
            for i in range(self._solver_init_data['num_vehicles']):
                self._routing_model.AddVariableMinimizedByFinalizer(
                    time_dimension.CumulVar(self._routing_model.Start(i)))
                self._routing_model.AddVariableMinimizedByFinalizer(
                    time_dimension.CumulVar(self._routing_model.End(i)))

    def add_operating_time_window_constraint(self):
        op_tw = dataframe_empty(self._orders['operating_window_to'])
        if not op_tw:
            from_operating_time = self._solver_init_data['operating_window_from']
            to_operating_time = self._solver_init_data['operating_window_to']
            time_dimension = self._routing_model.GetDimensionOrDie("VehicleTimeWithServiceTime")
            for i in range(0, len(self._solver_init_data['locations'])):
                if i == 0:
                    continue

                solver = self._routing_model.solver()
                index = self._routing_manager.NodeToIndex(i)
                td_cvar = time_dimension.CumulVar(index)

                # if from_operating_time[i] == 0 and to_operating_time[i] == 1439:
                #     continue
                if pd.isna(to_operating_time[i]):
                    continue

                start_mins, end_mins = int(from_operating_time[i]), int(to_operating_time[i])
                current_mins = self.timestamp.hour * 60 + self.timestamp.minute

                # time window is (a, b)
                # if b < a -> 22:00 - 04:00
                # case1: t = 23:00 (1380) -> start(1320)<t<1440 or 0<t<end(240) -> True or False -> True
                # case2: t = 02:00 (120) -> start(1320)<t<1440 or 0<t<end(240) -> True or False -> True

                vehicle_mins = ((td_cvar + current_mins) % (24 * 60))
                x1 = solver.IsLessOrEqualCstVar(vehicle_mins, 1440)
                x2 = solver.IsGreaterOrEqualCstVar(vehicle_mins, start_mins)
                x = solver.IsGreaterOrEqualCstVar(x1 + x2, 2)

                y1 = solver.IsLessOrEqualCstVar(vehicle_mins, end_mins)
                y2 = solver.IsGreaterOrEqualCstVar(vehicle_mins, 0)
                y = solver.IsGreaterOrEqualCstVar(y1 + y2, 2)

                if end_mins < start_mins:
                    logger.info("*" * 500)
                    solver.Add(
                        x + y >= 1
                    )
                else:
                    solver.AddConstraint(
                        start_mins < ((td_cvar + current_mins) % (24 * 60))
                    )
                    solver.AddConstraint(
                        ((td_cvar + current_mins) % (24 * 60)) < end_mins
                    )

    def welded_capacity_callback(self, from_index):
        demand = 0
        from_node = self._routing_manager.IndexToNode(from_index)
        if from_node != 0:
            sku = self._solver_init_data['products'][from_node]
            tags = [x.lower() for x in self._solver_init_data['sku_data'][sku]['tags']]
            if WELDED_TAG_NAME in tags:
                demand = self._solver_init_data['demands'][from_node]
        return demand

    def add_welded_capacity_dimension(self):
        load = dataframe_empty(self._orders['load'])
        if not load:
            welded_capacity_callback_index = self._routing_model.RegisterUnaryTransitCallback(self.welded_capacity_callback)
            slack_max = 0
            upper_cap = WELDED_TAG_UTILISATION_PERCENTAGE_UB/100
            capacity = [upper_cap * x for x in self._solver_init_data['vehicle_capacities']]
            fix_start_cumulative_to_zero = True

            self._routing_model.AddDimensionWithVehicleCapacity(
                welded_capacity_callback_index,
                slack_max,  # null capacity slack
                capacity,  # vehicle maximum capacities
                fix_start_cumulative_to_zero,  # start cumul to zero
                "weldedWeight"
            )

    def welded_volume_capacity_callback(self, from_index):
        demand = 0
        from_node = self._routing_manager.IndexToNode(from_index)
        if from_node != 0:
            sku = self._solver_init_data['products'][from_node]
            tags = [x.lower() for x in self._solver_init_data['sku_data'][sku]['tags']]
            if WELDED_TAG_NAME in tags:
                demand = self._solver_init_data['volume_demands'][from_node]
        return demand

    def add_welded_volume_capacity_dimension(self):
        vol = dataframe_empty(self._orders['volume'])
        if not vol:
            welded_capacity_callback_index = self._routing_model.RegisterUnaryTransitCallback(self.welded_volume_capacity_callback)
            slack_max = 0
            upper_cap = WELDED_TAG_UTILISATION_PERCENTAGE_UB / 100
            capacity = [upper_cap * x for x in self._solver_init_data['vehicle_volume_capacities']]
            fix_start_cumulative_to_zero = True

            self._routing_model.AddDimensionWithVehicleCapacity(
                welded_capacity_callback_index,
                slack_max,  # null capacity slack
                capacity,  # vehicle maximum capacities
                fix_start_cumulative_to_zero,  # start cumul to zero
                "weldedVolume"
            )

    def vehicle_capacity_callback(self, from_index):
        from_node = self._routing_manager.IndexToNode(from_index)
        return self._solver_init_data['demands'][from_node]

    def add_vehicle_capacity_dimension(self, dimension_name):
        load = dataframe_empty(self._orders['load'])
        if not load:
            vehicle_capacity_callback_index = self._routing_model.RegisterUnaryTransitCallback(self.vehicle_capacity_callback)
            slack_max = 0

            capacity = self._solver_init_data['vehicle_capacities']
            fix_start_cumulative_to_zero = True

            self._routing_model.AddDimensionWithVehicleCapacity(
                vehicle_capacity_callback_index,
                slack_max,  # null capacity slack
                capacity,  # vehicle maximum capacities
                fix_start_cumulative_to_zero,  # start cumul to zero
                dimension_name
            )

    def add_vehicle_capacity_constraint(self, dimension_name):
        load = dataframe_empty(self._orders['load'])
        if not load:
            counter_dimension = self._routing_model.GetDimensionOrDie(dimension_name)
            for vehicle_id in range(self._solver_init_data['num_vehicles']):
                if self._solver_init_data['utilisation_lb'][vehicle_id] == 0:
                    continue
                lower_bound_load = int(
                    (self._solver_init_data['vehicle_capacities'][vehicle_id] * self._solver_init_data['utilisation_lb'][vehicle_id]) / 100)
                counter_dimension.SetCumulVarSoftLowerBound(self._routing_model.End(vehicle_id), lower_bound_load, 100)
                self._routing_model.ConsiderEmptyRouteCostsForVehicle(False, vehicle_id)

    def add_mid_mile_capacity_constraint(self, dimension_name):
        load = dataframe_empty(self._orders['load'])
        if not load:
            counter_dimension = self._routing_model.GetDimensionOrDie(dimension_name)
            for vehicle_id in range(self._solver_init_data['num_vehicles']):
                index = self._routing_model.End(vehicle_id)
                node = self._routing_manager.IndexToNode(index)
                self._routing_model.solver().Add(counter_dimension.CumulVar(index) <=
                                                 int(self._solver_init_data['vehicle_capacities'][vehicle_id])
                                                 - int(self._solver_init_data['demands'][node]))

    def vehicle_volume_capacity_callback(self, from_index):
        from_node = self._routing_manager.IndexToNode(from_index)
        return self._solver_init_data['volume_demands'][from_node]

    def add_vehicle_volume_capacity_dimension(self, dimension_name):
        vol = dataframe_empty(self._orders['volume'])
        if not vol:
            vehicle_capacity_callback_index = self._routing_model.RegisterUnaryTransitCallback(self.vehicle_volume_capacity_callback)
            slack_max = 0

            capacity = self._solver_init_data['vehicle_volume_capacities']
            fix_start_cumulative_to_zero = True

            self._routing_model.AddDimensionWithVehicleCapacity(
                vehicle_capacity_callback_index,
                slack_max,  # null capacity slack
                capacity,  # vehicle maximum capacities
                fix_start_cumulative_to_zero,  # start cumul to zero
                dimension_name
            )

    def add_vehicle_volume_capacity_constraint(self, dimension_name):
        vol = dataframe_empty(self._orders['volume'])
        if not vol:
            counter_dimension = self._routing_model.GetDimensionOrDie(dimension_name)
            for vehicle_id in range(self._solver_init_data['num_vehicles']):
                if self._solver_init_data['volume_utilisation_lb'][vehicle_id] == 0:
                    continue
                lower_bound_volume = int(
                    (self._solver_init_data['vehicle_volume_capacities'][vehicle_id] * self._solver_init_data['volume_utilisation_lb'][vehicle_id]) / 100)
                counter_dimension.SetCumulVarSoftLowerBound(self._routing_model.End(vehicle_id), lower_bound_volume, 100)
                self._routing_model.ConsiderEmptyRouteCostsForVehicle(False, vehicle_id)

    def add_mid_mile_volume_capacity_constraint(self, dimension_name):
        volume = dataframe_empty(self._orders['volume'])
        if not volume:
            counter_dimension = self._routing_model.GetDimensionOrDie(dimension_name)
            for vehicle_id in range(self._solver_init_data['num_vehicles']):
                index = self._routing_model.End(vehicle_id)
                node = self._routing_manager.IndexToNode(index)
                self._routing_model.solver().Add(counter_dimension.CumulVar(index) <=
                                                 int(self._solver_init_data['vehicle_volume_capacities'][vehicle_id])
                                                 - int(self._solver_init_data['volume_demands'][node]))

    def dem_callback_generic(self, product):
        def demands_callback(from_index):
            demands = self.product_specific_demand(self._solver_init_data['demands'], self._solver_init_data['products'], product)
            from_node = self._routing_manager.IndexToNode(from_index)
            return demands[from_node]
        return demands_callback

    def vol_callback_generic(self, product):
        def volume_callback(from_index):
            vol_demands = self.product_specific_demand(self._solver_init_data['volume_demands'], self._solver_init_data['products'], product)
            from_node = self._routing_manager.IndexToNode(from_index)
            return vol_demands[from_node]
        return volume_callback

    @staticmethod
    def product_specific_demand(demands, products, prod):
        demand = []
        for index in range(len(products)):
            if prod == products[index]:
                demand.append(demands[index])
            else:
                demand.append(0)
        return demand

    def multi_item_dimension(self):
        for idx, product in enumerate(self._solver_init_data['unique_products']):
            dem_product_callback = self.dem_callback_generic(product)
            dem_callback_index = self._routing_model.RegisterUnaryTransitCallback(dem_product_callback)
            vol_product_callback = self.vol_callback_generic(product)
            vol_callback_index = self._routing_model.RegisterUnaryTransitCallback(vol_product_callback)

            slack_max = 0
            fix_start_cumulative_to_zero = True

            load = dataframe_empty(self._orders['load'])
            if not load:
                capacity = self._solver_init_data['vehicle_capacities']
                self._routing_model.AddDimensionWithVehicleCapacity(
                    dem_callback_index,
                    slack_max,  # null capacity slack
                    capacity,  # vehicle maximum capacities
                    fix_start_cumulative_to_zero,  # start cumul to zero
                    product
                )

            slack_max1 = 0
            vol = dataframe_empty(self._orders['volume'])
            if not vol:
                capacity1 = self._solver_init_data['vehicle_volume_capacities']
                self._routing_model.AddDimensionWithVehicleCapacity(
                    vol_callback_index,
                    slack_max1,  # null capacity slack
                    capacity1,  # vehicle maximum capacities
                    fix_start_cumulative_to_zero,  # start cumul to zero
                    product
                )

    def get_products_for_tag(self, tag):
        prod_tag_idx = []
        for idx, prod in enumerate(self._solver_init_data['products']):
            if idx == 0:
                continue
            x = self._solver_init_data['sku_data'][prod]['tags']
            if tag and tag in x:
                prod_tag_idx.append(idx)
        return prod_tag_idx

    def multi_item_constraint(self):
        for idx, location in enumerate(self._solver_init_data['locations']):
            if idx == 0:
                continue

            product = self._solver_init_data['products'][idx]
            product_exclusive_tags = self._solver_init_data["sku_data"][product]['exclusive_tags']

            exclusive_products = set()

            for tag in product_exclusive_tags:
                logger.info(type(tag))

                if tag:
                    tag_products = self.get_products_for_tag(tag)
                    logger.info(f"tag products{tag_products}")
                    for x in tag_products:
                        exclusive_products.add(x)

            logger.info(exclusive_products)

            exclusive_locations = []
            for prod in exclusive_products:
                exclusive_locations.append(prod)

            for excl_location in exclusive_locations:
                self._routing_model.solver().Add(
                    self._routing_model.VehicleVar(self._routing_manager.NodeToIndex(idx)) != self._routing_model.VehicleVar(self._routing_manager.NodeToIndex(excl_location))
                )

    def get_priority_nodes(self, priority):
        node_list = list()
        for idx, value in enumerate(self._solver_init_data['order_priority']):
            if value == priority:
                node_list.append(idx)
        return node_list

    def get_non_priority_nodes(self, priority):
        node_list = list()
        for idx, value in enumerate(self._solver_init_data['order_priority']):
            if value > priority:
                node_list.append(idx)
        return node_list

    def priority_constraint(self):
        ends = [self._routing_model.End(i) for i in range(self._routing_manager.GetNumberOfVehicles())]
        unique = list(set(self._solver_init_data['order_priority']))
        unique.sort()
        for node, node_type in enumerate(self._solver_init_data['order_priority']):
            if node_type == 0:
                continue
            index = self._routing_manager.NodeToIndex(node)
            for idx, priority in enumerate(unique):
                if node_type == priority:
                    self._routing_model.NextVar(index).SetValues(self.get_priority_nodes(priority) +
                                                          self.get_non_priority_nodes(priority) +
                                                          ends)

    def run(self):
        # Setting first solution heuristic.
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC)
        search_parameters.local_search_metaheuristic = (
            routing_enums_pb2.LocalSearchMetaheuristic.AUTOMATIC)
        logger.info(f'executing solver with strategy: {routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC}')
        logger.info(f'executing solver with metaheuristic: {routing_enums_pb2.LocalSearchMetaheuristic.AUTOMATIC}')

        if self._solver_config.search_time_limit:
            logger.info(f'executing solver search time limit: {self._solver_config.search_time_limit}')
            search_parameters.time_limit.FromSeconds(self._solver_config.search_time_limit)

        search_parameters.log_search = pywrapcp.BOOL_TRUE
        search_parameters.log_cost_scaling_factor = pywrapcp.BOOL_TRUE
        search_parameters.log_cost_offset = pywrapcp.BOOL_TRUE
        # Solve the problem.
        solution = self._routing_model.SolveWithParameters(search_parameters)
        return solution

    def dropping_nodes(self):
        penalty = self._solver_config.node_drop_penalty
        for node in range(1, len(self._solver_init_data['distance_matrix'])):
            self._routing_model.AddDisjunction([self._routing_manager.NodeToIndex(node)], penalty)

    def execute(self):
        # assertions before running solver to validate mandatory args to class
        self.set_routing_params()
        config = self.get_configuration()

        if config.costing_per_km:
            self.add_vehicle_cost_per_km_dimension()
        if config.costing_per_kg:
            self.add_vehicle_cost_per_kg_dimension()
        if config.costing_fixed:
            self.add_vehicle_fixed_cost_dimension()

        self.add_vehicle_time_dimension_with_service_time()

        self.add_vehicle_distance_dimension()

        if config.max_length_constraint:
            self.add_vehicle_max_length_constraint("Distance")

        if config.max_node_visits_constraint:
            self.add_vehicle_max_route_node_visits_dimension()
            self.add_vehicle_max_route_node_visits_constraint("Counter")

        self.add_vehicle_drop_distance_dimension()

        if config.max_drop_distance_constraint:
            self.add_vehicle_max_drop_distance_constraint("DropDistance")

        if config.welded_weight_capacity_constraint:
            self.add_welded_capacity_dimension()

        if config.welded_volume_capacity_constraint:
            self.add_welded_volume_capacity_dimension()

        if config.partial_planning:
            self.dropping_nodes()

        if config.serviceable_constraint:
            self.serviceable_vehicles_constraint()

        if config.sku_planning:
            self.multi_item_dimension()
            self.multi_item_constraint()

        if config.priority_constraint:
            self.priority_constraint()

        if config.vehicle_weight_capacity_constraint:
            self.add_vehicle_capacity_dimension("Capacity")
            self.add_vehicle_capacity_constraint("Capacity")
            if config.mid_mile_cost:
                self.add_mid_mile_capacity_constraint("Capacity")

        if config.vehicle_volume_capacity_constraint:
            self.add_vehicle_volume_capacity_dimension("VolumetricCapacity")
            self.add_vehicle_volume_capacity_constraint("VolumetricCapacity")
            if config.mid_mile_cost:
                self.add_mid_mile_volume_capacity_constraint("VolumetricCapacity")

        if config.sla_time_window_constraint:
            self.add_time_window_constraint()

        if config.operating_time_window_constraint:
            self.add_operating_time_window_constraint()

        solution = self.run()
        if solution:
            solution = SolverSolutionProviderV1(
                self._routing_model, self._routing_manager, solution, self._solver_init_data, config,
                from_city=self.from_city, to_city=self.to_city)
            solution.solve()
            return solution.get_routes(), solution.get_confusion_matrix(), solution.get_aggregated_output()
        else:
            soln_status = self._routing_model.status()
            message = SolverStatusErrorMessage.get_message(soln_status)
            raise SolverException(message)


class SolverStatusErrorMessage:

    @staticmethod
    def get_message(solver_status):
        status_dict = {
            0: "Problem not solved yet (NOT SOLVED)",
            1: "Problem solved successfully (SUCCESS)",
            2: "No solution found to the problem (FAIL)",
            3: "Time limit reached before finding a solution (TIMEOUT)",
            4: "Model, model parameters, or flags are not valid (INVALID)",
        }
        return status_dict[solver_status]
