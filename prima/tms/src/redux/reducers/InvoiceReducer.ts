import { createReducer } from "reduxsauce";
import { invoiceTab, rowsPerPageOptions } from '../../base/constant/ArrayList';
import { isMobile } from "../../base/utility/ViewUtils";
import { InvoiceState } from '../storeStates/InvoiceStoreInterface';
import InvoiceTypes from "../types/InvoiceTypes";

export const INVOICE_STATE: InvoiceState = {
    openFilter: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    openModal: false,
    openPointModal: false,
    currentPage: 1,
    selectedTabIndex: 0,
    selectedTabName: invoiceTab[0],
    refresh_list: false,
    searchQuery: "",
    pageSize: rowsPerPageOptions[0],
    filterParams: {},
    filterChips: {},
    loading: false,
    defaultExpandRowIndex: -1,
    initialValue: undefined,
    refreshPeriodicList: false,
    showSubmitButton: false,
}

const toggleFilterReducer = (state = INVOICE_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = INVOICE_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = INVOICE_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = INVOICE_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && (action.response.billList || action.response.FreightOrderBillsDetails)] : action.response && (action.response.billList || action.response.FreightOrderBillsDetails))
        : action.response && (action.response.billList || action.response.FreightOrderBillsDetails),
    loading: false,
    selectedTabName: action.tabName,
    selectedTabIndex: invoiceTab.indexOf(action.tabName),
});

const setCurrentPageReducer = (state = INVOICE_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRefreshListReducer = (state = INVOICE_STATE) => ({
    ...state,
    refresh_list: !state.refresh_list,
    currentPage: 1,
    listData: undefined,
});

const setRefreshPeriodicList = (state = INVOICE_STATE, action: any) => ({
    ...state,
    refreshPeriodicList: !state.refreshPeriodicList,
    currentPage: 1,
    listData: undefined,
    defaultExpandRowIndex: action.value.defaultExpandRowIndex
});

const searchQueryReducer = (state = INVOICE_STATE, action: any) => ({
    ...state,
    searchQuery: action.value
});

const setRowPerPageReducer = (state = INVOICE_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    searchQuery: action.value
});

const setSelectedTabReducer = (state = INVOICE_STATE, action: any) => ({
    ...state,
    selectedTabIndex: action.value,
    selectedTabName: invoiceTab[action.value],
    listData: undefined,
});

const setInitialValue = (state = INVOICE_STATE, action: any) => ({
    ...state,
    initialValue: action.value
});

const showLoadingReducer = (state = INVOICE_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = INVOICE_STATE) => ({
    ...state,
    loading: false
});

const setFilterReducer = (state = INVOICE_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const togglePointsModalReducer = (state = INVOICE_STATE) => ({
    ...state,
    openPointModal: !state.openPointModal
});

const setCheckedListResponse = (state = INVOICE_STATE, action: any) => ({
    ...state,
    listData: action.response
})

const setExpandRowIndexReducer = (state = INVOICE_STATE, action: any) => ({
    ...state,
    defaultExpandRowIndex: action.defaultExpandRowIndex
})

const setShowSubmitButtonReducer = (state = INVOICE_STATE, action: any) => ({
    ...state,
    showSubmitButton: action.value
})

const ACTION_HANDLERS = {
    [InvoiceTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [InvoiceTypes.TOGGLE_MODAL]: toggleModalReducer,
    [InvoiceTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [InvoiceTypes.SET_RESPONSE]: setResponseReducer,
    [InvoiceTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [InvoiceTypes.REFRESH_LIST]: setRefreshListReducer,
    [InvoiceTypes.SEARCH_QUERY]: searchQueryReducer,
    [InvoiceTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [InvoiceTypes.SHOW_LOADING]: showLoadingReducer,
    [InvoiceTypes.HIDE_LOADING]: hideLoadingReducer,
    [InvoiceTypes.USER_FILTER]: setFilterReducer,
    [InvoiceTypes.SELECTED_INDEX]: setSelectedTabReducer,
    [InvoiceTypes.TOGGLE_POINTS_MODAL]: togglePointsModalReducer,
    [InvoiceTypes.SET_INITIAL_VALUE]: setInitialValue,
    [InvoiceTypes.SET_DEFAULT_EXPAND_ROW_INDEX]: setExpandRowIndexReducer,
    [InvoiceTypes.SET_CHECKED_RESPONSE]: setCheckedListResponse,
    [InvoiceTypes.REFRESH_PERIODIC_LIST]: setRefreshPeriodicList,
    [InvoiceTypes.SET_SHOW_SUBMIT_BUTTON]: setShowSubmitButtonReducer
}

export default createReducer(INVOICE_STATE, ACTION_HANDLERS);