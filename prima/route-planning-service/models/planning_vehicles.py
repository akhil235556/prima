from db.dao.base_dao import BaseDao
from db.dao.planning_vehicles import PlanningVehiclesDao
from exceptions.exceptions import DatabaseException

class PlanningVehiclesMapper(object):

    @staticmethod
    def validate_bulk_vehicles(vehicles):
        validated_vehicles = list()
        for vehicle in vehicles:
            validated_vehicle = dict()
            prefix = f"validate_bulk_vehicles:"

            BaseDao.is_empty(vehicle.get('request_id'), f'{prefix} request_id')
            BaseDao.is_str(vehicle.get('request_id'), 'request_id')
            validated_vehicle['request_id'] = vehicle.get('request_id')

            BaseDao.is_empty(vehicle.get('planning_request_id'), f'{prefix} planning_request_id')
            BaseDao.is_str(vehicle.get('planning_request_id'), 'planning_request_id')
            validated_vehicle['planning_request_id'] = vehicle.get('planning_request_id')

            if vehicle.get('planning_route_id'):
                BaseDao.is_str(vehicle.get('planning_route_id'), f'{prefix} planning_route_id')
                validated_vehicle['planning_route_id'] = vehicle.get('planning_route_id')

            if vehicle.get('vehicle_code'):
                BaseDao.is_str(vehicle.get('vehicle_code'), f'{prefix} vehicle_code')
                validated_vehicle['vehicle_code'] = vehicle.get('vehicle_code')

            if vehicle.get('weight_capacity'):
                BaseDao.is_decimal(vehicle.get('weight_capacity'), f'{prefix} weight_capacity')
                validated_vehicle['weight_capacity'] = vehicle.get('weight_capacity')

            if vehicle.get('volume_capacity'):
                BaseDao.is_decimal(vehicle.get('volume_capacity'), f'{prefix} volume_capacity')
                validated_vehicle['volume_capacity'] = vehicle.get('volume_capacity')

            if vehicle.get('fixed_cost'):
                BaseDao.is_decimal(vehicle.get('fixed_cost'), f'{prefix} fixed_cost')
                validated_vehicle['fixed_cost'] = vehicle.get('fixed_cost')

            if vehicle.get('number_of_vehicles'):
                BaseDao.is_int(vehicle.get('number_of_vehicles'), f'{prefix} number_of_vehicles')
                validated_vehicle['number_of_vehicles'] = vehicle.get('number_of_vehicles')

            validated_vehicles.append(validated_vehicle)
        return validated_vehicles

    @staticmethod
    def bulk_upload(vehicles, _connection):

        validated_vehicles = PlanningVehiclesMapper.validate_bulk_vehicles(vehicles)

        PlanningVehiclesDao.insert_many(validated_vehicles, connection=_connection)

    @staticmethod
    def update_planning_vehicles(data_dict, planning_request_id, connection):
        # Validate Mandatory Field
        BaseDao.is_empty(planning_request_id)
        for route in data_dict:
            request_id = route.get('vehicle_request_id')
            BaseDao.is_empty(request_id)

            route_id = route.get('route_id')

            BaseDao.is_str(route.get('vehicle_request_id'))
            BaseDao.is_empty(route.get('route_id'))

            PlanningVehiclesMapper.check_planning_task(PlanningVehiclesDao, request_id, planning_request_id, connection)

            filter_dict = {
                'request_id': request_id,
                'planning_request_id': planning_request_id
            }

            set_dict = {
                'planning_route_id': route_id
            }

            PlanningVehiclesDao.update(filter_dict, set_dict, connection=connection)

    @staticmethod
    def check_planning_task(dao, request_id, planning_request_id, connection=None):
        results = dao.query(dict(request_id=request_id, planning_request_id=planning_request_id),
                            connection=connection)

        if not results:
            raise DatabaseException(f"Request ID: {request_id} does not exist.")
