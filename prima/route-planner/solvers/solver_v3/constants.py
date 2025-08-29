import os
import sys
from enum import Enum


class SolvingMode(Enum):
    SOLVE = "DEFAULT_SOLVE"
    VALIDATE_ONLY = "VALIDATE_ONLY"
    GET_INFEASIBLE_SHIPMENTS = "DETECT_SOME_INFEASIBLE_SHIPMENTS"


class SearchMode(Enum):
    FIRST_GOOD_SOLUTION = "RETURN_FAST"
    CONSUME_ALL_TIME = "CONSUME_ALL_AVAILABLE_TIME"


class Priority:
    code = None
    name = None
    factor = None

    def __init__(self, code, name, factor):
        self.code = code
        self.name = name
        self.factor = factor


class PriorityMap(Enum):
    HIGHEST = Priority(1, "highest", 0)  # infinite priority
    SECOND_HIGHEST = Priority(2, "second_highest", 10)
    CRITICAL = Priority(3, "critical", 1)
    MEDIUM = Priority(4, "medium", 0.2)
    LOW = Priority(5, "low", 0.01)
    VERY_LOW = Priority(6, "very_low", 0.001)


VALID_PRIORITY_CODES = [x.value.code for x in PriorityMap]
PRIORITY_TO_PENALTY_MAP = {x.value.code: x.value.factor for x in PriorityMap}

UTC_FORMAT = '%Y-%m-%dT%H:%M:%SZ'
