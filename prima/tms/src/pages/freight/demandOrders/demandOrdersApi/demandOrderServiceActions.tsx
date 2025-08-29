import { Dispatch } from "redux";
import { handleApiError } from "../../../../base/utility/ErrorHandleUtils";
import { demandOrder } from './demandOrderServices';

export const getDOList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return demandOrder.getDOList(queryParams).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const getModifyDOList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return demandOrder.getModifyDOList(queryParams).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const createDO = (params: any): any => async (dispatch: Dispatch) => {
    return demandOrder.createDO(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const createBulkDO = (params: any): any => async (dispatch: Dispatch) => {
    return demandOrder.createBulkDO(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const updateDO = (params: any): any => async (dispatch: Dispatch) => {
    return demandOrder.updateDO(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const deleteDemandOrder = (queryParams: any): any => async (dispatch: Dispatch) => {
    return demandOrder.deleteDemandOrder(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const deleteBulkDemandOrder = (queryParams: any): any => async (dispatch: Dispatch) => {
    return demandOrder.deleteBulkDemandOrder(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const approveDemandOrder = (queryParams: any): any => async (dispatch: Dispatch) => {
    return demandOrder.approveDemandOrder(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const approveBulkDemandOrder = (queryParams: any): any => async (dispatch: Dispatch) => {
    return demandOrder.approveBulkDemandOrder(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const assignDemandOrder = (queryParams: any): any => async (dispatch: Dispatch) => {
    return demandOrder.assignDemandOrder(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const assignBulkDemandOrder = (queryParams: any): any => async (dispatch: Dispatch) => {
    return demandOrder.assignBulkDemandOrder(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const modifyAcceptDO = (params: any): any => async (dispatch: Dispatch) => {
    return demandOrder.modifyAcceptDO(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const modifyRejectDO = (params: any): any => async (dispatch: Dispatch) => {
    return demandOrder.modifyRejectDO(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getDoMaterialList = (params: any): any => async (dispatch: Dispatch) => {
    return demandOrder.doMaterialList(params).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getMaterialsList = (params: any): any => async (dispatch: Dispatch) => {
    return demandOrder.getMaterialsList(params).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};
