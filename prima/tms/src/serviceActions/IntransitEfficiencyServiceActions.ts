import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { inTransitEfficiency, inTransitEfficiencyDownload } from "../services";

export const getInTransitEfficiencyList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return inTransitEfficiency.getInTransitEfficiencyList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const getCountList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return inTransitEfficiencyDownload.getCountList(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};


export const getCsvLink = (params?: any): any => async (appDispatch: Dispatch) => {
    return inTransitEfficiencyDownload.getCsvLink(params).then((responseAxios: any) => {
        return responseAxios;
    }).catch((error: any) => {
        handleApiError(error.message, appDispatch)
    });
};