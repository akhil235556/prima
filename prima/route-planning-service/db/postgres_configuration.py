from route_planner.utils import env


class PostgresConfiguration:

    DEFAULT_HOST = ""
    DEFAULT_PORT = ""
    DEFAULT_USERNAME = ""
    DEFAULT_PASSWORD = ""
    DEFAULT_DATABASE = ""

    @property
    def host(self):
        return env.get("DB_PG_HOST") or PostgresConfiguration.DEFAULT_HOST

    @property
    def port(self):
        return env.get("DB_PG_PORT") or PostgresConfiguration.DEFAULT_PORT

    @property
    def username(self):
        return env.get("DB_PG_USERNAME") or PostgresConfiguration.DEFAULT_USERNAME

    @property
    def password(self):
        return env.get("DB_PG_PASSWORD") or PostgresConfiguration.DEFAULT_PASSWORD

    @property
    def database(self):
        return env.get("DB_PG_DATABASE") or PostgresConfiguration.DEFAULT_DATABASE
