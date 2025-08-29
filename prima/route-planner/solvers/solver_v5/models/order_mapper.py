import json
import pandas as pd


class OrderMapper(object):
    df = pd.DataFrame()

    def __init__(self, order_df: pd.DataFrame):
        self.df = order_df

    def get_order(self, order_index: int):
        order = self.df.loc[self.df['index'] == order_index]
        order_dict = order.to_dict('records')[0]
        return Order(order_dict)

    def get_order_df(self, order_indices: list):
        order_df = self.df.loc[self.df['index'].isin(order_indices)]
        return order_df


class Order:
    order = dict()

    def __str__(self):
        return json.dumps(self.order)

    def __init__(self, order: dict):
        self.order = order

    @property
    def id(self):
        return self.order.get('task_id', None)

    @property
    def load(self):
        return self.order.get('load', 0)

    @property
    def volume(self):
        return self.order.get('volume', 0)

    @property
    def index(self):
        return self.order.get('index', None)

    @property
    def to_city(self):
        return self.order.get('to_city', '')

    @property
    def from_city(self):
        return self.order.get('from_city', '')

    @property
    def to_coordinate(self):
        lat = self.order.get('to_latitude')
        long = self.order.get('to_longitude')
        return (lat, long)
