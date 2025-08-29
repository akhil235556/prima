import pandas as pd


class SolverV2InputDataProcessor(object):

    task_str_header = ['task_id', 'from_location', 'to_location', 'from_city', 'to_city', 'serviceable_vehicles', 'sku',
                       'sku_tag']
    vehicles_str_header = ['vehicle_type', 'from_city', 'to_city']
    products_str_header = ['sku', 'sku_category', 'sku_tag', 'exclusive_tags']

    def __init__(self, orders, vehicles, products, config, const_int_multiplier):
        self.orders = orders
        self.vehicles = vehicles
        self.products = products
        self._solver_config = config
        self._CONST_INT_MULTIPLIER = const_int_multiplier

        # typecast string_type columns
        SolverV2InputDataProcessor.type_cast_to_str(self.orders, self.task_str_header)
        SolverV2InputDataProcessor.type_cast_to_str(self.vehicles, self.vehicles_str_header)
        SolverV2InputDataProcessor.type_cast_to_str(self.products, self.products_str_header)

    @staticmethod
    def type_cast_to_str(df: pd.DataFrame, str_type_cols: list) -> None:
        if df is not None:
            df_columns = df.columns.to_list()
            for col_name in str_type_cols:
                if col_name in df_columns:
                    col = df[col_name].copy().dropna()
                    col = col.apply(str)
                    indexes = col.index
                    df[col_name].iloc[indexes] = col

    def get_order_load(self, orders):
        loads_df = (orders["load"] * 1000) * self._CONST_INT_MULTIPLIER
        load = loads_df.astype('int').values.tolist()
        return load

    @staticmethod
    def get_order_id_list(orders):
        o_df = orders["order_id"]
        o_lit = o_df.values.tolist()
        return o_lit

    def get_order_volume_list(self, orders):
        volumes_df = (orders["volume"] * 1000000) * self._CONST_INT_MULTIPLIER
        volume = volumes_df.astype('int').values.tolist()
        return volume

    def get_vehicle_load_capacity_list(self, vehicles):
        capacity_df = (vehicles["capacity"] * 1000) * self._CONST_INT_MULTIPLIER
        capacity = capacity_df.astype('int').values.tolist()
        return capacity

    def get_vehicle_load_lower_bound_list(self, vehicles):
        capacity_df = (vehicles["utilisation_lb"] / 100)
        capacity = capacity_df.values.tolist()
        return capacity

    def get_vehicle_volume_lower_bound_list(self, vehicles):
        capacity_df = (vehicles["volume_utilisation_lb"] / 100)
        capacity = capacity_df.values.tolist()
        return capacity

    def get_vehicle_volume_capacity_list(self, vehicles):
        capacity_df = (vehicles["volumetric_capacity"] * 1000000) * self._CONST_INT_MULTIPLIER
        capacity = capacity_df.astype('int').values.tolist()
        return capacity

    @staticmethod
    def get_vehicle_list(vehicles):
        vehicle_list = vehicles['vehicle_type_name'].values.tolist()
        return vehicle_list

    @staticmethod
    def get_vehicle_fixed_cost_list(vehicles):
        fixed_cost_list = vehicles["fixed_charges"].fillna(0).astype('int').values.tolist()
        return fixed_cost_list

    @staticmethod
    def get_vehicle_per_kg_charges_list(vehicles):
        per_kg_charges_list = vehicles["per_kg_charges"].fillna(0).astype('int').values.tolist()
        return per_kg_charges_list

    @staticmethod
    def map_sku_to_order_id(orders, sku) -> list:
        order_id_list = list()
        contain_bool = orders['sku'].str.contains(sku, regex=False)
        if contain_bool.any():
            order_id_list = orders[contain_bool]['order_id'].to_list()
        return order_id_list

    @staticmethod
    def get_vehicle_serviceability_locations_list(orders):
        orders["serviceable_vehicles"] = orders["serviceable_vehicles"].fillna('')
        serviceable_vehicle_per_location_list = orders["serviceable_vehicles"].map(lambda x: x.split(",")).to_list()
        return serviceable_vehicle_per_location_list

    @staticmethod
    def convert_service_list(vehicles_serviceable, vehicle_name):
        serviceable_list = list()
        for location in vehicles_serviceable:
            vehicle_type_list = []
            for vehicle_type in location:
                for idx, cap_type in enumerate(vehicle_name):
                    if vehicle_type == cap_type:
                        vehicle_type_list.append(idx)
            serviceable_list.append(vehicle_type_list)
        return serviceable_list

    @staticmethod
    def create_exclusion_data(orders, products):
        # subset of products df which has 'exclusive_tags'
        prod_with_exclusive = products.loc[products['exclusive_tags'].dropna().index]

        if not prod_with_exclusive.dropna().empty:
            print(prod_with_exclusive.dropna().empty)
            # convert csv to nested list
            prod_with_exclusive['exc_tags'] = prod_with_exclusive['exclusive_tags'].map(lambda x: x.split(",")).to_list()

            prod_with_exclusive_tags = prod_with_exclusive[['sku', 'exc_tags']].copy()

            # exclusion_sku_tags_dict ->  sku : [exclusion_tag1, exclusion_tag2, exclusion_tag3]
            exclusion_sku_tags_dict = prod_with_exclusive_tags.set_index('sku').T.to_dict(orient='index')['exc_tags']

            # exclusion_sku_dict -> sku -> [exclusion_sku1, exclusion_sku2]
            exclusion_sku_dict = dict()
            prod_with_tag = products.copy()
            prod_with_tag['tags'] = prod_with_tag['sku_tag'].map(lambda x: x.split(",")).to_list()

            sku_tag_tuple = prod_with_tag[['sku', 'tags']].to_records(index=False).tolist()
            for ex_sku, ex_tags in exclusion_sku_tags_dict.items():
                # print(f"exclusive sku: {ex_sku}, exc_tags: {ex_tags}")
                for sku, tags in sku_tag_tuple:
                    if sku == ex_sku:
                        continue
                    # print(f"current sku: {sku}")

                    if set(tags).intersection(set(ex_tags)):
                        # print(f"exclusion {ex_sku, sku}")
                        if ex_sku not in exclusion_sku_dict.keys():
                            exclusion_sku_dict[ex_sku] = list()
                        exclusion_sku_dict[ex_sku].append(sku)

            # exclusion_dict order_id : [exclusion_order_id1, exclusion_order_id2, exclusion_order_id3]
            exclusion_list = list()
            order_id_sku_tuple = orders[['order_id', 'sku']].copy().to_records(index=False).tolist()
            for idx, (order_id, order_sku) in enumerate(order_id_sku_tuple):
                # print(idx)
                # print(order_id)
                # print(order_sku)
                exclusion_list.insert(idx, list())

                if order_sku in exclusion_sku_dict.keys():
                    order_id_exclusion_list = [ex_skus for ex_skus_list in exclusion_sku_dict[order_sku] for ex_skus in
                                               SolverV2InputDataProcessor.map_sku_to_order_id(orders, ex_skus_list)]
                    exclusion_list[idx] = order_id_exclusion_list

            return exclusion_list
        else:
            exclusion_list = []
            return exclusion_list

    def create_data_model(self):
        order_load_list = list()
        order_volume_list = list()
        vehicle_load_capacity_list = list()
        vehicle_volume_lowerbound_list = list()
        vehicle_load_lowerbound_list = list()
        vehicle_volume_capacity_list = list()
        order_exclusion_list = list()

        # set orders
        order_items_list = self.get_order_id_list(self.orders)

        if self._solver_config.vehicle_load_capacity_constraint:
            order_load_list = self.get_order_load(self.orders)

        if self._solver_config.vehicle_volume_capacity_constraint:
            order_volume_list = self.get_order_volume_list(self.orders)

        # set vehicles
        vehicles_list = self.get_vehicle_list(self.vehicles)

        if self._solver_config.vehicle_load_capacity_constraint:
            vehicle_load_capacity_list = self.get_vehicle_load_capacity_list(self.vehicles)
            vehicle_load_lowerbound_list = self.get_vehicle_load_lower_bound_list(self.vehicles)

        if self._solver_config.vehicle_volume_capacity_constraint:
            vehicle_volume_capacity_list = self.get_vehicle_volume_capacity_list(self.vehicles)
            vehicle_volume_lowerbound_list = self.get_vehicle_volume_lower_bound_list(self.vehicles)

        # set fix charge
        vehicle_fixed_cost_list = self.get_vehicle_fixed_cost_list(self.vehicles)

        # set per_kg_charges
        vehicle_per_kg_charges_list = self.get_vehicle_per_kg_charges_list(self.vehicles)

        if self._solver_config.sku_exclusion_constraint:
            # get exclusion list
            order_exclusion_list = self.create_exclusion_data(self.orders, self.products)

        # get serviceable vehicles list
        # todo reduce complexity by calculating before repeat
        vehicle_serviceability_list = self.get_vehicle_serviceability_locations_list(self.orders)
        serviceable_list = self.convert_service_list(vehicle_serviceability_list, vehicles_list)

        orders_data_dict = {
            'id': order_items_list,
            'total': len(order_items_list),
            'demand_load': order_load_list,
            'demand_volume': order_volume_list,
            'exclusion_orders': order_exclusion_list
        }

        vehicles_data_dict = {
            'id': range(len(vehicles_list)),
            'type': vehicles_list,
            'load_capacity': vehicle_load_capacity_list,
            'volume_capacity': vehicle_volume_capacity_list,
            'load_lb': vehicle_load_lowerbound_list,
            'volume_lb': vehicle_volume_lowerbound_list,
            'fixed_charges': vehicle_fixed_cost_list,
            'per_kg_charges': vehicle_per_kg_charges_list,
            'serviceable': serviceable_list
        }

        data = dict(
            orders=orders_data_dict,
            vehicles=vehicles_data_dict
        )
        return data
