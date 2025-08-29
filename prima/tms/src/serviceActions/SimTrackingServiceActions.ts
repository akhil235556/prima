import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { simTracking } from "../services";

export const simTrackingList = (params: any): any => async (dispatch: Dispatch) => {
    return simTracking.simTrackingList(params).then((responseAxios: any) =>
        responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const simTrackingDetailList = (params: any): any => async (dispatch: Dispatch) => {
    return simTracking.simTrackingDetailList(params).then((responseAxios: any) =>
        responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const simTrackingDownload = (params: any): any => async (dispatch: Dispatch) => {
    return simTracking.simTrackingDownload(params).then((responseAxios: any) =>
        responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const getCsvLink = (params: any): any => async (dispatch: Dispatch) => {
    return simTracking.getCsvLink(params).then((responseAxios: any) =>
        responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};