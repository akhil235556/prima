import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { hideLoader } from '../redux/actions/AppActions';
import { shortageDamageReport, shortageDamageReportDownload } from "../services";

export const getShortageDamageReportList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return shortageDamageReport.getShortageDamageReportList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
        dispatch(hideLoader());
    });
};

export const getCountList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return shortageDamageReportDownload.getCountList(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const getCsvLink = (params?: any): any => async (appDispatch: Dispatch) => {
    return shortageDamageReportDownload.getCsvLink(params).then((responseAxios: any) => {
        return responseAxios;
    }).catch((error: any) => {
        handleApiError(error.message, appDispatch)
    });
};