from __future__ import absolute_import

from contextlib import contextmanager

import logging

import psycopg2
import psycopg2.extras

# from constants import PostgresEnvVariables
from db.drivers.driver import DatabaseDriver
from route_planner.exceptions.exceptions import DatabaseException
from db.postgres_configuration import PostgresConfiguration
# from settings import env

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


class PostgresDriver(DatabaseDriver):

    connection = None

    def __init__(self, connection=None, replica=None):
        self.replica = bool(replica)
        self.connection_overriden = True
        if not connection:
            connection = self.connect()
            self.connection_overriden = False
        self.connection = connection
        self.cursor = connection.cursor(cursor_factory=psycopg2.extras.DictCursor)

    def connect(self):
        try:
            postgresCredentials = PostgresCredentials()
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

    def execute(self, query, data=None, result=True, cursor=None):
        conn = self.connection
        _cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        try:
            logger.info("executing sql query: {}".format(query))
            logger.info("with data: {}".format(data))
            cursor = cursor or _cursor
            logger.info("Formed SQL: {}".format(cursor.mogrify(query, data)))
            cursor.execute(query, data)
            if result:
                result = [dict(x) for x in cursor]
            conn.commit()
            logger.info("sql query response: {}".format(result))
        except psycopg2.ProgrammingError as e:
            raise DatabaseException(str(e))
        finally:
            self.close()
        return result


@contextmanager
def postgres_connection():
    driver = PostgresDriver()
    try:
        yield driver.connection
        driver.connection.commit()
    finally:
        driver.close()