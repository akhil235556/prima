import { createReducer } from "reduxsauce";
import SalesOrderTypes from "../types/SalesOrderTypes";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { SalesOrderState } from "../storeStates/SalesOrderInterface";
import { isMobile } from "../../base/utility/ViewUtils";

export const SalesOrder_STATE: SalesOrderState = {
    openFilter: false,
    loading: false,
    refreshList: false,
    openBulkUpload: false,
    openModal: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    currentPage: 1,
    pageSize: rowsPerPageOptions[0],
    searchQuery: "",
    filterParams: {},
    filterChips: {},
}

const toggleFilterReducer = (state = SalesOrder_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

// const refreshListReducer = (state = SalesOrder_STATE) => ({
//     ...state,
//     refreshList: !state.refreshList,
//     currentPage: 1,
//     listData: undefined,
// });

const toggleModalReducer = (state = SalesOrder_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = SalesOrder_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = SalesOrder_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.salesOrders] : action.response && action.response.salesOrders)
        : action.response && action.response.salesOrders,

    loading: false,
});


const setCurrentPageReducer = (state = SalesOrder_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = SalesOrder_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const setFilterReducer = (state = SalesOrder_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = SalesOrder_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];

    switch (action.key) {
        case "locationName":
            state.filterParams && state.filterParams["location"] && delete state.filterParams["location"];
            break;
        case "fromDate":
            state.filterParams && state.filterParams["fromDate"] && delete state.filterParams["fromDate"];
            state.filterParams && state.filterParams["toDate"] && delete state.filterParams["toDate"];
            state.filterChips && state.filterChips["toDate"] && delete state.filterChips["toDate"];
            break;
        case "toDate":
            state.filterParams && state.filterParams["fromDate"] && delete state.filterParams["fromDate"];
            state.filterParams && state.filterParams["toDate"] && delete state.filterParams["toDate"];
            state.filterChips && state.filterChips["fromDate"] && delete state.filterChips["fromDate"];
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

const toggleBulkUploadReducer = (state = SalesOrder_STATE) => ({
    ...state,
    openBulkUpload: !state.openBulkUpload
});

const showLoadingReducer = (state = SalesOrder_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = SalesOrder_STATE) => ({
    ...state,
    loading: false
});


const ACTION_HANDLERS = {
    [SalesOrderTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [SalesOrderTypes.TOGGLE_MODAL]: toggleModalReducer,
    [SalesOrderTypes.SET_RESPONSE]: setResponseReducer,
    [SalesOrderTypes.SET_FILTER]: setFilterReducer,
    [SalesOrderTypes.REMOVE_FILTER]: removeFilterReducer,
    [SalesOrderTypes.SHOW_LOADING]: showLoadingReducer,
    [SalesOrderTypes.HIDE_LOADING]: hideLoadingReducer,
    [SalesOrderTypes.TOGGLE_BULK_UPLOAD]: toggleBulkUploadReducer,
    [SalesOrderTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [SalesOrderTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [SalesOrderTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,

}

export default createReducer(SalesOrder_STATE, ACTION_HANDLERS);