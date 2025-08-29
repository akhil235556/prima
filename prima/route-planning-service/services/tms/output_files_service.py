import logging
from abc import ABC, abstractmethod

from werkzeug.exceptions import BadRequest
from route_planner.exceptions.exceptions import AppException
from constants.constants import PlanningType, VALID_PLANNING_TYPES

from db.dao.base_dao import BaseDao
from utils.gs import GoogleStorage

logger = logging.getLogger(__name__)

class OutputFiles(ABC):

    @property
    def extension(self):
        return "xlsx"

    @property
    def csv_extension(self):
        return "csv"

    def csv_filepath(self, _rid):
        return f"{_rid}_{self.filename}.{self.csv_extension}"

    def filepath(self, _rid):
        return f"{_rid}_{self.filename}.{self.extension}"

    @abstractmethod
    def filename(self):
        return ""


class InputFile(OutputFiles):

    @property
    def filename(self):
        return "input"


class OutputFile(OutputFiles):

    @property
    def filename(self):
        return "output"


class IndentOutputFile(OutputFiles):

    @property
    def filename(self):
        return "indent_output"

def get_output_file(_planner_type):
    if PlanningType.SEQUENTIAL_MID_MILE_PLANNING.value.name == _planner_type:
        return [InputFile(), OutputFile(), IndentOutputFile()]

    return []


class OutputFilesService(object):

    def __init__(self, request):
        self.validate_request(request)
        self.planning_request_id = request.get('planning_request_id')
        self.planning_name = request.get('planning_name')

    @staticmethod
    def validate_request(request):
        if not request:
            raise BadRequest("No arguments provided")

        BaseDao.is_empty(request.get('planning_request_id'), 'planning_request_id')
        # BaseDao.is_empty(request.get('planning_name'), 'planning_name')

        BaseDao.is_str(request.get('planning_request_id'), 'planning_request_id')

        # if request.get('planning_name') not in VALID_PLANNING_TYPES:
        #     raise AppException(f"Invalid planning_name '{request.get('planning_name')}'")

    def output_files(self):
        details = dict()

        output_files_objects = get_output_file(self.planning_name)

        for output_files_object in output_files_objects:
            _filename = output_files_object.filename
            if _filename == IndentOutputFile().filename:
                _filepath = output_files_object.csv_filepath(self.planning_request_id)
                file_path = GoogleStorage.bucket_path(self.planning_request_id, _filepath, "Prima")
            else:
                _filepath = output_files_object.filepath(self.planning_request_id)
                file_path = GoogleStorage.bucket_path(self.planning_request_id, _filepath, "Prima")
            try:
                public_url = GoogleStorage.public_link(file_path)
                details[_filename] = public_url
            except IOError as e:
                logger.info(f"{_filename} does not exists! path:{file_path}")

        return details
