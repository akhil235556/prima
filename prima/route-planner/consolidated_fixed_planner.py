from route_planner.vrp.consolidated_fixed_cost_planner.consolidated_fixed_cost_validator import FixedCostUploadValidation

from route_planner.exceptions.exceptions import ValidationError


def set_env_variables():
    import os
    os.environ['PRIMA_SCRIPT_RUN'] = "TRUE"
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "/Users/dishantgupta/work/apps/route-planner/cred.json"


set_env_variables()

import sys

import logging
from route_planner.utils.utils import generate_request_id, get_current_timestamp


logging.basicConfig(level=1)
logger = logging.getLogger(__name__)


if __name__ == '__main__':

    logger.info(sys.argv)
    if len(sys.argv) < 2:
        raise AssertionError('filepath is mandatory')

    start = get_current_timestamp()
    filename = sys.argv[1]
    _rid = generate_request_id()
    try:
        validator = FixedCostUploadValidation(filename, _rid, None)
        resp, status = validator.process()
    except ValidationError as e:
        logger.error(str(e.problems), exc_info=True)
    except Exception as e:
        logger.error(str(e), exc_info=True)

    end = get_current_timestamp()
    logger.info(f"time taken: {(end-start).seconds/60} mins")
