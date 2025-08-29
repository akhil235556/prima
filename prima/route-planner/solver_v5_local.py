
def set_env_variables():
    import os
    os.environ["PRIMA_SCRIPT_RUN"] = "TRUE"
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "cred.json"


set_env_variables()

import sys

from route_planner.exceptions.exceptions import ValidationError
import logging
from route_planner.utils.utils import generate_request_id, get_current_timestamp
from route_planner.kohler.bin_packing_mid_mile.bin_packing_mid_mile_validator import BPMidMileUploadValidation



logging.basicConfig(level=1)
logger = logging.getLogger(__name__)



if __name__ == '__main__':

    logger.info(sys.argv)
    if len(sys.argv) < 2:
        raise AssertionError("filepath is mandatory")

    start = get_current_timestamp()
    filename = sys.argv[1]
    _rid = generate_request_id()
    try:
        validator = BPMidMileUploadValidation(filename, _rid, None)
        # Corrected unpacking to handle 7 return values
        sequential_data, summary_df, output_df, aggregated_df, vehicles_df, confusion_matrix_df, status = validator.process_main()
    except ValidationError as e:
        logger.error(e.problems, exc_info=True)
    except Exception as e:
        logger.error(str(e), exc_info=True)

    end = get_current_timestamp()
    logger.info(f"time taken: {(end - start).seconds / 60} mins")


