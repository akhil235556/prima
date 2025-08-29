from models.client_solver_config import ClientSolverConfigMapper
import logging
logger = logging.getLogger(__name__)


class UpdateSolverConfig:

    def __init__(self, api_key, solver_name, is_active):
        self.api_key = api_key
        self.solver_name = solver_name
        self.is_active = is_active

    def update_solver_config(self):
        solver_config_mapper = ClientSolverConfigMapper()

        solver_config_mapper.upload_request(self.api_key, self.solver_name, self.is_active)
