import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { VehicleTypeState } from '../storeStates/VehicleTypeStoreInterface';
import VehicletypesTypes from "../types/VehicletypesTypes";

export const VEHICLE_TYPE_STATE: VehicleTypeState = {
    openFilter: false,
    openBulkUpload: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    openModal: false,
    currentPage: 1,
    refresh_list: false,
    loading: false,
    searchQuery: "",
    pageSize: rowsPerPageOptions[0],
    filterParams: {},
    filterChips: {},
}

const toggleFilterReducer = (state = VEHICLE_TYPE_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = VEHICLE_TYPE_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = VEHICLE_TYPE_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = VEHICLE_TYPE_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.vehicleTypes] : action.response && action.response.vehicleTypes)
        : action.response && action.response.vehicleTypes,
    loading: false,
});

const setCurrentPageReducer = (state = VEHICLE_TYPE_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRefreshListReducer = (state = VEHICLE_TYPE_STATE) => ({
    ...state,
    refresh_list: !state.refresh_list,
    currentPage: 1,
    listData: undefined,
});

const searchQueryReducer = (state = VEHICLE_TYPE_STATE, action: any) => ({
    ...state,
    searchQuery: action.value
});

const setRowPerPageReducer = (state = VEHICLE_TYPE_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
});

const showLoadingReducer = (state = VEHICLE_TYPE_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = VEHICLE_TYPE_STATE) => ({
    ...state,
    loading: false
});
const toggleBulkUploadReducer = (state = VEHICLE_TYPE_STATE) => ({
    ...state,
    openBulkUpload: !state.openBulkUpload
});

const setFilterReducer = (state = VEHICLE_TYPE_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = VEHICLE_TYPE_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];
    switch (action.key) {
        case 'vehicleTypeName':
            state.filterParams && state.filterParams['code'] && delete state.filterParams['code'];
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

const ACTION_HANDLERS = {
    [VehicletypesTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [VehicletypesTypes.TOGGLE_MODAL]: toggleModalReducer,
    [VehicletypesTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [VehicletypesTypes.SET_RESPONSE]: setResponseReducer,
    [VehicletypesTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [VehicletypesTypes.REFRESH_LIST]: setRefreshListReducer,
    [VehicletypesTypes.SEARCH_QUERY]: searchQueryReducer,
    [VehicletypesTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [VehicletypesTypes.SHOW_LOADING]: showLoadingReducer,
    [VehicletypesTypes.HIDE_LOADING]: hideLoadingReducer,
    [VehicletypesTypes.TOGGLE_BULK_UPLOAD]: toggleBulkUploadReducer,
    [VehicletypesTypes.USER_FILTER]: setFilterReducer,
    [VehicletypesTypes.REMOVE_FILTER]: removeFilterReducer,
}

export default createReducer(VEHICLE_TYPE_STATE, ACTION_HANDLERS);