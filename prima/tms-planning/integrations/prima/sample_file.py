from context_logging import logging

from errors.exceptions import AppException
from integrations.prima.config.prima_api_endpoints import PrimaApiConfig
from utilities.http_client import HttpClient
from requests import HTTPError

logger = logging.getLogger(__name__)


class SampleFile(object):

    def __init__(self, api_key):
        self._api_key = api_key
        self.httpclient = HttpClient()

    def get_headers(self):
        return {
            "api-key": self._api_key
        }

    @staticmethod
    def get_params(payload):
        engine_name = payload.get("engine_name").replace("+", " ")
        sub_engine_name = payload.get("sub_engine_name").replace("+", " ")
        return {
            'engine_name': engine_name,
            'sub_engine_name': sub_engine_name
        }

    def get_sample(self, payload):
        url = PrimaApiConfig.get_planning_sample_file_url()

        headers = self.get_headers()
        params = SampleFile.get_params(payload)

        logger.info(f"get sample payload {payload}")

        try:
            self.httpclient.request("GET", url, params=params, headers=headers)
        except HTTPError as ex:
            raise AppException(f"Prima: get_sample_file failed at Client service:- {ex}")

        response = self.httpclient.response.json()
        logger.info(f'Prima: get sample file response: {response}')
        return response
