import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { hideLoader } from '../redux/actions/AppActions';
import { hideLoading, setResponse } from "../redux/actions/FreightReconciliationAction";
import { freightReconciliation } from "../services";

export const getFreightReconciliationList = (reactDispatch: any, queryParams: any): any => async (dispatch: Dispatch) => {
    freightReconciliation.getFreightReconciliationList(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    }).catch((error: any) => {
        handleApiError(error.message, dispatch);
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    });
};



