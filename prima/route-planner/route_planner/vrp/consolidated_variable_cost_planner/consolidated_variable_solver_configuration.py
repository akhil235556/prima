from solvers.solver_v1.config import SolverConfigurationV1
from route_planner.utils import env


class ConsolidatedVariableCostSolverConfigDefault:
    PARTIAL_PLANNING = False
    SERVICEABLE_CONSTRAINT = True
    PRIORITY_CONSTRAINT = False
    VEHICLE_WEIGHT_CAPACITY_CONSTRAINT = True
    VEHICLE_VOLUME_CAPACITY_CONSTRAINT = True
    SLA_TIME_WINDOW_CONSTRAINT = True
    OPERATING_TIME_WINDOW_CONSTRAINT = True
    SEARCH_TIME_LIMIT = None
    NODE_DROP_PENALTY = 1000
    WELDED_WEIGHT_CAPACITY_CONSTRAINT = False
    WELDED_VOLUME_CAPACITY_CONSTRAINT = False
    MAX_LENGTH_CONSTRAINT = True
    MAX_NODE_VISITS_CONSTRAINT = True
    MAX_DROP_DISTANCE_CONSTRAINT = True
    MID_MILE_COST = False

class ConsolidatedVariableCostSolverConfigVariables:

    @property
    def partial_planning(self):
        return env.get('SOLVER_CONFIG.CONSOLIDATED_VARIABLE_COST.PARTIAL_PLANNING') or \
               ConsolidatedVariableCostSolverConfigDefault.PARTIAL_PLANNING

    @property
    def serviceable_constraint(self):
        return env.get('SOLVER_CONFIG.CONSOLIDATED_VARIABLE_COST.SERVICEABLE_CONSTRAINT') or \
               ConsolidatedVariableCostSolverConfigDefault.SERVICEABLE_CONSTRAINT

    @property
    def priority_constraint(self):
        return env.get('SOLVER_CONFIG.CONSOLIDATED_VARIABLE_COST.PRIORITY_CONSTRAINT') or \
               ConsolidatedVariableCostSolverConfigDefault.PRIORITY_CONSTRAINT

    @property
    def vehicle_weight_capacity_constraint(self):
        return env.get('SOLVER_CONFIG.CONSOLIDATED_VARIABLE_COST.VEHICLE_WEIGHT_CAPACITY_CONSTRAINT') or \
               ConsolidatedVariableCostSolverConfigDefault.VEHICLE_WEIGHT_CAPACITY_CONSTRAINT

    @property
    def vehicle_volume_capacity_constraint(self):
        return env.get('SOLVER_CONFIG.CONSOLIDATED_VARIABLE_COST.VEHICLE_VOLUME_CAPACITY_CONSTRAINT') or \
               ConsolidatedVariableCostSolverConfigDefault.VEHICLE_VOLUME_CAPACITY_CONSTRAINT

    @property
    def sla_time_window_constraint(self):
        return env.get('SOLVER_CONFIG.CONSOLIDATED_VARIABLE_COST.SLA_TIME_WINDOW_CONSTRAINT') or \
               ConsolidatedVariableCostSolverConfigDefault.SLA_TIME_WINDOW_CONSTRAINT

    @property
    def operating_time_window_constraint(self):
        return env.get('SOLVER_CONFIG.CONSOLIDATED_VARIABLE_COST.OPERATING_TIME_WINDOW_CONSTRAINT') or \
               ConsolidatedVariableCostSolverConfigDefault.OPERATING_TIME_WINDOW_CONSTRAINT

    @property
    def search_time_limit(self):
        return env.get('SOLVER_CONFIG.CONSOLIDATED_VARIABLE_COST.SEARCH_TIME_LIMIT') or \
               ConsolidatedVariableCostSolverConfigDefault.SEARCH_TIME_LIMIT

    @property
    def node_drop_penalty(self):
        return env.get('SOLVER_CONFIG.CONSOLIDATED_VARIABLE_COST.NODE_DROP_PENALTY') or \
               ConsolidatedVariableCostSolverConfigDefault.NODE_DROP_PENALTY

    @property
    def welded_weight_capacity_constraint(self):
        return env.get('SOLVER_CONFIG.CONSOLIDATED_VARIABLE_COST.WELDED_WEIGHT_CAPACITY_CONSTRAINT') or \
               ConsolidatedVariableCostSolverConfigDefault.WELDED_WEIGHT_CAPACITY_CONSTRAINT

    @property
    def welded_volume_capacity_constraint(self):
        return env.get('SOLVER_CONFIG.CONSOLIDATED_VARIABLE_COST.WELDED_VOLUME_CAPACITY_CONSTRAINT') or \
               ConsolidatedVariableCostSolverConfigDefault.WELDED_VOLUME_CAPACITY_CONSTRAINT

    @property
    def max_node_visits_constraint(self):
        return env.get('SOLVER_CONFIG.CONSOLIDATED_VARIABLE_COST.MAX_NODE_VISITS_CONSTRAINT') or \
               ConsolidatedVariableCostSolverConfigDefault.MAX_NODE_VISITS_CONSTRAINT

    @property
    def max_length_constraint(self):
        return env.get('SOLVER_CONFIG.CONSOLIDATED_VARIABLE_COST.MAX_LENGTH_CONSTRAINT') or \
               ConsolidatedVariableCostSolverConfigDefault.MAX_LENGTH_CONSTRAINT

    @property
    def max_drop_distance_constraint(self):
        return env.get('SOLVER_CONFIG.CONSOLIDATED_VARIABLE_COST.MAX_DROP_DISTANCE_CONSTRAINT') or \
               ConsolidatedVariableCostSolverConfigDefault.MAX_DROP_DISTANCE_CONSTRAINT

    @property
    def mid_mile_cost(self):
        return env.get('SOLVER_CONFIG.CONSOLIDATED_VARIABLE_COST.MID_MILE_COST') or \
               ConsolidatedVariableCostSolverConfigDefault.MID_MILE_COST


class ConsolidatedSolverConfigurationV1(object):

    @staticmethod
    def get_default_consolidated_variable_configuration():
        config_vars = ConsolidatedVariableCostSolverConfigVariables()
        config = SolverConfigurationV1()
        config.sku_planning = False
        config.costing_fixed = False
        config.costing_per_km = True
        config.costing_per_kg = True
        config.daily_run = True

        config.partial_planning = config_vars.partial_planning
        config.serviceable_constraint = config_vars.serviceable_constraint
        config.priority_constraint = config_vars.priority_constraint
        config.vehicle_weight_capacity_constraint = config_vars.vehicle_weight_capacity_constraint
        config.vehicle_volume_capacity_constraint = config_vars.vehicle_volume_capacity_constraint
        config.sla_time_window_constraint = config_vars.sla_time_window_constraint
        config.operating_time_window_constraint = config_vars.operating_time_window_constraint
        config.search_time_limit = config_vars.search_time_limit
        config.node_drop_penalty = config_vars.node_drop_penalty
        config.max_length_constraint = config_vars.max_length_constraint
        config.max_node_visits_constraint = config_vars.max_node_visits_constraint
        config.welded_weight_capacity_constraint = config_vars.welded_weight_capacity_constraint
        config.welded_volume_capacity_constraint = config_vars.welded_volume_capacity_constraint
        config.max_drop_distance_constraint = config_vars.max_drop_distance_constraint
        config.mid_mile_cost = config_vars.mid_mile_cost

        # Data Configurations
        config.products_flag = False
        config.priority_flag = False
        config.task_id = False
        config.order_id = True
        return config
