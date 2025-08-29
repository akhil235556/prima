import datetime
import re
from abc import ABC

import psycopg2
from psycopg2 import sql

from db.drivers.postgres import PostgresDriver
from db.drivers.postgres import PostgressConnectionManager
from errors.exceptions import AppException, DatabaseException
from utilities.utils import parse_datetime


class BaseDao(ABC):
    """
    loads the database driver and provides abstract functionality
    to execute database operations
    """
    __version = '1.0.1' # custom paginated query

    _fields = None
    _table_name = None
    _pagination_default_order_by_field = None
    _allowed_wildcard_query_fields = None

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

    COMPARISON_OPERATORS = {
        "lte": '<=',
        "lt": '<',
        "gte": '>=',
        "gt": '>'
    }

    def where(self, **filters):
        """
        creates and returns where clause for query
        """
        with PostgressConnectionManager() as connection:
            in__filters = filters.get('in__filters', {})
            range__filters = filters.get('range__filters', {})
            clauses = []

            in_clause = ""
            for k, v in in__filters.items():
                if in_clause:
                    in_clause = in_clause + " AND "
                v = [sql.Literal(x) for x in v]
                in_clause = in_clause + sql.SQL("{k} in ({v})").format(k=sql.SQL(k), v=sql.SQL(',').join(v)).as_string(connection)
            if in_clause:
                clauses.append(in_clause)

            range_clause = ""
            for k, v in range__filters.items():
                if range_clause:
                    range_clause = range_clause + " AND "
                operator = BaseDao.COMPARISON_OPERATORS[k.split('__')[1]]
                field = k.split('__')[0]
                range_clause = range_clause + sql.SQL("{k} {op} {v}").format(k=sql.SQL(field), op=sql.SQL(operator), v=sql.Literal(v)).as_string(connection)
            if range_clause:
                clauses.append(range_clause)

            where_clause = ""
            for k, v in filters.items():
                if k not in ['in__filters', 'range__filters']:
                    if where_clause:
                        where_clause = where_clause + " AND "
                    if v is None:
                        where_clause = where_clause + sql.SQL("{k} is null").format(k=sql.SQL(k)).as_string(connection)
                    else:
                        where_clause = where_clause + sql.SQL("{k}={v}").format(k=sql.SQL(k), v=sql.Literal(v)).as_string(connection)
            if where_clause:
                clauses.append(where_clause)

            final_clause = ""
            if clauses:
                final_clause = " AND ".join(clauses)
            return final_clause

    def query(self, filters, fields=None):
        """
        select query wrapper
        # fields should be in order of table definition
        """
        with PostgressConnectionManager() as connection:
            if self.is_subset(filters.keys(), self.fields):
                sql_query = sql.SQL("SELECT {fields} FROM {table_name} WHERE {where_clause}").format(
                    fields=sql.SQL(fields or '*'), table_name=sql.Identifier(self.table_name), where_clause=sql.SQL(self.where(**filters))
                ).as_string(connection)
                resp = self.execute(sql_query, result=True)
            else:
                raise AppException("mismatch in attributes and fields of "
                                   "{} table. {} attributes not present in schema".format(
                    self.table_name, set(filters.keys()).difference(self.fields))
                )
            return self.process_response(resp)

    def insert(self, db_dict, no_execute=False):
        """
        inserts the resource in table
        """
        if not self.is_subset(db_dict.keys(), self.fields):
            # remove not registered attrs
            db_dict = self.clean(db_dict, self.fields)

        fields = sql.SQL(',').join([sql.Identifier(x) for x in db_dict.keys()])
        values = sql.SQL(',').join([sql.Literal(x) for x in db_dict.values()])
        sql_query = sql.SQL("INSERT INTO {table_name} ({fields}) VALUES ({values})").format(
            table_name=sql.Identifier(self.table_name), fields=fields, values=values
        )
        try:
            if no_execute:
                with PostgressConnectionManager() as connection:
                    return sql_query.as_string(connection)
            else:
                with PostgressConnectionManager() as connection:
                    self.execute(sql_query.as_string(connection))
        except psycopg2.errors.UniqueViolation as e:
            message = BaseDao.process_unique_violation_error(e)
            raise AppException(message)
        return True

    def set_clause(self, set_dict):
        with PostgressConnectionManager() as connection:
            set_clause = ""
            for k, v in set_dict.items():
                set_clause = set_clause + sql.SQL("{k}={v}, ").format(k=sql.Identifier(k), v=sql.Literal(v)).as_string(connection)
            set_clause = set_clause[:-2]  # remove last comma and space
            return set_clause

    def update(self, filter_dict, set_dict, no_execute=False):
        where_clause = self.where(**filter_dict)
        set_clause = self.set_clause(set_dict)
        sql_query = sql.SQL("UPDATE {table_name} SET {set_clause} WHERE {where_clause}").format(
            table_name=sql.Identifier(self.table_name), set_clause=sql.SQL(set_clause), where_clause=sql.SQL(where_clause)
        )
        if no_execute:
            with PostgressConnectionManager() as connection:
                return sql_query.as_string(connection)
        else:
            with PostgressConnectionManager() as connection:
                self.execute(sql_query.as_string(connection))
            return True

    @staticmethod
    def is_subset(list1, list2):
        """
        check if list1 is a subset of list2
        :param lists1:
        :param list2:
        :return:
        """
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
            if elem1 not in list2:
                _popped_keys.append(elem1)
        for k in _popped_keys:
            dict1.pop(k)
        return dict1

    def execute(self, query, result=False):
        db = PostgresDriver()
        res = db.execute(query, result)
        return res

    def custom_count(self, query, wildcard_field, wildcard_value):
        """
        select query wrapper
        # fields should be in order of table definition
        """
        sql = "select count(*) from" + query.split('from')[1]

        # add wildcard query clause in sql
        wildcard_query_clause = self.get_wildcard_query_clause(wildcard_field, wildcard_value)
        if wildcard_query_clause:
            sql = sql + wildcard_query_clause

        sql = sql + ';'
        resp = self.execute(sql, result=True)
        if resp:
            resp = resp[0]
            if resp:
                resp = resp['count']
        return resp

    def count(self, filters, wildcard_field, wildcard_value):
        """
        select query wrapper
        # fields should be in order of table definition
        """
        with PostgressConnectionManager() as connection:
            if self.is_subset(filters.keys(), self.fields):
                sql_query = sql.SQL("SELECT count(*) FROM {table_name} WHERE {where_clause}").format(
                    table_name=sql.Identifier(self.table_name), where_clause=sql.SQL(self.where(**filters))
                ).as_string(connection)

                # add wildcard query clause in sql
                wildcard_query_clause = self.get_wildcard_query_clause(wildcard_field, wildcard_value)
                if wildcard_query_clause:
                    if " where " in sql_query:
                        sql_query = sql_query + " and " + wildcard_query_clause
                    else:
                        sql_query = sql_query + " where " + wildcard_query_clause
                sql_query = sql_query + ';'

                resp = self.execute(sql_query, result=True)
            else:
                raise AppException("mismatch in attributes and fields of "
                                   "{} table. {} attributes not present in schema".format(
                    self.table_name, set(filters.keys()).difference(self.fields))
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

    def get_custom_pagination_dict(self, query, wildcard_field, wildcard_value, page, page_size):
        count = self.custom_count(query, wildcard_field, wildcard_value)
        pagination = {}
        pagination['count'] = count
        pagination['size'] = int(page_size)
        pagination['page'] = int(page)
        pagination['next'] = (page + 1) if count > page * page_size else None
        pagination['prev'] = (page - 1) if page > 1 else None
        return pagination

    def get_wildcard_query_clause(self, wildcard_field, wildcard_value):
        wildcard_query_clause = None

        if not wildcard_field:
            if not self._allowed_wildcard_query_fields:
                raise AppException("default wildcard query field not defined")
            wildcard_field = self._allowed_wildcard_query_fields[0]

        if wildcard_field and wildcard_field not in self._allowed_wildcard_query_fields:
            raise AppException(
                "wildcard queries only allowed on {}".format(','.join(
                    self._allowed_wildcard_query_fields)))

        with PostgressConnectionManager() as connection:
            if wildcard_field and wildcard_value:
                wildcard_query_clause = sql.SQL(" and LOWER({wildcard_field}) LIKE LOWER({wildcard_value})").format(
                    wildcard_field=sql.Identifier(wildcard_field),
                    wildcard_value=sql.Literal('%' + wildcard_value + '%')).as_string(connection)
        return wildcard_query_clause

    def paginated_query(self, filters, wildcard_field=None, wildcard_value=None, fields=None, page=1, page_size=10):
        """
        # fields should be in order of table definition
        """
        with PostgressConnectionManager() as connection:
            if not self._pagination_default_order_by_field:
                raise DatabaseException("order by attr is needed for pagination to work")

            if self.is_subset(filters.keys(), self.fields):
                pagination = self.get_pagination_dict(filters, wildcard_field, wildcard_value, page, page_size)
                offset = (pagination['page'] - 1) * pagination['size']
                limit = pagination['size']

                # sql with basic filters
                sql_query = sql.SQL("SELECT {fields} FROM {table_name} WHERE {where_clause}").format(
                    fields=sql.SQL(fields or '*'), table_name=sql.Identifier(self.table_name),
                    where_clause=sql.SQL(self.where(**filters))
                ).as_string(connection)

                # add wildcard query clause
                wildcard_query_clause = self.get_wildcard_query_clause(wildcard_field, wildcard_value)
                if wildcard_query_clause:
                    if " where " in sql_query:
                        sql_query = sql_query + " and " + wildcard_query_clause
                    else:
                        sql_query = sql_query + " where " + wildcard_query_clause

                # add pagination query clause
                pagination_query_clause = sql.SQL(
                    " order by {order_by_field} DESC limit {limit} offset {offset}").format(
                    order_by_field=sql.SQL(self._pagination_default_order_by_field), limit=sql.SQL(str(limit)),
                    offset=sql.SQL(str(offset))
                ).as_string(connection)
                sql_query = sql_query + pagination_query_clause
                resp = self.execute(sql_query, result=True)
            else:
                raise AppException("mismatch in attributes and fields of "
                                   "{} table. {} attributes not present in schema".format(
                    self.table_name, set(filters.keys()).difference(self.fields))
                )
            return self.process_response(resp), pagination

    def unpaginated_query(self, filters, wildcard_field=None, wildcard_value=None, fields=None):
        """
        # fields should be in order of table definition
        """
        with PostgressConnectionManager() as connection:
            if not self._pagination_default_order_by_field:
                raise DatabaseException("order by attr is needed for pagination to work")

            if self.is_subset(filters.keys(), self.fields):
                sql_query = sql.SQL("SELECT {fields} FROM {table_name} WHERE {where_clause}").format(
                    fields=sql.SQL(fields or '*'), table_name=sql.Identifier(self.table_name),
                    where_clause=sql.SQL(self.where(**filters))
                ).as_string(connection)
                # add wildcard query clause
                wildcard_query_clause = self.get_wildcard_query_clause(wildcard_field, wildcard_value)
                if wildcard_query_clause:
                    if " where " in sql_query:
                        sql_query = sql_query + " and " + wildcard_query_clause
                    else:
                        sql_query = sql_query + " where " + wildcard_query_clause
                sql_query = sql_query + sql.SQL("order by {order_by_field} DESC").format(
                    order_by_field=sql.SQL(self._pagination_default_order_by_field)).as_string(connection)
                resp = self.execute(sql_query, result=True)
            else:
                raise AppException("mismatch in attributes and fields of "
                                   "{} table. {} attributes not present in schema".format(
                    self.table_name, set(filters.keys()).difference(self.fields))
                )
            return self.process_response(resp)

    def paginated_custom_query(
            self, query, wildcard_field=None, wildcard_value=None, page=1, page_size=10, pagination=None):
        with PostgressConnectionManager() as connection:
            if not self._pagination_default_order_by_field:
                raise DatabaseException("order by attr is needed for pagination to work")

            if not pagination:
                pagination = self.get_custom_pagination_dict(query, wildcard_field, wildcard_value, page, page_size)

            offset = (pagination['page'] - 1) * pagination['size']
            limit = pagination['size']

            # sql with basic filters
            sql_query = query

            # add wildcard query clause
            wildcard_query_clause = self.get_wildcard_query_clause(wildcard_field, wildcard_value)
            if wildcard_query_clause:
                sql_query = sql_query + wildcard_query_clause

            # add pagination query clause
            pagination_query_clause = sql.SQL(" order by {order_by_field} DESC limit {limit} offset {offset}").format(
                order_by_field=sql.SQL(self._pagination_default_order_by_field), limit=sql.SQL(str(limit)),
                offset=sql.SQL(str(offset))
            ).as_string(connection)

            sql_query = sql_query + pagination_query_clause
            resp = self.execute(sql_query, result=True)
            return self.process_response(resp), pagination

    def unpaginated_custom_query(self, query, wildcard_field=None, wildcard_value=None):
        with PostgressConnectionManager() as connection:
            if not self._pagination_default_order_by_field:
                raise DatabaseException("order by attr is needed for pagination to work")

            sql_query = query

            # add wildcard query clause
            wildcard_query_clause = self.get_wildcard_query_clause(wildcard_field, wildcard_value)
            if wildcard_query_clause:
                if " where " in sql_query:
                    sql_query = sql_query + " and " + wildcard_query_clause
                else:
                    sql_query = sql_query + " where " + wildcard_query_clause

            sql_query = sql_query + sql.SQL("order by {order_by_field} DESC").format(
                order_by_field=sql.SQL(self._pagination_default_order_by_field)).as_string(connection)
            resp = self.execute(sql_query, result=True)
            return self.process_response(resp)

    def process_response(self, resp):
        for dict_resp in resp:
            for k, v in dict_resp.items():
                if isinstance(v, datetime.datetime):
                    dict_resp[k] = str(parse_datetime(str(v)))
        return resp

    def update_query_sql(self, filter_dict, set_dict, table_name=None):
        with PostgressConnectionManager() as connection:
            where_clause = self.where(**filter_dict)
            set_clause = self.set_clause(set_dict)
            sql_query = sql.SQL("UPDATE {table_name} SET {set_clause} WHERE ({where_clause})").format(
                table_name=sql.Identifier(table_name or self.table_name),
                set_clause=sql.SQL(set_clause), where_clause=sql.SQL(where_clause)
            ).as_string(connection)
            return sql_query

    def insert_sql_query(self, db_dict, table_name=None):
        """
        retrun sql query
        """
        with PostgressConnectionManager() as connection:
            fields = sql.SQL(',').join([sql.Identifier(x) for x in db_dict.keys()])
            values = sql.SQL(',').join([sql.Literal(x) for x in db_dict.values()])
            sql_query = sql.SQL("INSERT INTO {table_name} ({fields}) VALUES ({values})").format(
                table_name=sql.Identifier(table_name or self.table_name), fields=fields, values=values
            )
            return sql_query.as_string(connection)

    @staticmethod
    def process_unique_violation_error(exception):
        if exception.diag:
            message = exception.diag.message_detail
            value_regex = re.compile("=\((.+)\)")
            key_regex = re.compile("\((.+)\)=")

            key_phrases = key_regex.findall(message)
            value_phrases = value_regex.findall(message)

            keys = None
            values = None
            if key_phrases:
                keys = key_phrases[0].split(',')
            if value_phrases:
                values = value_phrases[0].split(',')

            _map = {}
            if keys and values:
                for i in range(0, len(keys)):
                    if keys[i] in ('tenant', 'partition',):
                        continue
                    else:
                        _map[keys[i]] = values[i]

            error_message = 'Record exists for: '
            if _map:
                for k, v in _map.items():
                    error_message += '{}={}'.format(k.strip(), v.strip())
            return error_message
