import { isNullValue } from '../../base/utility/StringUtils';
import AppTypes from "../types/AppTypes";

export const openDrawer = () => ({
    type: AppTypes.OPEN_DRAWER,
});

export const setRefreshCount = () => ({
    type: AppTypes.REFRESH_COUNT,
});

export const setSideNavigation = () => ({
    type: AppTypes.SIDE_NAVIGATION,
});

export const openSubDrawer = (value: boolean) => ({
    type: AppTypes.OPEN_SUB_DRAWER,
    value,
});

export const setCountNotification = (value: number | undefined) => ({
    type: AppTypes.SET_COUNT_NOTIFICATION,
    value,
});

export const showLoader = () => ({
    type: AppTypes.SHOW_LOADER,
});

export const hideLoader = () => ({
    type: AppTypes.HIDE_LOADER,
});

export const showAlert = (message: string, successAlert?: any, checkStartOrStop?: any) => ({
    type: AppTypes.SHOW_ALERT,
    message,
    successAlert: isNullValue(successAlert),
    checkStartOrStop
});

export const hideAlert = () => ({
    type: AppTypes.HIDE_ALERT,
});

export const toggleModal = () => ({
    type: AppTypes.TOGGLE_MODAL,
});

export const okPressed = (value: any) => ({
    type: AppTypes.OK_PRESSED,
    value
});

export const enableActionButton = () => ({
    type: AppTypes.ENABLE_ACTION_BUTTON,
});

export const disableActionButton = () => ({
    type: AppTypes.DISABLE_ACTION_BUTTON,
});

export const setCityList = (value: any) => ({
    type: AppTypes.CITY_LIST,
    value
});
export const setStateList = (value: any) => ({
    type: AppTypes.STATE_LIST,
    value
});


export const setVehicleTypeList = (value: any) => ({
    type: AppTypes.VEHICLE_TYPE_LIST,
    value
});

export const setTrackingAssetsList = (value: any) => ({
    type: AppTypes.TRACKING_ASSETS_LIST,
    value
});

export const setAllLocation = (value: any) => ({
    type: AppTypes.LOCATION_LIST,
    value
});

export const setDeviceDataList = (value: any) => ({
    type: AppTypes.DEVICE_DATA_LIST,
    value
});

export const setTrackingVendorList = (value: any) => ({
    type: AppTypes.TRACKING_VENDOR_LIST,
    value
});

export const setRolesList = (value: any) => ({
    type: AppTypes.ROLE_LIST,
    value
});

export const setPermissionsList = (value: any) => ({
    type: AppTypes.PERMISSION_LIST,
    value
});

export const setUserInfo = (value: any) => ({
    type: AppTypes.USER_INFO,
    value
});

export const setMainMenuInfo = (value: any) => ({
    type: AppTypes.MAIN_MENU_INFO,
    value
})

export const setGIFilter = (chips: any, params: any) => ({
    type: AppTypes.INVOICE_FILTER,
    chips,
    params,
});

export const removeGIFilter = (key: any) => ({
    type: AppTypes.REMOVE_INVOICE_FILTER,
    key
});

export const pollStart = (value: any) => ({
    type: AppTypes.POLL_START,
    value
});

export const pollStop = (value: any) => ({
    type: AppTypes.POLL_STOP,
    value
});
