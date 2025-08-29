from route_planner.utils import env


class PostgresConfiguration:

    DEFAULT_HOST = "127.0.0.1"
    DEFAULT_PORT = "8432"
    DEFAULT_USERNAME = "postgres"
    DEFAULT_PASSWORD = "Nj80m5gawz0oOCzr"
    DEFAULT_DATABASE = "route-planning-service"

    @property
    def host(self):
        return env.get("POSTGRES.PLANNING.HOST") or PostgresConfiguration.DEFAULT_HOST

    @property
    def port(self):
        return env.get("POSTGRES.PLANNING.PORT") or PostgresConfiguration.DEFAULT_PORT

    @property
    def username(self):
        return env.get("POSTGRES.PLANNING.USERNAME") or PostgresConfiguration.DEFAULT_USERNAME

    @property
    def password(self):
        return env.get("POSTGRES.PLANNING.PASSWORD") or PostgresConfiguration.DEFAULT_PASSWORD

    @property
    def database(self):
        return env.get("POSTGRES.PLANNING.DATABASE") or PostgresConfiguration.DEFAULT_DATABASE
