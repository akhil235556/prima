from route_planner.exceptions.exceptions import ValidationError


def set_env_variables():
    import os
    os.environ['PRIMA_SCRIPT_RUN'] = "TRUE"
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "/home/prima/route-planner/cred.json"


set_env_variables()

import sys

from route_planner.vrp.sku_variable_cost_planner import MultiProductVariableUploadValidation
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
        multi_product_validator = MultiProductVariableUploadValidation(filename, _rid, None)
        response = multi_product_validator.process()
    except ValidationError as e:
        logger.error(e.problems, exc_info=True)
    except Exception as e:
        logger.error(str(e), exc_info=True)

    end = get_current_timestamp()
    logger.info(f"time taken: {(end-start).seconds/60} mins")
