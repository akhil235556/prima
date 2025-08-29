from google.cloud import pubsub_v1

from route_planner.gcp.prima_pubsub_config import PrimaGooglePubSubConfiguration
from route_planner.utils import logging

logger = logging.getLogger(__name__)


def consume(callback_method):
    logger.info(f"starting connection")
    config = PrimaGooglePubSubConfiguration()
    subscriber = pubsub_v1.SubscriberClient()
    subscription_path = subscriber.subscription_path(config.project_id, config.subscription_id)

    flow_control = pubsub_v1.types.FlowControl(max_messages=1)

    streaming_pull_future = subscriber.subscribe(
        subscription_path, callback=callback_method, flow_control=flow_control)
    logger.info(f"Listening for messages on {subscription_path}..\n")

    # Wrap subscriber in a 'with' block to automatically call close() when done.
    with subscriber:
        try:
            # When `timeout` is not set, result() will block indefinitely,
            # unless an exception is encountered first.
            streaming_pull_future.result()
        finally:
            streaming_pull_future.cancel()  # Trigger the shutdown.
            streaming_pull_future.result()  # Block until the shutdown is complete.
