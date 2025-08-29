from route_planner.db.dao.base_dao import BaseDao


class RequestsDao(BaseDao):
    _table_name = "requests"
    _pagination_default_order_by_field = 'created_at'
    _date_filter_fields = ["created_at"]
    _fields = (
        "request_id",
        "planning_name",
        "user_id",
        "jwt",
        "session_id",
        "status_code",
        "status_name",
        "created_at",
        "updated_at",
        "ended_at",
        "time_taken",
        "locations",
        "vehicles",
        "routes",
        "orders",
        "process_id",
        "container_id",
        "machine_id",
        "response"
    )
