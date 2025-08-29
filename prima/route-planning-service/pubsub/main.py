import base64
import json
import logging

import grpc
import requests


from sentry_config.initialization import SentryInitialization

from constants.constants import DRIVER_ASYNC_EVENTS_TOKEN_KEY
from constants.constants import AsyncTaskExecutorEnvVariables
from settings import env


def get_service_address():
    return "{}:{}".format(
        env.get(AsyncTaskExecutorEnvVariables.GRPC_HOST_NAME),
        env.get(AsyncTaskExecutorEnvVariables.GRPC_PORT),
    )


def get_jwt_token():
    jwt_auth = GetServiceAccountToken(DRIVER_ASYNC_EVENTS_TOKEN_KEY, secure_connection=True)
    token = jwt_auth.token.decode('utf-8')
    return token


def get_grpc_metadata(request_id=None):
    metadata = []
    metadata.append(("authorization", get_jwt_token()))
    if request_id:
        metadata.append(("x-request-id", request_id))
    return metadata


def get_channel(address):
    ssl_creds = grpc.ssl_channel_credentials()
    channel = grpc.secure_channel(address, ssl_creds)
    return channel



def pubsub_event_handler(event, context):
    """Triggered from a message on a Cloud Pub/Sub topic.
    Args:
         event (dict): Event payload.
         context (google.cloud.functions.Context): Metadata for the event.
    """
    SentryInitialization()
    logger = logging.getLogger(__name__)

    try:
        logger.info("executing async cloud task function message: {message}".format(message=event))
        decoded_message = base64.b64decode(event['data']).decode('utf-8')
        logger.info("executing async cloud task function message: {message}".format(message=decoded_message))

        message_dict = json.loads(decoded_message)
        headers = {
            "Content-Type": "application/json"
        }
        resp = requests.post(
            "https://prima.gobolt.dev/_svc/route-planning-service/v3/file/handle/", json=message_dict,
            headers=headers
        )
        resp = resp.json()

        logger.info("successfully ran async cloud task function: {message}".format(message=resp))
    except Exception as e:
        logger.error(str(e), exc_info=True)
