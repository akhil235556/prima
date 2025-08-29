import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { VehicleState } from '../storeStates/VehicleStoreInterface';
import VehicleTypes from "../types/VehicleTypes";

export const VEHICLE_STATE: VehicleState = {
    openFilter: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    openModal: false,
    loading: false,
    openBulkUpload: false,
    currentPage: 1,
    refresh_list: false,
    searchQuery: "",
    pageSize: rowsPerPageOptions[0],
    filterParams: {},
    filterChips: {},
}

const toggleFilterReducer = (state = VEHICLE_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = VEHICLE_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = VEHICLE_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = VEHICLE_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.vehicles] : action.response && action.response.vehicles)
        : action.response && action.response.vehicles,
    loading: false,
});

const setCurrentPageReducer = (state = VEHICLE_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRefreshListReducer = (state = VEHICLE_STATE) => ({
    ...state,
    refresh_list: !state.refresh_list,
    currentPage: 1,
    listData: undefined,
});

const searchQueryReducer = (state = VEHICLE_STATE, action: any) => ({
    ...state,
    searchQuery: action.value
});

const setRowPerPageReducer = (state = VEHICLE_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
});

const showLoadingReducer = (state = VEHICLE_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = VEHICLE_STATE) => ({
    ...state,
    loading: false
});

const setFilterReducer = (state = VEHICLE_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = VEHICLE_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];
    switch (action.key) {
        case "vehicleNumber":
            state.filterParams && state.filterParams["vehicleNumber"] && delete state.filterParams["vehicleNumber"];
            break;
        default:
            state.filterParams && state.filterParams[action.key] && delete state.filterParams[action.key];
            break;
    }
    return {
        ...state,
        filterChips: state.filterChips,
        filterParams: state.filterParams,
        currentPage: 1,
        listData: undefined,
        refresh_list: !state.refresh_list,
    }
};

const toggleBulkUploadReducer = (state = VEHICLE_STATE) => ({
    ...state,
    openBulkUpload: !state.openBulkUpload
});

const ACTION_HANDLERS = {
    [VehicleTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [VehicleTypes.TOGGLE_MODAL]: toggleModalReducer,
    [VehicleTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [VehicleTypes.SET_RESPONSE]: setResponseReducer,
    [VehicleTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [VehicleTypes.REFRESH_LIST]: setRefreshListReducer,
    [VehicleTypes.SEARCH_QUERY]: searchQueryReducer,
    [VehicleTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [VehicleTypes.SHOW_LOADING]: showLoadingReducer,
    [VehicleTypes.HIDE_LOADING]: hideLoadingReducer,
    [VehicleTypes.SET_FILTER]: setFilterReducer,
    [VehicleTypes.REMOVE_FILTER]: removeFilterReducer,
    [VehicleTypes.TOGGLE_BULK_UPLOAD]: toggleBulkUploadReducer,
}

export default createReducer(VEHICLE_STATE, ACTION_HANDLERS);