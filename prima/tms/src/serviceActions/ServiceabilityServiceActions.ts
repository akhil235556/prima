import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { hideLoader } from '../redux/actions/AppActions';
import { setResponse } from "../redux/actions/ServiceabilityActions";
import { hideLoading } from '../redux/actions/VehicleAction';
import { serviceability } from "../services";

export const getServiceabilityList = (reactDispatch: any, queryParams: any): any => async (dispatch: Dispatch) => {
    serviceability.getServiceabilityList(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    }).catch((error: any) => {
        reactDispatch(hideLoading());
        handleApiError(error.message, dispatch)
    });
};

export const getServiceabilityGroupedList = (reactDispatch: any, queryParams: any): any => async (dispatch: Dispatch) => {
    serviceability.getServiceabilityGroupedList(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    }).catch((error: any) => {
        reactDispatch(hideLoading());
        handleApiError(error.message, dispatch)
    });
};

export const createServiceability = (params: any, isUpdate: boolean): any => async (dispatch: Dispatch) => {
    return serviceability.createServiceability(params, isUpdate).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getServiceabilityDetails = (params: any): any => async (dispatch: Dispatch) => {
    return serviceability.getServiceabilityDetails(params).then((responseAxios: any) => responseAxios && responseAxios.details
        && responseAxios.details.length && responseAxios.details[0]
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getLrNumberListDetails = (params: any): any => async (dispatch: Dispatch) => {
    return serviceability.getLrNumberDetails(params).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getServiceableVehciles = (params: any): any => async (dispatch: Dispatch) => {
    return serviceability.getServiceableVehciles(params).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const downloadOdaPincodesCsv = (params: any): any => async (dispatch: Dispatch) => {
    return serviceability.downloadOdaPincodesCsv(params)
        .then((responseAxios: any) => responseAxios && responseAxios.details
        ).catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};