import os
import pandas as pd
import logging

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
from werkzeug.exceptions import BadRequest

from constants.constants import PlanningType, ClientType
from route_planner.exceptions.exceptions import AppException, ValidationError
from models.planning_requests import PlanningRequestsMapper
from pubsub.pubsub_configurations import PubSubConfiguration
from services.tms.initialize_request import InitializeRequest
from utils.gs import GoogleStorage
from utils.utils import engine_subengine_to_solver_mapping

logger = logging.getLogger(__name__)



class FileUploadService(object):

    def __init__(self, rid):
        self._rid = rid

    @staticmethod
    def validate_request(request):
        if not request.form.to_dict():
            raise BadRequest("No arguments provided")

        if 'file' not in request.files or not request.files.get("file"):
            raise BadRequest("No file provided in input")

    @staticmethod
    def save_file_to_disk(binary_file, rid):
        ext = binary_file.filename.split(".")[-1]
        file_name = f"{rid}_input.{ext}"
        binary_file.save(file_name)
        return file_name

    @staticmethod
    def validate_file(file_name, rid, planner_type):

        if PlanningType.SKU_FIXED_PLANNING.value.name == planner_type:
            validator = MultiProductUploadValidation(file_name, rid, None)
            validator.validate_sheets()

        elif PlanningType.SEQUENTIAL_PLANNING.value.name == planner_type:
            validator = SequentialUploadValidation(file_name, rid, None)
            validator.validate_sheets()

        elif PlanningType.VRP_PLANNING.value.name == planner_type:
            validator = SequentialUploadValidation(file_name, rid, None)
            validator.validate_sheets()

        elif PlanningType.SKU_VARIABLE_PLANNING.value.name == planner_type:
            validator = MultiProductVariableUploadValidation(file_name, rid, None)
            validator.validate_sheets()

        elif PlanningType.FIXED_PLANNING.value.name == planner_type:
            # use route-planner dependency
            validator = FixedCostUploadValidation(file_name, rid, None)
            validator.validate_sheets()

        elif PlanningType.VARIABLE_PLANNING.value.name == planner_type:
            # use route-planner dependency
            validator = VariableUploadValidation(file_name, rid, None)
            validator.validate_sheets()

        elif PlanningType.SKU_BIN_PACKING_PLANNING.value.name == planner_type:
            # use route-planner dependency
            validator = BinPackingUploadValidation(file_name, rid, None)
            validator.validate_sheets()
        elif PlanningType.OPTIMIZATION_PLANNING.value.name == planner_type:
            # use route-planner dependency
            validator = OptimizationAIUploadValidation(file_name, rid, None)
            validator.validate_sheets()

        elif PlanningType.MID_MILE_PLANNING.value.name == planner_type:
            validator = MidMileUploadValidation(file_name, rid, None)
            validator.validate_sheets()

        elif PlanningType.BP_MID_MILE_PLANNING.value.name == planner_type:
            validator = BPMidMileUploadValidation(file_name, rid, None)
            validator.validate_sheets()

        elif PlanningType.SEQUENTIAL_MID_MILE_PLANNING.value.name == planner_type:
            validator = SequentialMidMileUploadValidation(file_name, rid, None)
            validator.validate_sheets()

        else:
            raise AppException(f"Invalid planner_type '{planner_type}'")

        return validator

    @staticmethod
    def get_download_link(file_path, rid):
        file_url = GoogleStorage.upload(rid, file_path)
        file_path = GoogleStorage.bucket_path(rid, file_path, "Prima")
        public_url = GoogleStorage.public_link(file_path)
        return public_url

    def file_upload(self, data, binary_file, engine, sub_engine):

        solver_name, file_name = engine_subengine_to_solver_mapping(engine, sub_engine)

        data['planning_name'] = solver_name

        planning_request_mapper = PlanningRequestsMapper(**data)

        _filename = None

        try:
            logger.info(f'Solver name - {solver_name}')
            # save file to disk
            _filename = FileUploadService.save_file_to_disk(binary_file, self._rid)

            planning_request_mapper.upload_request()

            validator = FileUploadService.validate_file(_filename, self._rid, solver_name)

            # update planning_request, planning_tasks, planning_vehicles
            InitializeRequest(
                planning_rid=self._rid,
                tenant=data.get("tenant"),
                partition=data.get("partition"),
                node=data.get("node"),
                tasks=validator.get_task(),
                vehicles=validator.get_vehicles()
            ).initialize_request()

            # upload file to cloud storage
            validated_file_name = validator.get_validated_input()

            input_link = FileUploadService.get_download_link(validated_file_name, self._rid)

            pubsub_message = dict(
                input_url=input_link,
                request_id=self._rid,
                planning_type=solver_name,
                client_type=ClientType.TMS.value,
                tenant=data.get("tenant"),
                partition=data.get("partition"),
                node=data.get("node")
            )
            logger.info(f"file_upload: pubsub message to be delivered: {pubsub_message}")

            GooglePubSubPublisher(
                topic_name=PubSubConfiguration().topic_name,
                project_id=PubSubConfiguration().project_id
            ).publish(pubsub_message)

            #  Create job in db
        finally:
            if _filename is not None:
                os.system(f"rm {_filename}")

        details = dict(
            request_id=self._rid,
            errors=list()
        )

        return details, data
