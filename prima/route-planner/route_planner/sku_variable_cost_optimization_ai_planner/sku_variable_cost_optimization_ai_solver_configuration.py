from solvers.solver_v3.config import SolverConfigurationV3
from route_planner.utils import env
from route_planner.sku_variable_cost_optimization_ai_planner.utils import get_utc_now


class OptimizationAIConfigDefault:
    # Boolean Constraints
    VEHICLE_LOAD_CAPACITY_CONSTRAINT = True  # not  configured todo
    VEHICLE_VOLUME_CAPACITY_CONSTRAINT = True  # not  configured todo
    VEHICLE_MIN_LOAD_CAPACITY_CONSTRAINT = False  # not  configured todo
    VEHICLE_MIN_VOLUME_CAPACITY_CONSTRAINT = False  # not  configured todo
    SKU_EXCLUSION_CONSTRAINT = True  # not  configured todo

    #  Value
    # VEHICLE_REPEAT_FACTOR: integer and > 0
    VEHICLE_REPEAT_FACTOR = 5
    # INTEGER_MULTIPLIER factor to typecast to float to int (Range: >=1 <INT>)
    INTEGER_MULTIPLIER = 1000
    # Planning Global Start Datetime (Current Datetime)
    GLOBAL_START_DATETIME = get_utc_now()
    # Planning Duration Hours to Calculate Global End Time (168 hours === 1 week)
    PLANNING_DURATION_HOURS = 168



class OptimizationAIConfigVariables:

    @property
    def vehicle_load_capacity_constraint(self):
        return env.get('SOLVER_CONFIG.SKU_FIXED_COST_BIN_PACKING.VEHICLE_LOAD_CAPACITY_CONSTRAINT') or \
               OptimizationAIConfigDefault.VEHICLE_LOAD_CAPACITY_CONSTRAINT

    @property
    def vehicle_volume_capacity_constraint(self):
        return env.get('SOLVER_CONFIG.SKU_FIXED_COST_BIN_PACKING.VEHICLE_LOAD_CAPACITY_CONSTRAINT') or \
               OptimizationAIConfigDefault.VEHICLE_VOLUME_CAPACITY_CONSTRAINT

    @property
    def vehicle_min_load_capacity_constraint(self):
        return env.get('SOLVER_CONFIG.SKU_FIXED_COST_BIN_PACKING.VEHICLE_MIN_WEIGHT_CAPACITY_CONSTRAINT') or \
               OptimizationAIConfigDefault.VEHICLE_MIN_LOAD_CAPACITY_CONSTRAINT

    @property
    def vehicle_min_volume_capacity_constraint(self):
        return env.get('SOLVER_CONFIG.SKU_FIXED_COST_BIN_PACKING.VEHICLE_MIN_VOLUME_CAPACITY_CONSTRAINT') or \
               OptimizationAIConfigDefault.VEHICLE_MIN_VOLUME_CAPACITY_CONSTRAINT

    @property
    def sku_exclusion_constraint(self):
        return env.get('SOLVER_CONFIG.SKU_FIXED_COST_BIN_PACKING.SKU_EXCLUSION_CONSTRAINT') or \
               OptimizationAIConfigDefault.SKU_EXCLUSION_CONSTRAINT

    @property
    def vehicle_repeat_factor(self):
        return env.get('SOLVER_CONFIG.SKU_FIXED_COST_BIN_PACKING.VEHICLE_REPEAT_FACTOR') or \
               OptimizationAIConfigDefault.VEHICLE_REPEAT_FACTOR

    @property
    def integer_multiplier(self):
        return env.get('SOLVER_CONFIG.SKU_FIXED_COST_BIN_PACKING.INTEGER_MULTIPLIER') or \
               OptimizationAIConfigDefault.INTEGER_MULTIPLIER

    @property
    def global_start_datetime(self):
        return OptimizationAIConfigDefault.GLOBAL_START_DATETIME

    @property
    def planning_duration_hours(self):
        return OptimizationAIConfigDefault.PLANNING_DURATION_HOURS



class SkuVariableSolverConfigurationV3(object):

    @staticmethod
    def get_default_sku_variable_optimization_ai_configuration():
        config_vars = OptimizationAIConfigVariables()
        config = SolverConfigurationV3()
        config.vehicle_load_capacity_constraint = config_vars.vehicle_load_capacity_constraint
        config.vehicle_volume_capacity_constraint = config_vars.vehicle_volume_capacity_constraint
        config.vehicle_min_load_capacity_constraint = config_vars.vehicle_min_load_capacity_constraint
        config.vehicle_min_volume_capacity_constraint = config_vars.vehicle_min_volume_capacity_constraint
        config.sku_exclusion_constraint = config_vars.sku_exclusion_constraint
        config.vehicle_repeat_factor = config_vars.vehicle_repeat_factor
        config.integer_multiplier = config_vars.integer_multiplier
        config.global_start_datetime = config_vars.global_start_datetime
        config.planning_duration_hours = config_vars.planning_duration_hours
        return config
