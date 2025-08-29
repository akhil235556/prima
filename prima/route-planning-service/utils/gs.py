import os
import logging
import six
import mimetypes
import datetime
from google.cloud import storage

from constants.constants import GoogleStorageDetails
from constants.constants import VALID_FILE_EXTENSIONS, DEFAULT_FILE_LNK_EXPIRY


LOGGER = logging.getLogger(__name__)


class GoogleStorage(object):
    @staticmethod
    def bucket():
        return os.environ.get(GoogleStorageDetails.BUCKET)

    @staticmethod
    def prefix():
        return os.environ.get(GoogleStorageDetails.PREFIX)

    @staticmethod
    def project_id():
        return os.environ.get(GoogleStorageDetails.PROJECT_ID)

    @staticmethod
    def check_extension(filename):
        extn = filename.split(".")[-1]
        return extn in VALID_FILE_EXTENSIONS

    @staticmethod
    def client():
        return storage.Client(project=GoogleStorage.project_id())

    @staticmethod
    def delete(filename):
        client = GoogleStorage.client()
        bucket = client.bucket(GoogleStorage.bucket())
        blob = bucket.blob(filename)
        blob.delete()
        LOGGER.info('File {} deleted.'.format(filename))

    @staticmethod
    def decode_url(url):
        if isinstance(url, six.binary_type):
            url = url.decode('utf-8')
        return url

    @staticmethod
    def bucket_path(request_id, file_name, upload_job_name):
        # extn = file_name.split(".")[-1]
        return f"{GoogleStorage.prefix()}/{upload_job_name}/{request_id}/{file_name}"

    @staticmethod
    def upload(request_id, file_path, upload_job_name="Prima"):
        try:
            with open(file_path, "rb") as file:
                file_name = file_path.split("/")[-1]
                content_type = mimetypes.MimeTypes().guess_type(file_name)[0]
                GoogleStorage.check_extension(file_name)
                client = GoogleStorage.client()
                bucket = client.bucket(GoogleStorage.bucket())
                blob = bucket.blob(GoogleStorage.bucket_path(request_id, file_name, upload_job_name))
                blob.upload_from_string(file.read(), content_type=content_type)
                return GoogleStorage.decode_url(blob.public_url)
        except IOError as e:
            raise Exception(f"Invalid file path. Error is {str(e)}")
        except Exception as e:
            raise Exception(str(e))

    @staticmethod
    def get(file_path):
        client = GoogleStorage.client()
        bucket = client.bucket(GoogleStorage.bucket())
        blob = bucket.blob(file_path)
        return blob

    @staticmethod
    def public_link(file_path):
        client = GoogleStorage.client()
        bucket = client.bucket(GoogleStorage.bucket())
        blob = bucket.blob(file_path)
        if not blob.exists():
            raise IOError("No sample file found")

        url = blob.generate_signed_url(
            version='v4',
            expiration=datetime.timedelta(hours=DEFAULT_FILE_LNK_EXPIRY),
            method='GET')
        return url

    @staticmethod
    def download_file(url):
        file_path = url.split("?")[0]
        file_path = "/".join(file_path.split("/")[4:])
        blob = GoogleStorage.get(file_path)
        file_path = file_path.split("/")[-1]
        destination_uri = "{}".format(file_path)
        blob.download_to_filename(destination_uri)
        return destination_uri
