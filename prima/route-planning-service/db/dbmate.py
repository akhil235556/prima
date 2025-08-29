import logging
import os

# from settings import env
from db.postgres_configuration import PostgresConfiguration

logging.basicConfig(level=1)
logger = logging.getLogger(__name__)


class Migration:

    @classmethod
    def get_database_url(cls):
        config = PostgresConfiguration()
        # db_url = "postgres://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DATABASE_NAME}?sslmode=disable".format(
        #     HOST=env.get(PostgresEnvVariables.HOST),
        #     PORT=env.get(PostgresEnvVariables.PORT),
        #     USERNAME=env.get(PostgresEnvVariables.USERNAME),
        #     PASSWORD=env.get(PostgresEnvVariables.PASSWORD),
        #     DATABASE_NAME=env.get(PostgresEnvVariables.DATABASE)
        db_url = "postgres://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DATABASE_NAME}?sslmode=disable".format(
            HOST=config.host,
            PORT=config.port,
            USERNAME=config.username,
            PASSWORD=config.password,
            DATABASE_NAME=config.database
        )
        logger.info("dbmate database_url: {}".format(db_url))
        return db_url

    @classmethod
    def set_database_url(cls):
        url = cls.get_database_url()
        os.environ["DATABASE_URL"] = url

    @classmethod
    def command_executor(cls, command):
        """
        to execute a command on shell in current directory
        """
        import subprocess
        p = subprocess.Popen(command,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT)
        for line in p.stdout.readlines():
            logger.info(line)
        logger.info(f"Command {command} executed, Please check log for execution status!")

    @classmethod
    def up(cls):
        cls.set_database_url()
        logger.info("Executing dbmate up...!")
        url = cls.get_database_url()
        logger.info(f"Executing migration with DATABASE_URL: {url}")
        cls.command_executor("dbmate up")
