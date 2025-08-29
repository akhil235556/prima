import copy
import uuid
import pandas as pd
from ortools.linear_solver import pywraplp
from abc import abstractmethod, ABC
from itertools import repeat


class SolverV5OutputExporter(object):

    routes = list()

    def __init__(self, solver, solver_status, input_processor, solver_variables):
        self.solver_status = solver_status
        self.routes = self.get_routes(self.solver_status, input_processor, **solver_variables)

        kwargs = dict(
            solver=solver,
            solver_status=self.get_solver_status(self.solver_status),
            solver_routes=self.routes,
            input_processor=input_processor
        )

        self.sequential_exporter = SequentialExporter(**kwargs)
        self.summary_exporter = SummaryExporter(**kwargs)
        self.output_exporter = OutputExporter(**kwargs)
        self.aggregated_exporter = AggregatedExporter(**kwargs)
        self.vehicles_exporter = VehiclesExporter(**kwargs)
        self.confusion_matrix_exporter = ConfusionMatrixExporter(**kwargs)
        self.process()

    @staticmethod
    def get_solver_status(solver_status):
        status = "INFEASIBLE"
        if solver_status == pywraplp.Solver.OPTIMAL:
            status = "OPTIMAL"
        if solver_status == pywraplp.Solver.FEASIBLE:
            status = "FEASIBLE"
        return status

    @staticmethod
    def get_routes(solver_status, input_processor, x, y, v, w):
        vehicle_classifier = input_processor.vehicle_classifier
        order_classifier = input_processor.order_classifier
        orders = input_processor.orders
        vehicles = input_processor.vehicles

        routes = list()

        if solver_status == "INFEASIBLE":
            return routes

        for l, vehicle_classifier_key in enumerate(vehicle_classifier.keys):
            for j in vehicle_classifier.get(vehicle_classifier_key):
                if y[(l, j)].solution_value() > 0:
                    route_df = dict(
                        vehicle_index=int,
                        orders_indices=list(),
                        touchpoints_key=list()
                    )
                    # j truck is selected for lane l
                    route_df['vehicle_index'] = vehicles.get_vehicle(j).index
                    order_indices = list()
                    for n, order_classifier_key in enumerate(order_classifier.keys):
                        if v[n, l, j].solution_value() > 0:
                            route_df['touchpoints_key'].append(order_classifier_key)
                        for i in order_classifier.get(order_classifier_key):
                            if x[n, l, i, j].solution_value() > 0:
                                order_indices.append(orders.get_order(i).index)
                    route_df['orders_indices'] = order_indices

                    routes.append(route_df)
        return routes

    def process(self):
        self.sequential_exporter.process()
        self.summary_exporter.process()
        self.output_exporter.process()
        self.aggregated_exporter.process()
        self.vehicles_exporter.process()
        self.confusion_matrix_exporter.process()

    @property
    def sequential_routes(self):
        return self.sequential_exporter.routes

    @property
    def summary_df(self):
        return self.summary_exporter.df


class SequentialExporter(object):

    sequential_routes = list()
    solver_routes = list()

    def __init__(self, solver_routes, input_processor, **kwargs):

        self.solver_routes = copy.deepcopy(solver_routes)
        self.input_processor = input_processor
        self.sequential_routes = SequentialExporter.sequential_routes

    @property
    def routes(self):
        return self.sequential_routes

    def process(self):

        _sequential_routes = []
        orders = self.input_processor.orders
        vehicles = self.input_processor.vehicles

        for route in self.solver_routes:
            sequential_route = dict(
                vehicles=pd.DataFrame(),
                task=pd.DataFrame()
            )

            sequential_route['vehicles'] = vehicles.get_vehicle_df(route.get('vehicle_index'))
            sequential_route['task'] = orders.get_order_df(route.get('orders_indices'))

            _sequential_routes.append(sequential_route)
        self.sequential_routes = _sequential_routes

        return self


class SheetExporter(object):

    def __init__(self, solver, solver_status, solver_routes, input_processor, **kwargs):
        self.solver_routes = copy.deepcopy(solver_routes)
        self.solver_status = solver_status
        self.solver = solver
        self.input_processor = input_processor

    @abstractmethod
    def df(self):
        pass

    @abstractmethod
    def process(self):
        pass

    @staticmethod
    def round_df(df: pd.DataFrame, round_by=3):
        return df.round(round_by)


class SummaryExporter(SheetExporter):

    summary_df = pd.DataFrame()

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    @property
    def df(self):
        return self.summary_df

    def process(self):
        _df = self.get_df()
        self.summary_df = self.round_df(_df)

    @staticmethod
    def get_optimality_gap(solver):
        if not solver.Objective().Value() == 0:
            return ((solver.Objective().Value() - solver.Objective().BestBound()) / solver.Objective().Value()) * 100
        else:
            return 0

    def get_aggregated_summary(self):
        vehicles = self.input_processor.vehicles
        orders = self.input_processor.orders

        total_route_load = 0
        total_route_volume = 0
        total_route_weight_utilization = 0
        total_route_volume_utilization = 0

        for route in self.solver_routes:
            # todo use mapper instead of df
            vehicle_df = vehicles.get_vehicle_df(route.get('vehicle_index'))
            order_df = orders.get_order_df(route.get('orders_indices'))

            total_route_load += order_df['load'].sum()
            total_route_volume += order_df['volume'].sum()
            if vehicle_df['capacity'].sum():
                total_route_weight_utilization += (order_df['load'].sum() / vehicle_df['capacity'].sum()) * 100
            else:
                total_route_weight_utilization += 0
            if vehicle_df['volumetric_capacity'].sum():
                total_route_volume_utilization += (order_df['volume'].sum() / vehicle_df['volumetric_capacity'].sum()) * 100
            else:
                total_route_weight_utilization += 0
        no_of_routes = len(self.solver_routes)

        if no_of_routes == 0:
            return dict()
        else:
            return dict(
                total_load=total_route_load,
                total_volume=total_route_volume,
                average_route_weight_utilization=total_route_weight_utilization / no_of_routes,
                average_route_volume_utilization=total_route_volume_utilization / no_of_routes
            )

    def get_df(self):
        solver = self.solver

        aggregated_dict = self.get_aggregated_summary()

        summary_dict = {
            "Overall Objective Function Value (Total Cost INR)": solver.Objective().Value(),
            "No. of Discrete Variables": solver.NumVariables(),
            "No. of Constraints": 12,
            "Solution Time (min)": round(solver.wall_time() / 60000, 1) or 0.1,
            "Solver Status": self.solver_status,
            "% Optimality Gap": self.get_optimality_gap(solver),
            "Total Weight (KG)": aggregated_dict.get('total_load'),
            "Total Volume (CBM)": aggregated_dict.get('total_volume'),
            "Avg. Wt Utilization (%)": aggregated_dict.get('average_route_weight_utilization'),
            "Avg. Vol. Utilization (%)": aggregated_dict.get('average_route_volume_utilization'),

        }
        summary_list = list()
        summary_list.append(summary_dict)
        sum_df = pd.DataFrame(summary_list)
        sum_df.index = sum_df.index + 1
        return sum_df


class OutputExporter(SheetExporter):
    output_df = pd.DataFrame()

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    @property
    def df(self):
        return self.output_df

    def process(self):
        _df = self.get_df()
        self.output_df = self.round_df(_df)

    @staticmethod
    def get_objective_value(solver):
        return solver.Objective().Value()

    def get_output_data(self):
        pd.set_option('display.max_columns', None)
        vehicles = self.input_processor.vehicles
        orders = self.input_processor.orders
        planning_id = 1

        output = dict(
            planning_id=list(),
            order_id=list(),
            vehicle_type=list(),
            from_city=list(),
            to_city=list(),
            weight_utilization=list(),
            volume_utilization=list(),
            order=list(),
            from_address=list(),
            to_address=list(),
            load=list(),
            volume=list(),
            cost=list()
        )

        for route in self.solver_routes:
            vehicle_df = vehicles.get_vehicle_df(route.get('vehicle_index'))
            order_df = orders.get_order_df(route.get('orders_indices'))
            vehicle_type = vehicle_df.iloc[0]['vehicle_type_name']
            vehicle_weight = vehicle_df.iloc[0]['capacity']
            vehicle_volume = vehicle_df.iloc[0]['volumetric_capacity']
            total_load = order_df['load'].sum()
            total_volume = order_df['volume'].sum()
            repeat_value = len(route.get('orders_indices'))
            num_touch_points = len(route.get('touchpoints_key')) - 1
            fixed_cost = vehicle_df.iloc[0]['fixed_charges']
            touchpoint_cost = vehicle_df.iloc[0]['tp_cost'] * num_touch_points
            total_cost = fixed_cost + touchpoint_cost

            output['planning_id'].extend(repeat(planning_id, repeat_value))
            output['order_id'].extend(order_df['task_id'].values.tolist())
            output['from_city'].extend(order_df['from_city'].values.tolist())
            output['to_city'].extend(order_df['to_city'].values.tolist())
            output['vehicle_type'].extend(repeat(vehicle_type, repeat_value))
            output['load'].extend(order_df['load'].values.tolist())
            output['volume'].extend(order_df['volume'].values.tolist())
            output['cost'].extend(repeat(total_cost, repeat_value))
            if vehicle_weight:
                output['weight_utilization'].extend(repeat((total_load/vehicle_weight) * 100, repeat_value))
            else:
                output['weight_utilization'].extend(repeat(0, repeat_value))
            if vehicle_volume:
                output['volume_utilization'].extend(repeat((total_volume / vehicle_volume) * 100, repeat_value))
            else:
                output['volume_utilization'].extend(repeat(0, repeat_value))
            output['from_address'].extend(order_df['from_location'].values.tolist())
            output['to_address'].extend(order_df['to_location'].values.tolist())
            planning_id += 1

        return output

    def get_df(self):
        output = self.get_output_data()

        output_dict = {
            'Planning ID': output.get('planning_id'),
            'From City': output.get('from_city'),
            'To City': output.get('to_city'),
            'Vehicle Type Name': output.get('vehicle_type'),
            'Weight Utilisation(%)': output.get('weight_utilization'),
            'Volume Utilisation (%)': output.get('volume_utilization'),
            'Shipment ID': output.get('order_id'),
            'From Node (Location Name)': output.get('from_address'),
            'RDC/Consignee (Location Name)': output.get('to_address'),
            'Weight(KG)': output.get('load'),
            'Volume(CBM)': output.get('volume'),
            'Cost(INR)': output.get('cost')
        }

        output_df = pd.DataFrame(output_dict)
        return output_df


class AggregatedExporter(SheetExporter):
    agg_df = pd.DataFrame()

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    @property
    def df(self):
        return self.agg_df

    def process(self):
        _agg_df = self.get_agg_df()
        self.agg_df = self.round_df(_agg_df)

    @staticmethod
    def get_objective_value(solver):
        return solver.Objective().Value()

    @staticmethod
    def get_delivery_cities(order_df):
        delivery_cities = list(set(order_df['to_city'].values.tolist()))
        delivery_cities_str = ', '.join([x for x in delivery_cities])
        return delivery_cities_str

    @staticmethod
    def get_touchpoint_data(route):
        b = route.get('touchpoints_key')
        touchpoint = ', '.join([xs[1] for xs in b])
        return touchpoint

    def get_aggregated_data(self):
        pd.set_option('display.max_columns', None)
        vehicles = self.input_processor.vehicles
        orders = self.input_processor.orders
        planning_id = 1

        #TODO: Number of Touch Point, Touch Point Locations

        agg = dict(
            planning_id=list(),
            vehicle_type=list(),
            from_city=list(),
            to_city=list(),
            weight_utilization=list(),
            volume_utilization=list(),
            order=list(),
            load=list(),
            volume=list(),
            touch_point_cost=list(),
            total_cost=list(),
            fixed_cost=list(),
            num_touch_point=list(),
            touch_point_loc=list(),
            delivery_cities=list()
        )

        for route in self.solver_routes:
            vehicle_df = vehicles.get_vehicle_df(route.get('vehicle_index'))
            order_df = orders.get_order_df(route.get('orders_indices'))
            num_touch_points = len(route.get('touchpoints_key')) - 1
            vehicle_weight = vehicle_df.iloc[0]['capacity']
            vehicle_volume = vehicle_df.iloc[0]['volumetric_capacity']
            total_load = order_df['load'].sum()
            total_volume = order_df['volume'].sum()
            touchpoint_loc = self.get_touchpoint_data(route)
            fixed_cost = vehicle_df.iloc[0]['fixed_charges']
            touchpoint_cost = vehicle_df.iloc[0]['tp_cost'] * num_touch_points
            total_cost = fixed_cost + touchpoint_cost

            agg['planning_id'].append(planning_id)
            agg['from_city'].append(vehicle_df.iloc[0]['from_city'])
            agg['to_city'].append(vehicle_df.iloc[0]['to_city'])
            agg['vehicle_type'].append(vehicle_df.iloc[0]['vehicle_type_name'])
            agg['load'].append(total_load)
            agg['volume'].append(total_volume)
            if vehicle_weight:
                agg['weight_utilization'].append((total_load/vehicle_weight) * 100)
            else:
                agg['weight_utilization'].append(0)
            if vehicle_volume:
                agg['volume_utilization'].append((total_volume / vehicle_volume) * 100)
            else:
                agg['volume_utilization'].append(0)
            agg['num_touch_point'].append(num_touch_points)
            agg['touch_point_loc'].append(touchpoint_loc)
            agg['fixed_cost'].append(fixed_cost)
            agg['touch_point_cost'].append(touchpoint_cost)
            agg['total_cost'].append(total_cost)
            agg['delivery_cities'].append(self.get_delivery_cities(order_df))
            planning_id += 1

        return agg

    def get_agg_df(self):
        agg = self.get_aggregated_data()

        agg_dict = {
            'Planning ID': agg.get('planning_id'),
            'From City': agg.get('from_city'),
            'To City': agg.get('to_city'),
            'Vehicle Type Name': agg.get('vehicle_type'),
            'Weight Utilisation(%)': agg.get('weight_utilization'),
            'Volume Utilisation (%)': agg.get('volume_utilization'),
            'Load Carrying(KG)': agg.get('load'),
            'Volume Carrying(CBM)': agg.get('volume'),
            'Route Cost(INR)': agg.get('fixed_cost'),
            'Touch Point Cost(INR)': agg.get('touch_point_cost'),
            'Total Cost(INR)': agg.get('total_cost'),
            'Number of Touch Points': agg.get('num_touch_point'),
            'Delivery Locations': agg.get('touch_point_loc'),
            'Delivery Cities': agg.get('delivery_cities')
        }

        agg_df = pd.DataFrame(agg_dict)
        return agg_df


class VehiclesExporter(SheetExporter):
    vehicles_df = pd.DataFrame()

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    @property
    def df(self):
        return self.vehicles_df

    def process(self):
        _vehicle_df = self.get_vehicle_df()
        self.vehicles_df = self.round_df(_vehicle_df)

    @staticmethod
    def get_objective_value(solver):
        return solver.Objective().Value()

    def get_vehicle_data(self):
        pd.set_option('display.max_columns', None)
        vehicles = self.input_processor.vehicles

        vehicle = dict(
            vehicle_type=list(),
            from_city=list(),
            to_city=list(),
        )

        for route in self.solver_routes:
            vehicle_df = vehicles.get_vehicle_df(route.get('vehicle_index'))

            vehicle['from_city'].append(vehicle_df.iloc[0]['from_city'])
            vehicle['to_city'].append(vehicle_df.iloc[0]['to_city'])
            vehicle['vehicle_type'].append(vehicle_df.iloc[0]['vehicle_type_name'])

        return vehicle

    def get_vehicle_df(self):
        vehicle = self.get_vehicle_data()

        grouping = ['From City', 'To City', 'Vehicle Type Name']

        vehicle_dict = {
            'From City': vehicle.get('from_city'),
            'To City': vehicle.get('to_city'),
            'Vehicle Type Name': vehicle.get('vehicle_type')
        }

        vehicle_df = pd.DataFrame(vehicle_dict)
        vehicle_df['Number of Vehicles'] = vehicle_df.groupby(grouping)['Vehicle Type Name'].transform('size')
        vehicle_df = vehicle_df.drop_duplicates()
        vehicle_df.index = vehicle_df.index + 1
        vehicle_df.loc['Total'] = vehicle_df[['Number of Vehicles']].sum()
        vehicle_df.fillna('', inplace=True)
        return vehicle_df

class ConfusionMatrixExporter(SheetExporter):
    confmatrix_df = pd.DataFrame()

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    @property
    def df(self):
        return self.confmatrix_df

    def process(self):
        _cm_df = self.get_cm_df()
        self.confmatrix_df = self.round_df(_cm_df)

    def get_cm_data(self):
        pd.set_option('display.max_columns', None)
        vehicles = self.input_processor.vehicles
        orders = self.input_processor.orders
        vehicle_classifier = self.input_processor.vehicle_classifier
        planning_id = 1

        cm = dict(
            planning_id=list(),
            vehicle_type=list(),
            from_city=list(),
            to_city=list(),
            weight_utilization=list(),
            volume_utilization=list(),
            order=list(),
            load=list(),
            volume=list(),
            total_cost=list(),
            selected_vehicle=list()
        )

        for route in self.solver_routes:
            vehicle_df = vehicles.get_vehicle_df(route.get('vehicle_index'))
            order_df = orders.get_order_df(route.get('orders_indices'))
            num_touch_points = len(route.get('touchpoints_key')) - 1
            vehicle_weight = vehicle_df.iloc[0]['capacity']
            vehicle_volume = vehicle_df.iloc[0]['volumetric_capacity']
            total_load = order_df['load'].sum()
            total_volume = order_df['volume'].sum()
            fixed_cost = vehicle_df.iloc[0]['fixed_charges']
            touchpoint_cost = vehicle_df.iloc[0]['tp_cost'] * num_touch_points
            total_cost = fixed_cost + touchpoint_cost

            cm['planning_id'].append(planning_id)
            cm['from_city'].append(vehicle_df.iloc[0]['from_city'])
            cm['to_city'].append(vehicle_df.iloc[0]['to_city'])
            cm['vehicle_type'].append(vehicle_df.iloc[0]['vehicle_type_name'])
            cm['load'].append(total_load)
            cm['volume'].append(total_volume)
            if vehicle_weight:
                cm['weight_utilization'].append((total_load / vehicle_weight) * 100)
            else:
                cm['weight_utilization'].append(0)
            if vehicle_volume:
                cm['volume_utilization'].append((total_volume / vehicle_volume) * 100)
            else:
                cm['volume_utilization'].append(0)

            cm['total_cost'].append(total_cost)
            cm['selected_vehicle'].append('CHECK')

            fromcity = vehicle_df.iloc[0]["from_city"]
            tocity = vehicle_df.iloc[0]["to_city"]
            for l, vehicle_classifier_key in enumerate(vehicle_classifier.keys):
                for j in vehicle_classifier.get(vehicle_classifier_key):
                    v1 = vehicles.get_vehicle(j)
                    if v1.index != (route.get('vehicle_index')):
                        vehicle_df1 = vehicles.get_vehicle_df(v1.index)
                        city1 = vehicle_df1.iloc[0]['from_city']
                        city2 = vehicle_df1.iloc[0]['to_city']
                        if city1 == fromcity and city2 == tocity:
                            vehicle_weight1 = vehicle_df1.iloc[0]['capacity']
                            vehicle_volume1 = vehicle_df1.iloc[0]['volumetric_capacity']
                            fixed_cost1 = vehicle_df1.iloc[0]['fixed_charges']
                            touchpoint_cost1 = vehicle_df1.iloc[0]['tp_cost'] * num_touch_points
                            total_cost1 = fixed_cost1 + touchpoint_cost1

                            cm['planning_id'].append(planning_id)
                            cm['from_city'].append(city1)
                            cm['to_city'].append(city2)
                            cm['vehicle_type'].append(vehicle_df1.iloc[0]['vehicle_type_name'])
                            cm['load'].append(total_load)
                            cm['volume'].append(total_volume)
                            if vehicle_weight:
                                cm['weight_utilization'].append((total_load / vehicle_weight) * 100)
                            else:
                                cm['weight_utilization'].append(0)
                            if vehicle_volume:
                                cm['volume_utilization'].append((total_volume / vehicle_volume) * 100)
                            else:
                                cm['volume_utilization'].append(0)
                            cm['total_cost'].append(total_cost1)
                            cm['selected_vehicle'].append(' ')
            planning_id += 1

        return cm

    def get_cm_df(self):
        cm = self.get_cm_data()

        cm_dict = {
            'Planning ID': cm.get('planning_id'),
            'From City': cm.get('from_city'),
            'To City': cm.get('to_city'),
            'Vehicle Type Name': cm.get('vehicle_type'),
            'Weight Utilisation(%)': cm.get('weight_utilization'),
            'Volume Utilisation (%)': cm.get('volume_utilization'),
            'Load Carrying(KG)': cm.get('load'),
            'Volume Carrying(CBM)': cm.get('volume'),
            'Total Cost(INR)': cm.get('total_cost'),
            'selected_vehicle': cm.get('selected_vehicle')
        }

        confmatrix_df = pd.DataFrame(cm_dict)
        return confmatrix_df
#
#
#
#
# def get_summary_csv_file_path(rid):
#     if not rid:
#         rid = str(uuid.uuid4())
#     return f"{AppConfig().temp_dir}/{rid}_summary.csv"
#
# def get_vehicle_csv_file_path(rid):
#     if not rid:
#         rid = str(uuid.uuid4())
#     return f"{AppConfig().temp_dir}/{rid}_vehicles.csv"
#
# def get_output_csv_file_path(rid):
#     if not rid:
#         rid = str(uuid.uuid4())
#     return f"{AppConfig().temp_dir}/{rid}_output.csv"
#
#
# def get_aggregated_csv_file_path(rid):
#     if not rid:
#         rid = str(uuid.uuid4())
#     return f"{AppConfig().temp_dir}/{rid}_aggregated_output.csv"
#
#
# def get_confusion_matrix_csv_file_path(rid):
#     if not rid:
#         rid = str(uuid.uuid4())
#     return f"{AppConfig().temp_dir}/{rid}_confusion_matrix.csv"
#
#
# def export_dummy_output(response, rid=None):
#     csv_file_path = get_dummy_output_csv_file_path(rid)
#     output_dict = response.get('output')
#     pd.DataFrame.from_dict(output_dict).to_csv(csv_file_path, index=False)
#     return csv_file_path
#
# def export_summary_output(summary):
#     summary_dict = summary.copy()
#
#     header_map = {
#         'city': 'City',
#         'obj': 'Overall Objective Function Value (Total Cost INR)',
#         'discrete_var': 'No. of Discrete Variables',
#         'num_constraints': 'No. of Constraints',
#         'solution_time': 'Solution Time (min)',
#         'status': 'Solver Status',
#         'opt_gap': '% Optimality Gap',
#         'total_wt': 'Total Weight (KG)',
#         'total_vol': 'Total Volume (CBM)',
#         'avg_wt_utilization': 'Avg. Wt Utilization (%)',
#         'avg_vol_utilization': 'Avg. Vol. Utilization (%)',
#         'per_unit_wt_cost': 'Per Unit Wt. Cost'
#     }
#
#     summary_csv_header = ['City', 'Overall Objective Function Value (Total Cost INR)', 'No. of Discrete Variables',
#                           'No. of Constraints', 'Solution Time (min)', 'Solver Status', '% Optimality Gap',
#                           'Total Weight (KG)', 'Total Volume (CBM)', 'Avg. Wt Utilization (%)',
#                           'Avg. Vol. Utilization (%)', 'Per Unit Wt. Cost']
#
#     _summary_numeric_cols = ['Overall Objective Function Value (Total Cost INR)', 'No. of Discrete Variables',
#                              'No. of Constraints', 'Solution Time (min)', '% Optimality Gap', 'Total Weight (KG)',
#                              'Total Volume (CBM)', 'Avg. Wt Utilization (%)', 'Avg. Vol. Utilization (%)',
#                              'Per Unit Wt. Cost']
#
#     total_value_columns = ['Overall Objective Function Value (Total Cost INR)', 'No. of Discrete Variables',
#                            'No. of Constraints', 'Solution Time (min)', 'Total Weight (KG)',
#                            'Total Volume (CBM)']
#
#     average_value_columns = ['Avg. Wt Utilization (%)', 'Avg. Vol. Utilization (%)', '% Optimality Gap',
#                              'Per Unit Wt. Cost']
#
#
#     # remap header
#     summary_dict = {header_map[k]: v for k, v in summary_dict.items() if k in header_map.keys()}
#     s_df = pd.DataFrame(summary_dict, columns=summary_csv_header)
#     s_df.index = s_df.index + 1
#     s_df.loc['Total'] = s_df[total_value_columns].sum()
#     s_df.loc['Avg'] = s_df[average_value_columns].mean()
#     s_df[_summary_numeric_cols] = round_df_values(s_df, _summary_numeric_cols)
#
#     return s_df
#
# def export_vehicle_output(vehicle_data, cities):
#     v_df = pd.DataFrame(vehicle_data)
#     v_df.index = v_df.index + 1
#     v_df.loc['Total'] = v_df[cities].sum()
#     v_df['Total'] = v_df[cities].sum(axis=1)
#     v_df = v_df.rename({'Truck_Type': 'Vehicle Type'}, axis=1)
#     return v_df
#
#
# def export_aggregated_output(solver_output):
#     data_dict = solver_output.copy()
#
#     header_map = {
#         'planning_id': 'Planning ID',
#         'vehicle_type': 'Vehicle Type Name',
#         'from_city': 'From City',
#         'to_city': 'To City',
#         'vehicle_load': 'Load Carrying(KG)',
#         'vehicle_volume': 'Volume Carrying(CBM)',
#         'weight_utilization': 'Weight Utilisation(%)',
#         'volume_utilization': 'Volume Utilisation (%)',
#         'cost': 'Cost(INR)'
#     }
#
#     csv_header = ['Planning ID', 'Vehicle Type Name', 'From City', 'To City', 'Load Carrying(KG)',
#                   'Volume Carrying(CBM)', 'Weight Utilisation(%)', 'Volume Utilisation (%)', 'Cost(INR)']
#
#     _numeric_cols = ['Load Carrying(KG)', 'Volume Carrying(CBM)', 'Weight Utilisation(%)', 'Volume Utilisation (%)',
#                      'Cost(INR)']
#
#     # remap header
#     data_dict = {header_map[k]: v for k, v in data_dict.items() if k in header_map.keys()}
#     ag_df = pd.DataFrame(data_dict, columns=csv_header)
#     ag_df[_numeric_cols] = round_df_values(ag_df, _numeric_cols)
#     # df to csv
#
#     return ag_df
#
#
# def export_output(output_dict):
#     data_dict = output_dict.copy()
#
#     header_map = {
#         'planning_id': 'Planning ID',
#         'vehicle_type': 'Vehicle Type Name',
#         'weight_utilization': 'Weight Utilisation(%)',
#         'volume_utilization': 'Volume Utilisation (%)',
#         'order': 'Order No.',
#         'sku': 'SKU',
#         'sku_class': 'SKU Class',
#         'from_address': 'From Address',
#         'to_address': 'To Address',
#         'load': 'Weight(KG)',
#         'volume': 'Volume(CBM)',
#         'cost': 'Cost(INR)',
#     }
#
#     csv_header = ['Planning ID', 'Vehicle Type Name', 'Weight Utilisation(%)', 'Volume Utilisation (%)', 'Order No.',
#                   'SKU', 'SKU Class', 'From Address', 'To Address', 'Weight(KG)', 'Volume(CBM)', 'Cost(INR)']
#
#     _numeric_cols = ['Cost(INR)', 'Weight Utilisation(%)', 'Volume Utilisation (%)']
#
#     # remap header
#     data_dict = {header_map[k]: v for k, v in data_dict.items() if k in header_map.keys()}
#     output_df = pd.DataFrame(data_dict, columns=csv_header)
#     output_df[_numeric_cols] = round_df_values(output_df, _numeric_cols)
#     # df to csv
#
#     return output_df
#
# def export_confusion_matrix(cm_dict):
#     data_dict = copy.copy(cm_dict)
#
#     header_map = {
#         'planning_id': 'Planning ID',
#         'skus': 'SKUs',
#         'vehicle_load': 'Load (KG)',
#         'vehicle_volume': 'Volume (CBM)',
#         'vehicle_type': 'Vehicle Type',
#         'cost': 'Total Cost (INR)',
#         'weight_utilization': 'Vehicle Weight Utilisation (%)',
#         'volume_utilization': 'Vehicle Volume Utilisation (%)',
#         'is_selected': 'Is Vehicle Selected For Route',
#     }
#
#     csv_header = ['Planning ID', 'SKUs', 'Load (KG)', 'Volume (CBM)', 'Vehicle Type', 'Total Cost (INR)',
#                   'Vehicle Weight Utilisation (%)', 'Vehicle Volume Utilisation (%)',  'Is Vehicle Selected For Route']
#
#     _numeric_cols = ['Total Cost (INR)', 'Vehicle Weight Utilisation (%)',
#                      'Vehicle Volume Utilisation (%)']
#
#     # remap header
#     data_dict = {header_map[k]: v for k, v in data_dict.items() if k in header_map.keys()}
#     output_df = pd.DataFrame(data_dict, columns=csv_header)
#     output_df[_numeric_cols] = round_df_values(output_df, _numeric_cols)
#     # df to csv
#
#     return output_df
#
#
# def round_df_values(df: pd.DataFrame, column_names: list, decimal=3) -> pd.DataFrame:
#     """Round df columns to 'decimal' no. of places"""
#     return df[column_names].round(decimal)
#
# def parse_hour_decimal(csv_row: dict, column_names: list) -> dict:
#     for column in column_names:
#         if csv_row.get(column):
#             time = csv_row.get(column)
#             hours = int(time)
#             minutes = (time * 60) % 60
#             if minutes < 10:
#                 csv_row[column] = f"{hours}:0{int(minutes)}"
#             else:
#                 csv_row[column] = f"{hours}:{int(minutes)}"
#     return csv_row
#
# def round_csv_values(csv_row: dict, column_names: list) -> dict:
#     for column in column_names:
#         if csv_row.get(column):
#             csv_row[column] = round(csv_row.get(column), 3)
#     return csv_row
