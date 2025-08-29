class AppException(Exception):
    code = 400

    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


class DatabaseException(Exception):
    code = 400

    def __init__(self, message):
        self.message = message
        super().__init__(self.message)
