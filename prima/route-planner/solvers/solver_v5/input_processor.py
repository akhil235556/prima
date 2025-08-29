import pandas as pd
from solvers.solver_v5.models.order_mapper import OrderMapper
from solvers.solver_v5.models.vehicles_mapper import VehiclesMapper
from solvers.solver_v5.models.classifier import DataframeClassifier, PincodeClassifier, CityClassifier
from route_planner.utils.distance_matrix import DistanceMatrix


class SolverV5InputDataProcessor(object):
    orders_df = pd.DataFrame()
    vehicles_df = pd.DataFrame()

    _order_classifier = DataframeClassifier
    _vehicle_classifier = DataframeClassifier
    _orders = OrderMapper
    _vehicles = VehiclesMapper

    def __init__(self, orders, vehicles, config):
        self.orders_df = orders
        self.vehicles_df = vehicles
        self.config = config
        self.dev_testing()

    def dev_testing(self):
        self.orders_df[['from_location', 'to_location']] = self.orders_df[['from_location', 'to_location']].astype(str)
        # todo integrate vehicle repeat factor
        self.orders_df['index'] = range(self.orders_df.shape[0])
        self.vehicles_df['index'] = range(self.vehicles_df.shape[0])

    @property
    def order_classifier(self):
        return self._order_classifier

    @property
    def vehicle_classifier(self):
        return self._vehicle_classifier

    @property
    def orders(self):
        return self._orders

    @property
    def vehicles(self):
        return self._vehicles

    @property
    def distance_matrix(self):
        return self.DM

    def process(self):
        print("SolverV5InputDataProcessor : process:")

        self._order_classifier = PincodeClassifier(pincode_column_name=['from_location', 'to_location'])
        self._order_classifier.process(self.orders_df)

        self._orders = OrderMapper(self.orders_df)

        self._vehicle_classifier = CityClassifier(city_column_name=['from_city', 'to_city'])
        self._vehicle_classifier.process(self.vehicles_df)

        self._vehicles = VehiclesMapper(self.vehicles_df)
        # todo integrate distance matrix
        self.DM = DistanceMatrix(self.orders_df, self.vehicles_df)


