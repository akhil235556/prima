import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../../../base/constant/ArrayList";
import { isMobile } from "../../../../base/utility/ViewUtils";
import { CustomerState } from './CustomerStoreInterface';
import CustomerTypes from "./CustomerTypes";

export const CUSTOMER_STATE: CustomerState = {
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

const toggleFilterReducer = (state = CUSTOMER_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const refreshListReducer = (state = CUSTOMER_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    searchQuery: "",
    listData: undefined,
});

const toggleCreateCustomerReducer = (state = CUSTOMER_STATE) => ({
    ...state,
    openCreateLocation: !state.openCreateLocation
});

const setSelectedItemReducer = (state = CUSTOMER_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = CUSTOMER_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.results] : action.response && action.response.results)
        : action.response && action.response.results
});

const searchQueryReducer = (state = CUSTOMER_STATE, action: any) => ({
    ...state,
    searchQuery: action.value,
    currentPage: 1,
    listData: undefined,
});

const setCurrentPageReducer = (state = CUSTOMER_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = CUSTOMER_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const showLoadingReducer = (state = CUSTOMER_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = CUSTOMER_STATE) => ({
    ...state,
    loading: false
});

const toggleBulkUploadReducer = (state = CUSTOMER_STATE) => ({
    ...state,
    openBulkUpload: !state.openBulkUpload
});

const setFilterReducer = (state = CUSTOMER_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = CUSTOMER_STATE, action: any) => {
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
    [CustomerTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [CustomerTypes.TOGGLE_CREATE_CUSTOMER]: toggleCreateCustomerReducer,
    [CustomerTypes.SELECTED_ELEMENT]: setSelectedItemReducer,
    [CustomerTypes.SET_RESPONSE]: setResponseReducer,
    [CustomerTypes.REFRESH_LIST]: refreshListReducer,
    [CustomerTypes.SEARCH_QUERY]: searchQueryReducer,
    [CustomerTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [CustomerTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [CustomerTypes.SHOW_LOADING]: showLoadingReducer,
    [CustomerTypes.HIDE_LOADING]: hideLoadingReducer,
    [CustomerTypes.TOGGLE_BULK_UPLOAD]: toggleBulkUploadReducer,
    [CustomerTypes.USER_FILTER]: setFilterReducer,
    [CustomerTypes.REMOVE_FILTER]: removeFilterReducer,
}

export default createReducer(CUSTOMER_STATE, ACTION_HANDLERS);