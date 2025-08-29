import json


class SolverConfigurationV3(object):
    vehicle_load_capacity_constraint = None
    vehicle_volume_capacity_constraint = None
    vehicle_min_load_capacity_constraint = None
    vehicle_min_volume_capacity_constraint = None
    sku_exclusion_constraint = None
    vehicle_repeat_factor = None
    integer_multiplier = None
    global_start_datetime = None
    planning_duration_hours = None

    def __str__(self):
        return json.dumps({
            "vehicle_load_capacity_constraint": self.vehicle_load_capacity_constraint,
            "vehicle_volume_capacity_constraint": self.vehicle_volume_capacity_constraint,
            "vehicle_min_load_capacity_constraint": self.vehicle_min_load_capacity_constraint,
            "vehicle_min_volume_capacity_constraint": self.vehicle_min_volume_capacity_constraint,
            "sku_exclusion_constraint": self.sku_exclusion_constraint,
            "vehicle_repeat_factor": self.vehicle_repeat_factor,
            'integer_multiplier': self.integer_multiplier,
            "global_start_datetime": self.global_start_datetime,
            "planning_duration_hours": self.planning_duration_hours
        })
