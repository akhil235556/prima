import datetime
import logging
import mimetypes

import six
from google.cloud import storage

from route_planner.gcp.prima_storage_config import PrimaGoogleStorageConfiguration

LOGGER = logging.getLogger(__name__)


class GoogleStorage(object):

    def __init__(self, project_id, bucket):
        self.project_id = project_id
        self.bucket = bucket
        self.client = storage.Client(project=self.project_id)
        self.bucket = self.client.bucket(bucket)

    @staticmethod
    def decode_url(url):
        if isinstance(url, six.binary_type):
            url = url.decode('utf-8')
        return url

    def upload(self, request_id, file_path):
        try:
            with open(file_path, "rb") as file:
                file_name = file_path.split("/")[-1]
                content_type = mimetypes.MimeTypes().guess_type(file_name)[0]
                blob = self.bucket.blob(PrimaGoogleStorageConfiguration.bucket_path(request_id, file_name))
                blob.upload_from_string(file.read(), content_type=content_type)
                return GoogleStorage.decode_url(blob.public_url)
        except IOError as e:
            raise Exception(f"Invalid file path. Error is {str(e)}")

    def get(self, file_path):
        blob = self.bucket.blob(file_path)
        return blob

    def public_link(self, file_path):
        blob = self.bucket.blob(file_path)
        if not blob.exists():
            raise IOError("No file found")

        url = blob.generate_signed_url(
            version='v4',
            expiration=datetime.timedelta(hours=PrimaGoogleStorageConfiguration.DEFAULT_FILE_LNK_EXPIRY),
            method='GET')
        return url

    def get_download_link(self, rid, file_path):
        self.upload(rid, file_path)
        file_path = PrimaGoogleStorageConfiguration.bucket_path(rid, file_path)
        public_url = self.public_link(file_path)
        return public_url

    def download_file(self, url):
        file_path = url.split("?")[0]
        file_path = "/".join(file_path.split("/")[4:])
        blob = self.get(file_path)
        file_path = file_path.split("/")[-1]
        destination_uri = "{}".format(file_path)
        blob.download_to_filename(destination_uri)
        return destination_uri

