from context_logging import logging

from errors.exceptions import AppException
from integrations.prima.config.prima_api_endpoints import PrimaApiConfig
from utilities.http_client import HttpClient
from requests import HTTPError

logger = logging.getLogger(__name__)


class SolverConfig(object):

    def __init__(self):
        self.httpclient = HttpClient()

    @staticmethod
    def get_params(payload):
        params = {
            "api_key": payload.get('api_key'),
            "solver_name": payload.get('solver_name'),
            "is_active": payload.get('is_active'),
        }
        return params

    def list(self, payload):
        url = PrimaApiConfig.update_solver_config_url()

        params = SolverConfig.get_params(payload)
        try:
            self.httpclient.request("POST", url, params=params)
            response = self.httpclient.response
            response.raise_for_status()
            response = response.json()
        except HTTPError as ex:
            raise AppException(f"Prima: SolverConfig: list failed at Client service:- {ex}")

        logger.info(f'Prima: SolverConfig: list response: {response}')
        return response
