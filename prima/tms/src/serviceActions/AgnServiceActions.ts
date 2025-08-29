import { agn } from '../services';
import { Dispatch } from 'redux';
import { handleApiError } from "../base/utility/ErrorHandleUtils";


export const getAgnList = (params?: any): any => async (appDispatch: Dispatch) => {
    return agn.getAgnList(params).then((responseAxios: any) => {
        return responseAxios.details;
    }).catch((error) => {
        handleApiError(error.message, appDispatch)
    });
};

export const receiveAgn = (params?: any): any => async (appDispatch: Dispatch) => {
    return agn.receiveAgn(params).then((responseAxios: any) => {
        return responseAxios;
    }).catch((error) => {
        handleApiError(error.message, appDispatch)
    });
};

export const cancelAgn = (params: any): any => async (appDispatch: Dispatch) => {
    return agn.cancelAgn(params).then((responseAxios: any) => {
        return responseAxios.details;
    }).catch((error) => {
        handleApiError(error.message, appDispatch)
    });
};

export const createAgn = (params: any): any => async (appDispatch: Dispatch) => {
    return agn.createAgn(params).then((responseAxios: any) => responseAxios)
        .catch((error) => {
            handleApiError(error.message, appDispatch)
        });
};