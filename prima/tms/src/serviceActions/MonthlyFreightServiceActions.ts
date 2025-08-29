import { Dispatch } from "redux";
import { freight } from "../services";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { setResponse, hideLoading } from "../redux/actions/MonthlyFreightActions";

export const getMonthlyFreightList = (reactDispatch: any, params: any): any => async (dispatch: Dispatch) => {
    freight.getMonthlyFreightList(params).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));
        reactDispatch(hideLoading());
    }).catch((error: any) => {
        reactDispatch(hideLoading());
        handleApiError(error.message, dispatch)
    });
};

export const createMonthlyFreight = (params: any): any => async (dispatch: Dispatch) => {
    return freight.createMonthlyFreight(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};