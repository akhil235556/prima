import { Dispatch } from "redux";
import { handleApiError } from "../../../../base/utility/ErrorHandleUtils";
import { hideLoader } from "../../../../redux/actions/AppActions";
import { hideLoading, setResponse } from "../../sto/stoRedux/StockTransferActions";
import { purchaseOrder } from './purchaseOrderServices';

export const getPODetails = (params: any): any => async (dispatch: Dispatch) => {
    return purchaseOrder.getPOList(params).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getPOList = (reactDispatch: any, queryParams: any, tabName: string): any => async (dispatch: Dispatch) => {
    purchaseOrder.getPOList(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details, tabName));
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    }
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    });
};

export const getPOConsigneeDetails = (params: any): any => async (dispatch: Dispatch) => {
    return purchaseOrder.getPOConsigneeDetails(params).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getPOProductDetails = (params: any): any => async (dispatch: Dispatch) => {
    return purchaseOrder.getPOProductDetails(params).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getPOVendorDetails = (params: any): any => async (dispatch: Dispatch) => {
    return purchaseOrder.getPOVendorDetails(params).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getPOTemplateDetails = (params: any): any => async (dispatch: Dispatch) => {
    return purchaseOrder.getPOTemplateDetails(params).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getBulkPOTemplateDetails = (params: any): any => async (dispatch: Dispatch) => {
    return purchaseOrder.getBulkPOTemplateDetails(params).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};