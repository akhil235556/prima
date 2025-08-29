import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { onTimeDispatchReport, onTimeDispatchReportDownload } from "../services";

export const getOnTimeDispatchReportList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return onTimeDispatchReport.getOnTimeDispatchReportList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const getCountList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return onTimeDispatchReportDownload.getCountList(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const getCsvLink = (params?: any): any => async (appDispatch: Dispatch) => {
    return onTimeDispatchReportDownload.getCsvLink(params).then((responseAxios: any) => {
        return responseAxios;
    }).catch((error: any) => {
        handleApiError(error.message, appDispatch)
    });
};

export const getDispatchGraphList = (queryParams: any, reactDispatch?: any): any => async (dispatch: Dispatch) => {
    return onTimeDispatchReport.getDispatchGraphList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};