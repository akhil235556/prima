from context_logging import logging

from errors.exceptions import AppException
from integrations.prima.config.prima_api_endpoints import PrimaApiConfig
from utilities.http_client import HttpClient
from requests import HTTPError

logger = logging.getLogger(__name__)


class PlanningErrors(object):
    _api_key = None

    def __init__(self, api_key):
        self._api_key = api_key
        self.httpclient = HttpClient()

    def get_headers(self):
        return {
            "api-key": self._api_key
        }

    @staticmethod
    def get_params(payload):
        # todo remove planning_request_id when client_id is integrated in route-planning-service
        params = {
            "planning_request_id": payload.get('planning_request_id')
        }
        return params

    def list(self, payload):
        url = PrimaApiConfig.get_planning_error_url()

        headers = self.get_headers()
        params = PlanningErrors.get_params(payload)

        try:
            self.httpclient.request("GET", url, params=params, headers=headers)
        except HTTPError as ex:
            raise AppException(f"Prima: PlanningErrors: list failed at Client service:- {ex}")

        response = self.httpclient.response.json()
        logger.info(f'Prima: PlanningErrors: list response: {response}')
        return response
