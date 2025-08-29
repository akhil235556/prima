from context_logging import logging

from errors.exceptions import AppException
from integrations.prima.config.prima_api_endpoints import PrimaApiConfig
from utilities.http_client import HttpClient
from requests import HTTPError

logger = logging.getLogger(__name__)


class PlanningConfig(object):
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
        params = {
            "partition": payload.get('partition'),
            "tenant": payload.get('tenant'),
            "node": payload.get('node'),
        }
        return params

    def list(self, payload):
        url = PrimaApiConfig.get_planning_config_url()

        headers = self.get_headers()
        params = PlanningConfig.get_params(payload)
        try:
            self.httpclient.request("GET", url, params=params, headers=headers)
            response = self.httpclient.response
            response.raise_for_status()
            response = response.json()
        except HTTPError as ex:
            raise AppException(f"Prima: PlanningConfig: list failed at Client service:- {ex}")

        logger.info(f'Prima: PlanningConfig: list response: {response}')
        return response
