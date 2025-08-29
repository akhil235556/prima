import { Dispatch } from "redux";
import { dispatchManagement } from "../services";
import { handleApiError } from "../base/utility/ErrorHandleUtils";

export const getDispatchList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return dispatchManagement.getDispatchList(queryParams).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getDispatchOrderList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return dispatchManagement.getDispatchOrderList(queryParams).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

