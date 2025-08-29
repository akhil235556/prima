from __future__ import absolute_import

from contextlib import contextmanager

import logging

import psycopg2
import psycopg2.extras

import datetime as dt
import decimal
import pytz

from route_planner.db.postgres_configuration import PostgresConfiguration
from route_planner.db.drivers.driver import DatabaseDriver
from route_planner.db.exceptions import DatabaseException

logger = logging.getLogger(__name__)


class PostgresCredentials(object):

    @property
    def host(self):
        return PostgresConfiguration().host

    @property
    def port(self):
        return PostgresConfiguration().port

    @property
    def username(self):
        return PostgresConfiguration().username
    @property
    def password(self):
        return PostgresConfiguration().password

    @property
    def database(self):
        return PostgresConfiguration().database



class PostgresDriverV2(DatabaseDriver):

    def __init__(self, connection=None, credentials=None):
        self.credentials = credentials
        self.connection = self.connect()
        if not connection:
            connection = self.connect()
            self.connection_overriden = False
        self.connection = connection
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.DictCursor)

    def connect(self):
        try:
            postgresCredentials = self.credentials or PostgresCredentials()
            self.connection = psycopg2.connect(
                host=postgresCredentials.host,
                port=postgresCredentials.port,
                database=postgresCredentials.database,
                user=postgresCredentials.username,
                password=postgresCredentials.password
            )
        except Exception as e:
            message = "Unable to connect to database. Error is: {}".format(str(e))
            raise DatabaseException(message)
        return self.connection

    def close(self):
        if self.connection:
            self.connection.close()

    def execute(self, query, data, resp=True, cursor=None, connection=None):
        self.connection = connection or self.connection
        _cursor = self.connection.cursor(cursor_factory=psycopg2.extras.DictCursor)
        try:
            logger.info("executing sql query: {}".format(query.as_string(self.connection)))
            logger.info("with data: {}".format(data))
            cursor = cursor or _cursor
            logger.info("Formed SQL: {}".format(cursor.mogrify(query, data)))
            cursor.execute(query, data)
            if resp:
                resp = self.cursor_row_as_dict(cursor)
            if not connection:
                self.connection.commit()
            logger.debug("sql query response: {}".format(resp))
        except psycopg2.ProgrammingError as e:
            raise DatabaseException(str(e))
        finally:
            if not connection:
                self.close()
        return resp

    def cursor_row_as_dict(self, cursor):
        """
        convert cursor result to list of dict
        """
        result = []
        column_names = [desc[0] for desc in cursor.description]
        if cursor.rowcount > 0:
            for row in cursor:
                res = dict(zip(column_names, row))
                result.append(res)
        result = [
            {
                k: (self.to_str(v) if type(v) in [str, dt.datetime, decimal.Decimal] else v)
                for k, v in d.items()
            }
            for d in result
        ]
        return result

    def to_str(self, value):
        """
        converts datetime instances to string and strips string object
        """
        if isinstance(value, dt.datetime):
            return value.replace(tzinfo=pytz.UTC).isoformat()
        if isinstance(value, decimal.Decimal):
            value = float(value)
            return value
        return value.strip()


@contextmanager
def postgres_connection():
    driver = PostgresDriverV2()
    try:
        yield driver.connection
        driver.connection.commit()
    finally:
        driver.close()
