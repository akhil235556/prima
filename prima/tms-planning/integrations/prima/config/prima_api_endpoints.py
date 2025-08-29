from integrations.prima.config.prima_api_config import PrimaIntegrationEnvironmentVariables
from settings import env


class PrimaApiConfig(object):

    @staticmethod
    def host():
        return env.get(PrimaIntegrationEnvironmentVariables.hostname)

    @staticmethod
    def get_planning_output_url():
        host = PrimaApiConfig.host()
        planning_output_api_uri = env.get(PrimaIntegrationEnvironmentVariables.planning_output_api_uri)
        url = "{host}{uri}".format(host=host, uri=planning_output_api_uri)
        return url

    @staticmethod
    def get_file_upload_url():
        host = PrimaApiConfig.host()
        planning_file_upload_api_uri = env.get(PrimaIntegrationEnvironmentVariables.planning_file_upload_api_uri)
        # todo for testing
        planning_file_upload_api_uri = "v2/planning/file/upload/"
        url = "{host}{uri}".format(host=host, uri=planning_file_upload_api_uri)
        return url

    @staticmethod
    def get_planning_requests_url():
        host = PrimaApiConfig.host()
        planning_requests_uri = env.get(PrimaIntegrationEnvironmentVariables.planning_requests_uri)
        # todo for testing
        planning_requests_uri = "v2/planning/request"
        url = "{host}{uri}".format(host=host, uri=planning_requests_uri)
        return url

    @staticmethod
    def get_planning_task_url():
        host = PrimaApiConfig.host()
        planning_task_uri = env.get(PrimaIntegrationEnvironmentVariables.planning_task_uri)
        # todo for testing
        planning_task_uri = "v2/planning/tasks"
        url = "{host}{uri}".format(host=host, uri=planning_task_uri)
        return url

    @staticmethod
    def get_planning_error_url():
        host = PrimaApiConfig.host()
        planning_error_uri = env.get(PrimaIntegrationEnvironmentVariables.planning_error_uri)
        # todo for testing
        planning_error_uri = "v2/planning/errors"
        url = "{host}{uri}".format(host=host, uri=planning_error_uri)
        return url
    
    @staticmethod
    def get_planning_results():
        host = PrimaApiConfig.host()
        planning_result_uri = env.get(PrimaIntegrationEnvironmentVariables.planning_result_uri)
        # todo for testing
        planning_result_uri = "v2/planning/result"
        url = "{host}{uri}".format(host=host, uri=planning_result_uri)
        return url
    
    @staticmethod
    def get_planning_routes_url():
        host = PrimaApiConfig.host()
        planning_routes_uri = env.get(PrimaIntegrationEnvironmentVariables.planning_routes_uri)
        # todo for testing
        planning_routes_uri = "v2/planning/routes"
        url = "{host}{uri}".format(host=host, uri=planning_routes_uri)
        return url

    @staticmethod
    def get_planning_sample_file_url():
        host = PrimaApiConfig.host()
        planning_sample_file_api_uri = "v2/sample_file"
        url = "{host}{uri}".format(host=host, uri=planning_sample_file_api_uri)
        return url

    @staticmethod
    def get_planning_config_url():
        host = PrimaApiConfig.host()
        planning_config_api_uri = "v2/planning/get_solver_config"
        url = "{host}{uri}".format(host=host, uri=planning_config_api_uri)
        return url

    @staticmethod
    def update_solver_config_url():
        host = PrimaApiConfig.host()
        planning_config_api_uri = "v2/planning/update_solver_config"
        url = "{host}{uri}".format(host=host, uri=planning_config_api_uri)
        return url

