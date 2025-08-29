from database.dao.base_dao_v2 import BaseDaoV2
from psycopg2 import sql

class PlanningResultDao(BaseDaoV2):
    _table_name = "planning_result"
    _pagination_default_order_by_field = 'request_id'
    _date_filter_fields = []
    _fields = (
        "request_id",
        "planning_request_id",
        "total_vehicles",
        "total_routes",
        "total_orders",
        "total_duration",
        "total_kms",
        "total_cost",
        "depot"
    )

    _conflict_columns = {
        "request_id"
    }

    @classmethod
    def get_table_fields(cls):
        return PlanningResultDao._fields

    @classmethod
    def get_table_name(cls):
        return PlanningResultDao._table_name

    @classmethod
    def upsert(cls, upsert_dict, connection=None):
        """
        Upsert the resource in table
        """
        if not BaseDaoV2.is_subset(upsert_dict.keys(), cls.get_table_fields()):
            # remove not registered attrs
            upsert_dict = BaseDaoV2.clean(upsert_dict, cls.get_table_fields())
        fields = upsert_dict.keys()
        _fields = sql.SQL(",").join([sql.Identifier(x) for x in fields])
        _values = sql.SQL(",").join([sql.Placeholder(x) for x in fields])
        set_clause = cls.set_clause(upsert_dict)
        # print(sql.SQL(",").join(sql.Identifier(x) for x in cls._conflict_columns))
        query = sql.SQL(
            "INSERT INTO {table_name} ({fields}) VALUES ({values}) ON CONFLICT ({conflict_columns}) "
            "DO UPDATE SET {set_clause};").format(
            table_name=sql.Identifier(cls.get_table_name()),
            fields=_fields,
            values=_values,
            conflict_columns=sql.SQL(",").join(sql.Identifier(x) for x in cls._conflict_columns),
            set_clause=set_clause
        )
        resp = cls.execute(query, upsert_dict, connection=connection, result=False)
        return resp

    @classmethod
    def set_clause(cls, set_dict):
        set_clauses = []
        for k, v in set_dict.items():
            if v is None:
                set_clauses.append(sql.SQL("{k}=null").format(k=sql.Identifier(k)))
            else:
                set_clauses.append(sql.SQL("{k}={v}").format(k=sql.Identifier(k), v=sql.Literal(v)))
        set_clause = sql.SQL(', ').join(set_clauses)
        return set_clause
