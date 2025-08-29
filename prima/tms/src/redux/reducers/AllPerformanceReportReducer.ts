import { createReducer } from "reduxsauce";
import AllPerformanceReportTypes from "../types/AllPerformanceReportTypes";
import { AllPerformanceReportState } from '../storeStates/AllPerformanceReportInterface';
import { rowsPerPageOptions, lastWeek } from "../../base/constant/ArrayList";

export const ALL_PERFORMANCE_REPORT_STATE: AllPerformanceReportState = {
    openFilter: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    openModal: false,
    currentPage: 1,
    refresh_list: false,
    searchQuery: "",
    pageSize: rowsPerPageOptions[0],
    filterParams: {
        fromDate: lastWeek.fromDate,
        toDate: lastWeek.toDate
    },
    filterChips: {},
}

const toggleFilterReducer = (state = ALL_PERFORMANCE_REPORT_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = ALL_PERFORMANCE_REPORT_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = ALL_PERFORMANCE_REPORT_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = ALL_PERFORMANCE_REPORT_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: action.response && action.response.vehicles
});

const setCurrentPageReducer = (state = ALL_PERFORMANCE_REPORT_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRefreshListReducer = (state = ALL_PERFORMANCE_REPORT_STATE) => ({
    ...state,
    refresh_list: !state.refresh_list,
    currentPage: 1,
    listData: undefined,
});

const searchQueryReducer = (state = ALL_PERFORMANCE_REPORT_STATE, action: any) => ({
    ...state,
    searchQuery: action.value
});

const setRowPerPageReducer = (state = ALL_PERFORMANCE_REPORT_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
});

const setFilterReducer = (state = ALL_PERFORMANCE_REPORT_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
    refresh_list: !state.refresh_list,
    // chartData: [],
    // dashboardCount: {}
});

const removeFilterReducer = (state = ALL_PERFORMANCE_REPORT_STATE, action: any) => {
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
            state.filterParams && state.filterParams["originLocationCode"] && delete state.filterParams["originLocationCode"];
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
    [AllPerformanceReportTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [AllPerformanceReportTypes.TOGGLE_MODAL]: toggleModalReducer,
    [AllPerformanceReportTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [AllPerformanceReportTypes.SET_RESPONSE]: setResponseReducer,
    [AllPerformanceReportTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [AllPerformanceReportTypes.REFRESH_LIST]: setRefreshListReducer,
    [AllPerformanceReportTypes.SEARCH_QUERY]: searchQueryReducer,
    [AllPerformanceReportTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [AllPerformanceReportTypes.REMOVE_FILTER]: removeFilterReducer,
    [AllPerformanceReportTypes.USER_FILTER]: setFilterReducer,
}

export default createReducer(ALL_PERFORMANCE_REPORT_STATE, ACTION_HANDLERS);