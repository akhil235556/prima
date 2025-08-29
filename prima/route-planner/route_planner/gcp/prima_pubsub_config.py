from route_planner.utils import env


class PrimaGooglePubSubConfiguration:

    DEFAULT_SUBSCRIPTION_ID = "prima-async-task-processor"
    DEFAULT_PROJECT_ID = "services-248607"
    DEFAULT_MESSAGE_CONSUME_COUNT = 1

    @property
    def subscription_id(self):
        return env.get("GOOGLE_PUBSUB.PLANNING.SUBSCRIPTION_ID") or PrimaGooglePubSubConfiguration.DEFAULT_SUBSCRIPTION_ID

    @property
    def project_id(self):
        return env.get("GOOGLE_PUBSUB.PLANNING.PROJECT_ID") or PrimaGooglePubSubConfiguration.DEFAULT_PROJECT_ID
