import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { sobReport, sobReportDownload } from "../services";

export const getSobList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return sobReport.getSobList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const getCountList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return sobReport.getCountList(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const getCsvLink = (params?: any): any => async (appDispatch: Dispatch) => {
    return sobReportDownload.getCsvLink(params).then((responseAxios: any) => {
        return responseAxios;
    }).catch((error: any) => {
        handleApiError(error.message, appDispatch)
    });
};

export const getSobReport = (queryParams: any): any => async (dispatch: Dispatch) => {
    return sobReport.getSobReport(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};