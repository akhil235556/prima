from route_planner.constants.app_configuration import AppConfig
from route_planner.utils import env


class PrimaGoogleStorageConfiguration:

    DEFAULT_BUCKET_NAME = "gobolt-bulk-uploads"
    DEFAULT_JOB_NAME = "Prima"
    DEFAULT_PROJECT_ID = "services-248607"
    DEFAULT_FILE_LNK_EXPIRY = 1

    @property
    def bucket(self):
        return env.get("GOOGLE_STORAGE.PLANNING.BUCKET_NAME") or PrimaGoogleStorageConfiguration.DEFAULT_BUCKET_NAME

    @property
    def project_id(self):
        return env.get("GOOGLE_STORAGE.PLANNING.PROJECT_ID") or PrimaGoogleStorageConfiguration.DEFAULT_PROJECT_ID

    @staticmethod
    def bucket_path(request_id, file_path):
        file_name = file_path.split('/')[-1]
        return f"{AppConfig().env}/{PrimaGoogleStorageConfiguration.DEFAULT_JOB_NAME}/{request_id}/{file_name}"

    @staticmethod
    def get_storage_client():
        from route_planner.gcp.storage import GoogleStorage
        config = PrimaGoogleStorageConfiguration()
        return GoogleStorage(config.project_id, config.bucket)
