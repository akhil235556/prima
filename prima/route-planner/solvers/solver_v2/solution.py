import copy
from route_planner.utils import logging

from route_planner.utils.utils import generate_request_id, to_np_array
import numpy as np


logger = logging.getLogger(__name__)


class SolverSolutionProviderV2(object):

    def __init__(self, solver_output, orders, vehicles, products, config, from_city=None, to_city=None, status=None):
        self._solver_output = solver_output
        self._orders = orders
        self._vehicles = vehicles
        self._products = products
        self._solver_config = config
        self._output = None
        self._confusion_matrix = None
        self._aggregated_output = None
        self.from_city = from_city
        self.to_city = to_city
        self.status = status

    def get_output(self):
        return self._output

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
    def _get_output(output_dict, _orders, _products, config):
        flatten_output = dict(
            planning_id=list(),
            vehicle_type=list(),
            weight_utilization=list(),
            volume_utilization=list(),
            order=list(),
            sku=list(),
            sku_class=list(),
            from_address=list(),
            to_address=list(),
            load=list(),
            volume=list(),
            cost=list()
        )
        for veh_no in output_dict.get('no_of_vehicles'):
            # flatten on orders
            for idx, order_id in enumerate(output_dict.get('order_ids')[veh_no]):
                # insert values which are not flatten by plan_id index
                flatten_output['planning_id'].append(output_dict.get('planning_id')[veh_no])
                flatten_output['vehicle_type'].append(output_dict.get('vehicle_type')[veh_no])
                if config.vehicle_load_capacity_constraint:
                    flatten_output['weight_utilization'].append(output_dict.get('weight_utilization')[veh_no])
                if config.vehicle_volume_capacity_constraint:
                    flatten_output['volume_utilization'].append(output_dict.get('volume_utilization')[veh_no])
                flatten_output['cost'].append(output_dict.get('cost')[veh_no])

                # insert values which are flattened by
                flatten_output['order'].append(output_dict.get('orders')[veh_no][idx])
                # order_index = (_orders['order_id'] == order_id)
                sku = _orders.loc[order_id, 'sku']
                flatten_output['sku'].append(sku)
                flatten_output['from_address'].append(_orders.loc[order_id, 'from_city'])
                flatten_output['to_address'].append(_orders.loc[order_id, 'to_city'])
                if config.vehicle_load_capacity_constraint:
                    flatten_output['load'].append(_orders.loc[order_id, 'load'])
                if config.vehicle_volume_capacity_constraint:
                    flatten_output['volume'].append(_orders.loc[order_id, 'volume'])

                products_index = int(_products[_products['sku'] == sku].index[0])
                flatten_output['sku_class'].append(_products.loc[products_index, 'sku_category'])

        return flatten_output

    @staticmethod
    def _get_confusion_matrix(output_dict, vehicles, _orders, config):
        _vehicles = vehicles.copy()
        cm = dict(
            planning_id=list(),
            skus=list(),
            vehicle_load=list(),
            vehicle_volume=list(),
            vehicle_type=list(),
            cost=list(),
            weight_utilization=list(),
            volume_utilization=list(),
            is_selected=list(),
            status=list()
        )
        for veh_no in output_dict.get('no_of_vehicles'):
            v_load = None
            v_vol = None

            # For Planned Vehicle

            skus = ",".join([_orders.loc[order_id, 'sku'] for order_id in output_dict.get('order_ids')[veh_no]])
            v_typ = output_dict.get('vehicle_type')[veh_no]
            plan_id = output_dict.get('planning_id')[veh_no]
            stat = output_dict.get('status')[veh_no]
            cm['planning_id'].append(plan_id)
            cm['skus'].append(skus)
            cm['vehicle_type'].append(v_typ)
            cm['cost'].append(output_dict.get('cost')[veh_no])
            cm['is_selected'].append('CHECK')
            cm['status'].append(stat)

            if config.vehicle_load_capacity_constraint:
                v_load = output_dict.get('vehicle_load')[veh_no]
                cm['vehicle_load'].append(v_load)
                cm['weight_utilization'].append(output_dict.get('weight_utilization')[veh_no])

            if config.vehicle_volume_capacity_constraint:
                v_vol = output_dict.get('vehicle_volume')[veh_no]
                cm['vehicle_volume'].append(v_vol)
                cm['volume_utilization'].append(output_dict.get('volume_utilization')[veh_no])

            _vehicles_nd = _vehicles.drop_duplicates(subset=['vehicle_index'])
            possible_vehicles = _vehicles_nd[_vehicles_nd['vehicle_type_name'] != v_typ].to_dict(orient='list')
            if possible_vehicles:
                n = len(possible_vehicles['vehicle_index'])
                cm['planning_id'].extend([plan_id] * n)
                cm['skus'].extend([skus] * n)
                cm['vehicle_type'].extend(possible_vehicles['vehicle_type_name'])
                fc = np.nan_to_num(to_np_array(possible_vehicles['fixed_charges']))
                vc = np.nan_to_num(to_np_array(possible_vehicles['per_kg_charges']))*v_load
                cm['cost'].extend((fc + vc).tolist())
                cm['is_selected'].extend([''] * n)
                cm['status'].extend([stat] * n)

                if config.vehicle_load_capacity_constraint:
                    cm['vehicle_load'].extend([v_load] * n)
                    v_weight_ut = ((to_np_array([v_load] * n) / to_np_array(possible_vehicles['capacity'])) * 100).tolist()
                    cm['weight_utilization'].extend(v_weight_ut)

                if config.vehicle_volume_capacity_constraint:
                    cm['vehicle_volume'].extend([v_vol] * n)
                    v_volume_ut = ((to_np_array([v_vol] * n) / to_np_array(possible_vehicles['volumetric_capacity'])) * 100).tolist()
                    cm['volume_utilization'].extend(v_volume_ut)

        return cm

    @staticmethod
    def _get_aggregated_output(output_dict, _orders, from_city, to_city):
        _output_dict = copy.copy(output_dict)
        _output_dict['from_city'] = [from_city] * len(_output_dict['no_of_vehicles'])
        _output_dict['to_city'] = [to_city] * len(_output_dict['no_of_vehicles'])
        return _output_dict

    def get_configuration(self):
        return self._solver_config

    def solve(self):
        config = self.get_configuration()
        output = self._get_output(self._solver_output, self._orders, self._products, config)
        cm = self._get_confusion_matrix(self._solver_output, self._vehicles, self._orders, config)
        aggregated_output = self._get_aggregated_output(self._solver_output, self._orders, self.from_city, self.to_city)

        self._output = output
        self._confusion_matrix = cm
        self._aggregated_output = aggregated_output
