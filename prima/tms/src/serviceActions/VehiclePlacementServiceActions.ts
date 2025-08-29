import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { vehiclePlacementReport, vehiclePlacementReportDownload } from "../services";

export const getVehiclePlacementList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return vehiclePlacementReport.getVehiclePlacementList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const getCountList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return vehiclePlacementReport.getCountList(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const getCsvLink = (params?: any): any => async (appDispatch: Dispatch) => {
    return vehiclePlacementReportDownload.getCsvLink(params).then((responseAxios: any) => {
        return responseAxios;
    }).catch((error: any) => {
        handleApiError(error.message, appDispatch)
    });
};