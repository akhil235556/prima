from .planner import RoutePlanner

class FixedRoutePlanner(RoutePlanner):
    def __init__(self):
        super().__init__()

    def plan(self, input_file=None, output_file=None):
        """
        Fixed route planning implementation
        """
        # Add sample route for testing
        route = {
            'route_id': 'R001',
            'stops': ['Stop1', 'Stop2', 'Stop3'],
            'total_distance': 50,
            'total_cost': 1000
        }
        self.routes = [route]
        return self.routes 