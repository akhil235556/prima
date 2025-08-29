from solvers.solver_v4.config import SolverConfigurationV4
from route_planner.utils import env


class SequentialSolverConfigDefault:
    # Boolean Constraints
    VEHICLE_LOAD_CAPACITY_CONSTRAINT = True
    VEHICLE_VOLUME_CAPACITY_CONSTRAINT = True
    VEHICLE_MIN_LOAD_CAPACITY_CONSTRAINT = True
    VEHICLE_MIN_VOLUME_CAPACITY_CONSTRAINT = True
    SKU_EXCLUSION_CONSTRAINT = True



    #  Value
    # Valid Range: (0,1)
    VEHICLE_MIN_LOAD_CAPACITY_PER_RATIO = 0.05
    # Valid Range: (0,1)
    VEHICLE_MIN_VOLUME_CAPACITY_PER_RATIO = 0.05
    NUM_OF_THREADS = 8
    # VEHICLE_REPEAT_FACTOR: integer and > 0
    VEHICLE_REPEAT_FACTOR = 5
    # INTEGER_MULTIPLIER factor to typecast to float to int (Range: >=1 <INT>)
    INTEGER_MULTIPLIER = 1
    SEQUENTIAL_BOOL = True


class SequentialSolverConfigVariables:

    @property
    def vehicle_load_capacity_constraint(self):
        return env.get('SOLVER_CONFIG.SEQUENTIAL_BIN_PACKING.VEHICLE_LOAD_CAPACITY_CONSTRAINT') or \
               SequentialSolverConfigDefault.VEHICLE_LOAD_CAPACITY_CONSTRAINT

    @property
    def vehicle_volume_capacity_constraint(self):
        return env.get('SOLVER_CONFIG.SEQUENTIAL_BIN_PACKING.VEHICLE_LOAD_CAPACITY_CONSTRAINT') or \
               SequentialSolverConfigDefault.VEHICLE_VOLUME_CAPACITY_CONSTRAINT

    @property
    def vehicle_min_load_capacity_constraint(self):
        return env.get('SOLVER_CONFIG.SEQUENTIAL_BIN_PACKING.VEHICLE_MIN_WEIGHT_CAPACITY_CONSTRAINT') or \
               SequentialSolverConfigDefault.VEHICLE_MIN_LOAD_CAPACITY_CONSTRAINT

    @property
    def vehicle_min_load_capacity_per_ratio(self):
        return env.get('SOLVER_CONFIG.SEQUENTIAL_BIN_PACKING.VEHICLE_MIN_WEIGHT_CAPACITY_PER_RATIO') or \
               SequentialSolverConfigDefault.VEHICLE_MIN_LOAD_CAPACITY_PER_RATIO

    @property
    def vehicle_min_volume_capacity_constraint(self):
        return env.get('SOLVER_CONFIG.SEQUENTIAL_BIN_PACKING.VEHICLE_MIN_VOLUME_CAPACITY_CONSTRAINT') or \
               SequentialSolverConfigDefault.VEHICLE_MIN_VOLUME_CAPACITY_CONSTRAINT

    @property
    def vehicle_min_volume_capacity_per_ratio(self):
        return env.get('SOLVER_CONFIG.SEQUENTIAL_BIN_PACKING.VEHICLE_MIN_VOLUME_CAPACITY_PER_RATIO') or \
               SequentialSolverConfigDefault.VEHICLE_MIN_VOLUME_CAPACITY_PER_RATIO

    @property
    def sku_exclusion_constraint(self):
        return env.get('SOLVER_CONFIG.SEQUENTIAL_BIN_PACKING.SKU_EXCLUSION_CONSTRAINT') or \
               SequentialSolverConfigDefault.SKU_EXCLUSION_CONSTRAINT

    @property
    def num_of_threads(self):
        return env.get('SOLVER_CONFIG.SEQUENTIAL_BIN_PACKING.NUM_OF_THREADS') or \
               SequentialSolverConfigDefault.NUM_OF_THREADS

    @property
    def vehicle_repeat_factor(self):
        return env.get('SOLVER_CONFIG.SEQUENTIAL_BIN_PACKING.VEHICLE_REPEAT_FACTOR') or \
               SequentialSolverConfigDefault.VEHICLE_REPEAT_FACTOR

    @property
    def integer_multiplier(self):
        return env.get('SOLVER_CONFIG.SEQUENTIAL_BIN_PACKING.INTEGER_MULTIPLIER') or \
               SequentialSolverConfigDefault.INTEGER_MULTIPLIER

    @property
    def sequential_bool(self):
        return env.get('SOLVER_CONFIG.SEQUENTIAL_BIN_PACKING.SEQUENTIAL_BOOL') or \
               SequentialSolverConfigDefault.SEQUENTIAL_BOOL


class SequentialSolverConfigurationV4(object):

    @staticmethod
    def get_default_sequential_configuration():
        config_vars = SequentialSolverConfigVariables()
        config = SolverConfigurationV4()
        config.vehicle_load_capacity_constraint = config_vars.vehicle_load_capacity_constraint
        config.vehicle_volume_capacity_constraint = config_vars.vehicle_volume_capacity_constraint
        config.vehicle_min_load_capacity_constraint = config_vars.vehicle_min_load_capacity_constraint
        config.vehicle_min_load_capacity_per_ratio = config_vars.vehicle_min_load_capacity_per_ratio
        config.vehicle_min_volume_capacity_constraint = config_vars.vehicle_min_volume_capacity_constraint
        config.vehicle_min_volume_capacity_per_ratio = config_vars.vehicle_min_volume_capacity_per_ratio
        config.sku_exclusion_constraint = config_vars.sku_exclusion_constraint
        config.num_of_threads = config_vars.num_of_threads
        config.vehicle_repeat_factor = config_vars.vehicle_repeat_factor
        config.integer_multiplier = config_vars.integer_multiplier
        config.sequential_bool = config_vars.sequential_bool
        return config
