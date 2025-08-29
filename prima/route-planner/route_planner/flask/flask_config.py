from route_planner.utils import env


class FlaskServiceConfiguration:

    ENV = env.get("ENV")

    SERVICE = f'api-external.gobolt.{ENV}/_svc/route-planning-service'

    PLANNING_STATUS_TO_PROCESSING_API_URL = '/v2/planning/request/update_status_to_processing'

    COMPLETE_REQUEST_API_URL = '/v2/planning/complete_request'

    UPLOAD_ERRORS_API_URL = '/v2/planning/upload_errors'
