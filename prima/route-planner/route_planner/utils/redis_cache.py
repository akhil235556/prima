
import redis
import pickle
from route_planner.constants.app_configuration import RedisConfig


class RedisCache:
    def __init__(self, data: dict):
        self.data = data

        # Try to connect to Redis, but if it fails, proceed without it
        try:
            config = RedisConfig()
            self.redis_connection = redis.StrictRedis(
                host=config.host, port=config.port, db=config.db, socket_connect_timeout=1
            )
            self.redis_connection.ping() # Test connection
            self.redis_enabled = True
        except (redis.exceptions.ConnectionError, redis.exceptions.TimeoutError):
            self.redis_connection = None
            self.redis_enabled = False
            print("Redis connection failed. Proceeding without Redis caching.")

    def create_cache_key(self, suffix_key):
        """
        :return:
        """
        value_list = list()
        for key, value in self.data.items():
            value_list.append(str(value))
        value_list.append(str(suffix_key))
        return ":".join(value_list)

    def set_expire_key(self, key, expire_time):
        """
        :param key:
        :param expire_time: in seconds
        :return:
        """
        if self.redis_enabled:
            self.redis_connection.expire(key, expire_time)

    def get_data(self, key):
        """

        :param key:
        :return:
        """
        if self.redis_enabled:
            data = self.redis_connection.get(key)
            if data:
                data = pickle.loads(data)
            return data
        return None

    def set_key_data(self, data, key):
        """

        :return:
        """
        if self.redis_enabled:
            data = pickle.dumps(data)
            self.redis_connection.set(key, data)

    def get_ttl_time(self, key: str):
        """
        Get ttl time
        :param key:
        :return:
        """
        if self.redis_enabled:
            return self.redis_connection.ttl(key)
        return -2 # -2 means key does not exist


