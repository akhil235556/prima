import datetime
import json
import logging

from route_planner.constants.app_constants import UploadJobsStatus
from route_planner.db.dao.upload_jobs import RequestsDao
from route_planner.exceptions.exceptions import AppException, RequestPendingException
from route_planner.utils import env

logger = logging.getLogger(__name__)


class RequestsServices(object):
    """
    Service to handle Upload Jobs
    """

    @staticmethod
    def is_valid_request_to_execute(request_id):
        if env.get('PRIMA_SCRIPT_RUN'):
            return

        dao = RequestsDao()
        filter_dict = {'request_id': request_id}
        fields = ['request_id', 'status_code']
        resp = dao.query(filter_dict, fields=fields)
        if not resp:
            raise AppException(f'Request ID: {request_id} does not exist')
        record = resp[0]
        if record['status_code'] == UploadJobsStatus.FAIL.value.code:
            raise AppException(f'Request ID: {request_id} is Failed. Can not execute.')
        elif record['status_code'] == UploadJobsStatus.CANCELLED.value.code:
            raise AppException(f'Request ID: {request_id} is Cancelled. Can not execute.')
        elif record['status_code'] == UploadJobsStatus.SUCCESS.value.code:
            raise AppException(f'Request ID: {request_id} is Success. Can not execute.')
        elif record['status_code'] == UploadJobsStatus.PROCESSING.value.code:
            raise RequestPendingException(f'Request ID: {request_id} is already Processing. Can not execute right now.')
        return resp

    @staticmethod
    def is_valid_request_to_continue(request_id):
        if env.get('PRIMA_SCRIPT_RUN'):
            return

        dao = RequestsDao()
        filter_dict = {'request_id': request_id}
        fields = ['request_id', 'status_code']
        resp = dao.query(filter_dict, fields=fields)
        if not resp:
            raise AppException(f'Request ID: {request_id} does not exist')
        record = resp[0]
        if record['status_code'] == UploadJobsStatus.FAIL.value.code:
            raise AppException(f'Request ID: {request_id} is Failed. Can not execute.')
        elif record['status_code'] == UploadJobsStatus.CANCELLED.value.code:
            raise AppException(f'Request ID: {request_id} is Cancelled. Can not execute.')
        return resp

    @staticmethod
    def create_job(data: dict):
        """
        creates a upload job
        :param model_dicts:
        :return:
        """
        if env.get('PRIMA_SCRIPT_RUN'):
            return

        # validate data dict
        RequestsServices.is_empty(data.get('request_id'), 'request_id')
        RequestsServices.is_empty(data.get('planning_name'), 'planning_name')
        RequestsServices.is_empty(data.get('jwt'), 'jwt')
        RequestsServices.is_int(data.get('status_code'), 'status_code')
        RequestsServices.is_empty(data.get('status_name'), 'status_name')

        model_dict = RequestsServices.set_create_attr(data)
        dao = RequestsDao()
        resp = dao.insert(model_dict)
        resp = RequestsServices.transform_resp(resp[0])
        return resp

    @staticmethod
    def set_create_attr(data: dict):
        # Todo validate and set create params
        model_dict = dict()
        model_dict['request_id'] = data.get('request_id')
        model_dict['planning_name'] = data.get('planning_name')
        model_dict['jwt'] = data.get('jwt')
        model_dict['status_code'] = data.get('status_code')
        model_dict['status_name'] = data.get('status_name')
        model_dict['updated_at'] = RequestsServices.get_current_time()
        return model_dict

    @staticmethod
    def poll(model_dict):
        """
        returns details
        :param model_dict:
        :return:
        """
        if env.get('PRIMA_SCRIPT_RUN'):
            return

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
        if env.get('PRIMA_SCRIPT_RUN'):
            return

        dao = RequestsDao()
        # validate
        RequestsServices.is_empty(model_dict.get('request_id'), 'request_id')

        filter_dict = dict(request_id=model_dict.get('request_id'))

        results = dao.query(filter_dict)
        if not results:
            raise AppException(f"Invalid request_id {filter_dict.get('request_id')}")
        job_detail = RequestsServices.transform_resp(results)[0]
        logger.info(job_detail)
        if not job_detail.get('response'):
            raise AppException(f"The request_id {filter_dict.get('request_id')} has no 'response'")

        return job_detail.get('response')

    @staticmethod
    def update(request_id, set_dict):
        if env.get('PRIMA_SCRIPT_RUN'):
            return

        dao = RequestsDao()
        filter_dict = dict(request_id=request_id)
        return dao.update(filter_dict, set_dict)

    @staticmethod
    def update_status(data_dict):
        if env.get('PRIMA_SCRIPT_RUN'):
            return


        # validate
        RequestsServices.is_empty(data_dict.get('request_id'), 'request_id')
        RequestsServices.is_int(data_dict.get('status_code'), 'status_code')
        RequestsServices.is_empty(data_dict.get('status_name'), 'status_name')

        dao = RequestsDao()
        # check if request id exists in table
        results = dao.query(dict(request_id=data_dict.get('request_id')))
        if not results:
            raise AppException(f"Invalid request_id {data_dict.get('request_id')}")

        #set attr
        filter_dict = dict()
        set_dict = dict()
        filter_dict['request_id'] = data_dict.get('request_id')
        set_dict['status_code'] = data_dict.get('status_code')
        set_dict['status_name'] = data_dict.get('status_name')
        set_dict['updated_at'] = RequestsServices.get_current_time()
        set_dict['response'] = json.dumps(data_dict.get('response'))
        results = dao.update(filter_dict, set_dict)
        return results



    @staticmethod
    def update_response(data_dict, status):
        if env.get('PRIMA_SCRIPT_RUN'):
            return


        # validate
        RequestsServices.is_empty(data_dict.get('request_id'), 'request_id')
        RequestsServices.is_dict(data_dict.get('response'), 'response')

        dao = RequestsDao()
        # check if request id exists in table
        results = dao.query(dict(request_id=data_dict.get('request_id')))
        if not results:
            raise AppException(f"Invalid request_id {data_dict.get('request_id')}")
        
        # set attr
        filter_dict = dict()
        set_dict = dict()
        filter_dict['request_id'] = data_dict.get('request_id')
        set_dict['response'] = json.dumps(data_dict.get('response'))
        set_dict['status_code'] = status.value.code
        set_dict['status_name'] = status.value.name
        set_dict['updated_at'] = RequestsServices.get_current_time()

        results = dao.update(filter_dict, set_dict)

        return results


    @staticmethod
    def transform_resp(response):
        if isinstance(response, list):
            return [RequestsServices.transform_resp(e) for e in response]
        return response

    @staticmethod
    def get_current_time():
        return str(datetime.datetime.now())

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

