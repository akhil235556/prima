import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { trackRequestVehicle } from "../services";

export const getCurrentVehicleType = (queryParams: any): any => async (dispatch: Dispatch) => {
    return trackRequestVehicle.getCurrentVehicleType(queryParams).then((responseAxios: any) => responseAxios && responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const raiseRequestVehicleType = (queryParams: any): any => async (dispatch: Dispatch) => {
    return trackRequestVehicle.raiseRequestVehicleType(queryParams).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const approveTrackRequest = (queryParams: any): any => async (dispatch: Dispatch) => {
    return trackRequestVehicle.approveTrackRequest(queryParams).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const rejectTrackRequest = (queryParams: any): any => async (dispatch: Dispatch) => {
    return trackRequestVehicle.rejectTrackRequest(queryParams).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getConfigVehicleType = (queryParams?: any): any => async (dispatch: Dispatch) => {
    return trackRequestVehicle.getConfigVehicleType(queryParams).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getPlacementDateTime = (queryParams: any): any => async (dispatch: Dispatch) => {
    return trackRequestVehicle.getPlacementDateTime(queryParams).then((responseAxios: any) => responseAxios && responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const acceptPlacementDateTime = (queryParams: any): any => async (dispatch: Dispatch) => {
    return trackRequestVehicle.acceptPlacementDateTime(queryParams).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const orchestrationToken = (queryParams: any): any => async (dispatch: Dispatch) => {
    return trackRequestVehicle.orchestrationToken(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
}

export const rejectPlacementDateTime = (queryParams: any): any => async (dispatch: Dispatch) => {
    return trackRequestVehicle.rejectPlacementDateTime(queryParams).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};
export const configPlacementDateTime = (): any => async (dispatch: Dispatch) => {
    return trackRequestVehicle.configPlacementDateTime().then((responseAxios: any) => responseAxios && responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};
