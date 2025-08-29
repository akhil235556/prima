import { Dispatch } from 'redux';
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { config } from "../services";

export const getConfigList = (params: any): any => async (appDispatch: Dispatch) => {
    return config.getConfigList(params).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, appDispatch);
    });
};

export const saveConfig = (params: any): any => async (appDispatch: Dispatch) => {
    return config.saveConfig(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, appDispatch);
    });
};

export const getEditShipmentConfig = (queryParams: any): any => async (dispatch: Dispatch) => {
    return config.getEditShipmentConfig(queryParams).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};
