class AppException(Exception):
    code = 400

    def __init__(self, message=None, problems=[]):
        self.message = message
        self.problems = problems
        super().__init__(self.message)

    @property
    def exception_type(self):
        return "AppException"


class ValidationError(AppException):
    code = 400

    def __init__(self, problems=[], message="Validation Error in the Uploaded File"):
        self.problems = problems
        self.message = message
        # super().__init__(self.message)

    @property
    def exception_type(self):
        return "Validation Error"


class InvalidRequest(AppException):
    code = 400

    def __init__(self, problems=[], message="Invalid Request", status_code=None):
        self.message = message
        self.problems = problems
        self.code = status_code if status_code is not None else InvalidRequest.code
        super().__init__(self.message)

    @property
    def exception_type(self):
        return "Invalid Request"


class InvalidHeader(AppException):
    code = 400

    def __init__(self, problems=[], message="Invalid Headers"):
        self.message = message
        self.problems = problems
        super().__init__(self.message)

    @property
    def exception_type(self):
        return "Invalid Header"

class InvalidTimeWindow(ValidationError):
    code = 400

    def __init__(self, message, problems=None):
        self.message = message
        self.problems = problems or []
        super().__init__(self.problems, self.message)


class SolverException(AppException):
    code = 400
    def __init__(self, message, problems=None):
        self.message = message
        self.problems = problems or []
        super().__init__(self.problems, self.message)

    @property
    def exception_type(self):
        return "Solver Exception"


class DatabaseException(AppException):
    code = 400

    def __init__(self, message):
        self.message = message
        super().__init__(self.message)

    @property
    def exception_type(self):
        return "Database Exception"

class RequestTerminationException(Exception):
    pass

class RequestPendingException(Exception):
    pass

class ReverseGeocodingException(AppException):
    code = 400

    def __init__(self, message, problems=None):
        self.message = message
        self.problems = problems or []
        super().__init__(self.problems, self.message)

    @property
    def exception_type(self):
        return "Reverse Geocoding Exception"

class PubSubMessageAckException(Exception):
    pass

class RequestAlreadyProcessingError(Exception):
    pass
