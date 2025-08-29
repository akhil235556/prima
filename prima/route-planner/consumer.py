import json
import os
import datetime
import sys
import traceback
from google.cloud import pubsub_v1

from route_planner.vrp.consolidated_fixed_cost_planner.consolidated_fixed_cost_validator import FixedCostUploadValidation
from route_planner.vrp.consolidated_variable_cost_planner.consolidated_variable_cost_validator import VariableUploadValidation
from route_planner.sku_variable_cost_optimization_ai_planner.sku_variable_cost_optimization_ai_validator import OptimizationAIUploadValidation
from route_planner.constants import app_constants
from route_planner.exceptions.exceptions import AppException, DatabaseException, SolverException, \
    RequestTerminationException, RequestPendingException, PubSubMessageAckException, RequestAlreadyProcessingError
from route_planner.gcp.prima_storage_config import PrimaGoogleStorageConfiguration
from route_planner.gcp.pubsub_consumer import consume
from route_planner.services.upload_jobs import RequestsServices
from route_planner.integrations.route_planning_service import RoutePlanningService
from route_planner.vrp.sku_fixed_cost_planner.sku_fixed_cost_validator import MultiProductUploadValidation
from route_planner.vrp.sku_variable_cost_planner.sku_variable_cost_validator import MultiProductVariableUploadValidation
from route_planner.bin_packing.sku_fixed_cost_bin_packing_planner.sku_fixed_cost_bin_packing_validator import BinPackingUploadValidation
from route_planner.kohler.bin_packing_mid_mile.bin_packing_mid_mile_validator import BPMidMileUploadValidation
from route_planner.kohler.sequential_mid_mile.sequential_mid_mile_validator import SequentialMidMileUploadValidation
from route_planner.bin_packing.sequential_planner.bin_packing_validator import SequentialUploadValidation
from route_planner.vrp.mid_mile_cost_planner.mid_mile_cost_validator import MidMileUploadValidation
from route_planner.vrp.v4_vrp_planner.vrp_validator import VRPUploadValidation
from route_planner.utils import logging
from route_planner.utils.logging import context_logging_method
from route_planner.utils.utils import parse_exception

logger = logging.getLogger(__name__)


def callback(message: pubsub_v1.subscriber.message.Message) -> None:

    try:

        # set context logging
        context_logging_method()

        logger.info(f"Received {message.data!r}.")

        data = json.loads(message.data)
        logger.info(f"\ndecoded message: \n{data}\n")

        _rid = data.get('request_id', '')
        _planner_type = data.get('planning_type', '')
        _input_url = data.get('input_url', '')
        search_time_limit = data.get('search_time_limit')
        client_type = data.get('client_type', '')
        tenant = data.get('tenant', '')
        partition = data.get('partition', '')
        node = data.get('node', '')

        # set message 'rid' in context logging
        context_logging_method(_rid)

        consumer_obj = Consumer(
            rid=_rid, planner_type=_planner_type, input_url=_input_url,
            search_time_limit=search_time_limit, client_type=client_type,
            tenant=tenant, partition=partition, node=node)

        if client_type == app_constants.ClientType.PRIMA.value:
            consumer_obj.process()
        elif client_type == app_constants.ClientType.TMS.value:
            consumer_obj.process_v2()
        else:
            raise AppException(f"Invalid client_type {client_type}")

        # acknowledge message
        message.ack()
    except PubSubMessageAckException as ex:
        # acknowledge message
        message.ack()
        logger.error(f"PubSubMessageAckException in consumer. exception={str(ex)} traceback={traceback.format_exc()}")
    except RequestAlreadyProcessingError as e:
        logger.error(f"RequestAlreadyProcessingError: {str(e)}")
        logger.error(f"RequestAlreadyProcessingError in consumer. exception={str(e)} traceback={traceback.format_exc()}")

    except Exception as ex:
        logger.error(f"error in consumer. exception={str(ex)} traceback={traceback.format_exc()}")
    finally:
        message.ack()



class Consumer(object):

    def __init__(self, **kwargs):
        self.file_name = ""
        self._input_url = kwargs.get('input_url')
        self._rid = kwargs.get('rid')
        self._planner_type = kwargs.get('planner_type')
        self.search_time_limit = kwargs.get('search_time_limit')
        self.client_type = kwargs.get('client_type')
        self.partition = kwargs.get('partition')
        self.node = kwargs.get('node')
        self.tenant = kwargs.get('tenant')

        self.validate_request_arguments()
        logger.info(f"params: {self._rid, self._planner_type, self._input_url}")

    def validate_request_arguments(self):
        if not self._rid or not self._input_url:
            raise AppException("Invalid params")

        if self._planner_type not in app_constants.VALID_PLANNING_TYPES:
            raise AppException(f"Invalid planner_type {self._planner_type}")

    def map_solver(self):
        if app_constants.PlanningType.SKU_FIXED_PLANNING.value == self._planner_type:
            validator = MultiProductUploadValidation(self.file_name, self._rid, self.search_time_limit)
            resp, status = validator.process()
        elif app_constants.PlanningType.SEQUENTIAL_PLANNING.value == self._planner_type:
            validator = SequentialUploadValidation(self.file_name, self._rid, self.search_time_limit)
            resp, status = validator.process()
        elif app_constants.PlanningType.VRP_PLANNING.value == self._planner_type:
            validator = VRPUploadValidation(self.file_name, self._rid, self.search_time_limit)
            resp, status = validator.process()
        elif app_constants.PlanningType.SKU_BIN_PACKING_PLANNING.value == self._planner_type:
            validator = BinPackingUploadValidation(self.file_name, self._rid, self.search_time_limit)
            resp, status = validator.process()
        elif app_constants.PlanningType.SKU_VARIABLE_PLANNING.value == self._planner_type:
            validator = MultiProductVariableUploadValidation(self.file_name, self._rid, self.search_time_limit)
            resp, status = validator.process()
        elif app_constants.PlanningType.FIXED_PLANNING.value == self._planner_type:
            validator = FixedCostUploadValidation(self.file_name, self._rid, self.search_time_limit)
            resp, status = validator.process()
        elif app_constants.PlanningType.VARIABLE_PLANNING.value == self._planner_type:
            validator = VariableUploadValidation(self.file_name, self._rid, self.search_time_limit)
            resp, status = validator.process()
        elif app_constants.PlanningType.OPTIMIZATION_PLANNING.value == self._planner_type:
            validator = OptimizationAIUploadValidation(self.file_name, self._rid, self.search_time_limit)
            resp, status = validator.process()
        elif app_constants.PlanningType.MID_MILE_PLANNING.value == self._planner_type:
            validator = MidMileUploadValidation(self.file_name, self._rid, self.search_time_limit)
            resp, status = validator.process()
        elif app_constants.PlanningType.BP_MID_MILE_PLANNING.value == self._planner_type:
            validator = BPMidMileUploadValidation(self.file_name, self._rid, self.search_time_limit)
            resp, status = validator.process()
        elif app_constants.PlanningType.SEQUENTIAL_MID_MILE_PLANNING.value == self._planner_type:
            validator = SequentialMidMileUploadValidation(self.file_name, self._rid, self.search_time_limit,
                                                          tenant=self.tenant, partition=self.partition, node=self.node)
            resp, status = validator.process(self.client_type)
        else:
            raise AppException(f"Invalid planner_type {self._planner_type}")
        return resp, status

    def process(self):

        try:
            RequestsServices.is_valid_request_to_execute(self._rid)

            storage = PrimaGoogleStorageConfiguration.get_storage_client()
            self.file_name = storage.download_file(self._input_url)

            model_dict = dict(
                request_id=self._rid,
                status_name=app_constants.UploadJobsStatus.PROCESSING.value.name,
                status_code=app_constants.UploadJobsStatus.PROCESSING.value.code
            )
            RequestsServices.update_status(model_dict)
            solver_response, status = self.map_solver()
            solver_response.update(input_file=self._input_url)

            model_dict = dict(
                request_id=self._rid,
                response=solver_response
            )
            resp = RequestsServices.update_response(model_dict, status)
            logger.info(f"Processing Completed for rid {self._rid} , response{resp}")
        except AppException as e:
            model_dict = dict(
                request_id=self._rid,
                status_name=app_constants.UploadJobsStatus.FAIL.value.name,
                status_code=app_constants.UploadJobsStatus.FAIL.value.code,
                response=dict(code=500, message=f'Planning Failed: {str(e)}', input_file=self._input_url)
            )
            RequestsServices.update_status(model_dict)
        except RequestTerminationException as e:
            model_dict = dict(
                request_id=self._rid,
                status_name=app_constants.UploadJobsStatus.FAIL.value.name,
                status_code=app_constants.UploadJobsStatus.FAIL.value.code,
                response=dict(code=500, message=f'Planning Failed: {str(e)}', input_file=self._input_url)
            )
            RequestsServices.update_status(model_dict)
        except RequestPendingException as e:
            model_dict = dict(
                request_id=self._rid,
                status_name=app_constants.UploadJobsStatus.FAIL.value.name,
                status_code=app_constants.UploadJobsStatus.FAIL.value.code,
                response=dict(code=500, message=f'Planning Failed: {str(e)}', input_file=self._input_url)
            )
            return model_dict
        finally:
            logger.info("::: consumer Finally :::")
            os.system(f"rm {self.file_name}")

        response = dict(
            rid=self._rid,
            message="Accepted Job Request",
            code=str(202),
            details=dict(
                request_id=self._rid
            )
        )
        return response

    def process_v2(self):
        model_dict = dict(
            request_id=self._rid,
            tenant=self.tenant,
            partition=self.partition,
            node=self.node,
            planning_name=self._planner_type
        )
        service = RoutePlanningService()
        try:

            # Update planning request to processing
            service.update_status_to_processing(model_dict=model_dict)

            storage = PrimaGoogleStorageConfiguration.get_storage_client()

            self.file_name = storage.download_file(self._input_url)

            solver_response, status = self.map_solver()

            if status == app_constants.UploadJobsStatus.FAIL.value.name:
                raise AppException("Both VRP and Bin Packing solver failed to provide result.")

            solver_response.update(input_file=self._input_url)

        except PubSubMessageAckException as ex:
            raise ex
        except RequestAlreadyProcessingError as e:
            raise e
        except Exception as ex:
            # update planning_errors
            errors = list()

            payload = dict(
                errors=list(),
                request_id=self._rid,
                tenant=self.tenant,
                partition=self.partition,
                node=self.node,
                planning_name=self._planner_type
            )

            ex_type, value, traceback = sys.exc_info()

            errors.append(parse_exception(self._rid, ex_type, value))

            payload['errors'] = errors

            service.upload_errors(payload)

            logger.info(ex)
            raise PubSubMessageAckException(ex)

        finally:
            logger.info("::: consumer Finally :::")
            os.system(f"rm {self.file_name}")

        response = dict(
            rid=self._rid,
            message="Accepted Job Request",
            code=str(202),
            details=dict(
                request_id=self._rid
            )
        )
        return response


if __name__ == '__main__':
    logger.info("logging env values: {}".format(os.environ.values()))
    consume(callback)
