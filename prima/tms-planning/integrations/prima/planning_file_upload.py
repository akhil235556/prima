from context_logging import logging

from errors.exceptions import AppException
from integrations.prima.config.prima_api_endpoints import PrimaApiConfig
from utilities.http_client import HttpClient
from requests import HTTPError

logger = logging.getLogger(__name__)


class PlanningFileUpload(object):
    _api_key = None

    def __init__(self, api_key):
        self._api_key = api_key
        self.httpclient = HttpClient()

    def get_headers(self):
        return {
            "api-key": self._api_key
        }

    @staticmethod
    def get_body(payload):
        # todo remove planning_name when client_id is integrated in route-planning-service
        return {
            'tenant': payload.get("tenant"),
            'partition': payload.get("partition"),
            'node': payload.get("node"),
            'engine_name': payload.get("engine_name"),
            'sub_engine_name': payload.get("sub_engine_name")
        }

    def file_upload(self, payload, file_path):

        url = PrimaApiConfig.get_file_upload_url()

        headers = self.get_headers()
        body = PlanningFileUpload.get_body(payload)

        try:
            self.httpclient.post_request_file(url=url, file_path=file_path, headers=headers, data=body)
        except HTTPError as ex:
            raise AppException(f"Prima: file_upload failed at Client service:- {ex}")

        response = self.httpclient.response.json()
        logger.info(f'Prima: file_upload response: {response}')
        return response
