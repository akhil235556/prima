from constants.constants import VALID_PLANNING_SERVICES_NAMES, PLANNING_SERVICES_NAMES_LOADER_MAP
from errors.exceptions import ValidationException
from utilities.utils import set_user_parameters, get_config


class SampleFileService(object):

    def __init__(self, user):
        self.user = user

    def process_sample_file(self, request_dict):

        request_dict = set_user_parameters(self.user, request_dict)

        # Get
        _planning_service, _api_key = get_config(self.user, request_dict)

        if _planning_service not in VALID_PLANNING_SERVICES_NAMES:
            raise ValidationException("Invalid planning_service")

        if not request_dict.get('engine_name'):
            raise ValidationException('engine_name is mandatory')

        if not request_dict.get('sub_engine_name'):
            raise ValidationException('sub_engine_name is mandatory')

        loader = PLANNING_SERVICES_NAMES_LOADER_MAP.get(_planning_service)
        response = loader(_api_key).get_sample_file(request_dict)

        return response







