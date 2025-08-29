import logging

from ortools.constraint_solver import pywrapcp, routing_enums_pb2
import pandas as pd
import sys
MAX_INT = sys.maxsize / 2
from route_planner.exceptions.exceptions import SolverException
from solvers.solver_v4.config import SolverConfigurationTSP
from solvers.solver_v4.input_processor_tsp import SolverTSPInputDataProcessor
from solvers.solver_v4.solution_tsp import SolverSolutionProviderTSP
from route_planner.utils.utils import generate_request_id, get_current_timestamp, dataframe_empty
from route_planner.bin_packing.sequential_planner.tsp_solver_configuration import TSPSolverConfiguration
from solvers.solver_v4.utils import vehicle_multiplier
logger = logging.getLogger(__name__)


class SolverTSP(object):

    _orders = None
    _vehicles = None
    _products = None
    _request_id = None

    _solver_config = None
    _solver_init_data = None

    _routing_manager = None
    _routing_model = None

    def __init__(self, orders, vehicles, all_vehicles, products=None, request_id=None, timestamp=None, config=None,
                 extra_products=None, search_time_limit=None, from_city=None, to_city=None):
        self._orders = orders
        self._vehicles = vehicles
        self._all_vehicles = all_vehicles
        self._products = products
        self._request_id = request_id or generate_request_id()
        self.timestamp = timestamp or get_current_timestamp()
        self.extra_products = extra_products
        self.from_city = from_city
        self.to_city = to_city

        if not config:
            config = TSPSolverConfiguration.get_default_tsp_configuration()
        self._solver_config = config

        # override search time limit
        if search_time_limit:
            self._solver_config.search_time_limit = search_time_limit

    def get_configuration(self):
        return self._solver_config

    def set_configuration(self, config: SolverConfigurationTSP):
        self._solver_config = config

    @staticmethod
    def repeat_vehicles(vehicles, orders):
        return vehicle_multiplier(vehicles, orders, return_df=False)

    @staticmethod
    def set_vehicle_index(vehicles):
        rows = len(vehicles)
        index_list = [x for x in range(rows)]
        vehicles['vehicle_index'] = index_list
        return vehicles

    def _init_solver_data(self, orders, vehicles, products, all_vehicles, extra_products, config):
        pd.set_option('display.max_columns', None)
        if not config.sequential_bool:
            self.set_vehicle_index(vehicles)
            vehicles['No. of vehicles'] = SolverTSP.repeat_vehicles(vehicles, orders)
        data, vehicle_data_model, all_vehicle_data_model = SolverTSPInputDataProcessor(orders=orders, vehicles=vehicles,
                                                                                       all_vehicles=all_vehicles,
                                                                                       products=products,
                                                                                       config=config).create_data_model()
        data['vehicles'] = vehicle_data_model
        data['all_vehicles'] = all_vehicle_data_model
        data['extra_products_list'] = extra_products
        return data

    @staticmethod
    def _init_routing_manager(data, config):
        manager = pywrapcp.RoutingIndexManager(
            len(data['distance_matrix']), data['num_vehicles'], data['depot']
        )
        return manager

    @staticmethod
    def _init_routing_model(manager):
        model = pywrapcp.RoutingModel(manager)
        return model

    def set_routing_params(self):
        self._solver_init_data = self._init_solver_data(self._orders, self._vehicles, self._products, self._all_vehicles,
                                                        self.extra_products, self._solver_config)
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

    def add_vehicle_distance_dimension(self, config):
        if config.sequential_bool:
            transit_callback_index = self._routing_model.RegisterTransitCallback(self.distance_callback)
            self._routing_model.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

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

    # def add_vehicle_fixed_cost_dimension(self):
    #     fixed_costing = dataframe_empty(self._vehicles['fixed_charges'])
    #     if not fixed_costing:
    #         for vehicle_id in range(self._solver_init_data['num_vehicles']):
    #             self._routing_model.SetFixedCostOfVehicle(int(self._solver_init_data['fixed_charges'][vehicle_id]), vehicle_id)

    def add_vehicle_fixed_cost_dimension(self):
        fixed_costing = dataframe_empty(self._vehicles['fixed_charges'])
        if not fixed_costing:
            for vehicle_id in range(self._solver_init_data['num_vehicles']):
                _vehicle_cost_per_km_callback_method = self.vehicle_cost_per_km_callback(
                    self._solver_init_data['distance_matrix'], 1,
                    self._solver_init_data['fixed_charges'][vehicle_id])
                _vehicle_cost_per_km_callback_method_index = self._routing_model.RegisterTransitCallback(
                    _vehicle_cost_per_km_callback_method
                )
                self._routing_model.SetArcCostEvaluatorOfVehicle(
                    _vehicle_cost_per_km_callback_method_index, vehicle_id
                )

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
        if all(v == 0.0 for v in self._orders['load']):
            return True

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
        if all(v == 0.0 for v in self._orders['volume']):
            return True

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
        if not sla and not all(v == MAX_INT for v in self._orders['working_window_to']):
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
                return True

    def add_operating_time_window_constraint(self):
        op_tw = dataframe_empty(self._orders['operating_window_to'])
        if not op_tw and not all(v == 0 for v in self._orders['operating_window_from']) and not all(v == 1439 for v in self._orders['operating_window_to']):
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
                    # logger.info("*" * 500)
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
            return True


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
        if self._solver_init_data['order_priority']:
            return True

    def run(self, solution_time):
        # Setting first solution heuristic.
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.AUTOMATIC)
        search_parameters.local_search_metaheuristic = (
            routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH)
        logger.info(f'executing solver with strategy: {routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC}')
        logger.info(f'executing solver with metaheuristic: {routing_enums_pb2.LocalSearchMetaheuristic.AUTOMATIC}')

        search_parameters.time_limit.FromSeconds(solution_time)
        logger.info(f"VRP Timeout: {solution_time}")
        # search_parameters.log_search = pywrapcp.BOOL_FALSE
        # search_parameters.log_cost_scaling_factor = pywrapcp.BOOL_FALSE
        # search_parameters.log_cost_offset = pywrapcp.BOOL_FALSE


        # Solve the problem.
        logger.info(f"Running VRP")
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
        constraint_count = 0

        if not config.sequential_bool:
            if config.costing_per_km:
                self.add_vehicle_cost_per_km_dimension()
            if config.costing_per_kg:
                self.add_vehicle_cost_per_kg_dimension()
            if config.costing_fixed:
                self.add_vehicle_fixed_cost_dimension()

        self.add_vehicle_time_dimension_with_service_time()

        self.add_vehicle_distance_dimension(config)

        if config.vehicle_weight_capacity_constraint:
            self.add_vehicle_capacity_dimension("Capacity")
            constraint = self.add_vehicle_capacity_constraint("Capacity")
            if constraint:
                constraint_count += 1

        if config.vehicle_volume_capacity_constraint:
            self.add_vehicle_volume_capacity_dimension("VolumetricCapacity")
            constraint = self.add_vehicle_volume_capacity_constraint("VolumetricCapacity")
            if constraint:
                constraint_count += 1

        if config.priority_constraint:
            constraint = self.priority_constraint()
            if constraint:
                constraint_count += 1

        if config.sla_time_window_constraint:
            constraint = self.add_time_window_constraint()
            if constraint:
                constraint_count += 1

        if config.operating_time_window_constraint:
            constraint = self.add_operating_time_window_constraint()
            if constraint:
                constraint_count += 1

        if config.sequential_bool:
            solution_time = 60
        else:
            solution_time = 500
        solution = self.run(solution_time)
        if solution:
            solution = SolverSolutionProviderTSP(
                self._routing_model, self._routing_manager, solution, self._solver_init_data, config, solver_time=solution_time,
                from_city=self.from_city, to_city=self.to_city, status=self._routing_model.status(), num_constraints=constraint_count)
            solution.solve()
            return solution.get_routes(), solution.get_confusion_matrix(), solution.get_aggregated_output(), solution.get_summary_output()
        else:
            if config.sequential_bool:
                solution = SolverSolutionProviderTSP(
                    self._routing_model, self._routing_manager, solution, self._solver_init_data, config,
                    solver_time=solution_time,
                    from_city=self.from_city, to_city=self.to_city, status=self._routing_model.status(),
                    num_constraints=constraint_count
                )
                sum = solution.infeasible_solution()
                routes = []
                cm = []
                ag = []
                return routes, cm, ag, sum
            else:
                soln_status = self._routing_model.status()
                message = SolverStatusErrorMessage.get_message(soln_status)
                return message


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
