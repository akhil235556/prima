from context_logging import logging

from errors.exceptions import AppException
from integrations.prima.config.prima_api_endpoints import PrimaApiConfig
from utilities.http_client import HttpClient
from requests import HTTPError

logger = logging.getLogger(__name__)


class PlanningResults(object):
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

    def results(self, payload):
        """
        It makes a GET request to the Prima API, and returns the response as a JSON object
        
        :param payload: dict with planning_request_id (mandatory)
        """
        url = PrimaApiConfig.get_planning_results()

        headers = self.get_headers()
        params = PlanningResults.get_params(payload)

        try:
            self.httpclient.request("GET", url, params=params, headers=headers)
        except HTTPError as ex:
            raise AppException(f"Prima: PlanningResults: planning results failed at Client service:- {ex}")

        response = self.httpclient.response.json()
        logger.info(f'Prima: PlanningResults: planning results response: {response}')
        return response
