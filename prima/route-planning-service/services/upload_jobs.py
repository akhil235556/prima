import logging
from constants.constants import UploadJobsStatus
from utils.utils import get_current_timestamp
from exceptions.exceptions import AppException

from db.dao.upload_jobs import RequestsDao

import json

logger = logging.getLogger(__name__)


class RequestsServices(object):
    """
    Service to handle requests table
    """

    @staticmethod
    def create_job(data: dict) -> list:
        """
        creates a new upload job

        :param data:
        :return response:
        """
        # validate data dict
        RequestsServices.is_empty(data.get('request_id'), 'request_id')
        RequestsServices.is_empty(data.get('planning_name'), 'planning_name')
        RequestsServices.is_int(data.get('status_code'), 'status_code')
        RequestsServices.is_empty(data.get('status_name'), 'status_name')

        model_dict = RequestsServices.set_create_attr(data)
        dao = RequestsDao()
        resp = dao.insert(model_dict)
        resp = RequestsServices.transform_resp(resp[0])
        return resp

    @staticmethod
    def set_create_attr(data: dict) -> dict:
        # validate and set create params
        model_dict = dict()
        model_dict['request_id'] = data.get('request_id')
        model_dict['planning_name'] = data.get('planning_name')
        model_dict['status_code'] = data.get('status_code')
        model_dict['status_name'] = data.get('status_name')
        model_dict['created_at'] = get_current_timestamp()
        model_dict['updated_at'] = get_current_timestamp()
        return model_dict

    @staticmethod
    def poll(model_dict: dict) -> list:
        """
        polling

        returns details
        :param model_dict:
        :return response:
        """
        dao = RequestsDao()

        # validate data dict
        RequestsServices.is_empty(model_dict.get('request_id'), 'request_id')

        filter_dict = dict(request_id=model_dict.get('request_id'))
        results = dao.query(filter_dict)
        response = RequestsServices.transform_resp(results)

        details = list()
        for resp in response:
            temp_dict = {
                "request_id": resp.get('request_id'),
                "status_code": resp.get('status_code'),
                "status_name": resp.get('status_name'),
                "response": resp.get('response', dict())
            }
            details.append(temp_dict)
        return details

    @staticmethod
    def response(model_dict):
        """
        response API

        returns details
        :param model_dict:
        :return response:
        """
        dao = RequestsDao()
        # validate
        RequestsServices.is_empty(model_dict.get('request_id'), 'request_id')

        filter_dict = dict(request_id=model_dict.get('request_id'))

        results = dao.query(filter_dict)
        if not results:
            raise AppException(f"Invalid request_id {filter_dict.get('request_id')}")
        job_detail = RequestsServices.transform_resp(results)[0]
        print(job_detail)
        if not job_detail.get('response'):
            raise AppException(f"The request_id {filter_dict.get('request_id')} has no 'response'")

        return job_detail.get('response')

    @staticmethod
    def cancel_request(data_dict):
        dao = RequestsDao()
        # check if request id exists in table
        results = dao.query(dict(request_id=data_dict.get('request_id')))
        if not results:
            raise AppException(f"Invalid request_id {data_dict.get('request_id')}")

        result = results[0]
        if result.get('status_code') in [
            UploadJobsStatus.FAIL.value.code,
            UploadJobsStatus.SUCCESS.value.code
        ]:
            raise AppException(
                f"Can not update request_id {data_dict.get('request_id')}. Request is {result.get('status_name')}")

        # set attr
        filter_dict = dict()
        set_dict = dict()
        filter_dict['request_id'] = data_dict.get('request_id')
        set_dict['status_code'] = UploadJobsStatus.CANCELLED.value.code
        set_dict['status_name'] = UploadJobsStatus.CANCELLED.value.name
        set_dict['updated_at'] = get_current_timestamp()
        return results

    @staticmethod
    def update_status(data_dict):

        # validate
        RequestsServices.is_empty(data_dict.get('request_id'), 'request_id')
        RequestsServices.is_int(data_dict.get('status_code'), 'status_code')
        RequestsServices.is_empty(data_dict.get('status_name'), 'status_name')

        dao = RequestsDao()
        # check if request id exists in table
        results = dao.query(dict(request_id=data_dict.get('request_id')))
        if not results:
            raise AppException(f"Invalid request_id {data_dict.get('request_id')}")

        result = results[0]
        if result.get('status_code') not in [
            UploadJobsStatus.CREATED.value.code,
            UploadJobsStatus.PROCESSING.value.code
        ]:
            raise AppException(f"Can not update request_id {data_dict.get('request_id')}")

        # set attr
        filter_dict = dict()
        set_dict = dict()
        filter_dict['request_id'] = data_dict.get('request_id')
        set_dict['status_code'] = data_dict.get('status_code')
        set_dict['status_name'] = data_dict.get('status_name')
        set_dict['updated_at'] = get_current_timestamp()
        set_dict['response'] = json.dumps(data_dict.get('response'))
        results = dao.update(filter_dict, set_dict)
        return results

    @staticmethod
    def update_response(data_dict):
        # validate
        RequestsServices.is_empty(data_dict.get('request_id'), 'request_id')
        RequestsServices.is_dict(data_dict.get('response'), 'response')

        dao = RequestsDao()
        # check if request id exists in table
        results = dao.query(dict(request_id=data_dict.get('request_id')))
        if not results:
            raise AppException(f"Invalid request_id {data_dict.get('request_id')}")

        result = results[0]
        if result.get('status_code') not in [
            UploadJobsStatus.PROCESSING.value.code
        ]:
            raise AppException(f"Can not update request_id {data_dict.get('request_id')}")

        # set attr
        filter_dict = dict()
        set_dict = dict()
        filter_dict['request_id'] = data_dict.get('request_id')
        set_dict['response'] = json.dumps(data_dict.get('response'))
        set_dict['status_code'] = UploadJobsStatus.SUCCESS.value.code
        set_dict['status_name'] = UploadJobsStatus.SUCCESS.value.name
        set_dict['updated_at'] = get_current_timestamp()

        results = dao.update(filter_dict, set_dict)

        return results

    @staticmethod
    def list(model_dict):

        dao = RequestsDao()

        # validate data dict
        filter_dict = dict()
        if model_dict.get('request_id', None):
            filter_dict['request_id'] = model_dict.get('request_id')
        if model_dict.get('planning_name', None):
            filter_dict['planning_name'] = model_dict.get('planning_name')
        if model_dict.get('status_code', None):
            filter_dict['status_code'] = model_dict.get('status_code')

        pagination_dict = RequestsServices.get_pagination_dict(model_dict)

        results, pagination = dao.paginated_query(filter_dict, **pagination_dict)
        return RequestsServices.transform_resp(results), pagination

    @staticmethod
    def get_pagination_dict(db_dict):
        pagination_dict = dict()
        pagination_dict['page'] = int(db_dict.get("page", 1))
        pagination_dict['page_size'] = int(db_dict.get("size", 10))
        return pagination_dict

    @staticmethod
    def transform_resp(response):
        if isinstance(response, list):
            return [RequestsServices.transform_resp(e) for e in response]
        return response

    @staticmethod
    def is_empty(value, key=None):
        display_key = str(key or value)
        if value is None:
            raise AppException("{} is None".format(display_key))

    @staticmethod
    def is_str(value, key=None):
        display_key = str(key or value)
        if not isinstance(value, str):
            raise AppException("{} is not of type str".format(display_key))

    @staticmethod
    def is_int(value, key=None):
        display_key = str(key or value)
        if not isinstance(value, int):
            raise AppException("{} is not of type int".format(display_key))

    @staticmethod
    def is_dict(value, key):
        display_key = str(key)
        if not isinstance(value, dict):
            raise AppException("{} is not of type dict".format(display_key))
