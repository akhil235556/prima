import logging

from route_planner.exceptions.exceptions import InvalidRequest
from werkzeug.exceptions import BadRequest

from constants.constants import UploadJobsStatus, DEFAULT_PAGE, DEFAULT_PAGE_SIZE, JOB_STATUS_CODE_NAME_MAP
from utils.utils import get_current_timestamp
from exceptions.exceptions import AppException
from database.drivers.postgres_v2 import postgres_connection, PostgresCredentials

from db.dao.planning_requests import PlanningRequestsDao
from db.dao.base_dao import BaseDao


logger = logging.getLogger(__name__)


class PlanningRequestsMapper(object):

    def __init__(self, **kwargs):
        self.validate_payload(kwargs)
        self._partition = kwargs.get('partition')
        self._tenant = kwargs.get('tenant')
        self._node = kwargs.get('node')
        self._request_id = kwargs.get('request_id')
        self._planning_name = kwargs.get('planning_name')

    @staticmethod
    def validate_payload(payload):
        if not payload.get("planning_name"):
            raise BadRequest("planning_name is mandatory")
        if not payload.get('partition'):
            raise BadRequest("partition is mandatory")
        if not payload.get('tenant'):
            raise BadRequest("tenant is mandatory")
        if not payload.get('node'):
            raise BadRequest("node is mandatory")

    def upload_request(self):
        payload = dict(
            partition=self._partition,
            tenant=self._tenant,
            node=self._node,
            request_id=self._request_id,
            planning_name=self._planning_name
        )
        PlanningRequestsMapper.create(payload)

    def update_request_to_fail(self):
        try:
            payload = dict(
                partition=self._partition,
                tenant=self._tenant,
                node=self._node,
                request_id=self._request_id,
                planning_name=self._planning_name
            )
            PlanningRequestsMapper.update_status_to_fail(payload)
        except Exception as ex:
            logger.info(f"update_request_to_fail : Failed : exception :{ex}")

    def update_request_to_pending(self):
        try:
            payload = dict(
                partition=self._partition,
                tenant=self._tenant,
                node=self._node,
                request_id=self._request_id,
                planning_name=self._planning_name
            )
            PlanningRequestsMapper.update_status_to_pending(payload)
        except Exception as ex:
            logger.info(f"update_request_to_pending : Failed : exception :{ex}")

    def update_request_to_processing(self):

        payload = dict(
            partition=self._partition,
            tenant=self._tenant,
            node=self._node,
            request_id=self._request_id,
            planning_name=self._planning_name
        )

        PlanningRequestsMapper.update_status_to_processing(payload)


    def update_request_to_completed(self, filter_dict, connection):
        try:
            payload = dict(
                partition=self._partition,
                tenant=self._tenant,
                node=self._node,
                request_id=self._request_id,
                planning_name=self._planning_name
            )

            PlanningRequestsMapper.update_status_to_completed(payload, filter_dict, connection)
        except Exception as ex:
            logger.info(f"update_request_to_fail : Failed : exception :{ex}")

    @staticmethod
    def validate_request(data: dict):
        dao = BaseDao

        # mandatory fields validation
        dao.is_empty(data.get('request_id'), 'request_id')
        dao.is_empty(data.get('tenant'), 'tenant')
        dao.is_empty(data.get('partition'), 'partition')
        dao.is_empty(data.get('node'), 'node')
        dao.is_empty(data.get('planning_name'), 'planning_name')
        dao.is_empty(data.get('status_code'), 'status_code')
        dao.is_empty(data.get('status_name'), 'status_name')

        # type validation
        dao.is_str(data.get('request_id'))
        dao.is_str(data.get('tenant'))
        dao.is_str(data.get('partition'))
        dao.is_str(data.get('node'))
        dao.is_str(data.get('planning_name'))
        dao.is_int(data.get('status_code'))
        dao.is_str(data.get('status_name'))

        if data.get('created_at'):
            dao.is_timestamp(data.get('created_at'))
        if data.get('updated_at'):
            dao.is_timestamp(data.get('updated_at'))
        if data.get('ended_at'):
            dao.is_timestamp(data.get('ended_at'))
        if data.get('updated_at'):
            dao.is_timestamp(data.get('updated_at'))
        if data.get('planning_start_time'):
            dao.is_timestamp(data.get('planning_start_time'))
        if data.get('planning_end_time'):
            dao.is_timestamp(data.get('planning_end_time'))

        if data.get('time_taken_hours'):
            dao.is_decimal(data.get('time_taken_hours'))
        if data.get('total_tasks'):
            dao.is_int(data.get('total_tasks'))
        if data.get('total_vehicles'):
            dao.is_int(data.get('total_vehicles'))
        if data.get('total_cost'):
            dao.is_decimal(data.get('total_cost'))
        if data.get('total_kms'):
            dao.is_decimal(data.get('total_kms'))
        if data.get('stops'):
            dao.is_int(data.get('stops'))
        if data.get('remarks'):
            dao.is_str(data.get('remarks'))

    @staticmethod
    def create(data: dict) -> list:
        # validate data dict
        BaseDao.is_empty(data.get('request_id'), 'request_id')
        BaseDao.is_empty(data.get('tenant'), 'tenant')
        BaseDao.is_empty(data.get('partition'), 'partition')
        BaseDao.is_empty(data.get('node'), 'node')
        BaseDao.is_empty(data.get('planning_name'), 'planning_name')

        BaseDao.is_str(data.get('request_id'), 'request_id')
        BaseDao.is_str(data.get('tenant'), 'tenant')
        BaseDao.is_str(data.get('partition'), 'partition')
        BaseDao.is_str(data.get('node'), 'node')
        BaseDao.is_str(data.get('planning_name'), 'planning_name')

        model_dict = PlanningRequestsMapper.set_create_attributes(data)
        with postgres_connection() as conn:
            response = PlanningRequestsDao.insert(model_dict, connection=conn)
        return response or list()

    @staticmethod
    def set_create_attributes(data: dict) -> dict:
        # validate and set create params
        model_dict = dict()
        model_dict['request_id'] = data.get('request_id')
        model_dict['tenant'] = data.get('tenant')
        model_dict['partition'] = data.get('partition')
        model_dict['node'] = data.get('node')
        model_dict['planning_name'] = data.get('planning_name')
        model_dict['status_code'] = UploadJobsStatus.CREATED.value.code
        model_dict['status_name'] = UploadJobsStatus.CREATED.value.name
        model_dict['created_at'] = get_current_timestamp()
        model_dict['updated_at'] = get_current_timestamp()
        return model_dict

    @staticmethod
    def paginated_list(model_dict):

        BaseDao.is_empty(model_dict.get('tenant'), 'tenant')
        BaseDao.is_empty(model_dict.get('partition'), 'partition')
        BaseDao.is_empty(model_dict.get('node'), 'node')

        BaseDao.is_str(model_dict.get('tenant'), 'tenant')
        BaseDao.is_str(model_dict.get('partition'), 'partition')
        BaseDao.is_str(model_dict.get('node'), 'node')

        BaseDao.set_page_and_page_size(model_dict)

        _page = model_dict.get('page') or DEFAULT_PAGE
        _page_size = model_dict.get('page_size') or DEFAULT_PAGE_SIZE

        # validate data dict
        if not model_dict.get("node") == '_ALL_':
            filter_dict = dict(
                tenant=model_dict.get("tenant"),
                partition=model_dict.get("partition"),
                node=model_dict.get("node")
            )
        else:
            filter_dict = dict(
                tenant=model_dict.get("tenant"),
                partition=model_dict.get("partition")
            )

        status_name = model_dict.get("status_name")
        request_id = model_dict.get("request_id")
        planning_name = model_dict.get("planning_name")

        if status_name:
            filter_dict['status_name'] = status_name
        if request_id:
            filter_dict['request_id'] = request_id
        if planning_name:
            filter_dict['planning_name'] = planning_name

        results, pagination = PlanningRequestsDao.paginated_query(filter_dict,
                                                                  credentials=PostgresCredentials(),
                                                                  page=_page,
                                                                  page_size=_page_size
                                                                  )

        return results, pagination

    @staticmethod
    def get_planning_request(filter_dict, _connection, raise_error=True):
        results = PlanningRequestsDao.query(filter_dict, connection=_connection)
        if not raise_error and not results:
            return {}

        if not results:
            raise AppException(f"Cannot find record with {filter_dict}")
        result = results[0]
        return result

    @staticmethod
    def update_status_to_fail(model_dict):

        # validate
        # mandatory fields validation
        BaseDao.is_empty(model_dict.get('request_id'))
        BaseDao.is_empty(model_dict.get('tenant'))
        BaseDao.is_empty(model_dict.get('partition'))
        BaseDao.is_empty(model_dict.get('node'))
        BaseDao.is_empty(model_dict.get('planning_name'))

        # type validation
        BaseDao.is_str(model_dict.get('request_id'))
        BaseDao.is_str(model_dict.get('tenant'))
        BaseDao.is_str(model_dict.get('partition'))
        BaseDao.is_str(model_dict.get('node'))
        BaseDao.is_str(model_dict.get('planning_name'))

        filter_dict = dict(
            request_id=model_dict.get("request_id"),
            tenant=model_dict.get("tenant"),
            partition=model_dict.get("partition"),
            node=model_dict.get("node"),
        )

        with postgres_connection() as conn:

            result = PlanningRequestsMapper.get_planning_request(filter_dict, _connection=conn)

            if result.get('status_code') not in [
                UploadJobsStatus.CREATED.value.code,
                UploadJobsStatus.PROCESSING.value.code,
            ]:
                raise AppException(
                    f"Cannot update status to {UploadJobsStatus.FAIL.value.name} Existing Status should be :{(UploadJobsStatus.CREATED.value.name, UploadJobsStatus.PROCESSING.value.name)}")
            set_dict = dict(
                status_code=UploadJobsStatus.FAIL.value.code,
                status_name=UploadJobsStatus.FAIL.value.name,
                updated_at=get_current_timestamp(),
                ended_at=get_current_timestamp(),
                planning_end_time=get_current_timestamp()
            )

            results = PlanningRequestsDao.update(filter_dict, set_dict, connection=conn)
        return results

    @staticmethod
    def update_status_to_pending(model_dict):
        # validate
        # mandatory fields validation
        BaseDao.is_empty(model_dict.get('request_id'))
        BaseDao.is_empty(model_dict.get('tenant'))
        BaseDao.is_empty(model_dict.get('partition'))
        BaseDao.is_empty(model_dict.get('node'))

        # type validation
        BaseDao.is_str(model_dict.get('request_id'))
        BaseDao.is_str(model_dict.get('tenant'))
        BaseDao.is_str(model_dict.get('partition'))
        BaseDao.is_str(model_dict.get('node'))

        filter_dict = dict(
            request_id=model_dict.get("request_id"),
            tenant=model_dict.get("tenant"),
            partition=model_dict.get("partition"),
            node=model_dict.get("node"),
        )

        with postgres_connection() as conn:
            result = PlanningRequestsMapper.get_planning_request(filter_dict, _connection=conn)

            if result.get('status_code') not in [
                UploadJobsStatus.CREATED.value.code,
                UploadJobsStatus.PROCESSING.value.code,
            ]:
                raise AppException(
                    f"Cannot update status to {UploadJobsStatus.FAIL.value.name} Existing Status should be :{(UploadJobsStatus.CREATED.value.name, UploadJobsStatus.PROCESSING.value.name)}")
            set_dict = dict(
                status_code=UploadJobsStatus.PENDING.value.code,
                status_name=UploadJobsStatus.PENDING.value.name,
                updated_at=get_current_timestamp(),
                ended_at=get_current_timestamp(),
                planning_end_time=get_current_timestamp()
            )

            results = PlanningRequestsDao.update(filter_dict, set_dict, connection=conn)
        return results

    @staticmethod
    def update_status_to_processing(model_dict):
        # validate
        # mandatory fields validation
        BaseDao.is_empty(model_dict.get('request_id'))
        BaseDao.is_empty(model_dict.get('tenant'))
        BaseDao.is_empty(model_dict.get('partition'))
        BaseDao.is_empty(model_dict.get('node'))
        BaseDao.is_empty(model_dict.get('planning_name'))

        # type validation
        BaseDao.is_str(model_dict.get('request_id'))
        BaseDao.is_str(model_dict.get('tenant'))
        BaseDao.is_str(model_dict.get('partition'))
        BaseDao.is_str(model_dict.get('node'))
        BaseDao.is_str(model_dict.get('planning_name'))

        filter_dict = dict(
            request_id=model_dict.get("request_id"),
            tenant=model_dict.get("tenant"),
            partition=model_dict.get("partition"),
            node=model_dict.get("node"),
            )

        with postgres_connection() as conn:

            result = PlanningRequestsMapper.get_planning_request(filter_dict, _connection=conn, raise_error=False)

            if result.get('status_code') in [
                UploadJobsStatus.PROCESSING.value.code
            ]:
                raise InvalidRequest(
                    message=f"Request already in {UploadJobsStatus.PROCESSING.value.name}  State",
                    status_code=400
                )
            elif result.get('status_code') not in [
                UploadJobsStatus.CREATED.value.code
            ]:
                curr_status_name = JOB_STATUS_CODE_NAME_MAP.get(result.get('status_code'), None)
                raise InvalidRequest(
                    message=f"Cannot update {curr_status_name} status to {UploadJobsStatus.PROCESSING.value.name} Existing Status should be: {(UploadJobsStatus.CREATED.value.name)} ",
                    status_code=409
                    )
            set_dict = dict(
                status_code=UploadJobsStatus.PROCESSING.value.code,
                status_name=UploadJobsStatus.PROCESSING.value.name,
                planning_start_time=get_current_timestamp(),
                updated_at=get_current_timestamp()
            )

            results = PlanningRequestsDao.update(filter_dict, set_dict, connection=conn)

        return results

    @staticmethod
    def update_status_to_completed(model_dict, filter_dict, connection):

        # validate
        # mandatory fields validation
        BaseDao.is_empty(filter_dict.get('request_id'))
        BaseDao.is_empty(filter_dict.get('tenant'))
        BaseDao.is_empty(filter_dict.get('partition'))
        BaseDao.is_empty(filter_dict.get('node'))
        BaseDao.is_empty(filter_dict.get('planning_name'))

        # type validation
        BaseDao.is_str(filter_dict.get('request_id'))
        BaseDao.is_str(filter_dict.get('tenant'))
        BaseDao.is_str(filter_dict.get('partition'))
        BaseDao.is_str(filter_dict.get('node'))
        BaseDao.is_str(filter_dict.get('planning_name'))

        BaseDao.is_decimal(model_dict.get('total_cost'))
        BaseDao.is_decimal(model_dict.get('total_kms'))
        BaseDao.is_decimal(model_dict.get('time_taken'))
        BaseDao.is_int(model_dict.get('stops'))

        result = PlanningRequestsMapper.get_planning_request(filter_dict, _connection=connection)

        if result.get('status_code') not in [
            UploadJobsStatus.PROCESSING.value.code,
        ]:
            raise AppException(
                f"Cannot update status to {UploadJobsStatus.COMPLETED.value.name} Existing Status should be :{(UploadJobsStatus.PROCESSING.value.name)}")
        set_dict = dict(
            status_code=UploadJobsStatus.COMPLETED.value.code,
            status_name=UploadJobsStatus.COMPLETED.value.name,
            updated_at=get_current_timestamp(),
            ended_at=get_current_timestamp(),
            planning_end_time=get_current_timestamp(),
            time_taken_hours=model_dict.get('time_taken'),
            total_cost=model_dict.get('total_cost'),
            total_kms=model_dict.get('total_kms'),
            stops=model_dict.get('stops')
        )

        results = PlanningRequestsDao.update(filter_dict, set_dict, connection=connection)

        return results

    @staticmethod
    def update_after_validation(_connection, **model_dict):
        # validate
        # mandatory fields validation
        BaseDao.is_empty(model_dict.get('request_id'))
        BaseDao.is_empty(model_dict.get('tenant'))
        BaseDao.is_empty(model_dict.get('partition'))
        BaseDao.is_empty(model_dict.get('node'))

        # type validation
        BaseDao.is_str(model_dict.get('request_id'))
        BaseDao.is_str(model_dict.get('tenant'))
        BaseDao.is_str(model_dict.get('partition'))
        BaseDao.is_str(model_dict.get('node'))

        BaseDao.is_int(model_dict.get('total_tasks'))
        BaseDao.is_int(model_dict.get('total_vehicles'))

        filter_dict = dict(
            request_id=model_dict.get("request_id"),
            tenant=model_dict.get("tenant"),
            partition=model_dict.get("partition"),
            node=model_dict.get("node"),
        )

        set_dict = dict(
            total_tasks=model_dict.get('total_tasks'),
            total_vehicles=model_dict.get('total_vehicles'),
            updated_at=get_current_timestamp()
        )
        results = PlanningRequestsDao.update(filter_dict, set_dict, connection=_connection)
        return results
