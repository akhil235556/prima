import { AxiosInstance } from "axios";
import { createVehicleUrl, createVehiclOnShipmenteUrl, getVehicleDetailsShipmentUrl, getVehicleDetailsUrl, getVehicleTemplateShipmentUrl, getVehicleTemplateUrl, reportVehicletoHubUrl, searchPlatformVehicleUrl, searchVehicleNumberUrl, updateVehicleDetailsOnShipmentUrl, updateVehicleDetailsUrl, updateVehicleTypeUrl, validatePermissionUrl, vehicleListUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getVehicleList(queryParams: any) {
        return api.get(vehicleListUrl, { params: queryParams });
    }
    function createVehicle(params: any) {
        return (api.post(createVehicleUrl, params));
    }

    function createVehicleOnShipment(params: any) {
        return (api.post(createVehiclOnShipmenteUrl, params));
    }

    function searchVehicle(queryParams: any) {
        return api.get(searchVehicleNumberUrl, { params: queryParams });
    }
    function searchPlatformVehicle(queryParams: any) {
        return api.get(searchPlatformVehicleUrl, { params: queryParams });
    }
    function reportVehicleToHUB(params: any) {
        return api.put(reportVehicletoHubUrl, params);
    }
    function getVehicleTemplate(params: any) {
        return api.get(getVehicleTemplateUrl, { params: params });
    }
    function getVehicleTemplateShipment(params: any) {
        return api.get(getVehicleTemplateShipmentUrl, { params: params });
    }
    function getVehicleDetails(params: any) {
        return api.get(getVehicleDetailsUrl, { params: params });
    }
    function getVehicleDetailsShipment(params: any) {
        return api.get(getVehicleDetailsShipmentUrl, { params: params });
    }
    function updateVehicleDetails(params: any) {
        return api.put(updateVehicleDetailsUrl, params);
    }
    function updateVehicleDetailsForShipment(params: any) {
        return api.put(updateVehicleDetailsOnShipmentUrl, params);
    }
    function updateVehicleType(params: any) {
        return api.put(updateVehicleTypeUrl, params);
    }
    function validatePermission(params: any) {
        return api.get(validatePermissionUrl, { params: params });
    }
    return {
        getVehicleList,
        createVehicle,
        searchVehicle,
        searchPlatformVehicle,
        createVehicleOnShipment,
        reportVehicleToHUB,
        getVehicleTemplate,
        getVehicleDetails,
        updateVehicleDetails,
        updateVehicleDetailsForShipment,
        getVehicleTemplateShipment,
        getVehicleDetailsShipment,
        updateVehicleType,
        validatePermission
    }
}