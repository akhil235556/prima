import logging
import datetime

from db.dao.requests_logs import RequestsLogDao
from utils.utils import get_current_timestamp

logger = logging.getLogger(__name__)


class RequestLog(object):

    def __init__(self, rid):
        self._rid = rid

    def write_log(self, log_message):
        model_dict = dict(
            request_id=self._rid,
            log_message=log_message,
            event_time=get_current_timestamp()
            )
        dao = RequestsLogDao()
        resp = dao.insert(model_dict)
        resp = resp[0]
        logger.info(f"requests_log updated with: request_id: {resp.get('request_id')}, log_message: {resp.get('log_message')}")
