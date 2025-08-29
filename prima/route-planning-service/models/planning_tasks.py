from database.drivers.postgres_v2 import PostgresCredentials

from db.dao.base_dao import BaseDao
from db.dao.planning_tasks import PlanningTasksDao
from exceptions.exceptions import DatabaseException
from utils.utils import get_current_timestamp


class PlanningTasksMapper(object):

    @staticmethod
    def list(model_dict):

        BaseDao.is_empty(model_dict.get('planning_request_id'), 'planning_request_id')
        BaseDao.is_empty(model_dict.get('planning_route_id'), 'planning_route_id')

        BaseDao.is_str(model_dict.get('planning_request_id'), 'planning_request_id')
        BaseDao.is_str(model_dict.get('planning_route_id'), 'planning_route_id')

        # validate data dict
        filter_dict = dict(
            planning_request_id=model_dict.get("planning_request_id"),
            planning_route_id=model_dict.get("planning_route_id")
        )

        results = PlanningTasksDao.query(filter_dict, credentials=PostgresCredentials())

        return results

    @staticmethod
    def validate_bulk_tasks(tasks):
        validated_tasks = list()
        for task in tasks:
            validated_task = dict()
            prefix = f"validate_bulk_tasks:"

            BaseDao.is_empty(task.get('request_id'), f'{prefix} request_id')
            BaseDao.is_str(task.get('request_id'), 'request_id')
            validated_task['request_id'] = task.get('request_id')

            BaseDao.is_empty(task.get('planning_request_id'), f'{prefix} planning_request_id')
            BaseDao.is_str(task.get('planning_request_id'), 'planning_request_id')
            validated_task['planning_request_id'] = task.get('planning_request_id')

            if task.get('planning_route_id'):
                BaseDao.is_str(task.get('planning_route_id'), f'{prefix} planning_route_id')
                validated_task['planning_route_id'] = task.get('planning_route_id')

            if task.get('order_id'):
                BaseDao.is_str(task.get('order_id'), f'{prefix} order_id')
                validated_task['order_id'] = task.get('order_id')

            if task.get('consignee_location'):
                BaseDao.is_str(task.get('consignee_location'), f'{prefix} consignee_location')
                validated_task['consignee_location'] = task.get('consignee_location')

            if task.get('consignee'):
                BaseDao.is_str(task.get('consignee'), f'{prefix} consignee')
                validated_task['consignee'] = task.get('consignee')

            if task.get('weight_kg'):
                BaseDao.is_decimal(task.get('weight_kg'), f'{prefix} weight_kg')
                validated_task['weight_kg'] = task.get('weight_kg')

            if task.get('volume_cbm'):
                BaseDao.is_decimal(task.get('volume_cbm'), f'{prefix} volume_cbm')
                validated_task['volume_cbm'] = task.get('volume_cbm')

            if task.get('dispatched_by'):
                BaseDao.is_timestamp(task.get('dispatched_by'), f'{prefix} dispatched_by')
                validated_task['dispatched_by'] = task.get('dispatched_by')

            if task.get('priority'):
                BaseDao.is_str(task.get('priority'), f'{prefix} priority')
                validated_task['priority'] = task.get('priority')

            validated_tasks.append(validated_task)
        return validated_tasks

    @staticmethod
    def bulk_upload(tasks, _connection):

        validated_tasks = PlanningTasksMapper.validate_bulk_tasks(tasks)

        PlanningTasksDao.insert_many(validated_tasks, connection=_connection)

    @staticmethod
    def update_planning_tasks(data_dict, planning_request_id, connection):
        # Validate Mandatory Field
        BaseDao.is_empty(planning_request_id)
        for order in data_dict:
            if not order.get("location_id") == 0:
                request_id = order.get('order_request_id')
                BaseDao.is_empty(request_id)

                route_id = order.get('route_id')

                BaseDao.is_str(order.get('order_request_id'))
                BaseDao.is_str(order.get('route_id'))

                PlanningTasksMapper.check_planning_task(PlanningTasksDao, request_id, planning_request_id, connection)

                filter_dict = {
                    'request_id': request_id,
                    'planning_request_id': planning_request_id
                }

                set_dict = {
                    'planning_route_id': route_id,
                    'dispatched_by': get_current_timestamp()
                }

                PlanningTasksDao.update(filter_dict, set_dict, connection=connection)

    @staticmethod
    def check_planning_task(dao, request_id, planning_request_id, connection=None):
        results = dao.query(dict(request_id=request_id, planning_request_id=planning_request_id),
                            connection=connection)

        if not results:
            raise DatabaseException(f"Request ID: {request_id} does not exist.")
