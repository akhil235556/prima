from enum import Enum

from loader.prima_loader import PrimaLoader


class PlanningService:
    name = None
    loader = None

    def __init__(self, name, loader):
        self.name = name
        self.loader = loader


class PlanningServices(Enum):
    PRIMA = PlanningService("PRIMA", PrimaLoader)


VALID_PLANNING_SERVICES_NAMES = [x.value.name for x in PlanningServices]
PLANNING_SERVICES_NAMES_LOADER_MAP = {x.value.name: x.value.loader for x in PlanningServices}

class ServiceStatusCode(object):
    SUCCESS = 200
    FAIL = 400
    AUTH_FAILURE = 401
    PERMISSION_FAILURE = 403

class ServiceStatusMessage(object):
    SUCCESS = "Operation Successful"
