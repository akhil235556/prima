from __future__ import absolute_import

from context_logging import logging

import psycopg2
import psycopg2.extras

from constants.env_variables import PostgresEnvVariables
from db.drivers.driver import DatabaseDriver
from errors.exceptions import DatabaseException
from settings import env

logger = logging.getLogger(__name__)


class PostgresCredentials(object):

    @property
    def host(self):
        return env.get(PostgresEnvVariables.HOST)

    @property
    def port(self):
        return env.get(PostgresEnvVariables.PORT)

    @property
    def username(self):
        return env.get(PostgresEnvVariables.USERNAME)

    @property
    def password(self):
        return env.get(PostgresEnvVariables.PASSWORD)

    @property
    def database(self):
        return env.get(PostgresEnvVariables.DATABASE)


class PostgresDriver(DatabaseDriver):

    __connection = None

    def __init__(self):
        self.__connection = self.connect()

    def connect(self):
        try:
            postgresCredentials = PostgresCredentials()
            self.__connection = psycopg2.connect(
                host=postgresCredentials.host,
                port=postgresCredentials.port,
                database=postgresCredentials.database,
                user=postgresCredentials.username,
                password=postgresCredentials.password
            )
        except Exception as e:
            message = "Unable to connect to database. Error is: {}".format(str(e))
            raise DatabaseException(message)
        return self.__connection

    def close(self):
        if self.__connection:
            self.__connection.close()

    def execute(self, query, results=None):
        resp = []
        conn = self.__connection

        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        logger.info("executing sql query: {}".format(query))
        try:
            if isinstance(query, list) and query:
                for q in query:
                    cursor.execute(q)
            elif isinstance(query, str) and query:
                cursor.execute(query)
            if results:
                resp = [dict(x) for x in cursor]
            conn.commit()
            logger.info("sql query response: {}".format(resp))
        except psycopg2.ProgrammingError as e:
            raise DatabaseException(str(e))
        finally:
            self.close()
        return resp

class PostgressConnectionManager:

    def __init__(self):
        postgresCredentials = PostgresCredentials()
        self.connection = psycopg2.connect(
            host=postgresCredentials.host,
            port=postgresCredentials.port,
            database=postgresCredentials.database,
            user=postgresCredentials.username,
            password=postgresCredentials.password
        )

    def __enter__(self):
        return self.connection

    def __exit__(self, exc_type, exc_value, exc_traceback):
        self.connection.close()
