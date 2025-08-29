import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { shipment } from "../services";

export const getClientList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return shipment.getClientList(queryParams).then((responseAxios: any) => responseAxios && responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getShipmentStatus = (queryParams: any): any => async (dispatch: Dispatch) => {
    return shipment.getShipmentStatus(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getStatusList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return shipment.getStatusList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getSubStatusList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return shipment.getSubStatusList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getStatusLatest = (queryParams: any): any => async (dispatch: Dispatch) => {
    return shipment.getStatusLatest(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const scanStatus = (queryParams: any): any => async (dispatch: Dispatch) => {
    return shipment.scanStatus(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getOrderList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return shipment.getOrderList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const syncStatus = (queryParams: any): any => async (dispatch: Dispatch) => {
    return shipment.syncStatus(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const shipmentLogList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return shipment.shipmentLogList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const shipmentLogDetails = (queryParams: any): any => async (dispatch: Dispatch) => {
    return shipment.shipmentLogDetails(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const shipmentTrackingDownload = (queryParams: any): any => async (dispatch: Dispatch) => {
    return shipment.shipmentTrackingDownload(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const shipmentLogDownload = (queryParams: any): any => async (dispatch: Dispatch) => {
    return shipment.shipmentLogDownload(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};
