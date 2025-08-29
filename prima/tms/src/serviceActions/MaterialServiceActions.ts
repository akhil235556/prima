import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { hideLoader } from '../redux/actions/AppActions';
import { hideLoading, setResponse } from "../redux/actions/MaterialAction";
import { Material } from '../redux/storeStates/MaterialStoreInterface';
import { material } from "../services";

export const getMaterialList = (reactDispatch: any, queryParams: any): any => async (dispatch: Dispatch) => {
    material.getMaterialList(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    }).catch((error: any) => {
        reactDispatch(hideLoading());
        handleApiError(error.message, dispatch);

    });
};

export const searchMaterialList = (queryParams?: any): any => async (dispatch: Dispatch) => {
    return material.searchMaterialList(queryParams).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const createMaterial = (params: Material, isUpdate: boolean): any => async (dispatch: Dispatch) => {
    return material.createMaterial(params, isUpdate).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getMaterial = (params: any): any => async (dispatch: Dispatch) => {
    return material.getMaterialList(params).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getBulkMaterialUnitsCount = (params: any): any => async (dispatch: Dispatch) => {
    return material.getBulkMaterialUnitsCount(params).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const convertUom = (params: any): any => async (dispatch: Dispatch) => {
    return material.convertUom(params).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};