
import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { hideLoader } from '../redux/actions/AppActions';
import { hideLoading, setResponse } from "../redux/actions/SobActions";
import { sobServices } from "../services";


export const getSobListing = (reactDispatch: any, queryParams: any): any => async (dispatch: Dispatch) => {
    return sobServices.getSobListing(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    }
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
}

export const createSob = (queryParams: any): any => async (dispatch: Dispatch) => {
    return sobServices.createSob(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};


export const getSob = (queryParams: any): any => async (dispatch: Dispatch) => {
    return sobServices.getSob(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const updateSob = (queryParams: any): any => async (dispatch: Dispatch) => {
    return sobServices.updateSob(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const deleteSob = (queryParams: any): any => async (dispatch: Dispatch) => {
    return sobServices.deleteSob(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const searchSob = (queryParams: any): any => async (dispatch: Dispatch) => {
    return sobServices.searchSob(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};