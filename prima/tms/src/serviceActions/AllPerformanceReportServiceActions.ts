import { Dispatch } from "redux";
import { allPerformanceReport } from "../services";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { setResponse } from "../redux/actions/AllPerformanceReportActions";
import { hideLoader } from '../redux/actions/AppActions';

export const getAllPerformanceReportList = (reactDispatch: any, queryParams: any): any => async (dispatch: Dispatch) => {
    allPerformanceReport.getAllPerformanceReportList(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));
        dispatch(hideLoader());
    }).catch((error: any) => {
        handleApiError(error.message, dispatch);
        dispatch(hideLoader());
    });
};