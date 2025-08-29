import requests
from context_logging import logging

logger = logging.getLogger(__name__)


class HttpClient(object):

    def __init__(self):
        self.response = None

    def request(self, method, url, payload=None, auth=None, headers=None, cookies=None, raise_error=False, params=None):
        headers = headers or dict()
        logger.info("making http request method: {} url: {} payload: {} auth: {} headers: {} params: {}".format(
            method, url, payload, auth, headers, params))
        response = requests.request(method, url, data=payload, auth=auth, headers=headers, cookies=cookies, params=params)
        self.response = response
        logger.info("received http response body: {} headers: {}".format(response.content, response.headers))
        response.raise_for_status() if raise_error else None

    def get_response_headers(self):
        return self.response.headers

    def get_response_cookies(self):
        return self.response.cookies.get_dict()

    def get_response_body(self):
        return self.response.json()

    def post_request_file(self, url, file_path, data=None, headers=None, raise_error=False):
        headers = headers or dict()
        logger.info(f"making http post_request_file request url: {url} data: {data}, headers: {headers} file_path: {file_path}")

        with open(file_path, 'rb') as f:
            response = requests.post(url=url, files={"file": f}, headers=headers, data=data)
        self.response = response
        logger.info("received http response body: {} headers: {}".format(response.content, response.headers))
        response.raise_for_status() if raise_error else None
