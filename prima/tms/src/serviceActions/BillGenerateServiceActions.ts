import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { hideLoader } from '../redux/actions/AppActions';
import { hideLoading, setResponse } from '../redux/actions/InvoiceActions';
import { billGenerate } from "../services";
// import { FreightReconciliation } from "../redux/storeStates/FreightReconciliationInterface";

export const getInvoiceList = (reactDispatch: any, queryParams: any, tabName: string, status: string): any => async (dispatch: Dispatch) => {
    billGenerate.getInvoiceList(queryParams, status).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details, tabName));
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    }).catch((error: any) => {
        handleApiError(error.message, dispatch);
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    });
};

export const getUnapproveInvoiceList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return billGenerate.getUnapproveInvoiceList(queryParams).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
        dispatch(hideLoader());
    });
};

export const bulkApproveInvoice = (params: any): any => async (dispatch: Dispatch) => {
    return billGenerate.bulkApproveInvoice(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
        dispatch(hideLoader());
    });
};

export const payBulkBill = (params: any): any => async (dispatch: Dispatch) => {
    return billGenerate.payBulkBill(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
        dispatch(hideLoader());
    });
};

export const getInvoiceTemplateData = (queryParams?: any): any => async (dispatch: Dispatch) => {
    return billGenerate.getInvoiceTemplateData(queryParams).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch);
        });
};

export const orderTransactions = (params: any): any => async (dispatch: Dispatch) => {
    return billGenerate.orderTransactions(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const invoiceTransactions = (params: any): any => async (dispatch: Dispatch) => {
    return billGenerate.invoiceTransactions(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const generateBill = (params: any): any => async (dispatch: Dispatch) => {
    return billGenerate.generateBill(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const updateBill = (params: any): any => async (dispatch: Dispatch) => {
    return billGenerate.updateBill(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const approveBill = (params: any): any => async (dispatch: Dispatch) => {
    return billGenerate.approveBill(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const awaitBill = (params: any): any => async (dispatch: Dispatch) => {
    return billGenerate.awaitBill(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
        throw (new Error(error));
    });
};


export const payBill = (params: any): any => async (dispatch: Dispatch) => {
    return billGenerate.payBill(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const rejectBill = (params: any): any => async (dispatch: Dispatch) => {
    return billGenerate.rejectBill(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const rejectPeriodicBill = (params: any): any => async (dispatch: Dispatch) => {
    return billGenerate.rejectPeriodicBill(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getNoDues = (queryParams: any): any => async (dispatch: Dispatch) => {
    return billGenerate.getNoDues(queryParams).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const aggregateData = (queryParams?: any): any => async (dispatch: Dispatch) => {
    return billGenerate.aggregateData(queryParams).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getDisputesList = (queryParams?: any): any => async (dispatch: Dispatch) => {
    return billGenerate.getDisputesList(queryParams).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const createDispute = (queryParams?: any): any => async (dispatch: Dispatch) => {
    return billGenerate.createDispute(queryParams).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const createDisputeV2 = (queryParams?: any): any => async (dispatch: Dispatch) => {
    return billGenerate.createDisputeV2(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};
export const raiseDispute = (params: any): any => async (dispatch: Dispatch) => {
    return billGenerate.raiseDispute(params)
        .then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch);
        })
}

export const acceptBill = (params: any): any => async (dispatch: Dispatch) => {
    return billGenerate.acceptBill(params)
        .then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch);
        })
}

export const resolveBillV2 = (params: any): any => async (dispatch: Dispatch) => {
    return billGenerate.resolveBillV2(params)
        .then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch);
        })
}

export const getDisputeReasons = (): any => async (dispatch: Dispatch) => {
    return billGenerate.getDisputeReasons()
        .then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch);
        })
}

export const getUsersList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return billGenerate.getUsersList(queryParams)
        .then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch);
        })
}

export const updateApprover = (params: any): any => async (dispatch: Dispatch) => {
    return billGenerate.updateApprover(params)
        .then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch);
            throw new Error(error);
        })
}

export const getApprover = (queryParams: any): any => async (dispatch: Dispatch) => {
    return billGenerate.getApprover(queryParams)
        .then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch);
        })
}

export const commentsTransactions = (params: any): any => async (dispatch: Dispatch) => {
    return billGenerate.commentsTransactions(params).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const saveTransactionDetail = (params: any): any => async (dispatch: Dispatch) => {
    return billGenerate.saveTransactionDetail(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getFreightOrderDetails = (params: any): any => async (dispatch: Dispatch) => {
    return billGenerate.getFreightOrderDetails(params).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getFreightBillingPeriodicInvoiceList = (params: any): any => async (dispatch: Dispatch) => {
    return billGenerate.getFreightBillingPeriodicInvoiceList(params).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const updatePeriodicBill = (params: any): any => async (dispatch: Dispatch) => {
    return billGenerate.updatePeriodicBill(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const disputeModalOrderDetails = (params: any): any => async (dispatch: Dispatch) => {
    return billGenerate.disputeModalOrderDetails(params).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};