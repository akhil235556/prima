from user_session_interceptor.models.user_session_model import UserSessionInfo

from constants.constants import ServiceStatusCode, ServiceStatusMessage
from errors.exceptions import ValidationException
from services.client_planning_config_service import ClientPlanningConfigService


def create_success_response_dict(details, message=None):
    return {
        'code': ServiceStatusCode.SUCCESS,
        'message': message or ServiceStatusMessage.SUCCESS,
        'details': details
    }

def validate_user_request(request_dict):
    if not request_dict.get('tenant'):
        raise ValidationException('tenant is mandatory')
    if not request_dict.get('partition'):
        raise ValidationException('partition is mandatory')
    if not request_dict.get('node'):
        raise ValidationException('node is mandatory')

def get_config(user, request_dict):
    client_config_service = ClientPlanningConfigService(user)
    result = client_config_service.get(request_dict)
    return result.get('planning_service'), result.get('api_key')

def set_user_parameters(user, request_dict):
    request_dict["tenant"] = request_dict.get("tenant") or (user and user.tenant)
    request_dict["partition"] = request_dict.get("partition") or (user and user.partition)
    request_dict["node"] = request_dict.get("node") or (user and user.node)
    return request_dict

def validate_user_request_v2(request_dict):
    if not request_dict.get('tenant'):
        raise ValidationException('tenant is mandatory')
    if not request_dict.get('partition'):
        raise ValidationException('partition is mandatory')
    if not request_dict.get('node'):
        raise ValidationException('node is mandatory')
    if not request_dict.get('engine_name'):
        raise ValidationException('engine_name is mandatory')
    if not request_dict.get('sub_engine_name'):
        raise ValidationException('sub_engine_name is mandatory')
