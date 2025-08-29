from database.drivers.postgres_v2 import postgres_connection

from constants.constants import UploadJobsStatus
from route_planner.exceptions.exceptions import AppException
from models.planning_requests import PlanningRequestsMapper
from models.planning_tasks import PlanningTasksMapper
from models.planning_vehicles import PlanningVehiclesMapper


class InitializeRequest(object):
    def __init__(self, planning_rid, tenant, partition, node, tasks, vehicles):
        self._planning_rid = planning_rid
        self._tenant = tenant
        self._partition = partition
        self._node = node
        self._tasks = tasks
        self._vehicles = vehicles

    def initialize_request(self):

        with postgres_connection() as conn:

            # check planning_request exits and status is Created
            filter_dict = dict(
                request_id=self._planning_rid,
                tenant=self._tenant,
                partition=self._partition,
                node=self._node
            )
            result = PlanningRequestsMapper.get_planning_request(filter_dict, _connection=conn)

            if result.get('status_code') not in [
                UploadJobsStatus.CREATED.value.code,
            ]:
                raise AppException(
                    f"Cannot initialize request {self._planning_rid}, Existing Status should be :{UploadJobsStatus.CREATED.value.name}")

            # update tasks
            PlanningTasksMapper.bulk_upload(self._tasks, _connection=conn)

            # update vehicles
            PlanningVehiclesMapper.bulk_upload(self._vehicles, _connection=conn)

            planning_requests_set_dict = dict(
                total_tasks=len(self._tasks),
                total_vehicles=len(self._vehicles)
            )

            # update planning_request
            PlanningRequestsMapper.update_after_validation(**filter_dict, **planning_requests_set_dict, _connection=conn)
