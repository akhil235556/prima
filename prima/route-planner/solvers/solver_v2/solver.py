from route_planner.utils import logging

from ortools.sat.python import cp_model

from route_planner.exceptions.exceptions import SolverException
from route_planner.bin_packing.sku_fixed_cost_bin_packing_planner import SkuFixedSolverConfigurationV2

from solvers.solver_v2.input_processor import SolverV2InputDataProcessor
from solvers.solver_v2.solution import SolverSolutionProviderV2

from route_planner.utils.utils import generate_request_id, get_current_timestamp, to_np_array


logger = logging.getLogger(__name__)

class SolverV2(object):

    _orders = None
    _vehicles = None
    _products = None
    _request_id = None

    _solver_config = None
    _solver_init_data = None

    _routing_manager = None
    _routing_model = None

    def __init__(self, orders, vehicles, products=None, request_id=None, timestamp=None, config=None,
                 extra_products=None, from_city=None, to_city=None, planning_id_init=None):
        if not config:
            config = SkuFixedSolverConfigurationV2.get_default_sku_fixed_configuration()
        self._solver_config = config

        self._CONST_INT_MULTIPLIER = self._solver_config.integer_multiplier or 1
        self._planning_id_init = planning_id_init if planning_id_init else 0
        self._orders = orders
        self._vehicles = vehicles
        self._products = products
        if not vehicles.empty:
            self._vehicles = self.set_vehicle_index(vehicles)
            self._vehicles = self.vehicle_multiplier(vehicles)
        self._request_id = request_id or generate_request_id()
        self.timestamp = timestamp or get_current_timestamp()
        self.extra_products = extra_products
        self.from_city = from_city
        self.to_city = to_city
        # for memoization
        self.orders_to_vehicles_map = dict()

    def get_planning_id_init(self):
        return self._planning_id_init

    def set_vehicle_index(self, vehicles):
        rows = len(vehicles)
        index_list = [x for x in range(rows)]
        vehicles['vehicle_index'] = index_list
        return vehicles

    def vehicle_multiplier(self, vehicles, repeat_factor=1):
        if self._solver_config.vehicle_repeat_factor:
            repeat_factor = int(self._solver_config.vehicle_repeat_factor)

        vehicles['No. of vehicles'] = vehicles['No. of vehicles'].fillna(repeat_factor)

        # repeat vehicles, set _VEHICLE_REPEAT_FACTOR = 1 to retain original no. of vehicles
        logger.info(f"Using VEHICLE_REPEAT_FACTOR: {repeat_factor}")
        # Repeat rows on basis of 'No. of vehicles' column
        return vehicles.reindex(vehicles.index.repeat(vehicles['No. of vehicles'])).reset_index(drop=True)

    def get_configuration(self):
        return self._solver_config

    def get_vehicles_for_order(self, i):
        # check map if index already present
        if i in self.orders_to_vehicles_map.keys():
            # using cached value
            return self.orders_to_vehicles_map[i]

        if i < self._solver_init_data['orders']['total'] and self._solver_init_data['vehicles']['serviceable'][i]:
            # get serviceable vehicles
            self.orders_to_vehicles_map[i] = self._solver_init_data['vehicles']['serviceable'][i]
        else:
            # get all vehicles
            self.orders_to_vehicles_map[i] = self._solver_init_data['vehicles'].get('id')

        return self.orders_to_vehicles_map[i]

    @staticmethod
    def _init_solver_data(orders, vehicles, products, extra_products, config, int_multiplier):
        # get data for solver
        data = SolverV2InputDataProcessor(orders, vehicles, products, config, int_multiplier).create_data_model()
        data['extra_products_list'] = extra_products
        # logger.info(f"Solver Init Data: {data}")
        return data

    @staticmethod
    def _init_routing_model():
        model = cp_model.CpModel()
        return model

    def set_routing_params(self):
        # get _solver_init_data consist (orders, vehicles, products)
        self._solver_init_data = self._init_solver_data(self._orders, self._vehicles, self._products, self.extra_products, self._solver_config, self._CONST_INT_MULTIPLIER)
        self._routing_model = self._init_routing_model()

    def set_solver_variables(self):

        # x[i, j] = 1 if item i is packed in bin j
        x = {}
        for i in self._solver_init_data['orders'].get('id'):
            for j in self.get_vehicles_for_order(i):
                x[(i, j)] = self._routing_model.NewIntVar(0, 1, 'x_%i_%i' % (i, j))

        # y[j] = 1 if bin j is used.
        y = {}
        for j in self._solver_init_data['vehicles'].get('id'):
            y[j] = self._routing_model.NewIntVar(0, 1, 'y[%i]' % j)
        return x, y

    def add_item_integrity_constraint(self, x):
        # Each item must be in exactly one bin.
        m = "Each item must be in exactly one truck"
        logger.info(f"Constraint Added: '{m}'")
        for i in self._solver_init_data['orders'].get('id'):
            self._routing_model.Add(sum(x[i, j] for j in self.get_vehicles_for_order(i)) == 1)

    def add_vehicle_load_capacity_constraint(self, x, y):
        # The amount packed in each bin cannot exceed its capacity.
        m = "The amount of load packed in each truck cannot exceed its capacity."
        logger.info(f"Constraint Added: '{m}'")
        for j in self._solver_init_data['vehicles'].get('id'):
            self._routing_model.Add(
                sum(x[(i, j)] * self._solver_init_data['orders']['demand_load'][i] for i in self._solver_init_data['orders'].get('id') if j in self.get_vehicles_for_order(i)) <= y[j] *
                self._solver_init_data['vehicles'].get('load_capacity')[j])

    def add_vehicle_volume_capacity_constraint(self, x, y):
        m = "The amount of volume packed in each truck cannot exceed its capacity."
        logger.info(f"Constraint Added: '{m}'")
        for j in self._solver_init_data['vehicles'].get('id'):
            self._routing_model.Add(
                sum(x[(i, j)] * self._solver_init_data['orders']['demand_volume'][i] for i in self._solver_init_data['orders'].get('id') if j in self.get_vehicles_for_order(i)) <= y[j] *
                self._solver_init_data['vehicles'].get('volume_capacity')[j])

    def add_vehicle_min_load_capacity_constraint(self, x, y):
        # The amount packed in each bin should be at-least >= min_capacity.
        m = f"The amount of load packed in each truck should be at-least >= lower bound of it's capacity."
        logger.info(f"Constraint Added: '{m}'")
        for j in self._solver_init_data['vehicles'].get('id'):
            self._routing_model.Add(
                sum(x[(i, j)] * self._solver_init_data['orders']['demand_load'][i] for i in self._solver_init_data['orders'].get('id') if j in self.get_vehicles_for_order(i)) >= y[j] *
                int(self._solver_init_data['vehicles'].get('load_lb')[j] * (self._solver_init_data['vehicles'].get('load_capacity')[j])))

    def add_vehicle_min_volume_capacity_constraint(self, x, y):
        min_capacity = self._solver_config.vehicle_min_volume_capacity_per_ratio
        m = f"The amount of volume packed in each truck should be at-least >= lower bound of it's capacity."
        logger.info(f"Constraint Added: '{m}'")
        for j in self._solver_init_data['vehicles'].get('id'):
            self._routing_model.Add(
                sum(x[(i, j)] * self._solver_init_data['orders']['demand_volume'][i] for i in self._solver_init_data['orders'].get('id') if j in self.get_vehicles_for_order(i)) >= y[j] *
                int(self._solver_init_data['vehicles'].get('volume_lb')[j] * (self._solver_init_data['vehicles'].get('volume_capacity')[j])))

    def add_exclusion_constraint(self, x, y):
        m = "Exclusion"
        logger.info(f"Constraint Added: '{m}'")
        for i, exclusion_list in enumerate(self._solver_init_data['orders'].get('exclusion_orders')):
            if exclusion_list:
                # log exclusion data
                logger.info(f"exclusion {i}: {exclusion_list}")
            for exclusion_i in exclusion_list:
                for j in self.get_vehicles_for_order(i):
                    a = x[(i, j)]
                    if j in self.get_vehicles_for_order(exclusion_i):
                        b = x[(exclusion_i, j)]
                        # solver.AddBoolOr({a.Not(), b.Not()})
                        self._routing_model.Add(b == False).OnlyEnforceIf(a)

    def add_objective(self, x, y):
        # Objective: minimize the number of bins used.

        veh_cost = list()
        for j in self._solver_init_data['vehicles'].get('id'):

            fixed_cost = y[j] * (self._solver_init_data['vehicles'].get('fixed_charges')[j])

            per_kg_cost = list()
            for i in self._solver_init_data['orders'].get('id'):
                if j in self.get_vehicles_for_order(i):
                    charge = self._solver_init_data['orders']['demand_load'][i] * self._solver_init_data['vehicles'].get('per_kg_charges')[j]
                    per_kg_cost.append(x[i, j] * charge)

            per_kg_cost.append(fixed_cost)

            veh_cost.append(per_kg_cost)

        self._routing_model.Minimize(cp_model.LinearExpr.Sum([cp_model.LinearExpr.Sum(c) for c in veh_cost]))
        # self._routing_model.Minimize(cp_model.LinearExpr.Sum([y[j] * (self._solver_init_data['vehicles'].get('fixed_charges')[j])   for j in self._solver_init_data['vehicles'].get('id')]))

    def run(self):
        cp_solver = cp_model.CpSolver()

        # Sets a time limit of 190 seconds.
        cp_solver.parameters.max_time_in_seconds = 180.0

        if self._solver_config.num_of_threads:
            logger.info(f"Using NUM_OF_THREADS: {int(self._solver_config.num_of_threads)}")
            # Set Number of threads
            cp_solver.parameters.num_search_workers = int(self._solver_config.num_of_threads)

        cp_solver.parameters.log_search_progress = True
        status = cp_solver.Solve(self._routing_model)
        return cp_solver, status

    def execute(self):
        # assertions before running solver to validate mandatory args to class
        self.set_routing_params()
        config = self.get_configuration()

        # set variables
        x, y = self.set_solver_variables()

        # Constraints
        logger.info("::: Constraints :::")
        self.add_item_integrity_constraint(x)

        if config.vehicle_load_capacity_constraint:
            self.add_vehicle_load_capacity_constraint(x, y)
        if config.vehicle_min_load_capacity_constraint:
            self.add_vehicle_min_load_capacity_constraint(x, y)

        if config.vehicle_volume_capacity_constraint:
            self.add_vehicle_volume_capacity_constraint(x, y)

        if config.vehicle_min_volume_capacity_constraint:
            self.add_vehicle_min_volume_capacity_constraint(x, y)

        if config.sku_exclusion_constraint:
            self.add_exclusion_constraint(x, y)

        # add objective
        self.add_objective(x, y)

        # solution
        cp_solver, status = self.run()

        response = dict()

        if status == cp_model.FEASIBLE or status == cp_model.OPTIMAL:
            response = self.dummy_output(cp_solver, status, x, y)
            solver_output = self.solver_output(cp_solver, status, x, y)

            if status == cp_model.FEASIBLE:
                stat = "Feasible"
            elif status == cp_model.OPTIMAL:
                stat = "Optimal"
            #  Generate output

            solution = SolverSolutionProviderV2(
                solver_output, self._orders, self._vehicles, self._products, config,
                from_city=self.from_city, to_city=self.to_city, status=stat)
            solution.solve()
            return solution.get_aggregated_output(), solution.get_output(), solution.get_confusion_matrix()
        else:
            message = 'The problem does not have an optimal solution.'

            raise SolverException(message)

    def dummy_output(self, cp_solver, status, x, y):
        output_dict = dict(
            vehicle_type=list(),
            orders=list(),
            load=list(),
            cost=list()
        )

        detail = dict(
            output=dict(),
            total_cost=None,
            solver_time_s=None,
        )
        num_bins = 0.
        total_cost = 0.
        for j in self._solver_init_data['vehicles'].get('id'):
            if cp_solver.Value(y[j]) == 1:
                bin_items = []
                bin_weight = 0
                for i in self._solver_init_data['orders'].get('id'):
                    if j in self.get_vehicles_for_order(i) and cp_solver.Value(x[i, j]) > 0:
                        bin_items.append(i)
                        bin_weight += round(((self._solver_init_data['orders'].get('demand_load')[i] / 1000) / self._CONST_INT_MULTIPLIER), 3)
                if bin_weight > 0:
                    num_bins += 1
                    total_cost += round(self._solver_init_data['vehicles'].get('fixed_charges')[j], 3)
                    # print('Bin number', j)
                    # print('Vehicle Type: ', vehicles['vehicle_type_name'].loc[j])
                    output_dict['vehicle_type'].append(self._vehicles['vehicle_type_name'].loc[j])

                    # print('  Items packed:', bin_items)
                    # print(' orders: ', ",".join(orders[orders['order_id'].isin(bin_items)]['task_id'].to_list()))
                    output_dict['orders'].append(
                        ",".join(self._orders[self._orders['order_id'].isin(bin_items)]['task_id'].to_list()))

                    # print('  Total weight:', bin_weight)
                    output_dict['load'].append(bin_weight)

                    # print('  Cost:', data['bin_cost'][j])
                    output_dict['cost'].append(self._solver_init_data['vehicles'].get('fixed_charges')[j])
        #             print()
        # print()
        detail['output'] = output_dict
        #
        # print('Number of bins used:', num_bins)
        #
        detail['total_cost'] = cp_solver.ObjectiveValue()
        # print(f"Total Cost: {detail['total_cost']}")
        #
        detail['solver_time_s'] = cp_solver.WallTime()
        # print('Time = ', detail['solver_time_s'], ' seconds')

        return detail

    def solver_output(self, cp_solver, status, x, y):
        output_dict = dict(
            no_of_vehicles=list(),
            order_ids=list(),
            planning_id=list(),
            vehicle_type=list(),
            weight_utilization=list(),
            volume_utilization=list(),
            orders=list(),
            vehicle_load=list(),
            vehicle_volume=list(),
            vehicle_load_capacity=list(),
            vehicle_volume_capacity=list(),
            cost=list(),
            status=list()
        )

        detail = dict(
            output=dict(),
            total_cost=None,
            solver_time_s=None,
        )
        num_bins = 0.
        total_cost = 0.
        for j in self._solver_init_data['vehicles'].get('id'):
            if cp_solver.Value(y[j]) == 1:
                bin_items = []
                bin_weight = 0
                bin_volume = 0
                for i in self._solver_init_data['orders'].get('id'):
                    if j in self.get_vehicles_for_order(i) and cp_solver.Value(x[i, j]) > 0:
                        bin_items.append(i)
                        if self._solver_config.vehicle_load_capacity_constraint:
                            bin_weight += ((self._solver_init_data['orders'].get('demand_load')[i] / 1000) / self._CONST_INT_MULTIPLIER)
                        if self._solver_config.vehicle_volume_capacity_constraint:
                            bin_volume += ((self._solver_init_data['orders'].get('demand_volume')[i] / 1000000) / self._CONST_INT_MULTIPLIER)
                if (self._solver_config.vehicle_load_capacity_constraint and bin_weight > 0) or (self._solver_config.vehicle_volume_capacity_constraint and bin_volume > 0):
                    num_bins += 1
                    total_cost += self._solver_init_data['vehicles'].get('fixed_charges')[j]
                    # print('Bin number', j)
                    # print('Vehicle Type: ', vehicles['vehicle_type_name'].loc[j])
                    output_dict['vehicle_type'].append(self._vehicles['vehicle_type_name'].loc[j])

                    # print('  Items packed:', bin_items)
                    # print(' orders: ', ",".join(orders[orders['order_id'].isin(bin_items)]['task_id'].to_list()))
                    output_dict['orders'].append((self._orders[self._orders['order_id'].isin(bin_items)]['task_id'].to_list()))
                    output_dict['order_ids'].append(bin_items)
                    # print('  Total weight:', bin_weight)
                    output_dict['vehicle_load'].append(bin_weight)

                    output_dict['vehicle_volume'].append(bin_volume)

                    # vehicle load capacity
                    output_dict['vehicle_load_capacity'].append((self._solver_init_data['vehicles'].get('load_capacity')[j] / 1000) / self._CONST_INT_MULTIPLIER)
                    # vehicle volume capacity
                    output_dict['vehicle_volume_capacity'].append((self._solver_init_data['vehicles'].get('volume_capacity')[j]/ 1000000) / self._CONST_INT_MULTIPLIER)

                    # print('  Cost:', data['bin_cost'][j])
                    # fixed_cost
                    f_c = self._solver_init_data['vehicles'].get('fixed_charges')[j]
                    # variable_cost
                    v_c = self._solver_init_data['vehicles'].get('per_kg_charges')[j] * bin_weight
                    output_dict['cost'].append(f_c + v_c)
                    if status == 4:
                        stat = "Optimal"
                    elif status == 2:
                        stat = "Feasible"
                    output_dict['status'].append(stat)
                    # print()
        output_dict['no_of_vehicles'] = list(range(len(output_dict['vehicle_type'])))
        no_veh = len(output_dict['vehicle_type'])
        output_dict['planning_id'] = list(range(self._planning_id_init + 1, self._planning_id_init + no_veh + 1))

        self._planning_id_init = output_dict['planning_id'][-1]
        # print()

        output_dict['weight_utilization'] = ((to_np_array(output_dict['vehicle_load']) / to_np_array(output_dict['vehicle_load_capacity']))*100).tolist()
        output_dict['volume_utilization'] = ((to_np_array(output_dict['vehicle_volume']) / to_np_array(output_dict['vehicle_volume_capacity'])) * 100).tolist()
        return output_dict


# class SolverStatusErrorMessage:
#
#     @staticmethod
#     def get_message(solver_status):
#         status_dict = {
#             0: "Problem not solved yet (NOT SOLVED)",
#             1: "Problem solved successfully (SUCCESS)",
#             2: "No solution found to the problem (FAIL)",
#             3: "Time limit reached before finding a solution (TIMEOUT)",
#             4: "Model, model parameters, or flags are not valid (INVALID)",
#         }
#         return status_dict[solver_status]
