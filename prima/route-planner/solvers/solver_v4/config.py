import json


class SolverConfigurationV4(object):
    vehicle_load_capacity_constraint = None
    vehicle_volume_capacity_constraint = None
    vehicle_min_load_capacity_constraint = None
    vehicle_min_load_capacity_per_ratio = None
    vehicle_min_volume_capacity_constraint = None
    vehicle_min_volume_capacity_per_ratio = None
    sku_exclusion_constraint = None
    vehicle_repeat_factor = None
    num_of_threads = None
    integer_multiplier = None
    sequential_bool = None

    def __str__(self):
        return json.dumps({
            "vehicle_load_capacity_constraint": self.vehicle_load_capacity_constraint,
            "vehicle_volume_capacity_constraint": self.vehicle_volume_capacity_constraint,
            "vehicle_min_load_capacity_constraint": self.vehicle_min_load_capacity_constraint,
            "vehicle_min_load_capacity_per_ratio": self.vehicle_min_load_capacity_per_ratio,
            "vehicle_min_volume_capacity_constraint": self.vehicle_min_volume_capacity_constraint,
            "vehicle_min_volume_capacity_per_ratio": self.vehicle_min_volume_capacity_per_ratio,
            "sku_exclusion_constraint": self.sku_exclusion_constraint,
            "vehicle_repeat_factor": self.vehicle_repeat_factor,
            "num_of_threads": self.num_of_threads,
            'integer_multiplier': self.integer_multiplier,
            'sequential_bool': self.sequential_bool
        })

class SolverConfigurationTSP(object):
    costing_per_km = None
    costing_per_kg = None
    costing_fixed = None
    partial_planning = None
    serviceable_constraint = None
    sku_planning = None
    priority_constraint = None
    vehicle_weight_capacity_constraint = None
    vehicle_volume_capacity_constraint = None
    sla_time_window_constraint = None
    operating_time_window_constraint = None
    search_time_limit = None
    node_drop_penalty = None
    products_flag = None
    priority_flag = None
    task_id = None
    order_id = None
    max_length_constraint = None
    max_node_visits_constraint = None
    welded_weight_capacity_constraint = None
    welded_volume_capacity_constraint = None
    daily_run = None
    max_drop_distance_constraint = None
    mid_mile_cost = None
    sequential_bool = None

    def __str__(self):
        return json.dumps({
            "sku_planning": self.sku_planning,
            "partial_planning": self.partial_planning,
            "costing_fixed": self.costing_fixed,
            "serviceable_constraint": self.serviceable_constraint,
            "vehicle_weight_capacity_constraint": self.vehicle_weight_capacity_constraint,
            "vehicle_volume_capacity_constraint": self.vehicle_volume_capacity_constraint,
            "sla_time_window_constraint": self.sla_time_window_constraint,
            "operating_time_window_constraint": self.operating_time_window_constraint,
            "search_time_limit": self.search_time_limit,
            "node_drop_penalty": self.node_drop_penalty,
            "products_flag": self.products_flag,
            "priority_flag": self.priority_flag,
            "task_id": self.task_id,
            "order_id": self.order_id,
            "max_length_constraint": self.max_length_constraint,
            "max_node_visits_constraint": self.max_node_visits_constraint,
            "welded_volume_capacity_constraint": self.welded_volume_capacity_constraint,
            "welded_weight_capacity_constraint": self.welded_volume_capacity_constraint,
            "daily_run": self.daily_run,
            "max_drop_distance_constraint": self.max_drop_distance_constraint,
            "mid_mile_cost": self.mid_mile_cost,
            "sequential_bool": self.sequential_bool
        })