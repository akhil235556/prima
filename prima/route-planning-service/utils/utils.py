import uuid
from datetime import datetime, timedelta
import logging

import pandas as pd
import pytz
from dateutil import tz
from constants.constants import PlanningType, Engine, SubEngine
from exceptions.exceptions import AppException
from werkzeug.exceptions import BadRequest

LOGGER = logging.getLogger(__name__)

def generate_request_id():
    return str(uuid.uuid4()).replace('-', '')


def get_current_timestamp():
    return datetime.now(tz=tz.gettz('Asia/Kolkata'))


def dataframe_not_empty(df_column):
    empty_list = df_column.isnull().values.any()
    if empty_list:
        # dataframe has nan values
        return False
    else:
        return True


def get_now() -> datetime:
    return datetime.now(pytz.timezone('Asia/Calcutta'))


def get_eta(now: datetime, time_taken: int, time_format: str = '%d/%m/%Y %H:%M'):
    eta = now + timedelta(hours=time_taken)
    eta = eta.strftime(time_format)
    return eta


def type_cast_to_str(df: pd.DataFrame, str_type_cols: list) ->None:
    if df:
        df_columns = df.columns.to_list()
        for col_name in str_type_cols:
            if col_name in df_columns:
                col = df[col_name].copy().dropna()
                col = col.apply(str)
                indexes = col.index
                df[col_name].iloc[indexes] = col


def remove_empty_keys(data_dict):
    _dict = {}
    for k, v in data_dict.items():
        if v:
            _dict[k] = v
    data_dict = _dict
    return data_dict

def solver_mapping(solver_list):
    a = dict()
    for solver in solver_list:
        if solver == PlanningType.VARIABLE_PLANNING.value.name:
            engine = Engine.OPTIMUS_CONSOLIDATED_LOAD.value
            if not a.get(engine):
                a[engine] = list()
            a[engine].append(SubEngine.VARIABLE_COST.value)

        if solver == PlanningType.FIXED_PLANNING.value.name:
            engine = Engine.OPTIMUS_CONSOLIDATED_LOAD.value
            if not a.get(engine):
                a[engine] = list()
            a[engine].append(SubEngine.FIXED_COST.value)

        if solver == PlanningType.MID_MILE_PLANNING.value.name:
            engine = Engine.OPTIMUS_CONSOLIDATED_LOAD.value
            if not a.get(engine):
                a[engine] = list()
            a[engine].append(SubEngine.MID_MILE.value)

        if solver == PlanningType.SKU_FIXED_PLANNING.value.name:
            engine = Engine.OPTIMUS_SKU_BASED.value
            if not a.get(engine):
                a[engine] = list()
            a[engine].append(SubEngine.FIXED_COST.value)

        if solver == PlanningType.SKU_VARIABLE_PLANNING.value.name:
            engine = Engine.OPTIMUS_CONSOLIDATED_LOAD.value
            if not a.get(engine):
                a[engine] = list()
            a[engine].append(SubEngine.VARIABLE_COST.value)

        if solver == PlanningType.SKU_BIN_PACKING_PLANNING.value.name:
            engine = Engine.MAXIMO.value
            if not a.get(engine):
                a[engine] = list()
            a[engine].append(SubEngine.VEHICLE_ALLOCATION.value)

        if solver == PlanningType.VRP_PLANNING.value.name:
            engine = Engine.MAXIMO.value
            if not a.get(engine):
                a[engine] = list()
            a[engine].append(SubEngine.VRP.value)

        if solver == PlanningType.SEQUENTIAL_PLANNING.value.name:
            engine = Engine.MAXIMO.value
            if not a.get(engine):
                a[engine] = list()
            a[engine].append(SubEngine.SEQUENTIAL_VRP.value)

        if solver == PlanningType.BP_MID_MILE_PLANNING.value.name:
            engine = Engine.MID_MILE_PLANNING.value
            if not a.get(engine):
                a[engine] = list()
            a[engine].append(SubEngine.VEHICLE_ALLOCATION.value)

        if solver == PlanningType.SEQUENTIAL_MID_MILE_PLANNING.value.name:
            engine = Engine.MID_MILE_PLANNING.value
            if not a.get(engine):
                a[engine] = list()
            a[engine].append(SubEngine.SEQUENTIAL_VRP.value)

        if solver == PlanningType.OPTIMIZATION_PLANNING.value.name:
            engine = Engine.OPTIMUS_PRIMA.value
            if not a.get(engine):
                a[engine] = list()
            a[engine].append(SubEngine.CLUBBER_V0.value)

    return a


def engine_subengine_to_solver_mapping(engine, sub_engine):
    validate_engine_sub_engine(engine, sub_engine)

    if engine == Engine.OPTIMUS_CONSOLIDATED_LOAD.value and sub_engine == SubEngine.VARIABLE_COST.value:
        solver_name = PlanningType.VARIABLE_PLANNING.value.name
        sample_file = PlanningType.VARIABLE_PLANNING.value.sample_file

    elif engine == Engine.OPTIMUS_CONSOLIDATED_LOAD.value and sub_engine == SubEngine.FIXED_COST.value:
        solver_name = PlanningType.FIXED_PLANNING.value.name
        sample_file = PlanningType.FIXED_PLANNING.value.sample_file

    elif engine == Engine.OPTIMUS_CONSOLIDATED_LOAD.value and sub_engine == SubEngine.MID_MILE.value:
        solver_name = PlanningType.MID_MILE_PLANNING.value.name
        sample_file = PlanningType.MID_MILE_PLANNING.value.sample_file

    elif engine == Engine.OPTIMUS_SKU_BASED.value and sub_engine == SubEngine.FIXED_COST.value:
        solver_name = PlanningType.SKU_FIXED_PLANNING.value.name
        sample_file = PlanningType.SKU_FIXED_PLANNING.value.sample_file

    elif engine == Engine.OPTIMUS_CONSOLIDATED_LOAD.value and sub_engine == SubEngine.VARIABLE_COST.value:
        solver_name = PlanningType.SKU_VARIABLE_PLANNING.value.name
        sample_file = PlanningType.SKU_VARIABLE_PLANNING.value.sample_file

    elif engine == Engine.MAXIMO.value and sub_engine == SubEngine.VEHICLE_ALLOCATION.value:
        solver_name = PlanningType.SKU_BIN_PACKING_PLANNING.value.name
        sample_file = PlanningType.SKU_BIN_PACKING_PLANNING.value.sample_file

    elif engine == Engine.MAXIMO.value and sub_engine == SubEngine.VRP.value:
        solver_name = PlanningType.VRP_PLANNING.value.name
        sample_file = PlanningType.VRP_PLANNING.value.sample_file

    elif engine == Engine.MAXIMO.value and sub_engine == SubEngine.SEQUENTIAL_VRP.value:
        solver_name = PlanningType.SEQUENTIAL_PLANNING.value.name
        sample_file = PlanningType.SEQUENTIAL_PLANNING.value.sample_file

    elif engine == Engine.MID_MILE_PLANNING.value and sub_engine == SubEngine.VEHICLE_ALLOCATION.value:
        solver_name = PlanningType.BP_MID_MILE_PLANNING.value.name
        sample_file = PlanningType.BP_MID_MILE_PLANNING.value.sample_file

    elif engine == Engine.MID_MILE_PLANNING.value and sub_engine == SubEngine.SEQUENTIAL_VRP.value:
        solver_name = PlanningType.SEQUENTIAL_MID_MILE_PLANNING.value.name
        sample_file = PlanningType.SEQUENTIAL_MID_MILE_PLANNING.value.sample_file

    elif engine == Engine.OPTIMUS_PRIMA.value and sub_engine == SubEngine.CLUBBER_V0.value:
        solver_name = PlanningType.OPTIMIZATION_PLANNING.value
        sample_file = PlanningType.OPTIMIZATION_PLANNING.value.sample_file

    else:
        raise AppException('Invalid Engine/Sub-Engine Combination')

    return solver_name, sample_file


def enum_contains(enum_type, value):
    try:
        enum_type(value)
    except ValueError:
        return False
    return True


def validate_engine_sub_engine(engine, sub_engine):
    if not engine or not sub_engine:
        LOGGER.info(f"Not able to find engine {engine} and sub_engine {sub_engine}")
        raise AppException(f'Not able to find solver name')
    if not enum_contains(Engine, engine) and not enum_contains(SubEngine, sub_engine):
        raise BadRequest("Invalid Engine/Sub-Engine param provided")


def list_of_dicts_to_list(list_of_dicts, value):
    y = [x[value] for x in list_of_dicts]
    return y
