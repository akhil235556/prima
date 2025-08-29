import { AxiosInstance } from "axios";
import {
    createLanePartnerUrl, createLaneUrl,
    getLaneBasedOnLocations,
    getLaneDetailsUrl, getLaneLocationsUrl, getLaneSobUrl, getMasterLaneDetailsUrl, laneListUrl, searchLanePartnerUrl, searchLaneUrl,
    searchV1LaneUrl,
    taggedLocationsUrl,
    updateLaneUrl
} from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getLaneList(queryParams: any) {
        return api.get(laneListUrl, { params: queryParams });
    }
    function createLane(params: any) {
        return api.post(createLaneUrl, params);
    }
    function updateLane(params: any) {
        return api.post(updateLaneUrl, params);
    }
    function createLanePartner(params: any) {
        return api.post(createLanePartnerUrl, params);
    }
    function updateLanePartner(params: any) {
        return api.put(createLanePartnerUrl, params);
    }
    function searchLane(queryParams: any) {
        return api.get(searchLaneUrl, { params: queryParams });
    }
    function searchV1Lane(queryParams: any) {
        return api.get(searchV1LaneUrl, { params: queryParams });
    }
    function searchSobLanes(queryParams: any) {
        return api.get(searchLaneUrl, { params: queryParams });
    }
    function searchLanePartner(queryParams: any) {
        return api.get(searchLanePartnerUrl, { params: queryParams });
    }
    function getLaneLocations(queryParams: any) {
        return api.get(getLaneLocationsUrl, { params: queryParams });
    }
    function getLaneSob(queryParams: any) {
        return api.get(getLaneSobUrl, { params: queryParams });
    }
    function getLaneDetails(queryParams: any) {
        return api.get(getLaneDetailsUrl, { params: queryParams });
    }
    function getMasterLaneDetails(queryParams: any) {
        return api.get(getMasterLaneDetailsUrl, { params: queryParams });
    }
    function getLaneFromOriginAndDestination(queryParams: any) {
        return api.get(getLaneBasedOnLocations, { params: queryParams })
    }
    function getTaggedLocations(queryParams: any) {
        return api.get(taggedLocationsUrl, { params: queryParams })
    }
    return {
        getLaneList,
        createLane,
        createLanePartner,
        searchLane,
        searchSobLanes,
        searchLanePartner,
        updateLane,
        updateLanePartner,
        getLaneLocations,
        getLaneSob,
        getLaneDetails,
        getMasterLaneDetails,
        searchV1Lane,
        getLaneFromOriginAndDestination,
        getTaggedLocations
    }
}