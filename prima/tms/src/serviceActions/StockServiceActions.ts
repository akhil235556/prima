import { Dispatch } from "redux";
import { stock } from "../services";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { hideLoading, setResponse } from "../redux/actions/ForecastAction";

export const forecastStockList = (reactDispatch: any, queryParams: any): any => async (dispatch: Dispatch) => {
    stock.forecastStockList(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));
        reactDispatch(hideLoading());
    }).catch((error: any) => {
        reactDispatch(hideLoading());
        handleApiError(error.message, dispatch)
    });
};

export const salesOrderList = (reactDispatch: any, queryParams: any): any => async (dispatch: Dispatch) => {
    stock.salesOrderList(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));
        reactDispatch(hideLoading());
    }).catch((error: any) => {
        reactDispatch(hideLoading());
        handleApiError(error.message, dispatch)
    });
};

export const getInventoryViewList = (params: any): any => async (dispatch: Dispatch) => {
    return stock.getInventoryViewList(params).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};