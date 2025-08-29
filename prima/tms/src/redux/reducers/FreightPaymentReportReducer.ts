import { createReducer } from "reduxsauce";
import { lastWeek, rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { FreightPaymentReportState } from '../storeStates/FreightPaymentReportInterface';
import FreightPaymentReportTypes from "../types/FreightPaymentReportTypes";

export const FREIGHT_PAYMENT_REPORT_STATE: FreightPaymentReportState = {
    openFilter: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    openModal: false,
    currentPage: 1,
    refresh_list: false,
    searchQuery: "",
    pageSize: rowsPerPageOptions[0],
    filterChips: {},
    filterParams: {
        fromDate: lastWeek.fromDate,
        toDate: lastWeek.toDate
    },
    dateType: {
        label: "Created At",
        value: "created_at",
    }
}

const toggleFilterReducer = (state = FREIGHT_PAYMENT_REPORT_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = FREIGHT_PAYMENT_REPORT_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = FREIGHT_PAYMENT_REPORT_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = FREIGHT_PAYMENT_REPORT_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.results] : action.response && action.response.results)
        : action.response && action.response.results,
});

const setCurrentPageReducer = (state = FREIGHT_PAYMENT_REPORT_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRefreshListReducer = (state = FREIGHT_PAYMENT_REPORT_STATE) => ({
    ...state,
    refresh_list: !state.refresh_list,
    currentPage: 1,
    listData: undefined,
});

const searchQueryReducer = (state = FREIGHT_PAYMENT_REPORT_STATE, action: any) => ({
    ...state,
    searchQuery: action.value
});

const setRowPerPageReducer = (state = FREIGHT_PAYMENT_REPORT_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
});

const setFilterReducer = (state = FREIGHT_PAYMENT_REPORT_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    listData: undefined,
    refresh_list: !state.refresh_list,
    currentPage: 1,
    // chartData: [],
    // dashboardCount: {}
});

const removeFilterReducer = (state = FREIGHT_PAYMENT_REPORT_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];

    switch (action.key) {
        case "period":
            state.filterParams && state.filterParams["period"] && delete state.filterParams["period"];
            state.filterParams && state.filterParams["fromDate"] && delete state.filterParams["fromDate"];
            state.filterParams && state.filterParams["toDate"] && delete state.filterParams["toDate"];
            state.filterChips && state.filterChips["fromDate"] && delete state.filterChips["fromDate"];
            state.filterChips && state.filterChips["toDate"] && delete state.filterChips["toDate"];
            break;
        case "partnerName":
            state.filterParams && state.filterParams["partnerCode"] && delete state.filterParams["partnerCode"];
            break;
        case "destinationLocationName":
            state.filterParams && state.filterParams["destinationLocationCode"] && delete state.filterParams["destinationLocationCode"];
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

const setDateTypeReducer = (state = FREIGHT_PAYMENT_REPORT_STATE, action: any) => ({
    ...state,
    dateType: action.value
});

const ACTION_HANDLERS = {
    [FreightPaymentReportTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [FreightPaymentReportTypes.TOGGLE_MODAL]: toggleModalReducer,
    [FreightPaymentReportTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [FreightPaymentReportTypes.SET_RESPONSE]: setResponseReducer,
    [FreightPaymentReportTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [FreightPaymentReportTypes.REFRESH_LIST]: setRefreshListReducer,
    [FreightPaymentReportTypes.SEARCH_QUERY]: searchQueryReducer,
    [FreightPaymentReportTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [FreightPaymentReportTypes.USER_FILTER]: setFilterReducer,
    [FreightPaymentReportTypes.REMOVE_FILTER]: removeFilterReducer,
    [FreightPaymentReportTypes.SET_DATE_TYPE]: setDateTypeReducer,

}

export default createReducer(FREIGHT_PAYMENT_REPORT_STATE, ACTION_HANDLERS);