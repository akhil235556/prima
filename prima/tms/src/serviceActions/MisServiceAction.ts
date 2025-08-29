import { Dispatch } from "redux";
import { mis } from "../services";
import { handleApiError } from "../base/utility/ErrorHandleUtils";

export const dispatchDashboardCount = (queryParams?: any): any => async (dispatch: Dispatch) => {
    return mis.dispatchDashboardCount(queryParams).then((responseAxios: any) => responseAxios && responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const dispatchChartData = (queryParams?: any): any => async (dispatch: Dispatch) => {
    return mis.dispatchChartData(queryParams).then((responseAxios: any) => responseAxios && responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};
