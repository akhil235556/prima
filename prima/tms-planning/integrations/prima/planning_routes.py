from context_logging import logging

from errors.exceptions import AppException
from integrations.prima.config.prima_api_endpoints import PrimaApiConfig
from utilities.http_client import HttpClient
from requests import HTTPError

logger = logging.getLogger(__name__)


class PlanningRoutes(object):
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
            "planning_request_id": payload.get('planning_request_id'),
        }
        if "page" in payload.keys():
            params["page"] = payload.get("page")
        if "page_size" in payload.keys():
            params["page_size"] = payload.get("page_size")
        return params

    def list(self, payload):
        url = PrimaApiConfig.get_planning_routes_url()

        headers = self.get_headers()
        params = PlanningRoutes.get_params(payload)

        try:
            self.httpclient.request("GET", url, params=params, headers=headers)
        except HTTPError as ex:
            raise AppException(f"Prima: PlanningRoutes: list failed at Client service:- {ex}")

        response = self.httpclient.response.json()
        logger.info(f'Prima: PlanningRoutes: list response: {response}')
        return response
