from database.dao.base_dao_v2 import BaseDaoV2


class ClientPlanningConfigDao(BaseDaoV2):
    _table_name = "client_planning_config"
    _pagination_default_order_by_field = 'partition'
    _date_filter_fields = []
    _fields = (
        "partition",
        "tenant",
        "node",
        "planning_service",
        "api_key",
        "is_active"
    )

    @classmethod
    def get_table_fields(cls):
        return ClientPlanningConfigDao._fields

    @classmethod
    def get_table_name(cls):
        return ClientPlanningConfigDao._table_name
