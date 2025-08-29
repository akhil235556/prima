import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { hideLoader } from '../redux/actions/AppActions';
import { hideLoading, setResponse } from "../redux/actions/LaneActions";
import { lane } from "../services";

export const getLaneList = (reactDispatch: any, queryParams: any): any => async (dispatch: Dispatch) => {
    lane.getLaneList(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    }).catch((error: any) => {
        reactDispatch(hideLoading());
        handleApiError(error.message, dispatch)
    });
};

export const createLane = (params: any): any => async (dispatch: Dispatch) => {
    return lane.createLane(params).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const updateLane = (params: any): any => async (dispatch: Dispatch) => {
    return lane.updateLane(params).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const createLanePartner = (params: any): any => async (dispatch: Dispatch) => {
    return lane.createLanePartner(params).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const updateLanePartner = (params: any): any => async (dispatch: Dispatch) => {
    return lane.updateLanePartner(params).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const searchLane = (query: any): any => async (dispatch: Dispatch) => {
    return lane.searchLane(query).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const searchV1Lane = (queryParams: any): any => async (dispatch: Dispatch) => {
    return lane.searchV1Lane(queryParams).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const searchSobLanes = (queryParams: any): any => async (dispatch: Dispatch) => {
    return lane.searchSobLanes({ ...queryParams, sob: 1 }).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getLaneLocations = (queryParams: any): any => async (dispatch: Dispatch) => {
    return lane.getLaneLocations(queryParams).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};


export const searchLanePartner = (queryParams: any): any => async (dispatch: Dispatch) => {
    return lane.searchLanePartner(queryParams).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getLaneSob = (queryParams: any): any => async (dispatch: Dispatch) => {
    return lane.getLaneSob(queryParams).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getLaneDetails = (queryParams: any): any => async (dispatch: Dispatch) => {
    return lane.getLaneDetails(queryParams).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getMasterLaneDetails = (queryParams: any): any => async (dispatch: Dispatch) => {
    return lane.getMasterLaneDetails(queryParams).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getLaneFromOriginAndDestination = (queryParams: any): any => async (dispatch: Dispatch) => {
    return lane.getLaneFromOriginAndDestination(queryParams).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getTaggedLocations = (queryParams: any): any => async (dispatch: Dispatch) => {
    return lane.getTaggedLocations(queryParams).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};