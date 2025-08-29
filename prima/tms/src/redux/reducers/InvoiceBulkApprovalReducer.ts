import { createReducer } from "reduxsauce";
import InvoiceBulkApprovalTypes from "../types/InvoiceBulkApprovalTypes";

export const INVOICE_APPROVAL_STATE: any = {
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
    pageSize: 25,
    filterParams: {},
    filterChips: {},
}

const toggleFilterReducer = (state = INVOICE_APPROVAL_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = INVOICE_APPROVAL_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = INVOICE_APPROVAL_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = INVOICE_APPROVAL_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: action.response && action.response.billList,
    loading: false,
});

const setCurrentPageReducer = (state = INVOICE_APPROVAL_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRefreshListReducer = (state = INVOICE_APPROVAL_STATE) => ({
    ...state,
    refresh_list: !state.refresh_list,
    currentPage: 1,
    listData: undefined,
});

const searchQueryReducer = (state = INVOICE_APPROVAL_STATE, action: any) => ({
    ...state,
    searchQuery: action.value
});

const setRowPerPageReducer = (state = INVOICE_APPROVAL_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
});
const setCheckedListResponse = (state = INVOICE_APPROVAL_STATE, action: any) => ({
    ...state,
    listData: action.response
})

const showLoadingReducer = (state = INVOICE_APPROVAL_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = INVOICE_APPROVAL_STATE) => ({
    ...state,
    loading: false
});
const toggleBulkUploadReducer = (state = INVOICE_APPROVAL_STATE) => ({
    ...state,
    openBulkUpload: !state.openBulkUpload
});

const setFilterReducer = (state = INVOICE_APPROVAL_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = INVOICE_APPROVAL_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];
    switch (action.key) {
        case 'partnerName':
            state.filterParams && state.filterParams['partnerCode'] && delete state.filterParams['partnerCode'];
            break;
        case 'freightTypeCode':
            state.filterParams && state.filterParams['contractType'] && delete state.filterParams['contractType'];
            break;
        case 'serviceabilityModeName':
            state.filterParams && state.filterParams['serviceabilityModeCode'] && delete state.filterParams['serviceabilityModeCode'];
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
    [InvoiceBulkApprovalTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [InvoiceBulkApprovalTypes.TOGGLE_MODAL]: toggleModalReducer,
    [InvoiceBulkApprovalTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [InvoiceBulkApprovalTypes.SET_RESPONSE]: setResponseReducer,
    [InvoiceBulkApprovalTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [InvoiceBulkApprovalTypes.REFRESH_LIST]: setRefreshListReducer,
    [InvoiceBulkApprovalTypes.SEARCH_QUERY]: searchQueryReducer,
    [InvoiceBulkApprovalTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [InvoiceBulkApprovalTypes.SHOW_LOADING]: showLoadingReducer,
    [InvoiceBulkApprovalTypes.HIDE_LOADING]: hideLoadingReducer,
    [InvoiceBulkApprovalTypes.TOGGLE_BULK_UPLOAD]: toggleBulkUploadReducer,
    [InvoiceBulkApprovalTypes.USER_FILTER]: setFilterReducer,
    [InvoiceBulkApprovalTypes.REMOVE_FILTER]: removeFilterReducer,
    [InvoiceBulkApprovalTypes.SET_CHECKED_RESPONSE]: setCheckedListResponse,
}

export default createReducer(INVOICE_APPROVAL_STATE, ACTION_HANDLERS);