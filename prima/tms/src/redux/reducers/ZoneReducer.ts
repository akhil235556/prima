import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { ZoneState } from "../storeStates/ZoneInterface";
import ZoneTypes from "../types/ZoneTypes";

export const ZONE_STATE: ZoneState = {
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

const toggleFilterReducer = (state = ZONE_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = ZONE_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = ZONE_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = ZONE_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.results] : action.response && action.response.results)
        : action.response && action.response.results,
    loading: false,
});

const setCurrentPageReducer = (state = ZONE_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRefreshListReducer = (state = ZONE_STATE) => ({
    ...state,
    refresh_list: !state.refresh_list,
    currentPage: 1,
    listData: undefined,
});

const searchQueryReducer = (state = ZONE_STATE, action: any) => ({
    ...state,
    searchQuery: action.value
});

const setRowPerPageReducer = (state = ZONE_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
});

const showLoadingReducer = (state = ZONE_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = ZONE_STATE) => ({
    ...state,
    loading: false
});
const toggleBulkUploadReducer = (state = ZONE_STATE) => ({
    ...state,
    openBulkUpload: !state.openBulkUpload
});

const setFilterReducer = (state = ZONE_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = ZONE_STATE, action: any) => {
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
    [ZoneTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [ZoneTypes.TOGGLE_MODAL]: toggleModalReducer,
    [ZoneTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [ZoneTypes.SET_RESPONSE]: setResponseReducer,
    [ZoneTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [ZoneTypes.REFRESH_LIST]: setRefreshListReducer,
    [ZoneTypes.SEARCH_QUERY]: searchQueryReducer,
    [ZoneTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [ZoneTypes.SHOW_LOADING]: showLoadingReducer,
    [ZoneTypes.HIDE_LOADING]: hideLoadingReducer,
    [ZoneTypes.TOGGLE_BULK_UPLOAD]: toggleBulkUploadReducer,
    [ZoneTypes.USER_FILTER]: setFilterReducer,
    [ZoneTypes.REMOVE_FILTER]: removeFilterReducer,
}

export default createReducer(ZONE_STATE, ACTION_HANDLERS);