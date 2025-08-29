import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { MaterialState } from '../storeStates/MaterialStoreInterface';
import MaterialTypes from "../types/MaterialTypes";

export const MATERIAL_STATE: MaterialState = {
    openFilter: false,
    openBulkUpload: false,
    refreshList: false,
    openCreateLocation: false,
    loading: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    currentPage: 1,
    pageSize: rowsPerPageOptions[0],
    searchQuery: "",
    filterParams: {},
    filterChips: {},
}

const toggleFilterReducer = (state = MATERIAL_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const refreshListReducer = (state = MATERIAL_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    searchQuery: "",
    listData: undefined,
});

const toggleCreateLocationReducer = (state = MATERIAL_STATE) => ({
    ...state,
    openCreateLocation: !state.openCreateLocation
});

const setSelectedItemReducer = (state = MATERIAL_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = MATERIAL_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.materials] : action.response && action.response.materials)
        : action.response && action.response.materials
});

const searchQueryReducer = (state = MATERIAL_STATE, action: any) => ({
    ...state,
    searchQuery: action.value,
    currentPage: 1,
    listData: undefined,
});

const setCurrentPageReducer = (state = MATERIAL_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = MATERIAL_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const showLoadingReducer = (state = MATERIAL_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = MATERIAL_STATE) => ({
    ...state,
    loading: false
});

const toggleBulkUploadReducer = (state = MATERIAL_STATE) => ({
    ...state,
    openBulkUpload: !state.openBulkUpload
});

const setFilterReducer = (state = MATERIAL_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = MATERIAL_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];
    switch (action.key) {
        case 'name':
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
        refreshList: !state.refreshList,
    }
};

const ACTION_HANDLERS = {
    [MaterialTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [MaterialTypes.TOGGLE_CREATE_LOCATION]: toggleCreateLocationReducer,
    [MaterialTypes.SELECTED_ELEMENT]: setSelectedItemReducer,
    [MaterialTypes.SET_RESPONSE]: setResponseReducer,
    [MaterialTypes.REFRESH_LIST]: refreshListReducer,
    [MaterialTypes.SEARCH_QUERY]: searchQueryReducer,
    [MaterialTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [MaterialTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [MaterialTypes.SHOW_LOADING]: showLoadingReducer,
    [MaterialTypes.HIDE_LOADING]: hideLoadingReducer,
    [MaterialTypes.TOGGLE_BULK_UPLOAD]: toggleBulkUploadReducer,
    [MaterialTypes.USER_FILTER]: setFilterReducer,
    [MaterialTypes.REMOVE_FILTER]: removeFilterReducer,
}

export default createReducer(MATERIAL_STATE, ACTION_HANDLERS);