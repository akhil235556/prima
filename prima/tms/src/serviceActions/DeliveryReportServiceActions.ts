import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { deliveryReportDownload } from "../services";

export const getDeliveryReportList = (queryParams: any, reactDispatch?: any): any => async (dispatch: Dispatch) => {
    return deliveryReportDownload.getDeliveryReportList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const getShipmentReportList = (queryParams: any, reactDispatch?: any): any => async (dispatch: Dispatch) => {
    return deliveryReportDownload.getShipmentReportList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const getDeliveryCount = (queryParams: any, reactDispatch?: any): any => async (dispatch: Dispatch) => {
    return deliveryReportDownload.getDeliveryCount(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const getCsvLink = (params: any, url: any): any => async (appDispatch: Dispatch) => {
    return deliveryReportDownload.getCsvLink(params, url).then((responseAxios: any) => {
        return responseAxios;
    }).catch((error: any) => {
        handleApiError(error.message, appDispatch)
    });
};