from route_planner.utils import env


class PubSubConfiguration:

    DEFAULT_TOPIC_NAME = ""
    DEFAULT_PROJECT_ID = ""


    @property
    def topic_name(self):
        return env.get("PUB_SUB_TOPIC_NAME") or PubSubConfiguration.DEFAULT_TOPIC_NAME

    @property
    def project_id(self):
        return env.get("PUB_SUB_PROJECT_ID") or PubSubConfiguration.DEFAULT_PROJECT_ID
