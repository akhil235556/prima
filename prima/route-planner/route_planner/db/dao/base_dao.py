import logging
import datetime
from abc import ABC

import psycopg2
from psycopg2 import sql
from urllib.parse import unquote_plus

from route_planner.db.drivers.postgres import PostgresDriver
from route_planner.exceptions.exceptions import AppException, DatabaseException


logger = logging.getLogger(__name__)


class BaseDao(ABC):
    """
    loads the database driver and provides abstract functionality
    to execute database operations
    """
    _fields = None
    _table_name = None
    _pagination_default_order_by_field = None
    _allowed_wildcard_query_fields = None
    _date_filter_fields = []
    _op_mapping = {"gte": ">=", "lte": "<=", "gt": ">", "lt": "<"}
    _splitter = "__"

    @property
    def fields(self):
        """
        returns registered list of fields of DAO
        """
        if self._fields:
            return self._fields
        else:
            raise AppException("table can not have 0 columns")

    @property
    def table_name(self):
        """
        returns registered table name of dao
        """
        if self._table_name:
            return self._table_name
        else:
            raise AppException("table name can not be empty")

    def where(self, **filters):
        """
        creates and returns where clause for query
        """
        sql_where_clauses = []
        where_placeholder_values = {}
        op = '='
        for k, v in filters.items():
            placeholder_template = f'WHERE-{k}'
            if self._splitter in k:
                k, op_identifier = k.split(self._splitter)
                op = self._op_mapping.get(op_identifier, op)
            else:
                op = '='
            sql_where_clauses.append(
                sql.SQL("{k}{op}{v}").format(
                    k=sql.Identifier(k), op=sql.SQL(op),
                    v=sql.Placeholder(name=placeholder_template)
                )
            )
            where_placeholder_values[placeholder_template] = unquote_plus(v)
        where_clause = sql.SQL(" AND ").join(sql_where_clauses)
        where_clause = sql.SQL('WHERE {} ').format(where_clause)
        return where_clause, where_placeholder_values

    def query(self, filters, fields=None):
        """
        select query wrapper
        # fields should be in order of table definition
        """
        if self.is_subset(filters.keys(), self.fields):
            logger.info(f"Where Conditions: {filters}")
            where_clause, where_placeholder_values = self.where(**filters)
            order_by_clause = self.get_order_by_clause('request_id', "ASC")
            if fields:
                fields = sql.SQL(",").join(sql.Identifier(x) for x in fields)
            else:
                fields = sql.SQL('*')
            query = sql.SQL("select {fields} from {table} {where_clause} {order_by_clause} ;").format(
                fields=fields,
                table=sql.Identifier(self.table_name),
                where_clause=where_clause,
                order_by_clause=order_by_clause)

            resp = self.execute(query, where_placeholder_values, result=True)
        else:
            raise AppException(
                "mismatch in attributes and fields of "
                "client table. {} attributes not present in schema".format([
                    x not in self.fields for x in filters.keys()
                ]
            ))
        return self.process_response(resp)

    def bulk_insert(self, db_dicts):
        """
        Insert data through bulk
        """
        if len(db_dicts) == 0:
            return

        values_list = []
        fields = []
        for model in db_dicts:
            model = self.clean(model, self.fields)
            fields = model.keys()
            values = ','.join(map(str, ["'{}'".format(x) if isinstance(x, str) else x for x in model.values()]))
            values_list.append(values)

        insert_query = sql.SQL("INSERT INTO {table_name} ({fields}) VALUES ").format(
            table_name=sql.Identifier(self.table_name),
            fields=sql.SQL(",").join([sql.Identifier(x) for x in fields])
        )
        for i, values in enumerate(values_list):
            insert_query += sql.SQL("({values})").format(values=values)
            if i != (len(values_list) - 1):
                insert_query += sql.SQL(",")

        insert_query += sql.SQL(" RETURNING id;")
        logger.info(f"Inserting Bulk data {insert_query}")
        try:
            resp = self.execute(insert_query, result=True)
        except psycopg2.errors.UniqueViolation as e:
            raise AppException(e.pgerror.split("DETAIL: ")[1])
        return self.process_response(resp)

    def bulk_insert_v2(self, data_list):
        """
            Insert data through bulk
        """
        if len(data_list) == 0:
            return
        for model in data_list:
            model = self.clean(model, self.fields)
            self.insert(model)
        return True

    def insert(self, db_dict):
        """
        inserts the resource in table
        """
        resp = {}
        if not self.is_subset(db_dict.keys(), self.fields):
            db_dict = self.clean(db_dict, self.fields)
        fields = db_dict.keys()
        insert_query = sql.SQL("INSERT INTO {table_name} ({fields}) VALUES ({values}) RETURNING *;").format(
            table_name=sql.Identifier(self.table_name),
            fields=sql.SQL(",").join([sql.Identifier(x) for x in fields]),
            values=sql.SQL(",").join([sql.Placeholder(x) for x in fields])
        )
        logger.info(f"Inserting data {insert_query}")
        try:
            resp = self.execute(insert_query, db_dict, result=True)
        except psycopg2.errors.UniqueViolation as e:
            raise AppException(e.pgerror.split("DETAIL: ")[1])
        return self.process_response(resp)

    def get_set_clause(self, set_dict):
        sql_set_clauses = []
        set_placeholder_values = {}
        for k, v in set_dict.items():
            placeholder_template = f'SET-{k}'
            sql_set_clauses.append(
                sql.SQL("{k}={v}").format(k=sql.Identifier(k), v=sql.Placeholder(name=placeholder_template))
            )
            set_placeholder_values[placeholder_template] = v
        set_clause = sql.SQL(" , ").join(sql_set_clauses)
        return set_clause, set_placeholder_values

    def update(self, filter_dict, set_dict):

        set_clause, set_placeholder_values = self.get_set_clause(set_dict)
        where_clause, where_placeholder_values = self.where(**filter_dict)
        query = sql.SQL("UPDATE {table_name} set {set_clause} {where_clause} ;").format(
            table_name=sql.Identifier(self.table_name),
            set_clause=set_clause,
            where_clause=where_clause
        )
        # logger.info(f"Update query={query} and data={set_placeholder_values, where_placeholder_values}")
        self.execute(query, {**set_placeholder_values, **where_placeholder_values})
        return True

    @staticmethod
    def is_subset(list1, list2):
        """
        check if list1 is a subset of list2
        :param lists1:
        :param list2:
        :return:
        """
        list1 = [e.split("__")[0] for e in list1]
        if all(x in list2 for x in list1):
            return True
        return False

    @staticmethod
    def clean(dict1, list2):
        """
        remove additional dict1 elements that are not in list2
        :param dict1:
        :param list2:
        :return:
        """
        _popped_keys = []
        for elem1 in dict1.keys():
            if elem1 not in list2 or elem1 is None:
                _popped_keys.append(elem1)
        for k in _popped_keys:
            dict1.pop(k)
        return dict1

    def execute(self, query, data=None, result=False):
        db = PostgresDriver()
        res = db.execute(query, data, result)
        return res

    # def group_by(self, filters, group_by_field):
    #     """
    #     Return groupped results count
    #     """
    #     if self.is_subset(filters.keys(), self.fields):
    #         sql = (
    #             "SELECT {group_by_field}, count(*) AS count FROM "
    #             "\"{table_name}\" WHERE ({where_clause}) "
    #             "GROUP BY {group_by_field}"
    #         ).format(
    #             table_name=self.table_name,
    #             where_clause=self.where(**filters), group_by_field=group_by_field)
    #
    #         sql = sql + ';'
    #         resp = self.execute(sql, result=True)
    #         return resp
    #
    #     raise AppException(
    #         "mismatch in attributes and fields of "
    #         "client table. {} attributes not present in schema".format(
    #             set(filters.keys()).difference(self.fields)
    #         )
    #     )

    def count(self, filters, wildcard_field, wildcard_value):
        """
        select query wrapper
        # fields should be in order of table definition
        """
        if self.is_subset(filters.keys(), self.fields):
            where_clause, where_placeholder_values = self.where(**filters)
            query = sql.SQL("select count(*) from {table} {where_clause} ").format(
                table=sql.Identifier(self.table_name),
                where_clause=where_clause)
            wildcard_query_clause = self.get_wildcard_query_clause(wildcard_field, wildcard_value)
            if wildcard_query_clause:
                query = query + wildcard_query_clause
            resp = self.execute(query, where_placeholder_values, result=True)
        else:
            raise AppException(
                "mismatch in attributes and fields of "
                "client table. {} attributes not present in schema".format(
                    set(filters.keys()).difference(self.fields)
                )
            )
        if resp:
            resp = resp[0]
            if resp:
                resp = resp['count']
        return resp

    def get_pagination_dict(self, filters, wildcard_field, wildcard_value, page, page_size):
        count = self.count(filters, wildcard_field, wildcard_value)
        pagination = {}
        pagination['count'] = count
        pagination['size'] = int(page_size)
        pagination['page'] = int(page)
        pagination['next'] = (page + 1) if count > page * page_size else None
        pagination['prev'] = (page - 1) if page > 1 else None
        return pagination

    def get_wildcard_query_clause(self, wildcard_field, wildcard_value):
        wildcard_query_clause = None
        if wildcard_field and wildcard_field not in self._allowed_wildcard_query_fields:
            raise AppException(
                "wildcard queries only allowed on {}".format(','.join(
                    self._allowed_wildcard_query_fields)))
        if wildcard_field and wildcard_value:
            wildcard_query_clause = sql.SQL(" and LOWER({wildcard_field}) LIKE LOWER('%{wildcard_value}%') ".format(
                wildcard_field=wildcard_field, wildcard_value=wildcard_value))
        return wildcard_query_clause

    def paginated_query(self, filters, wildcard_field=None, wildcard_value=None, fields=None, page=1, page_size=10):
        """
        # fields should be in order of table definition
        """
        if not self._pagination_default_order_by_field:
            raise DatabaseException("order by attr is needed for pagination to work")

        if self.is_subset(filters.keys(), self.fields):
            pagination = self.get_pagination_dict(filters, wildcard_field, wildcard_value, page, page_size)
            offset = (pagination['page'] - 1) * pagination['size']
            limit = pagination['size']

            logger.info(f"Where Conditions: {filters}")
            where_clause, where_placeholder_values = self.where(**filters)
            logger.info(f"where_clause>>{where_clause} >>>>>>where_placeholder_values>>>>> {where_placeholder_values}")
            order_by_clause = self.get_order_by_clause(self._pagination_default_order_by_field, "DESC")
            if fields:
                fields = sql.SQL(",").join(sql.Identifier(x) for x in fields)
            else:
                fields = sql.SQL('*')
            query = sql.SQL("select {fields} from {table} {where_clause} ").format(
                fields=fields,
                table=sql.Identifier(self.table_name),
                where_clause=where_clause)
            # add wildcard query clause
            wildcard_query_clause = self.get_wildcard_query_clause(wildcard_field, wildcard_value)
            if wildcard_query_clause:
                query = query + wildcard_query_clause
            logger.info(f"query : {query}")
            # add pagination query clause
            offset_clause = self.get_offset_clause(offset)
            limit_clause = self.get_limit_clause(limit)
            pagination_query = sql.SQL(' {order_by_clause} {limit_clause} {offset_clause};').format(
                order_by_clause=order_by_clause,
                offset_clause=offset_clause,
                limit_clause=limit_clause)
            query += pagination_query
            logger.info(f"final query : {query}")
            resp = self.execute(query, where_placeholder_values, result=True)
        else:
            raise AppException(
                "mismatch in attributes and fields of "
                "client table. {} attributes not present in schema".format(
                    set(filters.keys()).difference(self.fields)
                )
            )
        return self.process_response(resp), pagination

    # def unpaginated_query(self, filters, wildcard_field=None, wildcard_value=None, fields=None):
    #     """
    #     # fields should be in order of table definition
    #     """
    #     if not self._pagination_default_order_by_field:
    #         raise DatabaseException("order by attr is needed for pagination to work")
    #
    #     if self.is_subset(filters.keys(), self.fields):
    #         sql = "SELECT {fields} FROM \"{table_name}\" WHERE {where_clause}".format(
    #             fields=fields or '*', table_name=self.table_name, where_clause=self.where(**filters)
    #         )
    #
    #         wildcard_query_clause = self.get_wildcard_query_clause(wildcard_field, wildcard_value)
    #         if wildcard_query_clause:
    #             sql = sql + wildcard_query_clause
    #         sql = sql + "order by {order_by_field} DESC ;".format(
    #             order_by_field=self._pagination_default_order_by_field)
    #         resp = self.execute(sql, result=True)
    #     else:
    #         raise AppException("mismatch in attributes and fields of "
    #                            "client table. {} attributes not present in schema".format(
    #             set(filters.keys()).difference(self.fields))
    #         )
    #     return self.process_response(resp)

    def process_response(self, resp):
        for dict_resp in resp:
            for k, v in dict_resp.items():
                if isinstance(v, datetime.datetime):
                    dict_resp[k] = str(v)
        return resp

    def get_order_by_clause(self, order_by_key, order_by_order):
        if order_by_key:
            order_by_clause = sql.SQL(" ORDER BY {} {}").format(sql.Identifier(order_by_key), sql.SQL(order_by_order))
        else:
            order_by_clause = sql.SQL("")
        return order_by_clause

    def get_limit_clause(self, limit):
        if limit:
            limit_clause = sql.SQL(" LIMIT {}").format(sql.Literal(limit))
        else:
            limit_clause = sql.SQL("")
        return limit_clause

    def get_offset_clause(self, offset):
        if offset:
            offset_clause = sql.SQL(" OFFSET {}").format(sql.Literal(offset))
        else:
            offset_clause = sql.SQL("")
        return offset_clause
