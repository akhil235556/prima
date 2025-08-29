import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { hideLoader } from '../redux/actions/AppActions';
import { hideLoading, setResponse } from "../redux/actions/PartnerActions";
import { partners } from "../services";

export const getPartnersList = (reactDispatch: any, queryParams: any): any => async (dispatch: Dispatch) => {
    partners.getPartnersList(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    }).catch((error: any) => {
        reactDispatch(hideLoading());
        handleApiError(error.message, dispatch)
    });
};

export const clientPartnersList = (reactDispatch: any, queryParams: any): any => async (dispatch: Dispatch) => {
    return partners.clientPartnersList(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    }).catch((error: any) => {
        reactDispatch(hideLoading());
        handleApiError(error.message, dispatch)
    });
};

export const searchClientPartner = (queryParams: any): any => async (dispatch: Dispatch) => {
    return partners.searchClientPartner(queryParams).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getNotEnabledPartnerList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return partners.getNotEnabledPartnerList(queryParams).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const searchAllPartnersList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return partners.searchAllPartner(queryParams).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const enablePartners = (params: any): any => async (dispatch: Dispatch) => {
    return partners.enablePartners(params).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const consigneeAddress = (params: any): any => async (dispatch: Dispatch) => {
    return partners.consigneeAddress(params).then((responseAxios: any) => responseAxios && responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getPartnerCheck = (queryParams: any): any => async (dispatch: Dispatch) => {
    return partners.getPartnerCheck(queryParams).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
            // return Promise.reject(error);
        });
};

export const contractTerminate = (params: any): any => async (dispatch: Dispatch) => {
    return partners.contractTerminate(params).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const disableClientPartnerRltn = (params: any): any => async (dispatch: Dispatch) => {
    return partners.disableClientPartnerRltn(params).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const createPartner = (params: any): any => async (dispatch: Dispatch) => {
    return partners.createPartner(params).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};
