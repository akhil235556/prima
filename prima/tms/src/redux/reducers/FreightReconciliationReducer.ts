import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { FreightReconciliationState } from '../storeStates/FreightReconciliationInterface';
import FreightReconciliationTypes from "../types/FreightReconciliationTypes";

export const FREIGHT_RECONCILIATION_STATE: FreightReconciliationState = {
    openFilter: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    openModal: false,
    currentPage: 1,
    refresh_list: false,
    searchQuery: "",
    pageSize: rowsPerPageOptions[0],
    filterParams: {},
    filterChips: {},
    loading: false,
    openPointModal: false,
    defaultExpandRowIndex: -1,
    refreshPeriodicList: false,
    orderDetails: undefined,
    aggregateDetails: undefined
}

const toggleFilterReducer = (state = FREIGHT_RECONCILIATION_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = FREIGHT_RECONCILIATION_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = FREIGHT_RECONCILIATION_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = FREIGHT_RECONCILIATION_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.results] : action.response && action.response.results)
        : action.response && action.response.results,

    loading: false,
});

const setOrderDetailsReducer = (state = FREIGHT_RECONCILIATION_STATE, action: any) => ({
    ...state,
    aggregateDetails: action.response && action.response.aggregateDetails,
    orderDetails: isMobile ?
        (state.orderDetails ? [...state.orderDetails, ...action.response && action.response.freightReconciliation] : action.response && action.response.freightReconciliation)
        : action.response && action.response.freightReconciliation,

    loading: false,
});

const setCurrentPageReducer = (state = FREIGHT_RECONCILIATION_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRefreshListReducer = (state = FREIGHT_RECONCILIATION_STATE) => ({
    ...state,
    refresh_list: !state.refresh_list,
    currentPage: 1,
    listData: undefined,
});

const searchQueryReducer = (state = FREIGHT_RECONCILIATION_STATE, action: any) => ({
    ...state,
    searchQuery: action.value
});

const setRowPerPageReducer = (state = FREIGHT_RECONCILIATION_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const showLoadingReducer = (state = FREIGHT_RECONCILIATION_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = FREIGHT_RECONCILIATION_STATE) => ({
    ...state,
    loading: false
});

const setFilterReducer = (state = FREIGHT_RECONCILIATION_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const togglePointsModalReducer = (state = FREIGHT_RECONCILIATION_STATE) => ({
    ...state,
    openPointModal: !state.openPointModal
});

const setExpandRowIndexReducer = (state = FREIGHT_RECONCILIATION_STATE, action: any) => ({
    ...state,
    defaultExpandRowIndex: action.defaultExpandRowIndex
})

const setRefreshPeriodicList = (state = FREIGHT_RECONCILIATION_STATE, action: any) => ({
    ...state,
    refreshPeriodicList: !state.refreshPeriodicList,
    currentPage: 1,
    listData: undefined,
    defaultExpandRowIndex: action.value.defaultExpandRowIndex
});

const ACTION_HANDLERS = {
    [FreightReconciliationTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [FreightReconciliationTypes.TOGGLE_MODAL]: toggleModalReducer,
    [FreightReconciliationTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [FreightReconciliationTypes.SET_RESPONSE]: setResponseReducer,
    [FreightReconciliationTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [FreightReconciliationTypes.REFRESH_LIST]: setRefreshListReducer,
    [FreightReconciliationTypes.SEARCH_QUERY]: searchQueryReducer,
    [FreightReconciliationTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [FreightReconciliationTypes.SHOW_LOADING]: showLoadingReducer,
    [FreightReconciliationTypes.HIDE_LOADING]: hideLoadingReducer,
    [FreightReconciliationTypes.USER_FILTER]: setFilterReducer,
    [FreightReconciliationTypes.TOGGLE_POINTS_MODAL]: togglePointsModalReducer,
    [FreightReconciliationTypes.SET_DEFAULT_EXPAND_ROW_INDEX]: setExpandRowIndexReducer,
    [FreightReconciliationTypes.REFRESH_PERIODIC_LIST]: setRefreshPeriodicList,
    [FreightReconciliationTypes.SET_ORDER_DETAILS]: setOrderDetailsReducer
}

export default createReducer(FREIGHT_RECONCILIATION_STATE, ACTION_HANDLERS);