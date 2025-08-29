import { AxiosInstance } from "axios";
import { createVehicleTypeUrl, serviceableVehicleTypesUrl, VehicleTypesListUrl, vehicleTypesSearchUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getVehicleTypeList(queryParams: any) {
        return api.get(VehicleTypesListUrl, { params: queryParams });
    }
    function createVehicleType(params: any, isUpdate: boolean) {
        return (isUpdate ? api.put(createVehicleTypeUrl, params) : api.post(createVehicleTypeUrl, params));
    }
    function searchVehicleType(queryParams: any) {
        return api.get(VehicleTypesListUrl, { params: queryParams });
    }
    function getAllVehicleTypeList() {
        return api.get(vehicleTypesSearchUrl, {
            params: {
                page: 1,
                size: 10000
            }
        });
    }
    function getServiceableVehicleTypes(queryParams: any) {
        return api.get(serviceableVehicleTypesUrl, { params: queryParams })
    }
    return {
        getVehicleTypeList,
        createVehicleType,
        searchVehicleType,
        getAllVehicleTypeList,
        getServiceableVehicleTypes
    }
}