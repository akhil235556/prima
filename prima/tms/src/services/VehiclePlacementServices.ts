import { AxiosInstance } from "axios";
import { getvehicleCsvLinkUrl, vehiclePlacementCountListUrl, VehiclePlacementListUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getVehiclePlacementList(queryParams: any) {
        return api.get(VehiclePlacementListUrl, { params: queryParams });
    }
    function getCountList(queryParams: any) {
        return api.get(vehiclePlacementCountListUrl, { params: queryParams });
    }
    function getCsvLink(queryParams: any) {
        return api.get(getvehicleCsvLinkUrl, { params: queryParams });
    }
    return {
        getVehiclePlacementList,
        getCountList,
        getCsvLink
    }
}