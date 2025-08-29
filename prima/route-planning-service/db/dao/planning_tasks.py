from database.dao.base_dao_v2 import BaseDaoV2


class PlanningTasksDao(BaseDaoV2):
    _table_name = "planning_tasks"
    _pagination_default_order_by_field = 'request_id'
    _date_filter_fields = []
    _fields = (
        "request_id",
        "planning_request_id",
        "planning_route_id",
        "order_id",
        "consignee_location",
        "consignee",
        "weight_kg",
        "volume_cbm",
        "dispatched_by",
        "priority"
    )

    @classmethod
    def get_table_fields(cls):
        return PlanningTasksDao._fields

    @classmethod
    def get_table_name(cls):
        return PlanningTasksDao._table_name
