from database.dao.base_dao_v2 import BaseDaoV2


class PlanningErrorsDao(BaseDaoV2):
    _table_name = "planning_errors"
    _pagination_default_order_by_field = 'request_id'
    _date_filter_fields = []
    _fields = (
        "request_id",
        "planning_request_id",
        "planning_tasks_id",
        "error_name",
        "error_row_no",
        "error_sheet",
        "error_message",
        "error_details"
    )

    @classmethod
    def get_table_fields(cls):
        return PlanningErrorsDao._fields

    @classmethod
    def get_table_name(cls):
        return PlanningErrorsDao._table_name
