from enum import Enum
import os
import sys

UPLOAD_FOLDER = 'tmp'
MAX_CONTENT_LENGTH = 16 * 1024 * 1024
CHUNK_SIZE = 1024 * 1024
ALGORITHMS = ["RS256"]

WELL_KNOWN_JSON_URL = os.environ.get(
    "WELL_KNOWN_JSON_URL",
    "https://storage.googleapis.com/gobolt-assets/auth0/.well-known/gobolt-dev/gobolt-dev-jwks.json")

PROXY_PASS_REQUEST_HEADERS = ["file-extention", "job-name"]

class Codes(Enum):
    PLANNING = "PLA"


class PlanningConfig(Enum):
    INITIATED = "INITIATED"
    IN_PROCESS = "IN_PROCESS"
    COMPLETED = "COMPLETED"


API_AUDIENCE = os.environ.get("API_AUDIENCE", "https://google_endpoints/")
AUTH0_DOMAIN = os.environ.get("AUTH0_DOMAIN", "gobolt-dev.eu.auth0.com")


class FileUploadClientInfo(object):
    HOST = "BULK_UPLOAD_GRPC_HOST"
    PORT = "BULK_UPLOAD_GRPC_PORT"

# For MimiType File Extension check
VALID_FILE_EXTENSIONS = [".xlsx"]

VALID_SHEET_NAMES = ["Vehicles", "Task", "Products"]
CONSOLIDATED_FIXED_COST_VALID_SHEET_NAMES = ["Vehicles", "Task"]
CONSOLIDATED_VARIABLE_COST_VALID_SHEET_NAMES = ["Vehicles", "Task"]

# Google Storage

DEFAULT_FILE_LNK_EXPIRY = 1
class GoogleStorageDetails(object):
    BUCKET = "GS_BUCKET_NAME"
    PROJECT_ID = "GS_PROJECT_ID"
    PREFIX = "GS_PREFIX"


NUMBER_DTYPE_KIND = ['f', 'i']
OBJECT_DTYPE_KIND = ['O']

MAX_INT = sys.maxsize/2

VALID_UOM_TYPE_LIST = ['kg', 'cbm']

AVERAGE_VEHICLE_SPEED = 40

SAMPLE_FILE_BASE_PATH = "samples/Prima"

WELDED_TAG_NAME = os.environ.get("WELDED_TAG_NAME", "welded")

WELDED_TAG_UTILISATION_PERCENTAGE_UB = os.environ.get("WELDED_TAG_UTILISATION_PERCENTAGE_UB", 65)

SAMPLE_FILE_MAP = {
    "consolidated_variable": "consolidated_load_variable_planning.zip",
    "consolidated_fixed": "consolidated_load_fixed_cost_planning.zip",
    "sku_variable": "sku_based_variable_planning.zip",
    "sku_fixed": "sku_based_fixed_cost_planning.zip",
    "sku_fixed_bin_packing": "sku_based_fixed_cost_bin-packing_planning.zip",
    "optimization_planning": "optimization_planning.zip",
    "mid_mile_planning": "mid_mile_planning.zip",
    "mid-mile-sequential-planning": "mid-mile-sequential-planning.zip"
}


class SolverInfo(object):
    name = None
    sample_file = None

    def __init__(self, name, sample_file):
        self.name = name
        self.sample_file = sample_file


class PlanningType(Enum):
    SKU_FIXED_PLANNING = SolverInfo("sku-fixed-planning", "sku_based_fixed_cost_planning.zip")
    FIXED_PLANNING = SolverInfo("fixed-planning", "consolidated_load_fixed_cost_planning.zip")
    VARIABLE_PLANNING = SolverInfo("variable-planning", "consolidated_load_variable_planning.zip")
    SKU_BIN_PACKING_PLANNING = SolverInfo("sku-bin-packing-planning", "sku_based_fixed_cost_bin-packing_planning.zip")
    OPTIMIZATION_PLANNING = SolverInfo('optimization-planning', "optimization-planning.zip")
    SKU_VARIABLE_PLANNING = SolverInfo("sku-variable-planning", "sku_based_variable_planning.zip")
    MID_MILE_PLANNING = SolverInfo('mid-mile-planning', "mid_mile_planning.zip")
    SEQUENTIAL_PLANNING = SolverInfo('sequential-planning', "mid-mile-sequential-planning.zip")
    VRP_PLANNING = SolverInfo('vrp-planning', "mid-mile-sequential-planning.zip")
    BP_MID_MILE_PLANNING = SolverInfo("mid-mile-vehicle-allocation-planning", "mid-mile-sequential-planning.zip")
    SEQUENTIAL_MID_MILE_PLANNING = SolverInfo("mid-mile-sequential-planning", "mid-mile-sequential-planning.zip")


class Engine(Enum):
    OPTIMUS_CONSOLIDATED_LOAD = "Optimus_Consolidated Load"
    OPTIMUS_SKU_BASED = "Optimus_SKU based"
    MAXIMO = "Maximo"
    MID_MILE_PLANNING = "Mid Mile Planning"
    OPTIMUS_PRIMA = "Optimus Prime"

    @classmethod
    def has_member_key(cls, key):
        return key in cls.__members__


class SubEngine(Enum):
    VARIABLE_COST = "Variable Cost"
    FIXED_COST = "Fixed Cost"
    MID_MILE = "Mid Mile"
    VEHICLE_ALLOCATION = "Vehicle Allocation"
    VRP = "VRP"
    SEQUENTIAL_VRP = "Sequential VRP"
    CLUBBER_V0 = "Clubber V0"

    @classmethod
    def has_member_key(cls, key):
        return key in cls.__members__


VALID_PLANNING_TYPES = [x.value for x in PlanningType]


class Status:
    code = None
    name = None

    def __init__(self, code, name):
        self.code = code
        self.name = name


class UploadJobsStatus(Enum):
    CREATED = Status(200, "Created")
    PENDING = Status(400, "Pending")
    PROCESSING = Status(600, "Processing")
    SUCCESS = Status(900, "Success")
    FAIL = Status(901, "Failed")
    CANCELLED = Status(902, "Cancelled")
    COMPLETED = Status(900, "Completed")


VALID_JOB_STATUS_CODES = [x.value.code for x in UploadJobsStatus]
VALID_JOB_STATUS_NAMES = [x.value.name for x in UploadJobsStatus]
JOB_STATUS_CODE_NAME_MAP = {x.value.code: x.value.name for x in UploadJobsStatus}

DEFAULT_PAGE = 1
DEFAULT_PAGE_SIZE = 25

class ClientType(Enum):
    TMS = "tms"
    PRIMA = "prima"


engine_subengine_map = {
    Engine.OPTIMUS_CONSOLIDATED_LOAD.value: [SubEngine.VARIABLE_COST.value, SubEngine.FIXED_COST.value, SubEngine.MID_MILE.value],
    Engine.OPTIMUS_SKU_BASED.value: [SubEngine.VARIABLE_COST.value, SubEngine.FIXED_COST.value],
    Engine.MAXIMO.value: [SubEngine.VEHICLE_ALLOCATION.value, SubEngine.VRP.value, SubEngine.SEQUENTIAL_VRP.value],
    Engine.MID_MILE_PLANNING.value: [SubEngine.VEHICLE_ALLOCATION.value, SubEngine.VRP.value, SubEngine.SEQUENTIAL_VRP.value],
    Engine.OPTIMUS_PRIMA.value: [SubEngine.CLUBBER_V0.value],
}
