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
        sequential_validator = SequentialUploadValidation(filename, _rid, None)
        response = sequential_validator.process()
        details = response[0].get('details')
        routes = details.pop('routes')
        logger.info(f"Response: details: {details}")
    except Exception as e:
        logger.error(str(e), exc_info=True)
        print("\n\n")
        if hasattr(e, 'problems'):
            problems = (e.problems)
            for problem in problems:
                print(f"{problem.get('row_number')} : {problem.get('message')} : {problem.get('sheet')} ")

    end = get_current_timestamp()
    logger.info(f"time taken: {(end-start).seconds/60} mins")
