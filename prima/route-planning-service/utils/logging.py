import logging
import threading
from utils.utils import generate_request_id

logging.basicConfig(level=1)


def getLogger(name):
    logging.basicConfig(level=1)
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    logger.propagate = False
    handler = _CustomLogHandler()
    handler_classes = [x.__class__ for x in logger.handlers]
    if handler.__class__ not in handler_classes:
        handler.setFormatter(_CustomLogManager.get_formatter())
        logger.addHandler(handler)
    custom_logger = CustomLogger(name, logger)
    return custom_logger


class CustomLogger(object):

    name = None
    logger = None

    def __init__(self, name, logger):
        self.name = name
        self.logger = logger

    @property
    def adapter(self):
        return logging.LoggerAdapter(self.logger, extra=_CustomLogManager.get_extra())

    @property
    def request_id(self):
        return _CustomLogManager.get_extra().get("request_id")

    def info(self, *args, **kwargs):
        self.adapter.info(*args, **kwargs)

    def error(self, *args, **kwargs):
        self.adapter.error(*args, **kwargs)

    def warning(self, *args, **kwargs):
        self.adapter.warning(*args, **kwargs)

    def debug(self, *args, **kwargs):
        self.adapter.debug(*args, **kwargs)


class _CustomLogHandler(logging.StreamHandler):
    pass


class _CustomLogManager(object):

    @staticmethod
    def get_extra():
        thread = threading.current_thread()
        extra = dict(request_id=None)
        try:
            extra['request_id'] = thread.request_id
        except AttributeError as e:
            pass
        return extra

    @staticmethod
    def set_extra(request_id):
        thread = threading.current_thread()
        thread.request_id = request_id

    @staticmethod
    def get_formatter():
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(threadName)s - %(request_id)s - %(message)s')
        return formatter


# decorator to add context to thread to enrich logging
def context_logging(func):

    def set_context_in_thread(*args, **kwargs):
        request_id = generate_request_id()
        _CustomLogManager.set_extra(request_id)
        return func(rid=request_id, *args, **kwargs)

    # Renaming the function name:
    set_context_in_thread.__name__ = func.__name__
    return set_context_in_thread


__all__ = ['CustomLogger', 'getLogger', 'context_logging']
