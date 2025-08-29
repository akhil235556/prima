import { AxiosInstance } from "axios";
import { cityListUrl, getLanePriceUrl, getStateListUrl, getTrackingAssetModalTemplate, getTrackingAssetsUrl, getUserProfileUrl, menuTemplateUrl, ServiceabilityDeatilsUrl, TrackingVendorListUrl, VehicleDeviceListUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getUserProfile() {
        return api.get(getUserProfileUrl);
    }

    function getUserMenu() {
        return api.get(menuTemplateUrl);
    }

    function getCities() {
        return api.get(cityListUrl);
    }
    // function getLocationTypes() {
    //     return api.get(locationType);
    // }
    function getTrackingAssetsType() {
        return api.get(getTrackingAssetsUrl);
    }
    function getDeviceData() {
        return api.get(VehicleDeviceListUrl);
    }
    function getTrackingVendorData(queryParams: any) {
        return api.get(TrackingVendorListUrl, { params: queryParams });
    }
    function getTemplateData(queryParams: any) {
        return api.get(getTrackingAssetModalTemplate, { params: queryParams });
    }
    function getStateList(queryParams?: any) {
        return api.get(getStateListUrl, { params: queryParams });
    }
    function getServiceabilityDetails(queryParams: any) {
        return api.get(ServiceabilityDeatilsUrl, { params: queryParams });
    }
    function getLanePrice(queryParams: any) {
        return api.get(getLanePriceUrl, { params: queryParams });
    }

    return {
        getLanePrice,
        getServiceabilityDetails,
        getUserProfile,
        getUserMenu,
        getCities,
        getTrackingAssetsType,
        getDeviceData,
        getTrackingVendorData,
        getTemplateData,
        getStateList
        //getLocationTypes
    }
}