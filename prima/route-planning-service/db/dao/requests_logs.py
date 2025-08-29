from db.dao.base_dao import BaseDao


class RequestsLogDao(BaseDao):
    _table_name = "requests_log"
    _pagination_default_order_by_field = 'event_time'
    _date_filter_fields = ["event_time"]
    _fields = (
        "id",
        "request_id",
        "log_message",
        "event_time"
    )
