import { AxiosInstance } from 'axios';
import {
    startTripsUrl, stopTripsUrl, addTripWayPointsUrl, getStoppageUrl, getTripDetailsUrl,
    getCurrentLocationUrl, vehicleStatusUrl, createTripUrl, trackingTripsUrl, driverConsentUrl,
    getSpecificTatUrl, tripDetail, editDriverUrl,
    trackingTripsListUrl, getCsvLinkUrl, transientCountUrl, unknownCountList,routePolylineUrl,
    pushLocationUrl
} from '../base/api/ServiceUrl';


export default (api: AxiosInstance) => {
    function getTrips(params?: any) {
        return api.get(trackingTripsUrl, { params });
    }
    function getTripListCount(params?: any) {
        return api.get(trackingTripsListUrl, { params });
    }
    function getUnknownCount(params?: any) {
        return api.get(unknownCountList, { params });
    }
    function getTripDetail(params?: any) {
        return api.get(tripDetail, { params });
    }
    function createTrip(params: any) {
        return api.post(createTripUrl, params);
    }

    function startTrip(params: any) {
        return api.put(startTripsUrl + params);
    }

    function stopTrip(params: any, queryParams: any) {
        return api.put(stopTripsUrl + params, queryParams);
    }
    function addTripWayPoints(tripId: any, params: any) {
        return api.post(addTripWayPointsUrl + tripId, params);
    }

    function getStoppageList(params: any) {
        return api.post(getStoppageUrl, params);
    }

    function getCurrentLocation(vehicleNumber: any) {
        return api.get(getCurrentLocationUrl + vehicleNumber);
    }

    function getTripEta(params: any) {
        return api.post(getTripDetailsUrl, params);
    }

    function getVehicleStatus(vehicleCode: any) {
        return api.get(vehicleStatusUrl + vehicleCode);
    }
    function DriverConsent(params: any) {
        return api.get(driverConsentUrl, { params });
    }
    function getSpecificTat(params: any) {
        return api.get(getSpecificTatUrl, { params });
    }
    function getCsvLink(queryParams: any) {
        return api.get(getCsvLinkUrl, { params: queryParams });
    }
    function transientCount(queryParams?: any) {
        return api.get(transientCountUrl, { params: queryParams });
    }
    function editDriverDetails(queryParams: any) {
        return api.put(editDriverUrl, queryParams);
    }
    function getRoutePolyline(queryParams: any) {
        return api.get(routePolylineUrl, {params: queryParams});
    }
    function pushLocation(params: any) {
        return api.put(pushLocationUrl, params);
    }
    return {
        getTrips,
        createTrip,
        startTrip,
        stopTrip,
        addTripWayPoints,
        getStoppageList,
        getCurrentLocation,
        getTripEta,
        getVehicleStatus,
        DriverConsent,
        getSpecificTat,
        getTripDetail,
        getTripListCount,
        getUnknownCount,
        getCsvLink,
        transientCount,
        editDriverDetails,
        getRoutePolyline,
        pushLocation,
    }
}