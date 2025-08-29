import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { loadability, loadabilityDownload } from "../services";

export const getLoadabilityList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return loadability.getLoadabilityList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const getCountList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return loadability.getCountList(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const getCsvLink = (params?: any): any => async (appDispatch: Dispatch) => {
    return loadabilityDownload.getCsvLink(params).then((responseAxios: any) => {
        return responseAxios;
    }).catch((error: any) => {
        handleApiError(error.message, appDispatch)
    });
};