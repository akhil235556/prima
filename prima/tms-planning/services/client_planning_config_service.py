from db.dao.client_planning_config import ClientPlanningConfigDao
from db.drivers.postgres import PostgresCredentials
from errors.exceptions import ClientPlanningConfigDoesNotExist
from models.client_planning_config_mapper import ClientPlanningConfigMapper


class ClientPlanningConfigService(object):

    def __init__(self, user):
        self.user = user

    def get(self, model_dict):
        """
        returns client_planning_config
        :param model_dict:
        :return:
        """
        dao = ClientPlanningConfigDao()
        filter_dict = ClientPlanningConfigMapper.get_filter_dict(self.user, model_dict)
        filter_dict['is_active'] = True

        results = dao.query(filter_dict, credentials=PostgresCredentials())
        if not results:
            raise ClientPlanningConfigDoesNotExist("Planning engine is disabled, please contact the site administrator")
        return results[0]

