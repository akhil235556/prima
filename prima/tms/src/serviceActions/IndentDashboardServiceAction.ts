import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { hideLoading, setResponse } from "../redux/actions/IndentDashboardAction";
import { indentDashboard, indentDashboardDownload } from "../services";

export const getSobLaneContribution = (reactDispatch: any, queryParams: any): any =>
    async (dispatch: Dispatch) => {
        return indentDashboard.getSobLaneContributionList(queryParams)
            .then((responseAxios: any) => {
                reactDispatch(setResponse(responseAxios.details));
                reactDispatch(hideLoading());
            })
            .catch((error: any) => {
                reactDispatch(hideLoading());
                handleApiError(error.message, dispatch);
            });
    }

export const getCsvLink = (params?: any): any => async (appDispatch: Dispatch) => {
    return indentDashboardDownload.getCsvLink(params).then((responseAxios: any) => {
        return responseAxios.details;
    }).catch((error: any) => {
        handleApiError(error.message, appDispatch)
    });
};

