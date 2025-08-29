import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { detentionReport, detentionReportDownload } from "../services";

export const getDetentionReportList = (queryParams: any, reactDispatch?: any): any => async (dispatch: Dispatch) => {
    return detentionReport.getDetentionReportList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const getDetentionGraphList = (queryParams: any, reactDispatch?: any): any => async (dispatch: Dispatch) => {
    return detentionReport.getDetentionGraphList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const getCsvLink = (params?: any): any => async (appDispatch: Dispatch) => {
    return detentionReportDownload.getCsvLink(params).then((responseAxios: any) => {
        return responseAxios;
    }).catch((error: any) => {
        handleApiError(error.message, appDispatch)
    });
};