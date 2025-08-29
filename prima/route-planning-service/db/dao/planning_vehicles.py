from database.dao.base_dao_v2 import BaseDaoV2


class PlanningVehiclesDao(BaseDaoV2):
    _table_name = "planning_vehicles"
    _pagination_default_order_by_field = 'request_id'
    _date_filter_fields = []
    _fields = (
        "request_id",
        "planning_request_id",
        "planning_route_id",
        "vehicle_code",
        "weight_capacity",
        "volume_capacity",
        "fixed_cost",
        "number_of_vehicles"
    )

    @classmethod
    def get_table_fields(cls):
        return PlanningVehiclesDao._fields

    @classmethod
    def get_table_name(cls):
        return PlanningVehiclesDao._table_name
