import { createReducer } from "reduxsauce";
import { rowsPerPageOptions, stockTransferStatusTab } from "../../../../base/constant/ArrayList";
import { isMobile } from "../../../../base/utility/ViewUtils";
import { StockOrderState } from './stockOrdersInterface';
import stockOrdersTypes from "./stockOrdersTypes";

export const STOCK_ORDER_STATE: StockOrderState = {
    openFilter: false,
    loading: false,
    refreshList: false,
    openPointModal: false,
    openModal: false,
    selectedItem: undefined,
    selectedTabIndex: 0,
    selectedTabName: stockTransferStatusTab[0],
    pagination: undefined,
    listData: undefined,
    currentPage: 1,
    pageSize: rowsPerPageOptions[0],
    searchQuery: "",
    filterParams: {},
    filterChips: {},
}

const toggleFilterReducer = (state = STOCK_ORDER_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = STOCK_ORDER_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = STOCK_ORDER_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = STOCK_ORDER_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.data] : action.response && action.response.data)
        : action.response && action.response.data,
    selectedTabName: action.tabName,
    selectedTabIndex: stockTransferStatusTab.indexOf(action.tabName),
});

const setCurrentPageReducer = (state = STOCK_ORDER_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRefreshListReducer = (state = STOCK_ORDER_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const searchQueryReducer = (state = STOCK_ORDER_STATE, action: any) => ({
    ...state,
    searchQuery: action.value
});

const setRowPerPageReducer = (state = STOCK_ORDER_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
});

const setSelectedTabReducer = (state = STOCK_ORDER_STATE, action: any) => ({
    ...state,
    selectedTabIndex: action.value,
    selectedTabName: stockTransferStatusTab[action.value],
    listData: undefined,
});

const setInitialValue = (state = STOCK_ORDER_STATE, action: any) => ({
    ...state,
    initialValue: action.value
});

const showLoadingReducer = (state = STOCK_ORDER_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = STOCK_ORDER_STATE) => ({
    ...state,
    loading: false
});

const setFilterReducer = (state = STOCK_ORDER_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    listData: undefined,
    refreshList: !state.refreshList,
    currentPage: 1,
});

const removeFilterReducer = (state = STOCK_ORDER_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];

    switch (action.key) {
        case "sourceNumber":
            state.filterParams && state.filterParams["sourceNumber"] && delete state.filterParams["sourceNumber"];
            break;
        case "stockOrderId":
            state.filterParams && state.filterParams["stockOrderId"] && delete state.filterParams["stockOrderId"];
            break;
        case "quantity":
            state.filterParams && state.filterParams["quantity"] && delete state.filterParams["quantity"];
            break;
        case "startDateTime":
            state.filterParams && state.filterParams["startDateTime"] && delete state.filterParams["startDateTime"];
            state.filterParams && state.filterParams["endDateTime"] && delete state.filterParams["endDateTime"];
            state.filterChips && state.filterChips["endDateTime"] && delete state.filterChips["endDateTime"];
            break;
        case "endDateTime":
            state.filterParams && state.filterParams["startDateTime"] && delete state.filterParams["startDateTime"];
            state.filterParams && state.filterParams["endDateTime"] && delete state.filterParams["endDateTime"];
            state.filterChips && state.filterChips["startDateTime"] && delete state.filterChips["startDateTime"];
            break;
        case "query":
            state.filterParams && state.filterParams["queryField"] && delete state.filterParams["queryField"];
            state.filterParams && state.filterParams["query"] && delete state.filterParams["query"];
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

const setCheckedListResponse = (state = STOCK_ORDER_STATE, action: any) => ({
    ...state,
    listData: action.response
})

const ACTION_HANDLERS = {
    [stockOrdersTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [stockOrdersTypes.TOGGLE_MODAL]: toggleModalReducer,
    [stockOrdersTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [stockOrdersTypes.SET_RESPONSE]: setResponseReducer,
    [stockOrdersTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [stockOrdersTypes.REFRESH_LIST]: setRefreshListReducer,
    [stockOrdersTypes.SEARCH_QUERY]: searchQueryReducer,
    [stockOrdersTypes.SHOW_LOADING]: showLoadingReducer,
    [stockOrdersTypes.HIDE_LOADING]: hideLoadingReducer,
    [stockOrdersTypes.SET_FILTER]: setFilterReducer,
    [stockOrdersTypes.REMOVE_FILTER]: removeFilterReducer,
    [stockOrdersTypes.SELECTED_INDEX]: setSelectedTabReducer,
    [stockOrdersTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [stockOrdersTypes.SET_INITIAL_VALUE]: setInitialValue,
    [stockOrdersTypes.SET_CHECKED_RESPONSE]: setCheckedListResponse,
}

export default createReducer(STOCK_ORDER_STATE, ACTION_HANDLERS);