from route_planner.utils import env


class DefaultAppConfig:
    ROUTE_PLANNING_SERVICE_GRPC_HOST = "localhost"
    ROUTE_PLANNING_SERVICE_GRPC_PORT = "3000"
    ROUTE_PLANNING_SERVICE_TEMP_DIRECTORY = "/tmp"
    ENV = "dev"


class AppConfig:

    @property
    def host(self):
        host = env.get('ROUTE_PLANNING_SERVICE_GRPC_HOST') or DefaultAppConfig.ROUTE_PLANNING_SERVICE_GRPC_HOST
        return host

    @property
    def port(self):
        port = env.get('ROUTE_PLANNING_SERVICE_GRPC_PORT') or DefaultAppConfig.ROUTE_PLANNING_SERVICE_GRPC_PORT
        return port

    @property
    def temp_dir(self):
        temp_dir = env.get('ROUTE_PLANNING_SERVICE_TEMP_DIRECTORY') or DefaultAppConfig.ROUTE_PLANNING_SERVICE_TEMP_DIRECTORY
        return temp_dir

    @property
    def env(self):
        _env = env.get('ROUTE_PLANNING_SERVICE_ENV') or DefaultAppConfig.ENV
        return _env

class DefaultRedisConfig:
    REDIS_HOST = "10.40.0.3"
    REDIS_PORT = "6379"
    REDIS_DB = "1"

class RedisConfig:

    @property
    def host(self) -> str:
        host = env.get('REDIS_HOST') or DefaultRedisConfig.REDIS_HOST
        return host

    @property
    def port(self):
        port = env.get('REDIS_PORT') or DefaultRedisConfig.REDIS_PORT
        return port

    @property
    def db(self):
        db = env.get('REDIS_DB') or DefaultRedisConfig.REDIS_DB
        return db
