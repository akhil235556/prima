"""
Python Flask WebApp for file upload integration
"""
import json
import logging
import os
import traceback


from auth.api_key_auth import AuthError, requires_auth
from models.planning_errors import PlanningErrorsMapper
from models.planning_result import PlanningResultMapper
from models.planning_tasks import PlanningTasksMapper
from models.planning_requests import PlanningRequestsMapper
from models.planning_routes import PlanningRoutesMapper
from services.tms.file_upload_service import FileUploadService
from services.tms.output_files_service import OutputFilesService
from services.tms.planning_errors_service import PlanningErrorsService
from services.tms.complete_request_service import CompleteRequestService
from services.tms.solver_config_service import SolverConfigService
from services.tms.update_solver_config_service import UpdateSolverConfig
from utils.utils import generate_request_id

from flask import Flask
from flask import jsonify
from flask import request
from geopy.distance import geodesic
from route_planner.vrp.consolidated_fixed_cost_planner.consolidated_fixed_cost_validator import FixedCostUploadValidation
from route_planner.vrp.consolidated_variable_cost_planner.consolidated_variable_cost_validator import \
    VariableUploadValidation
from route_planner.bin_packing.sku_fixed_cost_bin_packing_planner.sku_fixed_cost_bin_packing_validator import BinPackingUploadValidation
from route_planner.sku_variable_cost_optimization_ai_planner.sku_variable_cost_optimization_ai_validator import OptimizationAIUploadValidation
from route_planner.vrp.sku_variable_cost_planner.sku_variable_cost_validator import MultiProductVariableUploadValidation
from route_planner.vrp.mid_mile_cost_planner.mid_mile_cost_validator import MidMileUploadValidation
from route_planner.bin_packing.sequential_planner.bin_packing_validator import SequentialUploadValidation
from route_planner.kohler.bin_packing_mid_mile.bin_packing_mid_mile_validator import BPMidMileUploadValidation
from route_planner.kohler.sequential_mid_mile.sequential_mid_mile_validator import SequentialMidMileUploadValidation
# File upload validator
from route_planner.vrp.sku_fixed_cost_planner.sku_fixed_cost_validator import MultiProductUploadValidation
from viper.publishers.pubsub_publisher import GooglePubSubPublisher

from werkzeug.exceptions import BadRequest, HTTPException

from constants.constants import (SAMPLE_FILE_MAP, SAMPLE_FILE_BASE_PATH, MAX_CONTENT_LENGTH,
                                 AVERAGE_VEHICLE_SPEED, PlanningType, UploadJobsStatus, ClientType, Engine, SubEngine)
from constants.requests_log_messages import RequestLogMessages

from route_planner.exceptions.exceptions import ValidationError, InvalidRequest, InvalidHeader, AppException, \
    DatabaseException
from pubsub.pubsub_configurations import PubSubConfiguration
from services.requests_log import RequestLog
from services.upload_jobs import RequestsServices
from utils.gs import GoogleStorage
from utils.logging import context_logging
from utils.utils import engine_subengine_to_solver_mapping

app = Flask(__name__)
app.secret_key = "2893748923wjdhqvd326tr328"
app.url_map.strict_slashes = False
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

logging.basicConfig(level=1)
LOGGER = logging.getLogger(__name__)


@app.errorhandler(Exception)
def handle_auth_error(ex):
    response = jsonify(message=str(ex), details={}, code="500")
    response.status_code = 500

    if isinstance(ex, AuthError):
        details = dict(errors=list())
        details["errors"].append(ex.details)
        response = jsonify(
            message=ex.message, code=ex.code, details=details)
        response.status_code = ex.status_code

    if isinstance(ex, (HTTPException, BadRequest)):
        response = jsonify(message=str(ex), code=str(ex.code), details={})
        response.status_code = ex.code

    if isinstance(ex, (InvalidRequest, InvalidHeader, ValidationError, AppException, DatabaseException)):
        problems = ex.problems or []
        response = jsonify(
            message=ex.message,
            code=str(ex.code),
            details=problems
        )
        response.status_code = ex.code

    LOGGER.error(f"error in service. exception={str(ex)} traceback={traceback.format_exc()}")
    return response


@app.route("/v1/health", methods=['GET'])
def healthcheck():
    return "OK", 200


@app.route('/v1/distance', methods=["POST"])
def location_distance(*args, **kwargs):
    data = request.data
    data = json.loads(data)

    assert data.get('origin_latitude'), "origin_latitude is mandatory"
    assert data.get('origin_longitude'), "origin_longitude is mandatory"
    assert data.get('destination_latitude'), "destination_latitude is mandatory"
    assert data.get('destination_longitude'), "destination_longitude is mandatory"

    origin = (data['origin_latitude'], data['origin_longitude'],)
    destination = (data['destination_latitude'], data['destination_longitude'],)
    dist = int(geodesic(origin, destination).kilometers)

    response = jsonify(
        message="Success",
        code=str(200),
        details=dict(
            distance=dist,
            speed=AVERAGE_VEHICLE_SPEED, time=dist / AVERAGE_VEHICLE_SPEED
        ))
    response.status_code = 200
    return response


@app.route('/v1/sample_file', methods=["GET"])
def sample_file(*args, **kwargs):
    lnk = ""
    try:
        LOGGER.info(f"Sample File Request")
        param = request.args.get("query", None)
        if not param:
            raise BadRequest("'query' param mandatory ")
        if param not in SAMPLE_FILE_MAP.keys():
            raise BadRequest("Invalid 'query' param provided ")

        file_name = SAMPLE_FILE_MAP.get(param)
        path = os.path.join(SAMPLE_FILE_BASE_PATH, file_name)
        LOGGER.info(f"Sample File Path: {path}")
        lnk = GoogleStorage.public_link(path)
    except Exception as e:
        raise e

    response = jsonify(
        message="Success",
        code=str(200),
        details=dict(
            link=lnk
        ))
    response.status_code = 200
    return response

@app.route('/v2/sample_file', methods=["GET"])
@context_logging
@requires_auth
def sample_file_v2(*args, **kwargs):
    lnk = ""
    try:
        LOGGER.info(f"Sample File Request {request.args.to_dict()}")
        _info = request.args.to_dict()
        engine = _info.get('engine_name')
        sub_engine = _info.get('sub_engine_name')

        solver_name, file_name = engine_subengine_to_solver_mapping(engine, sub_engine)

        path = os.path.join(SAMPLE_FILE_BASE_PATH, file_name)
        LOGGER.info(f"Sample File Path: {path}")
        lnk = GoogleStorage.public_link(path)
    except Exception as e:
        raise e

    response = jsonify(
        message="Success",
        code=str(200),
        details=dict(
            link=lnk
        ))
    response.status_code = 200
    return response

@app.route('/v1/planning/file/upload/', methods=["POST"])
@context_logging
def file_upload(*args, **kwargs):
    _rid = kwargs.get('rid', None)

    RequestLog(_rid).write_log(RequestLogMessages.REQUEST_INIT.format(rid=_rid))

    data = request.form.to_dict()
    if not data:
        raise BadRequest("No arguments provided")

    LOGGER.info(f"file_upload request payload {data}")


    # validate request params
    if 'planning_name' not in data:
        raise BadRequest("No planning_name provided in input")
    _planner_type = data.get('planning_name')

    search_time_limit = None
    if 'search_time_limit' in data:
        search_time_limit = int(data.get('search_time_limit'))

    if 'file' not in request.files:
        raise BadRequest("No file provided in input")
    file = request.files.get('file')

    _file_name = ""
    try:
        # save file to disk
        ext = file.filename.split(".")[-1]
        _file_name = f"{_rid}_input.{ext}"
        file.save(_file_name)

        # set search time limit (s)
        # default
        _search_time_limit = None
        # validate file as per plan
        if PlanningType.SKU_FIXED_PLANNING.value == _planner_type:
            # use route-planner dependency

            validator = MultiProductUploadValidation(file, _rid, _search_time_limit)
            validator.validate_sheets()

        elif PlanningType.SEQUENTIAL_PLANNING.value == _planner_type:

            validator = SequentialUploadValidation(file, _rid, _search_time_limit)
            validator.validate_sheets()

        elif PlanningType.VRP_PLANNING.value == _planner_type:

            validator = SequentialUploadValidation(file, _rid, _search_time_limit)
            validator.validate_sheets()

        elif PlanningType.SKU_VARIABLE_PLANNING.value == _planner_type:

            validator = MultiProductVariableUploadValidation(file, _rid, _search_time_limit)
            validator.validate_sheets()

        elif PlanningType.FIXED_PLANNING.value == _planner_type:
            # use route-planner dependency

            validator = FixedCostUploadValidation(file, _rid, _search_time_limit)
            validator.validate_sheets()
        elif PlanningType.VARIABLE_PLANNING.value == _planner_type:

            # use route-planner dependency
            validator = VariableUploadValidation(file, _rid, _search_time_limit)
            validator.validate_sheets()
        elif PlanningType.SKU_BIN_PACKING_PLANNING.value == _planner_type:
            # use route-planner dependency
            validator = BinPackingUploadValidation(file, _rid, _search_time_limit)
            validator.validate_sheets()
        elif PlanningType.OPTIMIZATION_PLANNING.value == _planner_type:
            # use route-planner dependency
            validator = OptimizationAIUploadValidation(file, _rid, _search_time_limit)
            validator.validate_sheets()

        elif PlanningType.MID_MILE_PLANNING.value == _planner_type:
            validator = MidMileUploadValidation(file, _rid, _search_time_limit)
            validator.validate_sheets()

        elif PlanningType.BP_MID_MILE_PLANNING.value == _planner_type:
            validator = BPMidMileUploadValidation(file, _rid, _search_time_limit)
            validator.validate_sheets()

        elif PlanningType.SEQUENTIAL_MID_MILE_PLANNING.value == _planner_type:
            validator = SequentialMidMileUploadValidation(file, _rid, _search_time_limit)
            validator.validate_sheets()
        else:
            raise AppException(f"Invalid planner_type '{_planner_type}'")

        # upload file to cloud storage
        RequestLog(_rid).write_log(RequestLogMessages.UPLOAD_FILE_GS)
        input_link = _get_download_link(_file_name, _rid)

        pubsub_message = dict(
            input_url=input_link,
            request_id=_rid,
            planning_type=_planner_type,
            search_time_limit=search_time_limit,
            client_type=ClientType.PRIMA.value,
        )
        GooglePubSubPublisher(
            topic_name=PubSubConfiguration().topic_name,
            project_id=PubSubConfiguration().project_id
        ).publish(pubsub_message)

        #  Create job in db
        data_dict = dict(
            request_id=_rid,
            planning_name=_planner_type,
            jwt="Token-XXX-XXX",
            status_code=UploadJobsStatus.CREATED.value.code,
            status_name=UploadJobsStatus.CREATED.value.name,
        )
        log_resp = RequestsServices.create_job(data_dict)
        RequestLog(_rid).write_log(RequestLogMessages.REQUEST_FINISHED)
    except Exception as e:
        raise e
    finally:
        LOGGER.info("file_upload finally")
        os.system(f"rm {_file_name}")

    response = jsonify(
        message="Accepted Job Request",
        code=str(202),
        details=dict(
            request_id=_rid
        )
    )
    response.status_code = 202
    return response


def _get_download_link(file_path, rid):
    file_url = GoogleStorage.upload(rid, file_path)
    file_path = GoogleStorage.bucket_path(rid, file_path, "Prima")
    public_url = GoogleStorage.public_link(file_path)
    return public_url


@app.route('/v1/planning/request', methods=["GET"])
@context_logging
def planning_request(*args, **kwargs):
    #  added filters (status_code, planning_name, request_id)
    resp = dict()
    try:

        params = request.args.to_dict()
        LOGGER.info(f"planning_request payload {params}")

        jobs, pagination = RequestsServices.list(params)
        details = dict(results=jobs, pagination=pagination)

        resp = jsonify(
            code=str(200),
            message="message",
            details=details
        )

        resp.status_code = 200

    finally:
        LOGGER.info(f"planning_request response: {resp}")
    return resp


@app.route('/v1/planning/request/cancel', methods=["PUT"])
@context_logging
def cancel_planning_request(*args, **kwargs):
    #  added filters (status_code, planning_name, request_id)
    resp = dict()
    try:

        params = request.args.to_dict()
        LOGGER.info(f"cancel_planning_request payload {params}")

        RequestsServices.cancel_request(params)

        resp = jsonify(
            code=str(200),
            message="message",
            details=dict()
        )
        resp.status_code = 200

    except Exception as e:
        raise e
    finally:
        LOGGER.info(f"cancel_planning_request response: {resp}")
    return resp


@app.route('/v1/planning/response', methods=["GET"])
@context_logging
def planning_response(*args, **kwargs):
    # iff response is available
    resp = dict()
    try:
        LOGGER.info(f"planning_response Request")
        param = request.args.get("request_id", None)
        if not param:
            raise BadRequest("'request_id' param mandatory ")
        model_dict = dict(request_id=param)

        res = RequestsServices.response(model_dict)
        code = int(res.get("code"))

        resp = jsonify(res)
        resp.status_code = code

    except Exception as e:
        raise e
    finally:
        LOGGER.info(f"planning_response Response: {resp}")
    return resp


@app.route('/v1/planning/logs', methods=["GET"])
# @cross_origin(headers=["Authorization"])
# @requires_auth
@context_logging
def planning_logs(*args, **kwargs):
    # Todo plan schema and implement
    raise Exception("Not Implemented")


@app.route('/v1/planning/request/poll', methods=["GET"])
@context_logging
def planning_request_poll(*args, **kwargs):
    response = dict()
    try:
        LOGGER.info(f"planning_request_poll Request")
        param = request.args.get("request_id", None)
        if not param:
            raise BadRequest("'request_id' param mandatory ")
        model_dict = dict(request_id=param)

        details = RequestsServices.poll(model_dict)

        response = jsonify(
            code=str(200),
            message="message",
            details=details
        )

        response.status_code = 200

    except Exception as e:
        raise e
    finally:
        LOGGER.info(f"planning_request_poll response: {response}")
    return response


@app.route('/v2/planning/file/upload/', methods=["POST"])
@context_logging
@requires_auth
def file_upload_v2(*args, **kwargs):
    _data = dict()
    _rid = generate_request_id()
    error_service = PlanningErrorsService(_rid)
    try:
        LOGGER.info(f"File Upload : request {request.form.to_dict()}")
        service = FileUploadService(_rid)
        service.validate_request(request)
        _data = request.form.to_dict()
        _data['request_id'] = _rid
        binary_file = request.files.get('file')
        api_key = kwargs.get('api_key')
        engine = _data.get('engine_name')
        sub_engine = _data.get('sub_engine_name')
        details, _data = service.file_upload(data=_data, binary_file=binary_file, engine=engine, sub_engine=sub_engine)
    except Exception as ex:
        if isinstance(ex, (InvalidRequest, InvalidHeader, ValidationError, AppException, DatabaseException)):
            # update planning_errors
            errors = list()
            if isinstance(ex, ValidationError):
                PlanningRequestsMapper(**_data).update_request_to_fail()

                errors.extend(error_service.parse_validation_exception(ex))
            else:
                errors.append(error_service.parse_exception(ex))

            error_service.upload_errors(errors=errors, **_data)

            parsed_problems = error_service.jsonify_problems(ex.problems)
            # model error response
            response = jsonify(
                message=ex.message,
                code=str(ex.code),
                details=dict(
                    request_id=_rid,
                    errors=parsed_problems or []
                )
            )
            response.status_code = ex.code
            return response
        else:
            raise ex

    LOGGER.info(f"File Upload : response {details}")
    response = jsonify(
        message="Accepted Job Request",
        code=str(202),
        details=details
        )
    response.status_code = 202
    return response


@app.route('/v2/planning/request', methods=["GET"])
@context_logging
@requires_auth
def planning_requests(*args, **kwargs):
    resp = dict()
    try:
        request_dict = request.args.to_dict()
        LOGGER.info(f"planning_requests payload {request_dict}")

        jobs, pagination = PlanningRequestsMapper.paginated_list(request_dict)
        details = dict(results=jobs, pagination=pagination)

        resp = jsonify(
            code=str(200),
            message="Success",
            details=details
        )

        resp.status_code = 200

    except Exception as e:
        LOGGER.info("BASE EXCEPTION")
        raise e
    finally:
        LOGGER.info(f"planning_requests response: {resp}")
    return resp


@app.route('/v2/planning/routes', methods=["GET"])
@context_logging
@requires_auth
def planning_routes(*args, **kwargs):
    resp = dict()
    try:

        request_dict = request.args.to_dict()
        LOGGER.info(f"planning_routes payload {request_dict}")

        jobs, pagination = PlanningRoutesMapper.paginated_list(request_dict)
        details = dict(results=jobs, pagination=pagination)

        resp = jsonify(
            code=str(200),
            message="Success",
            details=details
        )

        resp.status_code = 200

    except Exception as e:
        LOGGER.info("BASE EXCEPTION")
        raise e
    finally:
        LOGGER.info(f"planning_routes response: {resp}")
    return resp


@app.route('/v2/planning/tasks', methods=["GET"])
@context_logging
@requires_auth
def planning_tasks(*args, **kwargs):
    resp = dict()
    try:

        request_dict = request.args.to_dict()
        LOGGER.info(f"planning_tasks payload {request_dict}")

        results = PlanningTasksMapper.list(request_dict)
        details = dict(results=results)

        resp = jsonify(
            code=str(200),
            message="Success",
            details=details
        )

        resp.status_code = 200

    except Exception as e:
        LOGGER.info("BASE EXCEPTION")
        raise e
    finally:
        LOGGER.info(f"planning_tasks response: {resp}")
    return resp

@app.route('/v2/planning/output', methods=["GET"])
@context_logging
@requires_auth
def planning_output(*args, **kwargs):
    resp = dict()
    try:

        request_dict = request.args.to_dict()
        LOGGER.info(f"planning_output payload {request_dict}")

        service = OutputFilesService(request_dict)

        results = service.output_files()
        details = dict(results=results)
        LOGGER.info(f"planning_output response: {details}")

        resp = jsonify(
            code=str(200),
            message="Success",
            details=details
        )

        resp.status_code = 200

    except Exception as e:
        LOGGER.info("BASE EXCEPTION")
        raise e
    finally:
        LOGGER.info(f"planning_output response: {resp}")
    return resp

@app.route('/v2/planning/result', methods=["GET"])
@context_logging
@requires_auth
def planning_result(*args, **kwargs):
    resp = dict()
    try:

        request_dict = request.args.to_dict()
        LOGGER.info(f"planning_result payload {request_dict}")

        results = PlanningResultMapper.list(request_dict)
        details = dict(results=results)

        resp = jsonify(
            code=str(200),
            message="Success",
            details=details
        )

        resp.status_code = 200

    except Exception as e:
        LOGGER.info("BASE EXCEPTION")
        raise e
    finally:
        LOGGER.info(f"planning_result response: {resp}")
    return resp

@app.route('/v2/planning/errors', methods=["GET"])
@context_logging
@requires_auth
def planning_errors(*args, **kwargs):
    resp = dict()
    try:

        request_dict = request.args.to_dict()
        LOGGER.info(f"upload_errors payload {request_dict}")

        results = PlanningErrorsMapper.list(request_dict)
        results = PlanningErrorsMapper.jsonify_planning_errors_results(results)
        details = dict(results=results)

        resp = jsonify(
            code=str(200),
            message="Success",
            details=details
        )

        resp.status_code = 200

    except Exception as e:
        LOGGER.info("BASE EXCEPTION")
        raise e
    finally:
        LOGGER.info(f"planning_errors response: {resp}")
    return resp

@app.route('/v2/planning/request/update_status_to_processing', methods=["PUT"])
@context_logging
def update_status_to_processing(*args, **kwargs):
    #  update status to processing
    resp = dict()
    try:

        resp = request.get_json()
        LOGGER.info(f"planning_request payload {resp}")

        # update planning_requests status to processing
        PlanningRequestsMapper(**resp).update_request_to_processing()

        resp = jsonify(
            code=str(200),
            message="message",
            details=dict()
        )
        resp.status_code = 200
    except Exception as ex:
        LOGGER.info(f"update_request_to_processing : Failed : exception :{ex}")
        raise ex

    finally:
        LOGGER.info(f"planning_request response: {resp}")
    return resp

@app.route('/v2/planning/complete_request', methods=["POST"])
@context_logging
def complete_request(*args, **kwargs):
    resp = dict()
    try:
        request_dict = request.get_json()
        service = CompleteRequestService(request_dict)
        service.validate_json(request)
        details = service.complete_request()

        resp = jsonify(
            code=str(200),
            message="message",
            details=details
        )

        resp.status_code = 200

    except Exception as e:
        LOGGER.info("BASE EXCEPTION")
        raise e
    finally:
        LOGGER.info(f"planning_errors response: {resp}")
    return resp


@app.route('/v2/planning/upload_errors', methods=["POST"])
@context_logging
def upload_errors(*args, **kwargs):
    resp = dict()
    try:

        request_dict = request.get_json()

        rid = request_dict['request_id']
        error_service = PlanningErrorsService(rid)

        errors = request_dict.get('errors')

        error_service.upload_errors_after_completion(errors=errors, request_dict=request_dict)

        # update planning_requests status to failed
        PlanningRequestsMapper(**request_dict).update_request_to_fail()

        resp = jsonify(
            code=str(200),
            message="Success",
            details=resp
        )

        resp.status_code = 200

    except Exception as e:
        LOGGER.info("BASE EXCEPTION")
        raise e
    finally:
        LOGGER.info(f"planning_errors response: {resp}")
    return resp


@app.route('/v2/planning/get_solver_config', methods=['GET'])
@context_logging
@requires_auth
def get_solver_config(*args, **kwargs):
    resp = dict()
    try:
        api_key = request.headers.get("api-key", None)
        solver_config = SolverConfigService(api_key)

        solver_config_list = solver_config.get_solver_config_list()

        engine_config = solver_config.engine_config_response(solver_config_list)

        resp = jsonify(
            code=str(200),
            message="Success",
            details=engine_config
        )
    finally:
        LOGGER.info(f"get_solver_config response: {resp}")
    return resp


@app.route('/v2/planning/update_solver_config', methods=["POST"])
@context_logging
@requires_auth
def update_solver_config(*args, **kwargs):
    resp = dict()

    try:
        _data = request.form.to_dict()
        api_key = _data.get("api_key")
        solver_name = _data.get("solver_name")
        is_active = _data.get("is_active")

        solver_config = UpdateSolverConfig(api_key, solver_name, is_active)

        solver_config.update_solver_config()

        resp = jsonify(
            code=str(200),
            message="Success",
            details=resp
        )
        resp.status_code = 200
    finally:
        LOGGER.info(f"update_solver_config response: {resp}")
    return resp


if __name__ == "__main__":
    HOST = os.environ.get("ROUTE_PLANNING_SERVICE_GRPC_HOST", '0.0.0.0')
    PORT = os.environ.get("ROUTE_PLANNING_SERVICE_GRPC_PORT", 3000)
    LOGGER.info(f"Started server at {HOST}:{PORT}")
    app.run(host=HOST, port=PORT)

