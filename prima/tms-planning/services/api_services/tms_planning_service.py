from constants.constants import VALID_PLANNING_SERVICES_NAMES, PLANNING_SERVICES_NAMES_LOADER_MAP
from errors.exceptions import ValidationException
from utilities.utils import set_user_parameters, validate_user_request, get_config


class TmsPlanningService(object):
    def __init__(self, user):
        self.user = user

    def planning_listing(self, request_dict):

        request_dict = set_user_parameters(self.user, request_dict)

        validate_user_request(request_dict)

        # Get
        _planning_service, _api_key = get_config(self.user, request_dict)

        if _planning_service not in VALID_PLANNING_SERVICES_NAMES:
            raise ValidationException("Planning engine is disabled, please contact the site administrator")

        loader = PLANNING_SERVICES_NAMES_LOADER_MAP.get(_planning_service)
        response = loader(_api_key).get_planning_listing(request_dict)
        return response


    def task_listing(self, request_dict):

        request_dict = set_user_parameters(self.user, request_dict)

        validate_user_request(request_dict)

        # Get
        _planning_service, _api_key = get_config(self.user, request_dict)

        if _planning_service not in VALID_PLANNING_SERVICES_NAMES:
            raise ValidationException("Planning engine is disabled, please contact the site administrator")

        loader = PLANNING_SERVICES_NAMES_LOADER_MAP.get(_planning_service)
        response = loader(_api_key).get_task_listing(request_dict)
        return response

    def error_listing(self, request_dict):

        request_dict = set_user_parameters(self.user, request_dict)

        validate_user_request(request_dict)

        # Get
        _planning_service, _api_key = get_config(self.user, request_dict)

        if _planning_service not in VALID_PLANNING_SERVICES_NAMES:
            raise ValidationException("Planning engine is disabled, please contact the site administrator")

        loader = PLANNING_SERVICES_NAMES_LOADER_MAP.get(_planning_service)
        response = loader(_api_key).get_error_listing(request_dict)
        return response
    
    def planning_result(self, request_dict):
        """
        It takes a user and a request_dict with planning request id, 
        validates the request_dict, gets the planner config details,
        and then calls the appropriate loader to get the result listing
        
        :param request_dict: This is the dictionary of parameters that the user passes in
        :return: The response is a list of dictionaries of that passed planning request id.
        """

        request_dict = set_user_parameters(self.user, request_dict)

        validate_user_request(request_dict)
        self.validate_planning_request_id(request_dict)

        # get planner config details
        _planning_service, _api_key = get_config(self.user, request_dict)

        if _planning_service not in VALID_PLANNING_SERVICES_NAMES:
            raise ValidationException("Planning engine is disabled, please contact the site administrator")

        loader = PLANNING_SERVICES_NAMES_LOADER_MAP.get(_planning_service)
        response = loader(_api_key).get_result_listing(request_dict)
        return response
    
    @staticmethod
    def validate_planning_request_id(request_dict):
        """
        It validates that the planning request id is present in the request dictionary.
        
        :param request_dict: The request dictionary that is passed to the service
        """
        if not request_dict.get('planning_request_id'):
            raise ValidationException("Planning request id is mandatory")
    
    def planning_routes(self, request_dict):

        request_dict = set_user_parameters(self.user, request_dict)

        validate_user_request(request_dict)
        self.validate_planning_request_id(request_dict)

        # Get
        _planning_service, _api_key = get_config(self.user, request_dict)

        if _planning_service not in VALID_PLANNING_SERVICES_NAMES:
            raise ValidationException("Planning engine is disabled, please contact the site administrator")

        loader = PLANNING_SERVICES_NAMES_LOADER_MAP.get(_planning_service)
        response = loader(_api_key).get_routes_listing(request_dict)
        return response

    def planning_config(self, request_dict):

        request_dict = set_user_parameters(self.user, request_dict)

        validate_user_request(request_dict)

        # Get
        _planning_service, _api_key = get_config(self.user, request_dict)

        if _planning_service not in VALID_PLANNING_SERVICES_NAMES:
            raise ValidationException("Planning engine is disabled, please contact the site administrator")

        loader = PLANNING_SERVICES_NAMES_LOADER_MAP.get(_planning_service)
        response = loader(_api_key).get_planning_config(request_dict)
        return response

    def solver_config(self, request_dict):
        request_dict = set_user_parameters(self.user, request_dict)

        validate_user_request(request_dict)

        # Get
        _planning_service, _api_key = get_config(self.user, request_dict)

        if _planning_service not in VALID_PLANNING_SERVICES_NAMES:
            raise ValidationException("Planning engine is disabled, please contact the site administrator")

        loader = PLANNING_SERVICES_NAMES_LOADER_MAP.get(_planning_service)
        response = loader(_api_key).update_solver_config(request_dict)
        return response

