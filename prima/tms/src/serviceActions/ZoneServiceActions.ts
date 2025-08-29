import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { hideLoader } from '../redux/actions/AppActions';
import { hideLoading, setResponse } from '../redux/actions/ZoneActions';
import { zone } from "../services";

export const zoneCreate = (queryParams: any): any => async (dispatch: Dispatch) => {
    return zone.zoneCreate(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getZoneDetails = (queryParams: any): any => async (dispatch: Dispatch) => {
    return zone.getZoneDetails(queryParams).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const zoneListing = (reactDispatch: any, queryParams: any): any => async (dispatch: Dispatch) => {
    zone.zoneListing(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    }).catch((error: any) => {
        reactDispatch(hideLoading());
        handleApiError(error.message, dispatch)
    });
};