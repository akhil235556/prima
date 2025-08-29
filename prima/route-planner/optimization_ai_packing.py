def set_env_variables():
    import os
    os.environ['PRIMA_SCRIPT_RUN'] = "TRUE"
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "cred.json"


set_env_variables()

import sys
from route_planner.sku_variable_cost_optimization_ai_planner.sku_variable_cost_optimization_ai_validator import OptimizationAIUploadValidation
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
        multi_product_validator = OptimizationAIUploadValidation(filename, _rid, None)
        response = multi_product_validator.process()
        logger.info(f"Response: {response}")
    except Exception as e:
        logger.error(str(e), exc_info=True)
        if hasattr(e, 'problems'):
            problems = (e.problems)
            for problem in problems:
                print(f"{problem.get('row_number')} : {problem.get('message')} : {problem.get('sheet')} ")



    end = get_current_timestamp()
    logger.info(f"time taken: {(end-start).seconds/60} mins")
