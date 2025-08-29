from abc import ABC, abstractmethod


class DataframeClassifier(ABC):

    @abstractmethod
    def process(self, df):
        pass

    @abstractmethod
    def keys(self) -> list:
       pass

    @abstractmethod
    def get(self, key) -> list:
        pass

    @abstractmethod
    def get_df_indices_by_key(self, key):
        pass

    @staticmethod
    def group_df_indices(df, keys):
        filter_columns = keys.copy()
        filter_columns.append('index')

        _df = df[filter_columns]
        grouped_df = _df.groupby(keys)['index'].apply(list).reset_index(name='df_indices')
        return grouped_df.set_index(keys).to_dict()['df_indices']


class PincodeClassifier(DataframeClassifier):

    pincode_to_df_index_map = dict()
    pincode_column_name = list()

    def __init__(self, pincode_column_name: list):
        self.pincode_column_name = pincode_column_name

    @property
    def keys(self) -> list:
        return self.pincodes

    def get(self, key) -> list:
        return self.pincode_to_df_index_map.get(key, [])

    @staticmethod
    def get_pincode_to_df_index_map(df, keys):
        return DataframeClassifier.group_df_indices(df, keys)

    @property
    def pincodes(self) -> list:
        return list(self.pincode_to_df_index_map.keys())

    def get_df_indices_by_key(self, pincode):
        return self.pincode_to_df_index_map.get(pincode, [])

    def process(self, df):
        self.pincode_to_df_index_map = self.get_pincode_to_df_index_map(df, keys=self.pincode_column_name)


class CityClassifier(DataframeClassifier):
    city_to_df_index_map = dict()
    city_column_name = list()

    def __init__(self, city_column_name: list):
        self.city_column_name = city_column_name

    @property
    def keys(self) -> list:
        return self.cities

    def get(self, key) -> list:
        return self.city_to_df_index_map.get(key, [])

    @staticmethod
    def get_city_to_df_index_map(df, keys):
        return DataframeClassifier.group_df_indices(df, keys)

    @property
    def cities(self) -> list:
        return list(self.city_to_df_index_map.keys())

    def get_df_indices_by_key(self, city):
        return self.city_to_df_index_map.get(city, [])

    def process(self, df):
        self.city_to_df_index_map = self.get_city_to_df_index_map(df, keys=self.city_column_name)
