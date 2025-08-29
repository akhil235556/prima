import math
from route_planner.utils import logging
from route_planner.sku_variable_cost_optimization_ai_planner.utils import set_zulu_time, utc_to_local
from datetime import datetime, timedelta

from solvers.solver_v3.constants import UTC_FORMAT

logger = logging.getLogger(__name__)


class SolverJsonProcessor(object):
    def __init__(self, orders, vehicles, products, order_to_serv_veh, all_vehicles, valid_load_demands, exclusion_dict, inclusion_dict, config):
        self._solver_config = config
        self._orders = orders
        self._vehicles = vehicles
        self._products = products
        self.ORDER_TO_SERV_VEHICLES_MAP = order_to_serv_veh
        self.ALL_VEHICLES_LIST = all_vehicles
        self.VALID_LOAD_DEMANDS = valid_load_demands
        self.EXCLUSION_DICT = exclusion_dict
        self.INCLUSION_DICT = inclusion_dict

    def get_data(self):
        task_cols = ['order_id', 'task_id', 'from_latitude', 'from_longitude', 'to_latitude', 'to_longitude',
                     'sla_in_s', 'loading_time_s', 'unloading_time_s', 'operating_hours_from', 'operating_hours_to',
                     'penalty', 'sku', 'sku_tag']
        veh_cols = ['veh_index', 'vehicle_type_name', 'fixed_charges', 'per_km_charges', 'per_hour_charges',
                    'driving_hours_from', 'driving_hours_to', 'max_route_length', 'veh_origin', 'veh_origin_lat',
                    'veh_origin_long', 'veh_destination', 'veh_destination_lat', 'veh_destination_long']

        if self.VALID_LOAD_DEMANDS.get('weight'):
            task_cols.append('load')
            veh_cols.append('weight_capacity')
        if self.VALID_LOAD_DEMANDS.get('volume'):
            task_cols.append('volume')
            veh_cols.append('volume_capacity')

        self._orders = self._orders[task_cols]
        self._vehicles = self._vehicles[veh_cols]

    @staticmethod
    def get_visit_request(order: dict, valid_load_demands: dict, request_type: str, time_windows=None):
        """

        :param order: single order dict
        :param valid_load_demands: which load demand is valid
        :param request_type: 'pickup' or 'delivery'
        :param time_windows: list of time windows set
        :return: list of Visit Request
        """

        visit_request_list = list()

        visit_request = dict()
        visit_request['label'] = str(order.get('task_id'))

        if request_type == 'pickup':
            visit_request['arrivalLocation'] = dict()
            visit_request['arrivalLocation']['latitude'] = order.get('from_latitude')
            visit_request['arrivalLocation']['longitude'] = order.get('from_longitude')

            visit_request['duration'] = str(order.get('loading_time_s')) + "s"

        if request_type == 'delivery':
            visit_request['arrivalLocation'] = dict()
            visit_request['arrivalLocation']['latitude'] = order.get('to_latitude')
            visit_request['arrivalLocation']['longitude'] = order.get('to_longitude')

            visit_request['duration'] = str(order.get('unloading_time_s')) + "s"

        visit_request['loadDemands'] = dict()

        if valid_load_demands.get('weight'):
            visit_request['loadDemands']['weight'] = dict(amount=str(int(order.get('load'))))
        if valid_load_demands.get('volume'):
            visit_request['loadDemands']['volume'] = dict(amount=str(int(order.get('volume'))))

        if time_windows:
            solver_time_windows = [{'startTime': window[0], 'endTime': window[1]}for window in time_windows]
            visit_request['timeWindows'] = solver_time_windows

        visit_request_list.append(visit_request)
        return visit_request_list

    @staticmethod
    def process_datetime(date_time, add_days=None, formatted_output=True):
        if add_days:
            date_time += timedelta(days=add_days)
        if formatted_output:
            return date_time.strftime(UTC_FORMAT)
        return date_time

    @staticmethod
    def get_valid_time_windows(abs_from_time, abs_to_time, config, formatted_output=True):

        if not abs_from_time or not abs_to_time:
            return None

        global_start_time = config.global_start_datetime
        global_duration_hours = config.planning_duration_hours

        # utc to India Local Time
        local_global_start = utc_to_local(global_start_time)

        from_datetime = datetime.strptime(abs_from_time, '%H:%M')
        from_time = (from_datetime.hour, from_datetime.minute)

        to_datetime = datetime.strptime(abs_to_time, '%H:%M')
        to_time = (to_datetime.hour, to_datetime.minute)

        # First possible time window
        first_from_time = local_global_start.replace(hour=from_time[0], minute=from_time[1], second=0, microsecond=0)
        first_to_time = local_global_start.replace(hour=to_time[0], minute=to_time[1], second=0, microsecond=0)
        first_from_time_offset = None
        if to_datetime < from_datetime:
            # Next day window roll over case
            first_to_time += timedelta(days=1)

        if first_from_time < local_global_start and first_to_time < local_global_start:
            # if time window on first day is not possible
            first_from_time += timedelta(days=1)
            first_to_time += timedelta(days=1)
        elif first_from_time < local_global_start < first_to_time:
            # slice first window
            first_from_time_offset = local_global_start

        # global end time
        end_time = local_global_start + timedelta(hours=global_duration_hours)

        # intermediate time windows
        time_windows = list()
        for x in range(0, (global_duration_hours // 24) + 1):
            from_window = first_from_time
            to_window = first_to_time

            if x == 0 and first_from_time_offset:
                from_window = first_from_time_offset

            if from_window + timedelta(days=x) < end_time < to_window + timedelta(days=x):
                to_window = end_time - timedelta(days=x)

            if from_window + timedelta(days=x) < end_time:

                time_windows.append((SolverJsonProcessor.process_datetime(from_window, x, formatted_output),
                                    SolverJsonProcessor.process_datetime(to_window, x, formatted_output)))

        return time_windows

    @staticmethod
    def get_shipments(orders, valid_load_demands, order_to_serv_vehs_map, config):
        orders_list = orders.to_dict(orient='records')

        shipments = list()

        for order in orders_list:

            shipment = dict()
            order_id = order.get('order_id')
            delivery_time_windows = SolverJsonProcessor.get_valid_time_windows(order.get('operating_hours_from'),
                                                                               order.get('operating_hours_to'), config)

            shipment['label'] = str(order.get('order_id'))
            shipment['shipmentType'] = str(order.get('order_id'))
            shipment['pickups'] = SolverJsonProcessor.get_visit_request(order, valid_load_demands,
                                                                        request_type='pickup')
            shipment['deliveries'] = SolverJsonProcessor.get_visit_request(order, valid_load_demands,
                                                                           request_type='delivery',
                                                                           time_windows=delivery_time_windows)
            if order_id in order_to_serv_vehs_map.keys():
                shipment['allowedVehicleIndices'] = order_to_serv_vehs_map[order_id]

            if order.get('sla_in_s') > 0:
                shipment['pickupToDeliveryTimeLimit'] = str(order.get('sla_in_s')) + "s"

            # apply penalty constraint
            # 0 penalty is considered infinite penalty
            if order.get('penalty', 0) > 0:
                shipment['penaltyCost'] = order['penalty']

            shipments.append(shipment)

        return shipments

    @staticmethod
    def get_break_time_windows(time_windows, config):
        if not time_windows:
            return None
        # start, end and duration(s)
        break_windows = list()
        start = config.global_start_datetime
        start = utc_to_local(start)
        end = start + timedelta(hours=config.planning_duration_hours)

        curr_start = start

        for time_window in time_windows:
            break_window = dict()
            if time_window[0] > curr_start and (time_window[0] - curr_start).total_seconds() > 2:
                break_start = curr_start + timedelta(seconds=0)
                break_end = time_window[0] - timedelta(seconds=0)
                break_window['start_time'] = break_start.strftime(UTC_FORMAT)
                break_window['end_time'] = break_end.strftime(UTC_FORMAT)
                break_window['duration'] = math.ceil((break_end - break_start).total_seconds())

                break_windows.append(break_window)

            curr_start = time_window[1]

        break_window = dict()
        if curr_start < end and (end - curr_start).total_seconds() > 2:
            break_start = curr_start + timedelta(seconds=0)
            break_end = end - timedelta(seconds=0)
            break_window['start_time'] = break_start.strftime(UTC_FORMAT)
            break_window['end_time'] = break_end.strftime(UTC_FORMAT)
            # floor duration to not break global end time
            break_window['duration'] = math.floor((break_end - break_start).total_seconds())

            break_windows.append(break_window)

        return break_windows

    @staticmethod
    def parse_break_windows(break_windows):
        if not break_windows:
            return None
        parsed_break_windows = list()
        for break_window in break_windows:
            parsed = dict()
            parsed['earliestStartTime'] = break_window.get('start_time')
            parsed['latestStartTime'] = break_window.get('start_time')
            parsed['minDuration'] = str(int(break_window.get('duration'))) + "s"
            parsed_break_windows.append(parsed)
        return parsed_break_windows

    @staticmethod
    def get_vehicles(_vehicles, valid_load_demands, config):
        vehicles_list = _vehicles.to_dict(orient='records')
        vehicles = list()

        for veh in vehicles_list:
            vehicle = dict()
            veh_id = veh.get('veh_index')

            time_windows = SolverJsonProcessor.get_valid_time_windows(veh.get('driving_hours_from'),
                                                                      veh.get('driving_hours_to'),
                                                                      config, formatted_output=False)
            break_windows = SolverJsonProcessor.get_break_time_windows(time_windows, config)
            parsed_break_windows = SolverJsonProcessor.parse_break_windows(break_windows)

            vehicle['label'] = str(veh_id)
            vehicle['fixedCost'] = veh.get('fixed_charges')
            vehicle['costPerKilometer'] = veh.get('per_km_charges')
            vehicle['costPerHour'] = veh.get('per_hour_charges')

            if veh.get('veh_origin'):
                vehicle['startLocation'] = dict()
                vehicle['startLocation']['latitude'] = veh.get('veh_origin_lat')
                vehicle['startLocation']['longitude'] = veh.get('veh_origin_long')

            if veh.get('veh_destination'):
                vehicle['endLocation'] = dict()
                vehicle['endLocation']['latitude'] = veh.get('veh_destination_lat')
                vehicle['endLocation']['longitude'] = veh.get('veh_destination_long')

            if veh.get('max_route_length') > 0:
                vehicle['routeDistanceLimit'] = dict()
                vehicle['routeDistanceLimit']['maxMeters'] = str(int(veh.get('max_route_length')))

            vehicle['loadLimits'] = dict()

            if valid_load_demands.get('weight'):
                vehicle['loadLimits']['weight'] = dict(maxLoad=str(int(veh.get('weight_capacity'))))
            if valid_load_demands.get('volume'):
                vehicle['loadLimits']['volume'] = dict(maxLoad=str(int(veh.get('volume_capacity'))))

            if parsed_break_windows:
                vehicle['breakRule'] = dict()
                vehicle['breakRule']['breakRequests'] = parsed_break_windows

            vehicles.append(vehicle)
        return vehicles

    @staticmethod
    def get_infeasible_shipments(exclusion_dict):
        infeasible = list()
        if not exclusion_dict:
            return infeasible
        logger.info("Infeasible Shipments")
        for order, exc_list in exclusion_dict.items():
            logger.info(f"{order} : {exc_list}")
            for ex in exc_list:
                s = {str(order), str(ex)}
                if s not in infeasible:
                    infeasible.append(s)
        return [list(i) for i in infeasible]

    @staticmethod
    def remove_chaining(rule_dict):
        remove_chain_dict = dict()
        temp = list()
        for order, rule_list in rule_dict.items():
            logger.info(f"{order} : {rule_list}")
            for ex in rule_list:
                s = {str(order), str(ex)}
                if s not in temp:
                    temp.append(s)
                    if str(order) not in remove_chain_dict.keys():
                        remove_chain_dict[str(order)] = list()
                    remove_chain_dict[str(order)].append(str(ex))
        return remove_chain_dict

    @staticmethod
    def get_shipment_type_requirements(inclusion_dict, requirement_mode):
        ship_typ_req_list = list()
        if not inclusion_dict:
            return ship_typ_req_list
        logger.info("Inclusive Shipments")

        inclusion_dict = SolverJsonProcessor.remove_chaining(inclusion_dict)

        for order, inc_list in inclusion_dict.items():
            ship_type_requirement = dict(
                requiredShipmentTypeAlternatives=list(),
                dependentShipmentTypes=list(),
                requirementMode=requirement_mode
            )
            ship_type_requirement['requiredShipmentTypeAlternatives'].append(order)
            ship_type_requirement['dependentShipmentTypes'] = inc_list
            ship_typ_req_list.append(ship_type_requirement)
        return ship_typ_req_list

    def process(self):
        config = self._solver_config
        self.get_data()

        project_id = 'fleet-routing-poc'
        data_json = dict(
            parent=f"projects/{project_id}",
            model=dict()
        )
        model = dict()
        shipments = self.get_shipments(self._orders, valid_load_demands=self.VALID_LOAD_DEMANDS, order_to_serv_vehs_map=self.ORDER_TO_SERV_VEHICLES_MAP, config=config)
        vehicles = self.get_vehicles(self._vehicles, valid_load_demands=self.VALID_LOAD_DEMANDS, config=config)

        infeasible_shipments_list = self.get_infeasible_shipments(self.EXCLUSION_DICT)

        incompatibility_list = [dict(types=ish, incompatibilityMode="NOT_PERFORMED_BY_SAME_VEHICLE") for ish in infeasible_shipments_list]
        compatibility_list = self.get_shipment_type_requirements(self.INCLUSION_DICT, requirement_mode="PERFORMED_BY_SAME_VEHICLE")

        model['shipments'] = shipments
        model['vehicles'] = vehicles
        if incompatibility_list:
            model['shipmentTypeIncompatibilities'] = incompatibility_list

        if compatibility_list:
            model['shipmentTypeRequirements'] = compatibility_list
        now = config.global_start_datetime

        model['globalStartTime'] = set_zulu_time(now)
        model['globalEndTime'] = set_zulu_time(now, offset_in_hours=config.planning_duration_hours)

        logger.info(f"Global Start Time: {model['globalStartTime']}")
        logger.info(f"Global End Time: {model['globalEndTime']}")

        data_json['model'] = model

        return data_json



