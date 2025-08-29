import { alert } from '../services';
import { Dispatch } from 'redux';
import { handleApiError } from "../base/utility/ErrorHandleUtils";


export const getSnoozeReasons = (params: any): any => async (appDispatch: Dispatch) => {
    return alert.getSnoozeReasons(params).then((responseAxios: any) => {
        return responseAxios.details;
    }).catch((error) => {
        handleApiError(error.message, appDispatch)
    });
};

export const postSnoozeReason = (params?: any): any => async (appDispatch: Dispatch) => {
    return alert.postSnoozeReason(params).then((responseAxios: any) => {
        return responseAxios;
    }).catch((error) => {
        handleApiError(error.message, appDispatch)
    });
};