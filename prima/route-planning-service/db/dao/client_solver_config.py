from database.dao.base_dao_v2 import BaseDaoV2


class ClientSolverConfigDao(BaseDaoV2):
    _table_name = "client_solver_config"
    _pagination_default_order_by_field = 'id'
    _date_filter_fields = []
    _fields = (
        "id",
        "api_key",
        "solver_name",
        "is_active"
    )

    @classmethod
    def get_table_fields(cls):
        return ClientSolverConfigDao._fields

    @classmethod
    def get_table_name(cls):
        return ClientSolverConfigDao._table_name
