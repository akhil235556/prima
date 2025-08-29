import uuid

from context_logging import logging
from google.protobuf.json_format import MessageToDict, ParseDict

from services.api_services.output_file_service import OutputFileService
from services.api_services.tms_planning_service import TmsPlanningService
from services.api_services.sample_file_service import SampleFileService
from tms_planning_services_pb2_grpc import TmsPlanningServiceServicer
from tms_planning_models_pb2 import getOutputFileResponse, FileUploadResponse, getPlanningListingResponse, getTaskListingResponse, getErrorListingResponse, getPlanningResultResponse, getPlanningRoutesResponse, getSampleFileResponse, getIndentOutputFileResponse, getPlanningConfigResponse, updateSolverConfigResponse

import grpc
from context_logging.logging import context_logging

from user_session_interceptor.decorators.user_session_decorator import (
    session_validate
)

from errors.exceptions import AppException
from utilities.utils import create_success_response_dict


logger = logging.getLogger(__name__)


class TmsPlanningController(TmsPlanningServiceServicer):

    @context_logging
    @session_validate
    def getOutputFile(self, request, context, user=None, error=None):
        try:
            request_dict = MessageToDict(request, preserving_proto_field_name=True)
            logger.info("getOutputFile request: {}".format(request_dict))

            response_dict = OutputFileService(user).process_output_file(request_dict)
            logger.info("getOutputFile response: {}".format(response_dict))

            response = getOutputFileResponse()
            response = ParseDict(response_dict, response, ignore_unknown_fields=True)
            return response
        except AppException as exc:
            message = str(exc)
            logger.info(message)
            context.abort(code=grpc.StatusCode.INVALID_ARGUMENT, details=message)

    @context_logging
    @session_validate
    def getSampleFile(self, request, context, user=None, error=None):
        try:
            request_dict = MessageToDict(request, preserving_proto_field_name=True)
            logger.info("getSampleFile request: {}".format(request_dict))

            response_dict = SampleFileService(user).process_sample_file(request_dict)
            logger.info("getSampleFile response: {}".format(response_dict))

            response = getSampleFileResponse()
            response = ParseDict(response_dict, response, ignore_unknown_fields=True)
            return response
        except AppException as exc:
            message = str(exc)
            logger.info(message)
            context.abort(code=grpc.StatusCode.INVALID_ARGUMENT, details=message)

    @context_logging
    @session_validate
    def upload(self, request, context, user=None, error=None):
        try:
            metadata = context.invocation_metadata()
            metadata_dict = {}
            for c in metadata:
                metadata_dict[c.key] = c.value
            logger.info(f"metadata file upload {metadata_dict}")
            proxy_filename = uuid.uuid4().hex
            file_extn = metadata_dict.get("file-extention", None)
            if not file_extn:
                raise AppException(f"file-extention is mandatory")

            file_path, engine, sub_engine = OutputFileService.write_stream(request, proxy_filename, file_extn)

            response_dict = OutputFileService(user).upload(filepath=file_path, engine=engine, sub_engine=sub_engine)
            logger.info("upload response: {}".format(response_dict))

            response = FileUploadResponse()
            response = ParseDict(response_dict, response, ignore_unknown_fields=True)
            return response
        except AppException as exc:
            message = str(exc)
            logger.info(message)
            context.abort(code=grpc.StatusCode.INVALID_ARGUMENT, details=message)

    @context_logging
    @session_validate
    def getIndentOutputFile(self, request, context, user=None, error=None):
        try:
            request_dict = MessageToDict(request, preserving_proto_field_name=True)
            logger.info("getIndentOutputFile request: {}".format(request_dict))

            response_dict = OutputFileService(user).process_indent_output_file(request_dict)
            logger.info("getIndentOutputFile response: {}".format(response_dict))

            response = getIndentOutputFileResponse()
            response = ParseDict(response_dict, response, ignore_unknown_fields=True)
            return response
        except AppException as exc:
            message = str(exc)
            logger.info(message)
            context.abort(code=grpc.StatusCode.INVALID_ARGUMENT, details=message)

    @context_logging
    @session_validate
    def getPlanningListing(self, request, context, user=None, error=None):
        try:
            request_dict = MessageToDict(request, preserving_proto_field_name=True)
            logger.info("getPlanningListing request: {}".format(request_dict))

            response_dict = TmsPlanningService(user).planning_listing(request_dict)
            logger.info("getPlanningListing response: {}".format(response_dict))

            response = getPlanningListingResponse()
            response = ParseDict(response_dict, response, ignore_unknown_fields=True)
            return response
        except AppException as exc:
            message = str(exc)
            logger.info(message)
            context.abort(code=grpc.StatusCode.INVALID_ARGUMENT, details=message)

    @context_logging
    @session_validate
    def getTaskListing(self, request, context, user=None, error=None):
        try:
            request_dict = MessageToDict(request, preserving_proto_field_name=True)
            logger.info("getTaskListing request: {}".format(request_dict))

            response_dict = TmsPlanningService(user).task_listing(request_dict)
            logger.info("getTaskListing response: {}".format(response_dict))

            response = getTaskListingResponse()
            response = ParseDict(response_dict, response, ignore_unknown_fields=True)
            return response
        except AppException as exc:
            message = str(exc)
            logger.info(message)
            context.abort(code=grpc.StatusCode.INVALID_ARGUMENT, details=message)

    @context_logging
    @session_validate
    def getErrorListing(self, request, context, user=None, error=None):
        try:
            request_dict = MessageToDict(request, preserving_proto_field_name=True)
            logger.info("getErrorListing request: {}".format(request_dict))

            response_dict = TmsPlanningService(user).error_listing(request_dict)
            logger.info("getErrorListing response: {}".format(response_dict))

            response = getErrorListingResponse()
            response = ParseDict(response_dict, response, ignore_unknown_fields=True)
            return response
        except AppException as exc:
            message = str(exc)
            logger.info(message)
            context.abort(code=grpc.StatusCode.INVALID_ARGUMENT, details=message)
    
    
    @context_logging
    @session_validate
    def getPlanningResult(self, request, context, user=None, error=None):
        try:
            request_dict = MessageToDict(request, preserving_proto_field_name=True)
            logger.info("getPlanningResult request: {}".format(request_dict))

            response_dict = TmsPlanningService(user).planning_result(request_dict)
            logger.info("getPlanningResult response: {}".format(response_dict))

            response = getPlanningResultResponse()
            response = ParseDict(response_dict, response, ignore_unknown_fields=True)
            return response
        except AppException as exc:
            message = str(exc)
            logger.info(message)
            context.abort(code=grpc.StatusCode.INVALID_ARGUMENT, details=message)
            
    @context_logging
    @session_validate
    def getPlanningRoutes(self, request, context, user=None, error=None):
        try:
            request_dict = MessageToDict(request, preserving_proto_field_name=True)
            logger.info("getPlanningRoutes request: {}".format(request_dict))

            response_dict = TmsPlanningService(user).planning_routes(request_dict)
            logger.info("getPlanningRoutes response: {}".format(response_dict))

            response = getPlanningRoutesResponse()
            response = ParseDict(response_dict, response, ignore_unknown_fields=True)
            return response
        except AppException as exc:
            message = str(exc)
            logger.info(message)
            context.abort(code=grpc.StatusCode.INVALID_ARGUMENT, details=message)

    @context_logging
    @session_validate
    def getPlanningConfig(self, request, context, user=None, error=None):

        try:
            request_dict = MessageToDict(request, preserving_proto_field_name=True)
            logger.info("getPlanningConfig request: {}".format(request_dict))

            response_dict = TmsPlanningService(user).planning_config(request_dict)
            logger.info("getPlanningConfig response: {}".format(response_dict))

            response = getPlanningConfigResponse()
            response = ParseDict(response_dict, response, ignore_unknown_fields=True)
            return response

        except AppException as exc:

            message = str(exc)
            logger.info(message)
            context.abort(code=grpc.StatusCode.INVALID_ARGUMENT, details=message)

    @context_logging
    @session_validate
    def updateSolverConfig(self, request, context, user=None, error=None):

        try:
            request_dict = MessageToDict(request, preserving_proto_field_name=True)
            logger.info("updateSolverConfig request: {}".format(request_dict))

            response_dict = TmsPlanningService(user).solver_config(request_dict)
            logger.info("updateSolverConfig response: {}".format(response_dict))

            response = updateSolverConfigResponse()
            response = ParseDict(response_dict, response, ignore_unknown_fields=True)
            return response

        except AppException as exc:

            message = str(exc)
            logger.info(message)
            context.abort(code=grpc.StatusCode.INVALID_ARGUMENT, details=message)