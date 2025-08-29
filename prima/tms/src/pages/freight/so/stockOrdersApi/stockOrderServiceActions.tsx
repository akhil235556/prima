import { Dispatch } from "redux";
import { handleApiError } from "../../../../base/utility/ErrorHandleUtils";
import { hideLoader } from "../../../../redux/actions/AppActions";
import { hideLoading, setResponse } from "../../sto/stoRedux/StockTransferActions";
import { stockOrder } from './stockOrderServices';

export const getSOList = (reactDispatch: any, queryParams: any, tabName: string): any => async (dispatch: Dispatch) => {
    stockOrder.getSOList(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios && responseAxios.details, tabName));
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    }
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    });
};

export const getSODetails = (params: any): any => async (dispatch: Dispatch) => {
    return stockOrder.getSOList(params).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getSOConsigneeDetails = (params: any): any => async (dispatch: Dispatch) => {
    return stockOrder.getSOConsigneeDetails(params).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getSOProductDetails = (params: any): any => async (dispatch: Dispatch) => {
    return stockOrder.getSOProductDetails(params).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getSOVendorDetails = (params: any): any => async (dispatch: Dispatch) => {
    return stockOrder.getSOVendorDetails(params).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getSOTemplateDetails = (params: any): any => async (dispatch: Dispatch) => {
    return stockOrder.getSOTemplateDetails(params).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getBulkSOTemplateDetails = (params: any): any => async (dispatch: Dispatch) => {
    return stockOrder.getBulkSOTemplateDetails(params).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};