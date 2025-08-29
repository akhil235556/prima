import logging

from health_models_pb2 import HealthResponse
from health_services_pb2_grpc import HealthServiceServicer

logger = logging.getLogger(__name__)


class HealthServiceServicerImpl(HealthServiceServicer):

    def checkHealth(self, request, context):
        """
        health controller
        :param request:
        :param context:
        :return:
        """
        logger.info("health check ok")
        return HealthResponse(message="OK")
