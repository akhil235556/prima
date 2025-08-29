import pandas as pd

from route_planner.utils import logging
from ortools.linear_solver import pywraplp
from solvers.solver_v5.config import SolverConfigurationV5
from route_planner.exceptions.exceptions import SolverException
from solvers.solver_v5.input_processor import SolverV5InputDataProcessor
from solvers.solver_v5.exporter import SolverV5OutputExporter

logger = logging.getLogger(__name__)


class SolverV5(object):

    config = SolverConfigurationV5
    input_processor = None

    solver = None

    def __init__(self, orders, vehicles, config=None):
        self.config = config if config else SolverV5.config
        self.input_processor = SolverV5InputDataProcessor(orders, vehicles, self.config)
        self.input_processor.process()

    def init_solver(self):
        self.solver = pywraplp.Solver.CreateSolver("CP-SAT")

    def set_solver_variables(self):
        solver = self.solver
        vehicle_classifier = self.input_processor.vehicle_classifier
        order_classifier = self.input_processor.order_classifier
        vehicles = self.input_processor.vehicles

        kwargs = dict(
            x=dict(),
            y=dict(),
            v=dict(),
            w=dict()
        )

        # x[n, l, i, j] = 1 if item i of lane l is packed in bin j for node n.
        x = {}
        for n, order_classifier_key in enumerate(order_classifier.keys):
            for l, vehicle_classifier_key in enumerate(vehicle_classifier.keys):
                for i in order_classifier.get(order_classifier_key):
                    for j in vehicle_classifier.get(vehicle_classifier_key):
                        x[n, l, i, j] = solver.IntVar(0, 1, "")
        kwargs["x"] = x

        # y[l, j] = 1 if bin j of lane l is used.
        y = {}
        for l, vehicle_classifier_key in enumerate(vehicle_classifier.keys):
            for j in vehicle_classifier.get(vehicle_classifier_key):
                y[l, j] = solver.IntVar(0, 1, "")
        kwargs["y"] = y

        v = {}
        for n, order_classifier_key in enumerate(order_classifier.keys):
            for l, vehicle_classifier_key in enumerate(vehicle_classifier.keys):
                for j in vehicle_classifier.get(vehicle_classifier_key):
                    v[n, l, j] = solver.IntVar(0, 1, "")
        kwargs["v"] = v

        w = {}
        for l, vehicle_classifier_key in enumerate(vehicle_classifier.keys):
            for j in vehicle_classifier.get(vehicle_classifier_key):
                tp_max = vehicles.get_vehicle(j).tp_limit
                w[l, j] = solver.IntVar(0, tp_max, "")
        kwargs["w"] = w

        return kwargs

    def set_constraints(self, x, y, v, w):

        vehicle_classifier = self.input_processor.vehicle_classifier
        order_classifier = self.input_processor.order_classifier
        orders = self.input_processor.orders
        vehicles = self.input_processor.vehicles
        solver = self.solver

        # Constraints

        # The amount packed in each bin cannot exceed its capacity.
        for l, vehicle_classifier_key in enumerate(vehicle_classifier.keys):
            for j in vehicle_classifier.get(vehicle_classifier_key):
                integrity_terms = []
                for n, order_classifier_key in enumerate(order_classifier.keys):
                    for i in order_classifier.get(order_classifier_key):
                        weight_demand = orders.get_order(i).load
                        integrity_terms.append(weight_demand * x[n, l, i, j])
                solver.Add(
                    solver.Sum(integrity_terms) <= y[(l, j)] * vehicles.get_vehicle(j).load_capacity)

        # The amount packed in each bin cannot exceed its volume.
        for l, vehicle_classifier_key in enumerate(vehicle_classifier.keys):
            for j in vehicle_classifier.get(vehicle_classifier_key):
                integrity_terms = []
                for n, order_classifier_key in enumerate(order_classifier.keys):
                    for i in order_classifier.get(order_classifier_key):
                        volume_demand = orders.get_order(i).volume
                        integrity_terms.append(volume_demand * x[n, l, i, j])

                solver.Add(
                    solver.Sum(integrity_terms) <= y[(l, j)] * vehicles.get_vehicle(j).volume_capacity)

        for n, order_classifier_key in enumerate(order_classifier.keys):
            for i in order_classifier.get(order_classifier_key):
                # integrity_terms = [x[(n, l, i, j)] for l in data.keys() for j in data[0]["all_bins"]]
                integrity_terms = []
                for l, vehicle_classifier_key in enumerate(vehicle_classifier.keys):
                    for j in vehicle_classifier.get(vehicle_classifier_key):
                        integrity_terms.append(x[(n, l, i, j)])

                solver.Add(solver.Sum(integrity_terms) == 1.0)

        # Touchpoint Constraints
        # constraints
        # 7
        for l, vehicle_classifier_key in enumerate(vehicle_classifier.keys):
            for j in vehicle_classifier.get(vehicle_classifier_key):
                for n, order_classifier_key in enumerate(order_classifier.keys):
                    for i in order_classifier.get(order_classifier_key):
                        solver.Add(x[n, l, i, j] <= v[n, l, j])

        # 8
        for l, vehicle_classifier_key in enumerate(vehicle_classifier.keys):
            for j in vehicle_classifier.get(vehicle_classifier_key):
                for n, order_classifier_key in enumerate(order_classifier.keys):
                    solver.Add(v[n, l, j] <= y[l, j])

        # 9
        for l, vehicle_classifier_key in enumerate(vehicle_classifier.keys):
            for j in vehicle_classifier.get(vehicle_classifier_key):
                integrity_terms = []
                for n, order_classifier_key in enumerate(order_classifier.keys):
                    integrity_terms.append(v[n, l, j])

                solver.Add(solver.Sum(integrity_terms) <= w[l, j] + 1.0)
                solver.Add(w[l, j] <= vehicles.get_vehicle(j).tp_limit)

        DM = self.input_processor.distance_matrix
        # 10
        for l, vehicle_classifier_key in enumerate(vehicle_classifier.keys):
            # print(f"l: {cities[l]}")
            for j in vehicle_classifier.get(vehicle_classifier_key):
                # print(f"j: {j}")
                for n, order_classifier_key in enumerate(order_classifier.keys):
                    # print(f"n: {pincodes[n]}")

                    to_pincode = order_classifier_key[1]
                    to_city = vehicle_classifier_key[1]
                    from_city = vehicle_classifier_key[0]

                    origin_node_distance = DM.get_distance(from_city, to_pincode)
                    # print(f"{from_city} -> {to_pincode}: {origin_node_distance}")
                    node_destination_distance = DM.get_distance(to_city, to_pincode)
                    # print(f"{to_city} -> {to_pincode}: {node_destination_distance}")
                    origin_node_destination_distance = origin_node_distance + node_destination_distance
                    # print(f"{from_city} -> {to_pincode} -> {to_city}: {origin_node_destination_distance}")

                    lane_length = DM.get_distance(from_city, to_city)
                    # print(f"{from_city} -> {to_city}Lane Length: {lane_length}")

                    tp_detour_distance = vehicles.get_vehicle(j).tp_detour_limit
                    # print(f"Touch Point Detour: {tp_detour_distance}")
                    max_allowed_distance = lane_length + tp_detour_distance
                    # print(f"Max Allowed Distance: {max_allowed_distance}")
                    if tp_detour_distance:
                        solver.Add((v[n, l, j] * origin_node_destination_distance) <= max_allowed_distance)
        #
        # 11
        # for l, vehicle_classifier_key in enumerate(vehicle_classifier.keys):
        #     for j in vehicle_classifier.get(vehicle_classifier_key):
        #         for n, order_classifier_key in enumerate(order_classifier.keys):
        #             destination_city_tuple = vehicle_classifier_key
        #             pincode_city_tuple = (orders.get_order(n).from_city, orders.get_order(n).to_city)
        #
        #             lane_vehicle_type = vehicles.get_vehicle(j).vehicle_type
        #
        #             if pincode_city_tuple == destination_city_tuple:
        #                 # skipping
        #                 continue
        #
        #             pincode_vehicles = vehicles.filter_vehicle_by_type(lane_vehicle_type, vehicle_classifier.get(pincode_city_tuple))
        #             # getting first vehicle, matched by vehicle_type
        #             pincode_city_lane_cost = pincode_vehicles[0].fixed_cost
        #
        #             lane_cost = vehicles.get_vehicle(j).fixed_cost
        #             solver.Add(v[n, l, j] * pincode_city_lane_cost <= lane_cost)

                    # print(f"Pincode: {pincode_city}: Fixed Cost: {pincode_city_lane_cost}")
                    # print(f"Lane: {destination_city}: Fixed Cost: {lane_cost}")
                    # print()


    def set_objective(self, x, y, v, w):
        # Objective: minimize the number of bins used.
        vehicle_classifier = self.input_processor.vehicle_classifier
        order_classifier = self.input_processor.order_classifier
        orders = self.input_processor.orders
        vehicles = self.input_processor.vehicles
        solver = self.solver
        #
        # obj_term = []
        # for l, vehicle_classifier_key in enumerate(vehicle_classifier.keys):
        #     for j in vehicle_classifier.get(vehicle_classifier_key):
        #         obj_term.append(y[l, j] * vehicles.get_vehicle(j).fixed_cost)
        # solver.Minimize(solver.Sum(obj_term))

        # Objective: minimize the number of bins used.
        objective_terms1 = []
        objective_terms2 = []
        for l, vehicle_classifier_key in enumerate(vehicle_classifier.keys):
            for j in vehicle_classifier.get(vehicle_classifier_key):
                objective_terms1.append(vehicles.get_vehicle(j).fixed_cost * y[l, j])
                objective_terms2.append(vehicles.get_vehicle(j).tp_cost * w[l, j])
        solver.Minimize(solver.Sum(objective_terms1 + objective_terms2))

    def execute(self):
        # assertions before running solver to validate mandatory args to class
        self.init_solver()

        # set variables
        variables = self.set_solver_variables()

        self.set_constraints(**variables)

        self.set_objective(**variables)
        # solution
        status = self.run()

        # todo refactor exporter
        exporter = SolverV5OutputExporter(solver=self.solver, solver_status=status, input_processor=self.input_processor, solver_variables=variables)
        # sequential_data = self.export_sequential_data(status, **variables)
        sequential_data = exporter.sequential_routes
        summary_data = exporter.summary_exporter
        output_data = exporter.output_exporter
        aggregated_data = exporter.aggregated_exporter
        vehicles_data = exporter.vehicles_exporter
        confusion_matrix_data = exporter.confusion_matrix_exporter

        print(f"sequential_data: {sequential_data}")
        print(f"summary_data.df: {summary_data.df}")
        print(f"output_data.df: {output_data.df}")
        print(f"aggregated_data.df: {aggregated_data.df}")
        print(f"vehicles_data.df: {vehicles_data.df}")
        print(f"confusion_matrix_data.df: {confusion_matrix_data.df}")
        print(f"status: {status}")

        return sequential_data, summary_data.df, output_data.df, aggregated_data.df, vehicles_data.df, confusion_matrix_data.df, status

    def run(self):
        self.solver.EnableOutput()
        self.solver.SetTimeLimit(600 * 1000)
        self.solver.SetNumThreads(10)
        status = self.solver.Solve()
        # todo integrate exporter
        return status


