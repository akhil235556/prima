import json
import logging

from route_planner.exceptions.exceptions import ValidationError

from constants.constants import UploadJobsStatus
from db.drivers.postgres import postgres_connection
from exceptions.exceptions import AppException
from models.planning_errors import PlanningErrorsMapper
from models.planning_requests import PlanningRequestsMapper

logger = logging.getLogger(__name__)

class PlanningErrorsService(object):

    def __init__(self, planning_rid):
        self._planning_rid = planning_rid

    def parse_validation_exception(self, ex: ValidationError):
        problems = ex.problems or []
        ex_type = ex.exception_type
        default_message = ex.message
        parsed_errors = list()
        for problem in problems:
            error = dict(
                planning_request_id=self._planning_rid,
                error_name=ex_type,
                error_message=problem.get("message", default_message)
            )
            if problem.get("row_number"):
                error["error_row_no"] = problem.get("row_number")
            if problem.get("sheet"):
                error["error_sheet"] = problem.get("sheet")
            if problem.get("row"):
                error["error_details"] = problem.get("row")
            parsed_errors.append(error)
        return parsed_errors

    def parse_exception(self, ex):
        ex_type = ex.exception_type
        message = ex.message
        error = dict(
            planning_request_id=self._planning_rid,
            error_name=ex_type,
            error_message=message
        )
        return error

    def upload_errors(self, errors, **kwargs):
        try:
            # check planning_request exits and status is Created
            filter_dict = dict(
                request_id=self._planning_rid,
                tenant=kwargs.get("tenant"),
                partition=kwargs.get("partition"),
                node=kwargs.get("node")
            )

            with postgres_connection() as conn:

                result = PlanningRequestsMapper.get_planning_request(filter_dict, _connection=conn)

                if result.get('status_code') not in [
                    UploadJobsStatus.CREATED.value.code,
                    UploadJobsStatus.PROCESSING.value.code,
                    UploadJobsStatus.FAIL.value.code,
                    UploadJobsStatus.PENDING.value.code
                ]:
                    raise AppException(
                        f"Cannot Update planning_errors for planning_request_id: {self._planning_rid}, Existing Status should be :{UploadJobsStatus.CREATED.value.name}, {UploadJobsStatus.FAIL.value.name}, {UploadJobsStatus.PROCESSING.value.name}")

                PlanningErrorsMapper.bulk_upload(errors, _connection=conn)
        except Exception as ex:
            logger.info(f"upload_errors: Failed : exception :{ex}")

    @staticmethod
    def jsonify_problems(problems):
        parsed_problems = list()
        if not problems:
            return parsed_problems
        for problem in problems:
            problem["row"] = json.dumps(problem.get("row", {}))
            parsed_problems.append(problem)
        return parsed_problems

    def upload_errors_after_completion(self, errors, request_dict):

        try:
            # check planning_request exits and status is processing
            filter_dict = dict(
                request_id=self._planning_rid,
                tenant=request_dict.get("tenant"),
                partition=request_dict.get("partition"),
                node=request_dict.get("node")
            )

            with postgres_connection() as conn:

                result = PlanningRequestsMapper.get_planning_request(filter_dict, _connection=conn)

                if result.get('status_code') not in [
                    UploadJobsStatus.PROCESSING.value.code,
                ]:
                    raise AppException(
                        f"Cannot Update planning_errors for planning_request_id: {self._planning_rid}, Existing Status should be :{UploadJobsStatus.PROCESSING.value.name}")

                PlanningErrorsMapper.bulk_upload(errors, _connection=conn)

        except Exception as ex:

            logger.info(f"upload_errors: Failed : exception :{ex}")
