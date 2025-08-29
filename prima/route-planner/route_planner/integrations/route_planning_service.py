import requests
import logging

from route_planner.exceptions.exceptions import PubSubMessageAckException, RequestAlreadyProcessingError
from route_planner.flask.flask_config import FlaskServiceConfiguration

logger = logging.getLogger(__name__)

class RoutePlanningService(object):

    def __init__(self):
        self.service = FlaskServiceConfiguration.SERVICE

    def update_status_to_processing(self, model_dict):
        response = None
        request_id = model_dict.get('request_id')

        try:
            api_url = f'https://{self.service}{FlaskServiceConfiguration.PLANNING_STATUS_TO_PROCESSING_API_URL}'

            response = requests.put(api_url, json=model_dict)
            if response.status_code == 409:
                raise PubSubMessageAckException(
                    f"Request: {request_id}, {response.json().get('message', 'already finished')}"
                )

            elif response.status_code == 400:
                # request in Processing
                raise RequestAlreadyProcessingError(
                    f"Request: {request_id}, {response.json().get('message', 'already processing')}"
                )

            response.raise_for_status()
        except Exception as e:
            logger.info(f'Error: {e}, Request ID : {request_id}, Request Data : {model_dict}, Response : {response}')

            if isinstance(e, (PubSubMessageAckException, RequestAlreadyProcessingError)):
                raise e


    def update_complete_request(self, model_dict):
        request_id = model_dict.get('request_id')

        try:
            api_url = f'https://{self.service}{FlaskServiceConfiguration.COMPLETE_REQUEST_API_URL}'

            response = requests.post(api_url, json=model_dict)

            response.raise_for_status()

            logger.info(response)

            return True

        except Exception as e:

            logger.info(f'Error: {e}, Request ID : {request_id}, Request Data : {model_dict}, Response : {response}')
            
            return False

    def upload_errors(self, model_dict):
        request_id = model_dict.get('request_id')

        try:
            api_url = f'https://{self.service}{FlaskServiceConfiguration.UPLOAD_ERRORS_API_URL}'

            response = requests.post(api_url, json=model_dict)

            response.raise_for_status()

            logger.info(response)

        except Exception as e:
            logger.info(f'Error: {e}, Request ID : {request_id}, Request Data : {model_dict}, Response : {response}')

