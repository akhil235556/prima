import { AxiosInstance } from "axios";
import { acceptPlacementDateTimeUrl, approveRequestVehicleTypeUrl, configPlacementDateTimeUrl, configRequestVehicleTypeUrl, getCurrentVehicleTypeUrl, getPlacementDateTimeUrl, orchestrationTokenUrl, raiseRequestVehicleTypeUrl, rejectPlacementDateTimeUrl, rejectRequestVehicleTypeUrl } from "../base/api/ServiceUrl";

export default (api: AxiosInstance) => {
    function getCurrentVehicleType(queryParams: any) {
        return api.get(getCurrentVehicleTypeUrl, { params: queryParams });
    }
    function raiseRequestVehicleType(queryParams: any) {
        return api.post(raiseRequestVehicleTypeUrl, queryParams);
    }
    function approveTrackRequest(params: any) {
        return api.patch(approveRequestVehicleTypeUrl, params)
    }
    function rejectTrackRequest(params: any) {
        return api.patch(rejectRequestVehicleTypeUrl, params)
    }
    function getConfigVehicleType(queryParams: any) {
        return api.get(configRequestVehicleTypeUrl, { params: queryParams })
    }
    function getPlacementDateTime(queryParams: any) {
        return api.get(getPlacementDateTimeUrl, { params: queryParams });
    }
    function acceptPlacementDateTime(params: any) {
        return api.patch(acceptPlacementDateTimeUrl, params)
    }
    function orchestrationToken(queryParams: any) {
        return api.get(orchestrationTokenUrl, { params: queryParams });
    }
    function rejectPlacementDateTime(params: any) {
        return api.patch(rejectPlacementDateTimeUrl, params)
    }
    function configPlacementDateTime() {
        return api.get(configPlacementDateTimeUrl)
    }

    return {
        getCurrentVehicleType,
        raiseRequestVehicleType,
        approveTrackRequest,
        rejectTrackRequest,
        getConfigVehicleType,
        getPlacementDateTime,
        acceptPlacementDateTime,
        rejectPlacementDateTime,
        configPlacementDateTime,
        orchestrationToken
    }
}