import { createReducer } from "reduxsauce";
import TrackingAssetsTypes from "../types/TrackingAssetsTypes";
import { TrackingAssetsState } from '../storeStates/TrackingAssetsStoreInterface';
import { rowsPerPageOptions } from "../../base/constant/ArrayList";

export const TRACKING_ASSETS_STATE: TrackingAssetsState = {
    openFilter: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    openModal: false,
    loading: false,
    currentPage: 1,
    pageSize: rowsPerPageOptions[0],
    refreshList: false,
}

const toggleFilterReducer = (state = TRACKING_ASSETS_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = TRACKING_ASSETS_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = TRACKING_ASSETS_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = TRACKING_ASSETS_STATE, action: any) => ({
    ...state,
    listData: action.response && action.response.assets,
    loading: false
});

const setCurrentPageReducer = (state = TRACKING_ASSETS_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = TRACKING_ASSETS_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const refreshListReducer = (state = TRACKING_ASSETS_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const showLoadingReducer = (state = TRACKING_ASSETS_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = TRACKING_ASSETS_STATE) => ({
    ...state,
    loading: false
});


const ACTION_HANDLERS = {
    [TrackingAssetsTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [TrackingAssetsTypes.TOGGLE_MODAL]: toggleModalReducer,
    [TrackingAssetsTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [TrackingAssetsTypes.SET_RESPONSE]: setResponseReducer,
    [TrackingAssetsTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [TrackingAssetsTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [TrackingAssetsTypes.REFRESH_LIST]: refreshListReducer,
    [TrackingAssetsTypes.SHOW_LOADING]: showLoadingReducer,
    [TrackingAssetsTypes.HIDE_LOADING]: hideLoadingReducer,

}

export default createReducer(TRACKING_ASSETS_STATE, ACTION_HANDLERS);