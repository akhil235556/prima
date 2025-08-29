import { Dispatch } from "redux";
import { handleApiError } from "../../../../base/utility/ErrorHandleUtils";
import { hideLoader } from "../../../../redux/actions/AppActions";
import { hideLoading, setResponse } from "../customersRedux/CustomerAction";
import { Customer } from "../customersRedux/CustomerStoreInterface";
import { customer } from './customerServices';

export const getCustomersList = (reactDispatch: any, queryParams: any): any => async (dispatch: Dispatch) => {
    customer.getCustomersList(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios && responseAxios.details));
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    }
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    });
};

export const createCustomer = (params: Customer): any => async (dispatch: Dispatch) => {
    return customer.createCustomer(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const updateCustomer = (params: Customer): any => async (dispatch: Dispatch) => {
    return customer.updateCustomer(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const searchCustomer = (queryParams: any): any => async (dispatch: Dispatch) => {
    return customer.searchCustomer(queryParams).then((responseAxios: any) => responseAxios.details && responseAxios.details.results
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};