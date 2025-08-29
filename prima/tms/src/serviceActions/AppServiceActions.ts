import { Dispatch } from 'redux';
import { handleApiError } from '../base/utility/ErrorHandleUtils';
import { hideLoader, setCityList, setDeviceDataList, setStateList, setTrackingAssetsList, setTrackingVendorList } from '../redux/actions/AppActions';
import { app } from '../services';


export const getUserProfileData = (): any => async (dispatch: Dispatch) => {
    return app.getUserProfile().then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getUserMenuList = (): any => async (dispatch: Dispatch) => {
    return app.getUserMenu().then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getCityList = (): any => async (dispatch: Dispatch) => {
    return app.getCities().then((responseAxios: any) => {
        dispatch(setCityList(responseAxios.details));
        dispatch(hideLoader());
    }).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getStateList = (): any => async (dispatch: Dispatch) => {
    return app.getStateList().then((responseAxios: any) => {
        dispatch(setStateList(responseAxios.details));
        dispatch(hideLoader());
    }).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

// export const getLocationType = (): any => async (dispatch: Dispatch) => {
//     return app.getLocationTypes().then((responseAxios: any) => {
//         dispatch(getLocationType(responseAxios.details));
//         dispatch(hideLoader());
//     }).catch((error: any) => {
//         handleApiError(error.message, dispatch)
//     });
// };

export const getTrackingAssets = () => async (dispatch: Dispatch) => {
    return app.getTrackingAssetsType().then((responseAxios: any) => {
        dispatch(setTrackingAssetsList(responseAxios.details));
        dispatch(hideLoader());
        return responseAxios.details;
    }).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const deviceData = () => async (dispatch: Dispatch) => {
    return app.getDeviceData().then((responseAxios: any) => {
        dispatch(setDeviceDataList(responseAxios.details));
        dispatch(hideLoader());
    }).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const trackingVendorData = (params: any): any => async (dispatch: Dispatch) => {
    return app.getTrackingVendorData(params).then((responseAxios: any) => {
        dispatch(setTrackingVendorList(responseAxios.details));
        dispatch(hideLoader());
    }).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getTemplateData = (params: any): any => async (dispatch: Dispatch) => {
    return app.getTemplateData(params).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};
export function getServiceabilityDetails(params: any): any {
    return async (dispatch: Dispatch) => {
        return app.getServiceabilityDetails(params).then((responseAxios: any) => responseAxios
        ).catch((error: any) => {
            handleApiError(error.message, dispatch);
        });
    };
}
