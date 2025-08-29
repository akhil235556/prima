import json


class SolverConfigurationV2(object):
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
            'integer_multiplier': self.integer_multiplier
        })
