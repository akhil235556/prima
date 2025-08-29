from integrations.prima.planning_errors import PlanningErrors
from integrations.prima.planning_output import PlanningOutput
from integrations.prima.planning_file_upload import PlanningFileUpload
from integrations.prima.planning_requests import PlanningRequests
from integrations.prima.planning_results import PlanningResults
from integrations.prima.planning_routes import PlanningRoutes
from integrations.prima.planning_tasks import PlanningTasks
from integrations.prima.sample_file import SampleFile
from integrations.prima.planning_config import PlanningConfig
from integrations.prima.solver_config import SolverConfig
from loader.default_loader import DefaultLoader
from context_logging import logging
logger = logging.getLogger(__name__)


class PrimaLoader(DefaultLoader):
    _api_key = None

    def __init__(self, api_key):
        self._api_key = api_key

    def file_upload(self, request_dict, filepath):
        planning_file_upload = PlanningFileUpload(self._api_key)
        response = planning_file_upload.file_upload(request_dict, filepath)
        return response

    def get_planning_listing(self, request_dict):
        planning_requests = PlanningRequests(self._api_key)
        response = planning_requests.list(request_dict)
        return response

    def get_task_listing(self, request_dict):
        planning_tasks = PlanningTasks(self._api_key)
        response = planning_tasks.list(request_dict)
        return response

    def get_routes_listing(self, request_dict):
        planning_routes = PlanningRoutes(self._api_key)
        response = planning_routes.list(request_dict)
        return response

    def get_result_listing(self, request_dict):
        planning_results = PlanningResults(self._api_key)
        response = planning_results.results(request_dict)
        return response

    def get_error_listing(self, request_dict):
        planning_errors = PlanningErrors(self._api_key)
        response = planning_errors.list(request_dict)
        return response

    def get_output_file(self, request_dict):
        planning_output = PlanningOutput(self._api_key)
        planning_output_response = planning_output.get_output(request_dict)
        if "details" in planning_output_response.keys() and \
                "results" in planning_output_response.get("details", {}).keys():
            results = dict(
                output=planning_output_response["details"]["results"].get('output', "")
            )
            planning_output_response["details"]["results"] = results
        return planning_output_response

    def get_indent_output_file(self, request_dict):
        planning_output = PlanningOutput(self._api_key)
        planning_output_response = planning_output.get_output(request_dict)
        if "details" in planning_output_response.keys() and \
                "results" in planning_output_response.get("details", {}).keys():
            details = dict(
                link=planning_output_response["details"]["results"].get('indent_output', "")
            )
            planning_output_response["details"] = details

        return planning_output_response

    def get_sample_file(self, request_dict):
        planning_sample_file = SampleFile(self._api_key)
        planning_output_response = planning_sample_file.get_sample(request_dict)
        logger.info(f'Sample File Response {planning_output_response}')
        if "details" in planning_output_response.keys() and \
                "link" in planning_output_response.get("details", {}).keys():
            details = dict(
                link=planning_output_response["details"].get('link', "")
            )
            planning_output_response["details"] = details

        return planning_output_response

    def get_planning_config(self, request_dict):
        planning_config = PlanningConfig(self._api_key)
        response = planning_config.list(request_dict)
        return response

    def update_solver_config(self, request_dict):
        solver_config = SolverConfig()
        response = solver_config.list(request_dict)
        return response
