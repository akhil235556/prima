import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { setAutoCompleteList, setAutoCompleteListWithData } from '../moduleUtility/DataUtils';
import { hideLoader } from '../redux/actions/AppActions';
import { setFreightChargesList, setFreightVariableList } from "../redux/actions/CreateContractActions";
import { setResponse } from "../redux/actions/FreightActions";
import { freight } from "../services";

export const getFreightList = (reactDispatch: any, params: any): any => async (dispatch: Dispatch) => {
    freight.getFreightList(params).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));
        dispatch(hideLoader());
    }).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getFreightChargesList = (reactDispatch?: any, params?: any): any => async (dispatch: Dispatch) => {
    return freight.getFreightChargesList(params).then((responseAxios: any) => {
        if (reactDispatch) {
            responseAxios && reactDispatch(setFreightChargesList(setAutoCompleteListWithData(responseAxios.details, "description", "chargeName")))
            // responseAxios && reactDispatch(setFreightChargesList(setAutoCompleteListWithData(charges, "description", "chargeName")))
        } else {
            return responseAxios.details
            // setFreightChargesList(setAutoCompleteListWithData(charges, "description", "chargeName"))
        }
    }).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getFreightVariableList = (reactDispatch?: any): any => async (dispatch: Dispatch) => {
    return freight.getFreightVariableList().then((responseAxios: any) => {
        if (reactDispatch) {
            responseAxios && reactDispatch(setFreightVariableList(setAutoCompleteList(responseAxios.details, "description", "name")))
        } else {
            return responseAxios.details
        }
    }).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const createFreightRate = (params: any): any => async (dispatch: Dispatch) => {
    return freight.createFreightRate(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const updateFreightDefinition = (params: any): any => async (dispatch: Dispatch) => {
    return freight.updateFreightDefinition(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const createFreightDefinition = (params: any): any => async (dispatch: Dispatch) => {
    return freight.createFreightDefinition(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getFreightDefinition = (queryParams: any): any => async (dispatch: Dispatch) => {
    return freight.getFreightDefinition(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getProxyFreightDefinition = (queryParams: any): any => async (dispatch: Dispatch) => {
    return freight.getProxyFreightDefinition(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getLanePrice = (queryParams: any): any => async (dispatch: Dispatch) => {
    return freight.getLanePrice(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getPtlZoneContract = (queryParams: any): any => async (dispatch: Dispatch) => {
    return freight.getPtlZoneContract(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getFreightRules = (): any => async (dispatch: Dispatch) => {
    return freight.getFreightRules().then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        })
}

export const createContractFreightRates = (params: any): any => async (dispatch: Dispatch) => {
    return freight.createContractFreightRates(params).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        })
}

export const getContractFreightRates = (queryParams: any): any => async (dispatch: Dispatch) => {
    return freight.getContractFreightRates(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getProxyContractFreightRates = (queryParams: any): any => async (dispatch: Dispatch) => {
    return freight.getProxyContractFreightRates(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const putContractFreightRates = (params: any): any => async (dispatch: Dispatch) => {
    return freight.putContractFreightRates(params).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        })
}

export const deleteContractFreightRates = (params: any): any => async (dispatch: Dispatch) => {
    return freight.deleteContractFreightRates(params).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        })
}





