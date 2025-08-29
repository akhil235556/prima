
import logging
from scipy.spatial.distance import squareform
from shapely.geometry import MultiPoint
from math import radians, cos, sin, asin, sqrt
# from here_location_services import LS # Commented out as we are bypassing HERE API
import json
from route_planner.constants.app_constants import HERE_API_KEY, HERE_LOCATION_TTL
import itertools
import pandas as pd
import numpy as np

from route_planner.utils.utils import HereAPI

logger = logging.getLogger(__name__)

class DistanceMatrix(object):

    def __init__(self, df, v_df):
        self.df = df
        self.v_df = v_df
        # self.pincode = pincode
        # self.coordinates = coordinates
        self.locations, self.coordinates = self.get_locations()
        # if not coordinates:
        #     self.coordinates = self.pincode_to_coord()
        self.matrix = self.get_distance_matrix_df()

    def get_locations(self):
        new_df = self.df.drop_duplicates(subset=["to_location"], keep="first")
        locations = new_df["to_location"].values.tolist()
        latitude_list = new_df["to_latitude"].values.tolist()
        longitude_list = new_df["to_longitude"].values.tolist()

        # getting from city, to city coordinates
        from_cities = self.df["from_city"].values.tolist()
        to_cities = self.df["to_city"].values.tolist()

        unique_from_cities = list(set(from_cities))
        unique_to_cities = list(set(to_cities))

        cities = unique_from_cities + unique_to_cities

        # Modified to use hardcoded coordinates for cities or existing lat/long
        city_coord = []
        for city in cities:
            if city == "citya":
                city_coord.append([-118.2437, 34.0522]) # Example coordinates for CityA
            elif city == "cityb":
                city_coord.append([-118.2437, 34.0522]) # Example coordinates for CityB
            elif city == "cityc":
                city_coord.append([-118.2437, 34.0522]) # Example coordinates for CityC
            elif city == "cityd":
                city_coord.append([-118.2437, 34.0522]) # Example coordinates for CityD
            else:
                # Fallback to dummy coordinates if city not recognized
                city_coord.append([0.0, 0.0])

        # inserting depot location info
        locations.insert(0, new_df["from_location"].iloc[0])
        latitude_list.insert(0, new_df["from_latitude"].iloc[0])
        longitude_list.insert(0, new_df["from_longitude"].iloc[0])

        coordinates = [[x] + [y] for x, y in zip(longitude_list, latitude_list)]

        locations.extend(cities)
        coordinates.extend(city_coord)

        return locations, coordinates

    def get_distance(self, origin, destination):
        distance = self.matrix[origin].loc[destination]
        return distance

    def get_distance_matrix_df(self):
        matrix_df = self.coordinates_to_matrix(self.coordinates, self.locations)
        return matrix_df

    @staticmethod
    def pincode_to_coord(locations):
        # This function is no longer needed as get_locations now handles coordinates directly
        # Keeping it as a placeholder to avoid breaking other parts of the code that might call it
        coordinates = []
        for location in locations:
            # Return dummy coordinates or log a warning
            coordinates.append([0.0, 0.0]) # Dummy coordinates
        return coordinates

    def coordinates_to_matrix(self, coordinates, locations):
        """
        Input to this method will be [[75.78553, 26.86891], [78.04891, 30.3097],...], list of lists of long, lats
        [75.78553, 26.86891] - 0 index is long and 1 index is lat.
        """
        place_coordinates_comb = itertools.combinations(coordinates, 2)
        place_coordinates_comb_flatten = [(*x, *y) for (x, y) in place_coordinates_comb]
        lon1, lat1, lon2, lat2 = np.array(place_coordinates_comb_flatten).T
        d_vect = self.haversine_np(lon1, lat1, lon2, lat2)
        if locations:
            place_correlation = pd.DataFrame(squareform(d_vect), columns=locations, index=locations)
        else:
            place_correlation = pd.DataFrame(squareform(d_vect))
        # matrix = place_correlation.values.tolist()
        # if not dedicated:
        #     for k in range(len(matrix)):
        #         matrix[k][0] = 0

        return place_correlation

    @staticmethod
    def haversine_np(lon1, lat1, lon2, lat2):
        """
        Calculate the great circle distance between two points
        on the earth (specified in decimal degrees)

        All args must be of equal length.
        """
        lon1, lat1, lon2, lat2 = map(np.radians, [lon1, lat1, lon2, lat2])

        dlon = lon2 - lon1
        dlat = lat2 - lat1

        a = np.sin(dlat / 2.0) ** 2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon / 2.0) ** 2

        c = 2 * np.arcsin(np.sqrt(a))
        km = 6367 * c
        return km


    @staticmethod
    def centroid(coord):
        """
        Input to this method will be [[75.78553, 26.86891], [78.04891, 30.3097],...], list of lists of long, lats
        It will give the center point for all the input coordinates
        """
        a = MultiPoint(coord).centroid
        centre = list()
        centre.append(a.x)
        centre.append(a.y)
        return centre

    def distance(self, origin, destination):
        """
        This method calculates distance in KM between 2 cities
        Input is Origin - [lat, long]
        """
        lon1 = origin[0]
        lat1 = origin[1]

        lon2 = destination[0]
        lat2 = destination[1]

        distance = self.haversine(lon1, lat1, lon2, lat2)

        return distance

    @staticmethod
    def haversine(lon1, lat1, lon2, lat2):
        """
        Calculate the great circle distance in kilometers between two points
        on the earth (specified in decimal degrees)
        """
        # convert decimal degrees to radians
        lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

        # haversine formula
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
        c = 2 * asin(sqrt(a))
        r = 6371  # Radius of earth in kilometers. Use 3956 for miles. Determines return value units.
        return c * r


