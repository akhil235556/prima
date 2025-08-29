import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { freightType } from "../services";

export const getFreightTypeList = (): any => async (dispatch: Dispatch) => {
    return freightType.getFreightTypeList().then((responseAxios: any) => responseAxios && responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getClientFreightTypeList = (): any => async (dispatch: Dispatch) => {
    let queryParams = {
        isActive: 1
    }
    return freightType.getClientFreightTypeList(queryParams).then((responseAxios: any) =>
        responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getAllClientFreightType = (): any => async (dispatch: Dispatch) => {
    return freightType.getAllClientFreightType().then((responseAxios: any) =>
        responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const enableFreightType = (params: any): any => async (dispatch: Dispatch) => {
    return freightType.enableFreightType(params).then((responseAxios: any) =>
        responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};


export const updateFreightType = (params: any): any => async (dispatch: Dispatch) => {
    return freightType.updateFreightType(params).then((responseAxios: any) =>
        responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const getPtlStatus = () => async (dispatch: Dispatch) => {
    return freightType.getPtlStatus().then((response: any) =>
        response.zoneEnabled || false
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
        return false;
    });
}
