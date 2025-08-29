class RequestLogMessages(object):

    REQUEST_INIT = "Initializing Solver for Planning"
    SOLVER_INIT = "Solver Initialization for Task: {total_task}, Vehicles: {total_vehicles}"
    SOLVER_SUCCESS = "Solver Successfully Executed for ({from_city}, {to_city})"
    SOLVER_FAIL = "Solver raised error message: {error_message}"
    REQUEST_FINISH = "Solver finished executing request: {rid}, Total errors: {count_errors}"
