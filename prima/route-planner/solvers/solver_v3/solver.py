import os
import json

from route_planner.utils import logging
from google.cloud import optimization_v1
from google.protobuf.json_format import MessageToDict
from google.cloud.optimization_v1.services import fleet_routing
from google.cloud.optimization_v1.services.fleet_routing import transports
from google.cloud.optimization_v1.services.fleet_routing.transports import grpc as fleet_routing_grpc

from route_planner.exceptions.exceptions import SolverException
from solvers.solver_v3.constants import SolvingMode, SearchMode

from solvers.solver_v3.solution import SolverSolutionProviderV3


logger = logging.getLogger(__name__)


class SolverV3(object):

    _orders = None
    _vehicles = None
    _products = None

    _model_dict = None

    valid_load_demands = None
    extra_products = None

    def __init__(self, model_dict, orders, vehicles, products=None, valid_load_demands=None, extra_products=None):

        self._model_dict = model_dict
        self._orders = orders
        self._vehicles = vehicles
        self._products = products
        self.valid_load_demands = valid_load_demands
        self.extra_products = extra_products

    @staticmethod
    def save_json_obj(json_obj, filename):
        with open(filename, "w") as outfile:
            outfile.write(json_obj)
        logger.info(":::" * 50, f"\noutput_file_path: {filename}\n", ":::" * 50)

    @staticmethod
    def set_model_configurations(model_dict):
        model_dict["solvingMode"] = SolvingMode.SOLVE.value
        model_dict["searchMode"] = SearchMode.FIRST_GOOD_SOLUTION.value
        model_dict['timeout'] = "600s"
        return model_dict

    @staticmethod
    def set_optimization_ai_credentials():
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "../route-planner/cred_AI.json"

    @staticmethod
    def set_route_planner_credentials():
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "../route-planner/cred.json"

    @staticmethod
    def solve_json(model_dict):

        json_object = json.dumps(model_dict)
        SolverV3.set_optimization_ai_credentials()
        response = dict()
        try:
            fleet_routing_request = optimization_v1.OptimizeToursRequest.from_json(json_object)
            channel = fleet_routing_grpc.FleetRoutingGrpcTransport.create_channel(
                options=[
                    ("grpc.keepalive_time_ms", 500),
                    ("grpc.max_send_message_length", -1),
                    ("grpc.max_receive_message_length", -1),
                ]
            )
            # Keep-alive pings are sent on the transport. Create the transport using the
            # custom channel The transport is essentially a wrapper to the channel.
            transport = transports.FleetRoutingGrpcTransport(channel=channel)
            client = fleet_routing.client.FleetRoutingClient(transport=transport)
            fleet_routing_response = client.optimize_tours(fleet_routing_request)
            response = MessageToDict(fleet_routing_response._pb)
        except Exception as e:
            raise SolverException(str(e))

        SolverV3.set_route_planner_credentials()
        return response

    @staticmethod
    def parse_output_visits_list(visits, valid_load_demands_dict):
        response = dict(
            drop_orders=list(),
            pickup_orders=list()
        )

        drop_orders_list = list()
        pickup_orders_list = list()
        visit_orders_list = list()

        for visit in visits:
            order_id = int(visit.get('shipmentLabel'))
            visit_orders_list.append(order_id)
            if visit.get('isPickup', False):
                pickup_orders_list.append(order_id)
            else:
                drop_orders_list.append(order_id)

        response['drop_orders'] = drop_orders_list
        response['pickup_orders'] = pickup_orders_list
        response['visit_orders'] = visit_orders_list

        return response

    @staticmethod
    def parse_output(response_dict, valid_load_demands_dict):
        routes = response_dict.get('routes')
        routes_list = list()
        for route in routes:

            if not route.get('visits', None):
                # if vehicle is not selected
                continue

            response = dict()
            metrics = route.get('metrics')

            veh_id = int(route.get('vehicleLabel'))
            route_cost = route.get('routeTotalCost')
            total_duration_s = int(metrics.get('totalDuration')[:-1])
            total_travel_distance_m = metrics.get('travelDistanceMeters')

            # get route total load and volume
            route_load = 0
            route_volume = 0
            max_loads = metrics.get('maxLoads', {})
            if 'weight' in max_loads.keys() and valid_load_demands_dict.get('weight'):
                weight_dict = max_loads['weight']
                route_load = int(weight_dict.get('amount', 0))

            if 'volume' in max_loads.keys() and valid_load_demands_dict.get('volume'):
                volume_dict = max_loads['volume']
                route_volume = int(volume_dict.get('amount', 0))

            # parse visits list
            vis_resp = SolverV3.parse_output_visits_list(route.get('visits'), valid_load_demands_dict)

            response['veh_id'] = veh_id
            response['drop_order_id_list'] = vis_resp['drop_orders']
            response['pickup_order_id_list'] = vis_resp['pickup_orders']
            response['visit_order_id_list'] = vis_resp['visit_orders']
            response['transitions'] = route.get('transitions')
            response['total_load'] = route_load
            response['total_volume'] = route_volume
            response['cost'] = route_cost
            response['total_duration_s'] = total_duration_s
            response['total_travel_distance_m'] = total_travel_distance_m

            routes_list.append(response)

        return routes_list

    @staticmethod
    def check_if_routes_empty(response):
        routes = response.get('routes', None)
        if not routes:
            return False
        for route in routes:
            if route.get('visits', False):
                return True
        return False

    @staticmethod
    def check_if_skipped_shipments(response):
        if response and 'skippedShipments' in response.keys():
            return True
        return False

    def execute(self):
        model_dict = SolverV3.set_model_configurations(self._model_dict)
        response = SolverV3.solve_json(model_dict)
        logger.info(f"Solver Returned Response")
        response['extra_product_list'] = self.extra_products

        if self.check_if_routes_empty(response) or self.check_if_skipped_shipments(response):
            routes_list = self.parse_output(response, self.valid_load_demands)
            solution = SolverSolutionProviderV3(routes_list, response, self._orders, self._vehicles, self._products, self.valid_load_demands)
            solution.solve()
            return solution.get_routes_list(), solution.get_aggregated_output(), solution.get_output()
        else:
            logger.info(f"Solver Response: {response}")
            raise SolverException(f"Solver did not returned sufficient data to proceed further!")
