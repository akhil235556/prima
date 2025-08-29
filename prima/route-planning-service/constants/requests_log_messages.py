class RequestLogMessages(object):
    REQUEST_INIT = "Received request: {rid}"
    FILE_VALIDATION_INIT = "Initializing File for Validation"
    FILE_VALIDATION_SHEET_INIT = "Started Validating {sheet} Sheet"
    FILE_VALIDATION_SHEET_ERROR = "Found {no_of_errors} error(s) during {validation_type} Validation"
    FILE_VALIDATION_SUCCESS = "File Validated Successfully!"
    UPLOAD_FILE_GS = "Uploading File to Storage"
    REQUEST_FINISHED = "Created Job for Solver"

