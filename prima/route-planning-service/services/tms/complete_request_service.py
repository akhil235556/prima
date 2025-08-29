from database.drivers.postgres_v2 import postgres_connection
from werkzeug.exceptions import BadRequest

from constants.constants import UploadJobsStatus
from exceptions.exceptions import AppException, DatabaseException
from models.planning_requests import PlanningRequestsMapper
from models.planning_tasks import PlanningTasksMapper
from models.planning_vehicles import PlanningVehiclesMapper
from models.planning_routes import PlanningRoutesMapper
from models.planning_result import PlanningResultMapper


class CompleteRequestService(object):
    def __init__(self, data):
        self._data = data

    @staticmethod
    def validate_request(request):
        if not request.form.to_dict():
            raise BadRequest("No arguments provided")

    @staticmethod
    def validate_json(request):
        if not request.get_json:
            raise BadRequest("No data provided")

    @staticmethod
    def success_data_payload(data):
        success_data = data.get('success_data')
        payload = dict(
            planning_end_time=success_data.get('planning_end_time'),
            time_taken=success_data.get('time_taken'),
            total_cost=success_data.get('total_cost'),
            total_kms=success_data.get('total_kms'),
            stops=success_data.get('stops')
        )
        return payload

    @staticmethod
    def get_filter_payload(data):
        rid = data.get('request_id')
        tenant = data.get('tenant')
        partition = data.get('partition')
        node = data.get('node')
        planner_type = data.get('planning_name')

        payload = dict(
            request_id=rid,
            tenant=tenant,
            partition=partition,
            node=node,
            planning_name=planner_type
        )
        return payload

    def complete_request(self):

        with postgres_connection() as conn:

            filter_dict = CompleteRequestService.get_filter_payload(self._data)

            planning_request_id = filter_dict.get('request_id')

            result = PlanningRequestsMapper.get_planning_request(filter_dict, _connection=conn)

            if result.get('status_code') not in [
                UploadJobsStatus.PROCESSING.value.code,
            ]:
                raise AppException(
                    f"Cannot Complete request {planning_request_id}, "
                    f"Existing Status should be :{UploadJobsStatus.PROCESSING.value.name}")
            else:
                # update status to completed in planning requests
                success_data = CompleteRequestService.success_data_payload(self._data)
                PlanningRequestsMapper.update_status_to_completed(success_data, filter_dict, conn)

                # update route id for planned tasks
                PlanningTasksMapper.update_planning_tasks(self._data.get('order_data'), planning_request_id, conn)

                # update route id for planned vehicles
                PlanningVehiclesMapper.update_planning_vehicles(self._data.get('routes_list'), planning_request_id, conn)

                # insert route details in planning routes
                PlanningRoutesMapper.insert_routes(self._data.get('routes_list'), planning_request_id, conn)

                # upsert data in planning results
                PlanningResultMapper.upsert_planning_results(self._data.get('planning_result'), conn)

        return True






