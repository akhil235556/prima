import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { hideLoader } from '../redux/actions/AppActions';
import { hideLoading, setResponse } from '../redux/actions/VehicleAction';
import { Vehicle } from "../redux/storeStates/VehicleStoreInterface";
import { vehicles } from "../services";

export const getVehicleList = (reactDispatch: any, queryParams: any): any => async (dispatch: Dispatch) => {
    vehicles.getVehicleList(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    }).catch((error: any) => {
        reactDispatch(hideLoading());
        handleApiError(error.message, dispatch)
    });
};

export const createVehicle = (params: Vehicle): any => async (dispatch: Dispatch) => {
    return vehicles.createVehicle(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const createVehicleOnShipment = (params: Vehicle): any => async (dispatch: Dispatch) => {
    return vehicles.createVehicleOnShipment(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const searchVehicleList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return vehicles.searchVehicle(queryParams).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const searchPlatformVehicle = (queryParams: any): any => async (dispatch: Dispatch) => {
    return vehicles.searchPlatformVehicle(queryParams).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const reportVehicleToHUB = (params: any): any => async (dispatch: Dispatch) => {
    return vehicles.reportVehicleToHUB(params).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getVehicleTemplate = (params?: any): any => async (dispatch: Dispatch) => {
    return vehicles.getVehicleTemplate(params).then((responseAxios: any) => responseAxios && responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getVehicleTemplateShipment = (params?: any): any => async (dispatch: Dispatch) => {
    return vehicles.getVehicleTemplateShipment(params).then((responseAxios: any) => responseAxios && responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getVehicleDetails = (params: any): any => async (dispatch: Dispatch) => {
    return vehicles.getVehicleDetails(params).then((responseAxios: any) => responseAxios && responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getVehicleDetailsShipment = (params: any): any => async (dispatch: Dispatch) => {
    return vehicles.getVehicleDetailsShipment(params).then((responseAxios: any) => responseAxios && responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const updateVehicleDetails = (params: any): any => async (dispatch: Dispatch) => {
    return vehicles.updateVehicleDetails(params).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const updateVehicleDetailsForShipment = (params: any): any => async (dispatch: Dispatch) => {
    return vehicles.updateVehicleDetailsForShipment(params).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const updateVehicleType = (params: any): any => async (dispatch: Dispatch) => {
    return vehicles.updateVehicleType(params).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const validatePermission = (params: any): any => async (dispatch: Dispatch) => {
    return vehicles.validatePermission(params).then((responseAxios: any) => responseAxios.details && responseAxios.details && responseAxios.details.userPermissions)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

