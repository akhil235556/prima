from database.drivers.postgres_v2 import postgres_connection
from models.client_solver_config import ClientSolverConfigMapper
from utils.utils import solver_mapping
from constants.constants import engine_subengine_map

class SolverConfigService(object):

    def __init__(self, api_key):

        self.api_key = api_key


    def get_solver_config_list(self):

        payload = dict(api_key=self.api_key)

        result = ClientSolverConfigMapper.list(payload)

        return result

    @staticmethod
    def engine_config_response(solver_config_list):

        solver_name_data = [d['solver_name'] for d in solver_config_list]

        engine_config = list()

        if solver_name_data:

            solver_info_dict = solver_mapping(solver_name_data)

            for engine, sub_engines in engine_subengine_map.items():
                a = dict()
                a['engine_name'] = engine
                a['is_enabled'] = False
                a['sub_engine_names'] = list()
                if engine in solver_info_dict.keys():
                    a['is_enabled'] = True
                for subs in sub_engines:
                    b = dict()
                    b['name'] = subs
                    b["enabled"] = False
                    if solver_info_dict.get(engine) is not None and subs in solver_info_dict.get(engine):
                        b["enabled"] = True
                    a['sub_engine_names'].append(b)
                engine_config.append(a)

        return engine_config











