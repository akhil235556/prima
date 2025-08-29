import os
import logging
import time
from concurrent import futures

import grpc

from constants.env_variables import ServerDetails

from controllers.health_controller import HealthServiceServicerImpl
from controllers.tms_planning_controller import TmsPlanningController
from db.dbmate import Migration
from health_services_pb2_grpc import add_HealthServiceServicer_to_server
from tms_planning_services_pb2_grpc import add_TmsPlanningServiceServicer_to_server
from settings import env


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
MAX_WORKERS = int(os.environ.get('MAX_WORKERS', 10))


def get_server_address():
    host = env.get(ServerDetails.HOST)
    port = env.get(ServerDetails.PORT)
    return "{}:{}".format(host, port)


def add_servicers_to_server(server):
    add_HealthServiceServicer_to_server(HealthServiceServicerImpl(), server)
    add_TmsPlanningServiceServicer_to_server(TmsPlanningController(), server)


def start_server():
    # define server and add server attributes
    logger.info(f'grpc max_workers: {MAX_WORKERS}')
    server = grpc.server(
        futures.ThreadPoolExecutor(
            max_workers=MAX_WORKERS
    ))

    # add services to server
    add_servicers_to_server(server)

    server.add_insecure_port(get_server_address())

    logger.info('Starting GRPC server at %s', get_server_address())
    server.start()
    logger.info('Started GRPC Server at %s', get_server_address())

    logger.info('Running migrations')
    Migration.up()
    logger.info('Successfully ran migrations')

    try:
        while True:
            ONE_DAY_IN_SECONDS = 60 * 60 * 24
            time.sleep(ONE_DAY_IN_SECONDS)
    except KeyboardInterrupt:
        logger.info('Exiting GRPC Server')
        server.stop(0)


if __name__ == '__main__':
    start_server()
