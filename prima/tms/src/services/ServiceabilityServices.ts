import { AxiosInstance } from "axios";
import { createServiceabilityUrl, getServiceableVehicles, lrNumberListUrl, odaPincodesCsvUrl, ServiceabilityDetailsUrl, ServiceabilityGroupedListUrl, ServiceabilityListUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getServiceabilityList(queryParams: any) {
        return api.get(ServiceabilityListUrl, { params: queryParams });
    }
    function getServiceabilityGroupedList(queryParams: any) {
        return api.get(ServiceabilityGroupedListUrl, { params: queryParams });
    }
    function createServiceability(params: any, isUpdate: boolean) {
        return (isUpdate ? api.put(createServiceabilityUrl, params) : api.post(createServiceabilityUrl, params));
    }
    function getServiceabilityDetails(queryParams: any) {
        return api.get(ServiceabilityDetailsUrl, { params: queryParams });
    }
    function getLrNumberDetails(queryParams: any) {
        return api.get(lrNumberListUrl, { params: queryParams });
    }
    function getServiceableVehciles(queryParams: any) {
        return api.get(getServiceableVehicles, { params: queryParams });
    }
    function downloadOdaPincodesCsv(queryParams: any) {
        return api.get(odaPincodesCsvUrl, { params: queryParams });
    }
    return {
        getServiceabilityList,
        createServiceability,
        getServiceabilityDetails,
        getServiceabilityGroupedList,
        getLrNumberDetails,
        getServiceableVehciles,
        downloadOdaPincodesCsv
    }
}