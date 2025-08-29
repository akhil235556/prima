from route_planner.utils import logging
from route_planner.constants.app_constants import MAX_INT
import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)


def vehicle_multiplier(_vehicles: pd.DataFrame, _orders: pd.DataFrame, return_df: bool, occurrence_factor=2, occurrence_overwrite_value=1):
    """
    To Calculate and Apply Vehicle repetition Factor

    for each vehicle_type:
      1. A: Total_Load_Of_All_Orders / Vehicle_Load_Capacity
         B: Total_Volume_Of_All_Orders / Vehicle_Volume_Capacity
         C: no_of_vehicles(defined by user), default_value = MAX_INT
         D: max(ceil(A),ceil(B))
      2. Sort vehicles on basis of fixed cost [Ascending]
      3. constant occurance_factor = 2
         n = occurrence_factor
         if a value in D occurs more than once:
          then,
          consider first n occurrences and overwrite rest with 1
    then
    vehicle_repeat_factor = min(C, D)

    :param _vehicles: vehicles dataframe
    :param _orders: orders dataframe
    :param return_df: if True return repeated vehicles Dataframe else just return computed No. Of. Vehicles Column
    :param occurrence_factor: number of occurrences to consider
    :param occurrence_overwrite_value: overwrite value for the remaining occurrences
    :return:
    """

    orders = _orders.copy()
    vehicles = _vehicles.copy()

    total_load = orders['load'].sum()
    total_volume = orders['volume'].sum()

    # logger.debug(f"Total Load: {total_load}, Total Volume: {total_volume}")

    A = total_load / vehicles['capacity'].astype('float')
    A = A.apply(np.ceil)

    B = total_volume / vehicles['volumetric_capacity']
    B = B.apply(np.ceil)

    C = vehicles['num_vehicles'].fillna(MAX_INT)

    df = pd.DataFrame({"vehicle_index": vehicles['vehicle_index'], "fixed_cost": vehicles['fixed_charges'],"A": A, "B": B, "C": C})

    df["D"] = df[["A", "B"]].max(axis=1)

    # sort df on fixed_cost
    df = df.sort_values('fixed_cost', ascending=True)

    # consider first n occurrences and overwrite rest with 1, where n = occurrence_factor
    D_unique_value_counts = df['D'].value_counts()

    D_unique = D_unique_value_counts[D_unique_value_counts > occurrence_factor].index.to_list()

    for unique_value in D_unique:
        remaining_occurrences = df[(df['D']==unique_value)].iloc[occurrence_factor:, :]
        if not remaining_occurrences.empty:
            remaining_occurrences['D'] = occurrence_overwrite_value
            df.loc[remaining_occurrences.index] = remaining_occurrences

    # logger.debug(f"vehicle_multiplier : df : {df}")

    vehicle_repeat_factor = df[["C", "D"]].min(axis=1)
    logger.info(f"vehicle_multiplier : vehicle_repeat_factor : {vehicle_repeat_factor.to_list()}")

    vehicles['num_vehicles'] = vehicle_repeat_factor

    if not return_df:
        return vehicles['num_vehicles']

    # repeat vehicles, set _VEHICLE_REPEAT_FACTOR = 1 to retain original no. of vehicles

    # Repeat rows on basis of 'No. of vehicles' column
    return vehicles.reindex(vehicles.index.repeat(vehicles['num_vehicles'])).reset_index(drop=True)