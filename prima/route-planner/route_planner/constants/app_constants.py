import os
import sys
from enum import Enum

MAX_INT = sys.maxsize / 2

WELDED_TAG_NAME = os.environ.get("WELDED_TAG_NAME", "welded")

WELDED_TAG_UTILISATION_PERCENTAGE_UB = int(os.environ.get("WELDED_TAG_UTILISATION_PERCENTAGE_UB", 65))

VALID_UOM_TYPE_LIST = ['kg', 'cbm']

MAX_CONTENT_LENGTH = 16 * 1024 * 1024

# For MimiType File Extension check
VALID_FILE_EXTENSIONS = [".xlsx"]

VALID_SHEET_NAMES = ["Vehicles", "Task", "Products"]
BP_MID_MILE_SHEET_NAMES = ["Vehicles", "Task"]
CONSOLIDATED_FIXED_COST_VALID_SHEET_NAMES = ["Vehicles", "Task"]
CONSOLIDATED_VARIABLE_COST_VALID_SHEET_NAMES = ["Vehicles", "Task"]

NUMBER_DTYPE_KIND = ['f', 'i']
OBJECT_DTYPE_KIND = ['O']

AVERAGE_VEHICLE_SPEED = 40
MINIMUM_DISTANCE_BETWEEN_DROPS = 1


class Status:
    code = None
    name = None

    def __init__(self, code, name):
        self.code = code
        self.name = name


class UploadJobsStatus(Enum):
    CREATED = Status(200, "Created")
    PROCESSING = Status(600, "Processing")
    CANCELLED = Status(902, "Cancelled")
    SUCCESS = Status(900, "Success")
    COMPLETED = Status(900, "Completed")
    FAIL = Status(901, "Fail")

VALID_JOB_STATUS_CODES = [x.value.code for x in UploadJobsStatus]
VALID_JOB_STATUS_NAMES = [x.value.name for x in UploadJobsStatus]


class PlanningType(Enum):
    SKU_FIXED_PLANNING = "sku-fixed-planning"
    FIXED_PLANNING = "fixed-planning"
    VARIABLE_PLANNING = "variable-planning"
    SKU_VARIABLE_PLANNING = "sku-variable-planning"
    SKU_BIN_PACKING_PLANNING = "sku-bin-packing-planning"
    OPTIMIZATION_PLANNING = "optimization-planning"
    MID_MILE_PLANNING = "mid-mile-planning"
    SEQUENTIAL_PLANNING = "sequential-planning"
    VRP_PLANNING = "vrp-planning"
    BP_MID_MILE_PLANNING = "mid-mile-vehicle-allocation-planning"
    SEQUENTIAL_MID_MILE_PLANNING = "mid-mile-sequential-planning"


class ClientType(Enum):
    TMS = "tms"
    PRIMA = "prima"


VALID_PLANNING_TYPES = [x.value for x in PlanningType]


HERE_API_KEY = os.environ.get("HERE_API_KEY", "Y0x-DkJ66yCSR1WJg_PZEUDcUUxm8Mlzfo0P9WsosHc")
HERE_LOCATION_TTL = int(os.environ.get("HERE_LOCATION_TTL", 7 * 24 * 3600))

class SolverStatus(Enum):
    Success = 'Success'
