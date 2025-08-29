class AppException(Exception):
    pass


class UserException(Exception):
    pass


class ValidationException(AppException):
    pass


class NoRecordsFound(AppException):
    pass


class DatabaseException(AppException):
    pass


class ClientPlanningConfigDoesNotExist(AppException):
    pass
