import { Dispatch } from "redux";
import { product } from "../services";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { setResponse, hideLoading } from '../redux/actions/ProductActions';
import { hideLoader } from '../redux/actions/AppActions';

export const getProductList = (reactDispatch: any, queryParams: any): any => async (dispatch: Dispatch) => {
    product.getProductList(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    }).catch((error: any) => {
        reactDispatch(hideLoading());
        handleApiError(error.message, dispatch)
    });
};

export const createProduct = (params: any): any => async (dispatch: Dispatch) => {
    return product.createProduct(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const searchProductList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return product.searchProduct(queryParams).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};
