import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { setAutoCompleteList } from "../moduleUtility/DataUtils";
import { hideLoading, setResponse } from '../redux/actions/ContractActions';
import { setBillingCycleList } from "../redux/actions/CreateContractActions";
import { contract } from "../services";

export const getContractList = (reactDispatch: any, queryParams: any): any => async (dispatch: Dispatch) => {
    contract.getContractList(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));
        reactDispatch(hideLoading());
    }).catch((error: any) => {
        reactDispatch(hideLoading());
        handleApiError(error.message, dispatch)
    });
};

export const getContractDetails = (queryParams: any): any => async (dispatch: Dispatch) => {
    return contract.getContractList(queryParams).then((responseAxios: any) =>
        responseAxios && responseAxios.details && responseAxios.details.contracts && (responseAxios.details.contracts.length > 0) && responseAxios.details.contracts[0]
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const searchContractDetails = (queryParams: any): any => async (dispatch: Dispatch) => {
    return contract.searchContractDetails(queryParams).then((responseAxios: any) =>
        responseAxios && responseAxios.details && responseAxios.details.contracts && (responseAxios.details.contracts.length > 0) && responseAxios.details.contracts[0]
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const searchContractIdList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return contract.searchContractIdList(queryParams).then((responseAxios: any) =>
        responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};


export const createContract = (params: any): any => async (dispatch: Dispatch) => {
    return contract.createContract(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const approveContract = (params: any): any => async (dispatch: Dispatch) => {
    return contract.approveContract(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const terminateContract = (params: any): any => async (dispatch: Dispatch) => {
    return contract.terminateContract(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getBillingCycle = (reactDispatch?: any): any => async (dispatch: Dispatch) => {
    contract.getBillingCycle().then((responseAxios: any) => {
        responseAxios && reactDispatch(setBillingCycleList(setAutoCompleteList(responseAxios.details, "cycle", "cycle")))
    }
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getBillingCycleNoDues = (reactDispatch?: any): any => async (dispatch: Dispatch) => {
    return contract.getBillingCycle().then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getActiveContracts = (params: any): any => async (dispatch: Dispatch) => {
    return contract.getActiveContracts(params).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const contractRenewal = (params: any): any => async (dispatch: Dispatch) => {
    return contract.contractRenewal(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getUnPaginatedContractList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return contract.getUnPaginatedContractList(queryParams).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const bulkApproveContract = (params: any): any => async (dispatch: Dispatch) => {
    return contract.bulkApproveContract(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};


export const getSobContractsList = (params: any): any => async (dispatch: Dispatch) => {
    return contract.getSobContractsList(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getConstraints = (params: any): any => async (dispatch: Dispatch) => {
    return contract.getConstraints(params).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const createConstraints = (params: any): any => async (dispatch: Dispatch) => {
    return contract.createConstraints(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const templateConstraints = (params: any): any => async (dispatch: Dispatch) => {
    return contract.templateConstraints(params).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};
