import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { order } from "../services";

export const getOrderList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return order.getOrderList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getFreightOrderList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return order.getFreightOrderList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getFreightInvoicingList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return order.getFreightInvoicing(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getDashboardOrderList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return order.getDashboardOrderList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getDashboardCountList = (queryParams?: any): any => async (dispatch: Dispatch) => {
    return order.getDashboardCountList(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getFreightReconciliationOrderList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return order.getOrderList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getEpodData = (queryParams: any): any => async (dispatch: Dispatch) => {
    return order.getEpodData(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const confirmPartner = (params: any): any => async (dispatch: Dispatch) => {
    return order.confirmPartner(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const shipmentPlaced = (params: any): any => async (dispatch: Dispatch) => {
    return order.shipmentPlaced(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const shipmentOut = (params: any): any => async (dispatch: Dispatch) => {
    return order.shipmentOut(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const addArticleInvoice = (params: any): any => async (dispatch: Dispatch) => {
    return order.addArticleInvoice(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const shipmentDelivered = (params: any): any => async (dispatch: Dispatch) => {
    return order.shipmentDelivered(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const shipmentReport = (params: any): any => async (dispatch: Dispatch) => {
    return order.shipmentReport(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const assignPartner = (params: any): any => async (dispatch: Dispatch) => {
    return order.assignPartner(params).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const freightOrderCancel = (params: any): any => async (dispatch: Dispatch) => {
    return order.freightOrderCancel(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const createByDispatch = (params: any): any => async (dispatch: Dispatch) => {
    return order.createByDispatch(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const raiseIndent = (params: any): any => async (dispatch: Dispatch) => {
    return order.raiseIndent(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const orderCreation = (params: any): any => async (dispatch: Dispatch) => {
    return order.orderCreation(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const orderDetail = (params: any): any => async (dispatch: Dispatch) => {
    return order.orderDetail(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getOrderDetail = (params: any): any => async (dispatch: Dispatch) => {
    return order.getOrderDetail(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getELrData = (queryParams: any): any => async (dispatch: Dispatch) => {
    return order.getELrData(queryParams).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getClaims = (queryParams: any): any => async (dispatch: Dispatch) => {
    return order.getClaims(queryParams).then((responseAxios: any) => responseAxios && responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const saveClaims = (queryParams: any): any => async (dispatch: Dispatch) => {
    return order.saveClaims(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const orderCount = (): any => async (dispatch: Dispatch) => {
    return order.orderCount().then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const addShipment = (params: any): any => async (dispatch: Dispatch) => {
    return order.addShipment(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const editShipment = (params: any): any => async (dispatch: Dispatch) => {
    return order.editShipment(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getInboundOrderList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return order.getInboundOrderList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getInboundDispatchOrder = (params: any): any => async (dispatch: Dispatch) => {
    return order.getInboundDispatchOrder(params).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getOrderLocations = (queryParams: any): any => async (dispatch: Dispatch) => {
    return order.getOrderLocations(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getOrderZoneLocations = (queryParams: any): any => async (dispatch: Dispatch) => {
    return order.getOrderZoneLocations(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};


export const getOrderLogList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return order.getOrderLogList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getPrintInvoice = (queryParams: any): any => async (dispatch: Dispatch) => {
    return order.getPrintInvoice(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const cancelInvoice = (queryParams: any): any => async (dispatch: Dispatch) => {
    return order.cancelInvoice(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const diversionListing = (params: any): any => async (dispatch: Dispatch) => {
    return order.diversionListing(params).then((responseAxios: any) => responseAxios && responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const diversionDetails = (params: any): any => async (dispatch: Dispatch) => {
    return order.diversionDetails(params).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const createDiversionRequest = (params: any): any => async (dispatch: Dispatch) => {
    return order.diversionRequestCreate(params).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const diversionApprove = (params: any): any => async (dispatch: Dispatch) => {
    return order.diversionApprove(params).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const diversionReject = (params: any): any => async (dispatch: Dispatch) => {
    return order.diversionReject(params).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getShipmentTagList = (queryParams?: any): any => async (dispatch: Dispatch) => {
    return order.getShipmentTagList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const diversionCreateFreightOrder = (params: any): any => async (dispatch: Dispatch) => {
    return order.diversionCreateFreightOrder(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const diversionConfirmOrder = (params: any): any => async (dispatch: Dispatch) => {
    return order.diversionConfirmOrder(params).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const diversionPlaceOrder = (params: any): any => async (dispatch: Dispatch) => {
    return order.diversionPlaceOrder(params).then((responseAxios: any) => responseAxios && responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const diversionDispatchOrder = (params: any): any => async (dispatch: Dispatch) => {
    return order.diversionDispatchOrder(params).then((responseAxios: any) => responseAxios && responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const diversionTotalMaterialList = (params: any): any => async (dispatch: Dispatch) => {
    return order.diversionTotalMaterialList(params).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getFreightOrderPeriodicInvoiceList = (params: any): any => async (dispatch: Dispatch) => {
    return order.getFreightOrderPeriodicInvoiceList(params).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getFreightReconciliationOrderListing = (params: any): any => async (dispatch: Dispatch) => {
    return order.getFreightReconciliationOrderListing(params).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getFreightReconcilationOrderDetails = (params: any): any => async (dispatch: Dispatch) => {
    return order.getFreightReconcilationOrderDetails(params).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const downloadReconciliationCsv = (params: any): any => async (dispatch: Dispatch) => {
    return order.downloadReconciliationCsv(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const createPeriodicBill = (params: any): any => async (dispatch: Dispatch) => {
    return order.createPeriodicBill(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getFreightBillingContractDetails = (params: any): any => async (dispatch: Dispatch) => {
    return order.getFreightBillingContractDetails(params).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getFreightReconcilationContractDetails = (params: any): any => async (dispatch: Dispatch) => {
    return order.getFreightReconcilationContractDetails(params).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const orderOrchestration = (queryParams: any): any => async (dispatch: Dispatch) => {
    return order.orderOrchestration(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};