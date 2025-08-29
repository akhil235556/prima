from context_logging import logging

from errors.exceptions import AppException
from integrations.prima.config.prima_api_endpoints import PrimaApiConfig
from utilities.http_client import HttpClient
from requests import HTTPError

logger = logging.getLogger(__name__)


class PlanningOutput(object):
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
        # todo remove planning_name when client_id is integrated in route-planning-service
        params = {
            "planning_request_id": payload.get('planning_request_id')
        }

        if "planning_name" in payload.keys():
            params["planning_name"] = payload.get('planning_name')
        else:
            params["planning_name"] = "mid-mile-sequential-planning"

        return params

    def get_output(self, payload):
        url = PrimaApiConfig.get_planning_output_url()

        headers = self.get_headers()
        params = PlanningOutput.get_params(payload)

        try:
            self.httpclient.request("GET", url, params=params, headers=headers)
        except HTTPError as ex:
            raise AppException(f"Prima: get_output failed at Client service:- {ex}")

        response = self.httpclient.response.json()
        logger.info(f'Prima: get_output response: {response}')
        return response
