import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { hideLoader } from '../redux/actions/AppActions';
import { freightPaymentReport, freightPaymentReportDownload } from "../services";

export const getFreightPaymentReportList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return freightPaymentReport.getFreightPaymentReportList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
        dispatch(hideLoader());
    });
};

export const getCountList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return freightPaymentReport.getCountList(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const getCsvLink = (params?: any): any => async (appDispatch: Dispatch) => {
    return freightPaymentReportDownload.getCsvLink(params).then((responseAxios: any) => {
        return responseAxios;
    }).catch((error: any) => {
        handleApiError(error.message, appDispatch)
    });
};