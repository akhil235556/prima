from database.drivers.postgres_v2 import PostgresCredentials
import json
from constants.constants import DEFAULT_PAGE, DEFAULT_PAGE_SIZE
from utils.utils import remove_empty_keys
from db.dao.base_dao import BaseDao
from db.dao.planning_routes import PlanningRoutesDao


class PlanningRoutesMapper(object):

    @staticmethod
    def paginated_list(model_dict):

        BaseDao.is_empty(model_dict.get('planning_request_id'), 'planning_request_id')

        BaseDao.is_str(model_dict.get('planning_request_id'), 'planning_request_id')

        BaseDao.set_page_and_page_size(model_dict)

        _page = model_dict.get('page') or DEFAULT_PAGE
        _page_size = model_dict.get('page_size') or DEFAULT_PAGE_SIZE

        # validate data dict
        filter_dict = dict(
            planning_request_id=model_dict.get("planning_request_id")
        )

        results, pagination = PlanningRoutesDao.paginated_query(filter_dict,
                                                                credentials=PostgresCredentials(),
                                                                page=_page,
                                                                page_size=_page_size
                                                                )

        return results, pagination

    @staticmethod
    def insert_routes(data_dict, planning_request_id, connection):
        for route in data_dict:
            try:
                request_id = route.get('route_id')
                vehicle_type = route.get('vehicle_type')
                total_weight = route.get('load')
                total_volume = route.get('volume')
                weight_utilisation = route.get('vehicle_utilisation')
                volume_utilisation = route.get('vehicle_volume_utilisation')
                total_time = route.get('time_taken')
                total_kms = route.get('distance')
                total_cost = route.get('cost')
                from_city = route.get('from_city')
                to_city = route.get('to_city')
                details = json.dumps(route)

                insert_dict = {
                    'planning_request_id': planning_request_id,
                    'route_id': request_id,
                    'vehicle_type': vehicle_type,
                    'total_weight_carrying': total_weight,
                    'total_volume_carrying': total_volume,
                    'weight_utilisation': weight_utilisation,
                    'volume_utilisation': volume_utilisation,
                    'total_time': total_time,
                    'total_kms': total_kms,
                    'total_cost': total_cost,
                    'from_city': from_city,
                    'to_city': to_city,
                    'details': details
                }

                insert_dict = remove_empty_keys(insert_dict)
            except Exception as e:
                raise e

            PlanningRoutesDao.upsert(insert_dict, connection=connection)
