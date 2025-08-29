import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { hideLoader } from '../redux/actions/AppActions';
import { hideLoading, setResponse } from "../redux/actions/ConsigneeAction";
import { Consignee } from "../redux/storeStates/ConsigneeStoreInterface";
import { consignee } from "../services";

export const getConsigneeList = (reactDispatch: any, queryParams: any): any => async (dispatch: Dispatch) => {
    consignee.getConsigneeList(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));

        reactDispatch(hideLoading());
        dispatch(hideLoader());
    }).catch((error: any) => {
        reactDispatch(hideLoading());
        handleApiError(error.message, dispatch);

    });
};

export const createConsignee = (params: Consignee): any => async (dispatch: Dispatch) => {
    return consignee.createConsignee(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const updateConsignee = (params: Consignee): any => async (dispatch: Dispatch) => {
    return consignee.updateConsignee(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const searchCustomer = (queryParams: any): any => async (dispatch: Dispatch) => {
    return consignee.searchCustomer(queryParams).then((responseAxios: any) => responseAxios.details && responseAxios.details.results
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};