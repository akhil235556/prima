import logging
from db.dao.client_solver_config import ClientSolverConfigDao
from db.dao.base_dao import BaseDao
from database.drivers.postgres_v2 import postgres_connection, PostgresCredentials


logger = logging.getLogger(__name__)


class ClientSolverConfigMapper(object):

    @staticmethod
    def list(model_dict):
        BaseDao.is_empty(model_dict.get('api_key'), 'api_key')

        # validate data dict
        filter_dict = dict(
            api_key=model_dict.get("api_key"),
            is_active="True"
        )

        results = ClientSolverConfigDao.query(filter_dict, credentials=PostgresCredentials())

        return results

    @staticmethod
    def get_by_api_key(api_key):
        filter_dict = dict(
            api_key=api_key,
            is_active=True
        )
        results = ClientSolverConfigDao.query(filter_dict, credentials=PostgresCredentials())
        if len(results) > 0:
            return results
        return list()

    @staticmethod
    def upload_request(api_key, solver_name, is_active):
        payload = dict(
            api_key=api_key,
            solver_name=solver_name,
            is_active=is_active
        )
        ClientSolverConfigMapper.create(payload)

    @staticmethod
    def create(data: dict) -> list:
        # validate data dict
        BaseDao.is_empty(data.get('api_key'), 'api_key')
        BaseDao.is_empty(data.get('solver_name'), 'solver_name')
        BaseDao.is_empty(data.get('is_active'), 'is_active')

        BaseDao.is_str(data.get('api_key'), 'api_key')
        BaseDao.is_str(data.get('solver_name'), 'solver_name')
        BaseDao.is_str(data.get('is_active'), 'is_active')

        with postgres_connection() as conn:
            response = ClientSolverConfigDao.insert(data, connection=conn)

        return response or list()

