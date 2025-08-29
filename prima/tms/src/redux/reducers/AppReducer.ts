import { createReducer } from "reduxsauce";
import { AppState } from "../storeStates/AppStoreInterface";
import AppTypes from "../types/AppTypes";

// the initial state of this reducer
export const APP_INIT_STATE: AppState = {
  drawerSate: false,
  subDrawerSate: false,
  successAlert: true,
  openModal: false,
  showLoader: false,
  showHomeSearch: false,
  showHomeFilter: false,
  isHomePage: false,
  alertMessage: undefined,
  cityList: undefined,
  stateList: undefined,
  disableActionButton: false,
  vehicleTypeList: undefined,
  trackingAssetList: undefined,
  locationList: undefined,
  deviceDataList: undefined,
  trackingVendorList: undefined,
  rolesList: undefined,
  permissionList: undefined,
  userInfo: undefined,
  notificationCount: 0,
  refreshCount: false,
  okPressed: false,
  checkStartOrStop: false,
  sideNavigation: false,
  // showAlert: false
  menuSelectedIndex: 500,
  menuElement: {},
  filterChips: {},
  filterParams: {}
}

// Handle Drawer Open and Close Sate
const openDrawerReducer = (state = APP_INIT_STATE) => {
  return { ...state, drawerSate: !state.drawerSate }
}

const setRefreshCountReducer = (state = APP_INIT_STATE) => {
  return { ...state, refreshCount: !state.refreshCount }
}

const openSubDrawerReducer = (state = APP_INIT_STATE, action: any) => {
  return { ...state, subDrawerSate: action.value }
}

const showLoaderReducer = (state = APP_INIT_STATE) => {
  return {
    ...state,
    showLoader: true,
  }
};

const hideLoaderReducer = (state = APP_INIT_STATE) => {
  return {
    ...state,
    showLoader: false,
  }
};

const toggleModalReducer = (state = APP_INIT_STATE) => {
  return {
    ...state,
    openModal: !state.openModal
  }
};

const showAlertReducer = (state = APP_INIT_STATE, action: any) => {
  return {
    ...state,
    alertMessage: action.message,
    showAlert: true,
    successAlert: action.successAlert,
    checkStartOrStop: action.checkStartOrStop
  }
};

const setSideNavigation = (state = APP_INIT_STATE, action: any) => {
  return {
    ...state,
    sideNavigation: !state.sideNavigation
  }
};

const hideAlertReducer = (state = APP_INIT_STATE) => {
  return {
    ...state,
    successAlert: true,
    alertMessage: "",
    showAlert: false,
    checkStartOrStop: false
  }
};


const enableActionButtonReducer = (state = APP_INIT_STATE,) => {
  return {
    ...state,
    disableActionButton: false,
  }
};

const okPressedReducer = (state = APP_INIT_STATE, action: any) => {
  return {
    ...state,
    okPressed: action.value,
  }
};

const disableActionButtonReducer = (state = APP_INIT_STATE) => {
  return {
    ...state,
    disableActionButton: true,
  }
};

const setCityListReducer = (state = APP_INIT_STATE, action: any) => {
  return {
    ...state,
    cityList: action.value,
  }
};

const setStateListReducer = (state = APP_INIT_STATE, action: any) => {
  return {
    ...state,
    stateList: action.value,
  }
};

const setVehicleTypeListReducer = (state = APP_INIT_STATE, action: any) => {
  return {
    ...state,
    vehicleTypeList: action.value,
  }
};

const setTrackingAssetsReducer = (state = APP_INIT_STATE, action: any) => {
  return {
    ...state,
    trackingAssetList: action.value,
  }
};

const setAllLocationReducer = (state = APP_INIT_STATE, action: any) => ({
  ...state,
  locationList: action.value,
});
const setDeviceDataListReducer = (state = APP_INIT_STATE, action: any) => {
  return {
    ...state,
    deviceDataList: action.value,
  }
};

const setTrackingVendorListReducer = (state = APP_INIT_STATE, action: any) => {
  return {
    ...state,
    trackingVendorList: action.value,
  }
};

const setRolesListReducer = (state = APP_INIT_STATE, action: any) => {
  return {
    ...state,
    rolesList: action.value && action.value.filter((element: any) => element.isActive === true),
  }
};

const setPermissionsReducer = (state = APP_INIT_STATE, action: any) => {
  return {
    ...state,
    // permissionList: action.value && action.value.filter((element: any) => element.isActive === true),
    permissionList: action.value,
  }
};

const setUserInfoReducer = (state = APP_INIT_STATE, action: any) => {
  return {
    ...state,
    userInfo: action.value,
  }
};

const setCountNotificationReducer = (state = APP_INIT_STATE, action: any) => {
  return {
    ...state,
    notificationCount: action.value,
  }
};

const setMainMenuInfoReducer = (state = APP_INIT_STATE, action: any) => {
  return {
    ...state,
    menuSelectedIndex: action.value.index,
    menuElement: action.value.element,
  }
};

const setFilterReducer = (state = APP_INIT_STATE, action: any) => ({
  ...state,
  filterChips: action.chips,
  filterParams: action.params,
});

const pollStartReducer = (state = APP_INIT_STATE, action: any) => ({
  ...state,
  startPoll: action.value,
})

const pollStopReducer = (state = APP_INIT_STATE, action: any) => ({
  ...state,
  stopPoll: action.value
})



const ACTION_HANDLERS = {
  [AppTypes.OPEN_DRAWER]: openDrawerReducer,
  [AppTypes.OPEN_SUB_DRAWER]: openSubDrawerReducer,
  [AppTypes.SHOW_LOADER]: showLoaderReducer,
  [AppTypes.HIDE_LOADER]: hideLoaderReducer,
  [AppTypes.SHOW_ALERT]: showAlertReducer,
  [AppTypes.HIDE_ALERT]: hideAlertReducer,
  [AppTypes.ENABLE_ACTION_BUTTON]: enableActionButtonReducer,
  [AppTypes.DISABLE_ACTION_BUTTON]: disableActionButtonReducer,
  [AppTypes.CITY_LIST]: setCityListReducer,
  [AppTypes.STATE_LIST]: setStateListReducer,
  [AppTypes.VEHICLE_TYPE_LIST]: setVehicleTypeListReducer,
  [AppTypes.TRACKING_ASSETS_LIST]: setTrackingAssetsReducer,
  [AppTypes.LOCATION_LIST]: setAllLocationReducer,

  [AppTypes.DEVICE_DATA_LIST]: setDeviceDataListReducer,
  [AppTypes.TRACKING_VENDOR_LIST]: setTrackingVendorListReducer,
  [AppTypes.ROLE_LIST]: setRolesListReducer,
  [AppTypes.PERMISSION_LIST]: setPermissionsReducer,
  [AppTypes.USER_INFO]: setUserInfoReducer,
  [AppTypes.SET_COUNT_NOTIFICATION]: setCountNotificationReducer,
  [AppTypes.REFRESH_COUNT]: setRefreshCountReducer,
  [AppTypes.OK_PRESSED]: okPressedReducer,
  [AppTypes.SIDE_NAVIGATION]: setSideNavigation,
  [AppTypes.MAIN_MENU_INFO]: setMainMenuInfoReducer,
  [AppTypes.INVOICE_FILTER]: setFilterReducer,
  [AppTypes.TOGGLE_MODAL]: toggleModalReducer,
  [AppTypes.POLL_START]: pollStartReducer,
  [AppTypes.POLL_STOP]: pollStopReducer,
}

export default createReducer(APP_INIT_STATE, ACTION_HANDLERS);

