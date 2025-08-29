import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { hideLoader } from '../redux/actions/AppActions';
import { monthlyFreightReport, monthlyFreightReportDownload } from "../services";

export const getMonthlyFreightReportList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return monthlyFreightReport.getMonthlyFreightReportList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
        dispatch(hideLoader());
    });
};

export const getCsvLink = (params?: any): any => async (appDispatch: Dispatch) => {
    return monthlyFreightReportDownload.getCsvLink(params).then((responseAxios: any) => {
        return responseAxios;
    }).catch((error: any) => {
        handleApiError(error.message, appDispatch)
    });
};