import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import ConsigneeTypes from "../types/ConsigneeTypes";
import { ConsigneeState } from './../storeStates/ConsigneeStoreInterface';

export const CONSIGNEE_STATE: ConsigneeState = {
    openFilter: false,
    openBulkUpload: false,
    openBulkUpdate: false,
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

const toggleFilterReducer = (state = CONSIGNEE_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const refreshListReducer = (state = CONSIGNEE_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    searchQuery: "",
    listData: undefined,
});

const toggleCreateLocationReducer = (state = CONSIGNEE_STATE) => ({
    ...state,
    openCreateLocation: !state.openCreateLocation
});

const setSelectedItemReducer = (state = CONSIGNEE_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = CONSIGNEE_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.results] : action.response && action.response.results)
        : action.response && action.response.results
});

const searchQueryReducer = (state = CONSIGNEE_STATE, action: any) => ({
    ...state,
    searchQuery: action.value,
    currentPage: 1,
    listData: undefined,
});

const setCurrentPageReducer = (state = CONSIGNEE_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = CONSIGNEE_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const showLoadingReducer = (state = CONSIGNEE_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = CONSIGNEE_STATE) => ({
    ...state,
    loading: false
});

const toggleBulkUploadReducer = (state = CONSIGNEE_STATE) => ({
    ...state,
    openBulkUpload: !state.openBulkUpload
});
const toggleBulkUpdateReducer = (state = CONSIGNEE_STATE) => ({
    ...state,
    openBulkUpdate: !state.openBulkUpdate
});

const setFilterReducer = (state = CONSIGNEE_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = CONSIGNEE_STATE, action: any) => {
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
    [ConsigneeTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [ConsigneeTypes.TOGGLE_CREATE_LOCATION]: toggleCreateLocationReducer,
    [ConsigneeTypes.SELECTED_ELEMENT]: setSelectedItemReducer,
    [ConsigneeTypes.SET_RESPONSE]: setResponseReducer,
    [ConsigneeTypes.REFRESH_LIST]: refreshListReducer,
    [ConsigneeTypes.SEARCH_QUERY]: searchQueryReducer,
    [ConsigneeTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [ConsigneeTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [ConsigneeTypes.SHOW_LOADING]: showLoadingReducer,
    [ConsigneeTypes.HIDE_LOADING]: hideLoadingReducer,
    [ConsigneeTypes.TOGGLE_BULK_UPLOAD]: toggleBulkUploadReducer,
    [ConsigneeTypes.TOGGLE_BULK_UPDATE]: toggleBulkUpdateReducer,
    [ConsigneeTypes.USER_FILTER]: setFilterReducer,
    [ConsigneeTypes.REMOVE_FILTER]: removeFilterReducer,
}

export default createReducer(CONSIGNEE_STATE, ACTION_HANDLERS);