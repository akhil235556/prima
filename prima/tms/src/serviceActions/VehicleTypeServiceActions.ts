import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { hideLoader, setVehicleTypeList } from '../redux/actions/AppActions';
import { hideLoading } from '../redux/actions/VehicleAction';
import { setResponse } from "../redux/actions/VehicleTypeActions";
import { VehicleType } from '../redux/storeStates/VehicleTypeStoreInterface';
import { vehicles, vehicleType } from "../services";

export const getVehicleTypeList = (reactDispatch: any, queryParams: any): any => async (dispatch: Dispatch) => {
    vehicleType.getVehicleTypeList(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    }).catch((error: any) => {
        reactDispatch(hideLoading());
        handleApiError(error.message, dispatch)
    });
};

export const getAllVehicleTypeList = (): any => async (dispatch: Dispatch) => {
    return vehicleType.getAllVehicleTypeList().then((responseAxios: any) => {
        responseAxios && responseAxios.details && responseAxios.details.vehicleTypes && dispatch(setVehicleTypeList(responseAxios.details.vehicleTypes));
        dispatch(hideLoader());
    }).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const createVehicleType = (params: VehicleType, isUpdate: boolean): any => async (dispatch: Dispatch) => {
    return vehicleType.createVehicleType(params, isUpdate).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const searchVehicleType = (queryParams: any): any => async (dispatch: Dispatch) => {
    return vehicleType.searchVehicleType(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getServiceableVehicleType = (queryParams: any): any => async (dispatch: Dispatch) => {
    return vehicleType.getServiceableVehicleTypes(queryParams).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};
export const updateVehicleType = (params: any): any => async (dispatch: Dispatch) => {
    return vehicles.updateVehicleType(params).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};