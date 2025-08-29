from database.drivers.postgres_v2 import PostgresCredentials

from db.dao.base_dao import BaseDao
from db.dao.planning_result import PlanningResultDao
from utils.utils import remove_empty_keys
from exceptions.exceptions import DatabaseException

class PlanningResultMapper(object):

    @staticmethod
    def list(model_dict):

        BaseDao.is_empty(model_dict.get('planning_request_id'), 'planning_request_id')

        BaseDao.is_str(model_dict.get('planning_request_id'), 'planning_request_id')

        # validate data dict
        filter_dict = dict(
            planning_request_id=model_dict.get("planning_request_id")
        )

        results = PlanningResultDao.query(filter_dict, credentials=PostgresCredentials())

        return results

    @staticmethod
    def upsert_planning_results(data_dict, connection):

        data_dict = remove_empty_keys(data_dict)
        try:
            PlanningResultDao.upsert(data_dict, connection)
        except DatabaseException as e:
            raise e
