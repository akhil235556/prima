import logging
from functools import wraps
from flask import request
from models.client_solver_config import ClientSolverConfigMapper

logger = logging.getLogger(__name__)

class AuthError(Exception):
    def __init__(self, error, status_code):
        self.message = error["description"]
        self.code = error["code"]
        self.details = error
        self.status_code = status_code


def get_api_key():
    auth = request.headers.get("api-key", None)
    return auth

def get_api_key_auth_header():
    """
    Obtains the API Key from the Authorization Header
    """
    auth = get_api_key()
    if not auth:
        raise AuthError({
                "code": "authorization_header_missing",
                "description": "Authorization header is expected"
            }, 401)
    return auth

def validate_api_key(api_key):
    try:
        result = ClientSolverConfigMapper.get_by_api_key(api_key)

    except Exception as e:
        raise AuthError({
            "code": "api_key_validation_error",
            "description": "Unable to validate api_key."
        }, 401)

    if not result:
        raise AuthError({
            "code": "invalid_api_key",
            "description": "Invalid api_key."
        }, 401)

    return result

def requires_auth(f):
    """
    Determines if the Access Token is valid
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        api_key_result = None
        try:
            api_key = get_api_key_auth_header()
            logger.info(f"requires_auth: {api_key}")

            api_key_result = validate_api_key(api_key)
            logger.info(f"requires_auth: api_key_result: {api_key_result}")

        except Exception as ex:
            logger.info(f"Exception during authentication: {ex}")
            raise ex

        return f(*args, **kwargs)

    return decorated
