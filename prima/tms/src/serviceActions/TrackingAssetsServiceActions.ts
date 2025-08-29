import { Dispatch } from "redux";
import { trackingAssets } from "../services";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { setResponse, hideLoading } from "../redux/actions/TrackingAssetsActions";
import { TrackingAssets } from "../redux/storeStates/TrackingAssetsStoreInterface";

export const getTrackingAssetsList = (reactDispatch: any): any => async (dispatch: Dispatch) => {
    trackingAssets.getTrackingAssetsList().then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));
        reactDispatch(hideLoading());
    }).catch((error: any) => {
        reactDispatch(hideLoading());
        handleApiError(error.message, dispatch)
    });
};

export const createTrackingAsset = (params: TrackingAssets, isUpdate: boolean): any => async (dispatch: Dispatch) => {
    return trackingAssets.createTrackingAsset(params, isUpdate).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};