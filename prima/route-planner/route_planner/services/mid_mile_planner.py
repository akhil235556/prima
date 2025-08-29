from .planner import RoutePlanner

class MidMilePlanner(RoutePlanner):
    def __init__(self):
        super().__init__()

    def plan(self, input_file=None, output_file=None):
        """
        Mid-mile route planning implementation
        """
        # Add sample route for testing
        route = {
            'route_id': 'M001',
            'stops': ['Hub1', 'Hub2', 'Hub3'],
            'total_distance': 100,
            'total_cost': 2000
        }
        self.routes = [route]
        return self.routes 