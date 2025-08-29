def set_env_variables():
    import os
    os.environ['PRIMA_SCRIPT_RUN'] = "TRUE"
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "cred.json"


set_env_variables()

import sys
from route_planner.bin_packing.sequential_planner.bin_packing_validator import SequentialUploadValidation
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
        multi_product_validator = SequentialUploadValidation(filename, _rid, None)
        response = multi_product_validator.process()
        logger.info(f"Response: {response}")
    except Exception as e:
        logger.error(str(e), exc_info=True)

    end = get_current_timestamp()
    logger.info(f"time taken: {(end-start).seconds/60} mins")
