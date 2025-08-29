import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../../../base/constant/ArrayList";
import { isMobile } from "../../../../base/utility/ViewUtils";
import { DemandOrderState } from "./DemandOrderStoreInterface";
import DemandOrderTypes from "./DemandOrderTypes";

export const DEMAND_ORDER_STATE: DemandOrderState = {
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
    selectedTabIndex: undefined,
}

const toggleFilterReducer = (state = DEMAND_ORDER_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const refreshListReducer = (state = DEMAND_ORDER_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    pageSize: rowsPerPageOptions[0],
    listData: undefined,
});

const toggleModalReducer = (state = DEMAND_ORDER_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = DEMAND_ORDER_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = DEMAND_ORDER_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.data] : action.response && action.response.data)
        : action.response && action.response.data
});


const setCurrentPageReducer = (state = DEMAND_ORDER_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = DEMAND_ORDER_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const setFilterReducer = (state = DEMAND_ORDER_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = DEMAND_ORDER_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];

    switch (action.key) {
        case "demandOrderCode":
            state.filterParams && state.filterParams["demandOrderCode"] && delete state.filterParams["demandOrderCode"];
            break;
        case "transporterName":
            state.filterParams && state.filterParams["transporter"] && delete state.filterParams["transporter"];
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

const toggleBulkUploadReducer = (state = DEMAND_ORDER_STATE) => ({
    ...state,
    openBulkUpload: !state.openBulkUpload
});

const showLoadingReducer = (state = DEMAND_ORDER_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = DEMAND_ORDER_STATE) => ({
    ...state,
    loading: false
});

const setSelectedTabReducer = (state = DEMAND_ORDER_STATE, action: any) => ({
    ...state,
    selectedTabIndex: action.value,
    listData: undefined,
});

const setCheckedListResponse = (state = DEMAND_ORDER_STATE, action: any) => ({
    ...state,
    listData: action.response
})

const ACTION_HANDLERS = {
    [DemandOrderTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [DemandOrderTypes.TOGGLE_MODAL]: toggleModalReducer,
    [DemandOrderTypes.SET_RESPONSE]: setResponseReducer,
    [DemandOrderTypes.SET_FILTER]: setFilterReducer,
    [DemandOrderTypes.REFRESH_LIST]: refreshListReducer,
    [DemandOrderTypes.REMOVE_FILTER]: removeFilterReducer,
    [DemandOrderTypes.SHOW_LOADING]: showLoadingReducer,
    [DemandOrderTypes.HIDE_LOADING]: hideLoadingReducer,
    [DemandOrderTypes.TOGGLE_BULK_UPLOAD]: toggleBulkUploadReducer,
    [DemandOrderTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [DemandOrderTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [DemandOrderTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [DemandOrderTypes.SELECTED_INDEX]: setSelectedTabReducer,
    [DemandOrderTypes.SET_CHECKED_RESPONSE]: setCheckedListResponse,
}

export default createReducer(DEMAND_ORDER_STATE, ACTION_HANDLERS);