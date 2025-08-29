import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { hideLoader, setAllLocation } from '../redux/actions/AppActions';
import { hideLoading, setResponse } from "../redux/actions/LocationActions";
import { LocationDetails } from '../redux/storeStates/LocationStoreInterface';
import { location } from "../services";

export const getLocationList = (reactDispatch: any, queryParams?: any): any => async (dispatch: Dispatch) => {
    location.getLocationList(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    }).catch((error: any) => {
        handleApiError(error.message, dispatch)
        reactDispatch(hideLoading());
    });
};

export const searchLocationList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return location.searchLocation(queryParams).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const searchZoneLocationList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return location.searchZoneLocationList(queryParams).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const setZoneOrigin = (queryParams: any): any => async (dispatch: Dispatch) => {
    return location.setZoneOrigin(queryParams).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getMasterLocationDetails = (queryParams: any): any => async (dispatch: Dispatch) => {
    return location.getMasterLocationDetails(queryParams).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getLocationType = (queryParams?: any): any => async (dispatch: Dispatch) => {
    return location.getLocationType(queryParams).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};


export const createLocation = (params: LocationDetails): any => async (dispatch: Dispatch) => {
    return location.createLocation(params)
        .then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const updateLocation = (params: LocationDetails): any => async (dispatch: Dispatch) => {
    return location.updateLocation(params)
        .then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const checkSubLocation = (params: any): any => async (dispatch: Dispatch) => {
    return location.checkSubLocation(params)
        .then((responseAxios: any) => responseAxios && responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getAllLocation = (): any => async (dispatch: Dispatch) => {
    location.getAllLocationList().then((responseAxios: any) => {
        responseAxios.details && dispatch(setAllLocation(responseAxios.details));
        dispatch(hideLoader());
    }).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getLocationData = (params: any): any => async (dispatch: Dispatch) => {
    return location.getLocationData(params).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getSubLocationList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return location.getSubLocationList(queryParams).then((responseAxios: any) => responseAxios && responseAxios.details && responseAxios.details.locationResponse)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getNodalLocationList = (params?: any): any => async (dispatch: Dispatch) => {
    return location.getNodalLocationList(params).then((responseAxios: any) => responseAxios && responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getAllLocationTypeList = (queryParams?: any): any => async (dispatch: Dispatch) => {
    return location.allLocationType(queryParams).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const enableUserlocationType = (params: any): any => async (dispatch: Dispatch) => {
    return location.enableUserlocationType(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getDropPointsList = (params: any): any => async (dispatch: Dispatch) => {
    return location.getDropPointsList(params).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getGateList = (params?: any): any => async (dispatch: Dispatch) => {
    return location.getGateList(params).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getUserGateList = (params?: any): any => async (dispatch: Dispatch) => {
    return location.getUserGateList(params).then((responseAxios: any) => responseAxios && responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const updateUserGateInfo = (params: LocationDetails): any => async (dispatch: Dispatch) => {
    return location.updateUserGateInfo(params)
        .then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};
