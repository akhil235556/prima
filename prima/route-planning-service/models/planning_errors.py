import json

from database.drivers.postgres_v2 import PostgresCredentials

from db.dao.base_dao import BaseDao
from db.dao.planning_errors import PlanningErrorsDao


class PlanningErrorsMapper(object):

    @staticmethod
    def list(model_dict):

        BaseDao.is_empty(model_dict.get('planning_request_id'), 'planning_request_id')
        BaseDao.is_str(model_dict.get('planning_request_id'), 'planning_request_id')

        # validate data dict
        filter_dict = dict(
            planning_request_id=model_dict.get("planning_request_id"),
        )

        results = PlanningErrorsDao.query(filter_dict, credentials=PostgresCredentials())

        return results

    @staticmethod
    def validate_bulk_errors(errors):
        validated_errors = list()
        for error in errors:
            validated_error = dict()
            prefix = f"validate_bulk_errors:"

            BaseDao.is_empty(error.get('planning_request_id'), f'{prefix} planning_request_id')
            BaseDao.is_str(error.get('planning_request_id'), 'planning_request_id')
            validated_error['planning_request_id'] = error.get('planning_request_id')

            if error.get('request_id'):
                BaseDao.is_int(error.get('request_id'), f'{prefix} request_id')
                validated_error['request_id'] = error.get('request_id')

            if error.get('planning_tasks_id'):
                BaseDao.is_str(error.get('planning_tasks_id'), f'{prefix} planning_tasks_id')
                validated_error['planning_tasks_id'] = error.get('planning_tasks_id')

            if error.get('error_name'):
                BaseDao.is_str(error.get('error_name'), f'{prefix} error_name')
                validated_error['error_name'] = error.get('error_name')

            if error.get('error_row_no'):
                BaseDao.is_int(error.get('error_row_no'), f'{prefix} error_row_no')
                validated_error['error_row_no'] = error.get('error_row_no')

            if error.get('error_sheet'):
                BaseDao.is_str(error.get('error_sheet'), f'{prefix} error_sheet')
                validated_error['error_sheet'] = error.get('error_sheet')

            if error.get('error_message'):
                BaseDao.is_str(error.get('error_message'), f'{prefix} error_message')
                validated_error['error_message'] = error.get('error_message')

            if error.get('error_details'):
                BaseDao.is_dict(error.get('error_details'), f'{prefix} error_details')
                validated_error['error_details'] = json.dumps(error.get('error_details'))

            validated_errors.append(validated_error)
        return validated_errors

    @staticmethod
    def bulk_upload(errors, _connection):

        validated_errors = PlanningErrorsMapper.validate_bulk_errors(errors)

        PlanningErrorsDao.insert_many(validated_errors, connection=_connection)

    @staticmethod
    def jsonify_planning_errors_results(results):
        parsed_results = list()
        if not results:
            return parsed_results

        for result in results:
            result['error_details'] = json.dumps(result.get("error_details", {}))
            parsed_results.append(result)
        return parsed_results
