from .planner import RoutePlanner

class VariableRoutePlanner(RoutePlanner):
    def __init__(self):
        super().__init__()

    def plan(self, input_file=None, output_file=None):
        """
        Variable route planning implementation
        """
        # Add sample route for testing
        route = {
            'route_id': 'V001',
            'stops': ['Location1', 'Location2', 'Location3'],
            'total_distance': 75,
            'total_cost': 1500
        }
        self.routes = [route]
        return self.routes 