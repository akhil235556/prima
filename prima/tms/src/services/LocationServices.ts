import { AxiosInstance } from "axios";
import {
    allLocationTypeUrl, allLocationUrl, checkSubLocationUrl, createLocationUrl,

    dropPointsUrl, enableLocationTypeUrl, getGateListUrl, getMasterLocationDetailsUrl, getUserGateListUrl, locationListUrl,

    locationTypeUrl, nodalLocationListUrl, searchLocationUrl, searchZoneLocationUrl, setZoneOriginUrl, subLocationListUrl, updateLocationUrl,



    updateUserGateUrl,
    waypointsDataUrl
} from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getLocationList(queryParams?: any) {
        return api.get(locationListUrl, { params: queryParams });
    }
    function getLocationData(queryParams?: any) {
        return api.post(waypointsDataUrl, queryParams);
    }
    function getLocationType(queryParams?: any) {
        return api.get(locationTypeUrl)
    }
    function getAllLocationList() {
        return api.get(allLocationUrl);
    }
    function createLocation(params: any) {
        return api.post(createLocationUrl, params);
    }
    function updateLocation(params: any) {
        return api.post(updateLocationUrl, params);
    }
    function searchLocation(queryParams?: any) {
        return api.get(searchLocationUrl, { params: queryParams });
    }
    function searchZoneLocationList(queryParams?: any) {
        return api.get(searchZoneLocationUrl, { params: queryParams });
    }
    function setZoneOrigin(queryParams?: any) {
        return api.get(setZoneOriginUrl, { params: queryParams });
    }
    function getMasterLocationDetails(queryParams?: any) {
        return api.get(getMasterLocationDetailsUrl, { params: queryParams });
    }
    function getSubLocationList(queryParams: any) {
        return api.get(subLocationListUrl, { params: queryParams });
    }

    function getNodalLocationList(queryParams?: any) {
        return api.get(nodalLocationListUrl, { params: queryParams });
    }
    function allLocationType(queryParams?: any) {
        return api.get(allLocationTypeUrl, { params: queryParams })
    }
    function enableUserlocationType(params: any) {
        return api.post(enableLocationTypeUrl, params)
    }
    function getDropPointsList(queryParams?: any) {
        return api.get(dropPointsUrl, { params: queryParams })
    }
    function checkSubLocation(queryParams: any) {
        return api.post(checkSubLocationUrl, queryParams)
    }
    function getGateList(queryParams: any) {
        return api.get(getGateListUrl, { params: queryParams });
    }
    function getUserGateList(queryParams: any) {
        return api.get(getUserGateListUrl, { params: queryParams });
    }
    function updateUserGateInfo(params: any) {
        return api.put(updateUserGateUrl, params);
    }
    return {
        getLocationList,
        createLocation,
        searchLocation,
        getAllLocationList,
        getLocationData,
        updateLocation,
        getNodalLocationList,
        getLocationType,
        getSubLocationList,
        allLocationType,
        enableUserlocationType,
        getDropPointsList,
        getMasterLocationDetails,
        checkSubLocation,
        getGateList,
        getUserGateList,
        updateUserGateInfo,
        searchZoneLocationList,
        setZoneOrigin
    }
}