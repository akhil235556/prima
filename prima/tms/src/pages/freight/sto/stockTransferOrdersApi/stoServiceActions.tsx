import { Dispatch } from "redux";
import { handleApiError } from "../../../../base/utility/ErrorHandleUtils";
import { hideLoader } from "../../../../redux/actions/AppActions";
import { hideLoading, setResponse } from "../stoRedux/StockTransferActions";
import { stockTransferOrder } from './stoServices';

export const getSTOList = (reactDispatch: any, queryParams: any, tabName: string): any => async (dispatch: Dispatch) => {
    stockTransferOrder.getSTOList(queryParams).then((responseAxios: any) => {
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

export const getSTODetails = (params: any): any => async (dispatch: Dispatch) => {
    return stockTransferOrder.getSTOList(params).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getSTOConsigneeDetails = (params: any): any => async (dispatch: Dispatch) => {
    return stockTransferOrder.getSTOConsigneeDetails(params).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getSTOProductDetails = (params: any): any => async (dispatch: Dispatch) => {
    return stockTransferOrder.getSTOProductDetails(params).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getSTOVendorDetails = (params: any): any => async (dispatch: Dispatch) => {
    return stockTransferOrder.getSTOVendorDetails(params).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getSTOTemplateDetails = (params: any): any => async (dispatch: Dispatch) => {
    return stockTransferOrder.getSTOTemplateDetails(params).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getBulkSTOTemplateDetails = (params: any): any => async (dispatch: Dispatch) => {
    return stockTransferOrder.getBulkSTOTemplateDetails(params).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};