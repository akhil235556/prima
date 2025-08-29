import { AxiosInstance } from "axios";
import { zoneCreateUrl, zoneDetailsUrl, zoneListingUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getZoneDetails(queryParams: any) {
        return api.get(zoneDetailsUrl, { params: queryParams });
    }
    function zoneCreate(params: any) {
        return (api.post(zoneCreateUrl, params));
    }
    function zoneListing(queryParams: any) {
        return api.get(zoneListingUrl, { params: queryParams });
    }
    return {
        getZoneDetails,
        zoneCreate,
        zoneListing
    }
}