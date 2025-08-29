import os
import logging
from constants.constants import VALID_PLANNING_SERVICES_NAMES, PLANNING_SERVICES_NAMES_LOADER_MAP
from errors.exceptions import ValidationException
from utilities.utils import set_user_parameters, validate_user_request, get_config, validate_user_request_v2

logger = logging.getLogger(__name__)

class OutputFileService(object):

    def __init__(self, user):
        self.user = user

    def process_output_file(self, request_dict):
        request_dict = set_user_parameters(self.user, request_dict)

        validate_user_request(request_dict)
        if not request_dict.get('planning_request_id'):
            raise ValidationException('planning_request_id is mandatory')

        # if not request_dict.get('planning_name'):
        #     raise ValidationException('planning_name is mandatory')

        # Get
        _planning_service, _api_key = get_config(self.user, request_dict)

        if _planning_service not in VALID_PLANNING_SERVICES_NAMES:
            raise ValidationException("Invalid planning_service")

        loader = PLANNING_SERVICES_NAMES_LOADER_MAP.get(_planning_service)
        response = loader(_api_key).get_output_file(request_dict)
        return response

    def upload(self, filepath, engine, sub_engine):
        request_dict = dict()
        request_dict['engine_name'] = engine
        request_dict['sub_engine_name'] = sub_engine

        request_dict = set_user_parameters(self.user, request_dict)

        logger.info(f"request dict - {request_dict}")

        validate_user_request_v2(request_dict)

        # Get
        _planning_service, _api_key = get_config(self.user, request_dict)

        if _planning_service not in VALID_PLANNING_SERVICES_NAMES:
            raise ValidationException("Invalid planning_service")

        loader = PLANNING_SERVICES_NAMES_LOADER_MAP.get(_planning_service)
        response = loader(_api_key).file_upload(request_dict, filepath)
        return response

    @staticmethod
    def write_stream(stream, filename, ext):
        _filename = f"{filename}.{ext}"
        file_path = None
        data = bytearray()
        engine = ''
        sub_engine = ''

        for req in stream:
            if req.engine.engine_name and req.engine.sub_engine_name:
                engine = req.engine.engine_name
                sub_engine = req.engine.sub_engine_name
                continue
            data.extend(req.data)

        logger.info(f"Engine Name -{engine}")
        logger.info(f"Sub Engine Name -{sub_engine}")
        logger.info(f"Data - {data}")

        with open(_filename, 'wb') as f:
            f.write(data)
            file_path = f"{os.getcwd()}/{_filename}"

        return file_path, engine, sub_engine

    @staticmethod
    def delete_file(file_path):
        if file_path:
            os.remove(file_path)
        return None

    def process_indent_output_file(self, request_dict):

        request_dict = set_user_parameters(self.user, request_dict)

        validate_user_request(request_dict)
        if not request_dict.get('planning_request_id'):
            raise ValidationException('planning_request_id is mandatory')

        # if not request_dict.get('planning_name'):
        #     raise ValidationException('planning_name is mandatory')

        # Get
        _planning_service, _api_key = get_config(self.user, request_dict)

        if _planning_service not in VALID_PLANNING_SERVICES_NAMES:
            raise ValidationException("Invalid planning_service")

        loader = PLANNING_SERVICES_NAMES_LOADER_MAP.get(_planning_service)
        response = loader(_api_key).get_indent_output_file(request_dict)
        return response






