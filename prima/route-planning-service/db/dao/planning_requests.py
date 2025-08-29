from database.dao.base_dao_v2 import BaseDaoV2


class PlanningRequestsDao(BaseDaoV2):
    _table_name = "planning_requests"
    _pagination_default_order_by_field = 'created_at'
    _date_filter_fields = ["created_at"]
    _fields = (
        "request_id",
        "tenant",
        "partition",
        "node",
        "planning_name",
        "status_code",
        "status_name",
        "created_at",
        "updated_at",
        "ended_at",
        "planning_start_time",
        "planning_end_time",
        "time_taken_hours",
        "total_tasks",
        "total_vehicles",
        "total_cost",
        "total_kms",
        "stops",
        "remarks"
    )

    @classmethod
    def get_table_fields(cls):
        return PlanningRequestsDao._fields

    @classmethod
    def get_table_name(cls):
        return PlanningRequestsDao._table_name
