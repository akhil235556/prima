import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { exportServices } from "../services";

export const getExportTemplate = (): any => async (dispatch: Dispatch) => {
    return exportServices.getExportTemplate().then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const postExport = (params: any): any => async (dispatch: Dispatch) => {
    return exportServices.postExport(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const shipmentCreateExport = (params: any): any => async (dispatch: Dispatch) => {
    return exportServices.shipmentCreateExport(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};