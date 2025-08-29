import { createReducer } from "reduxsauce";
import DetentionReportTypes from "../types/DetentionReportTypes";
import { DetentionReportState } from '../storeStates/DetentionReportInterface';
import { rowsPerPageOptions, lastWeek } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";

export const DETENTION_REPORT_STATE: DetentionReportState = {
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

const toggleFilterReducer = (state = DETENTION_REPORT_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = DETENTION_REPORT_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = DETENTION_REPORT_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = DETENTION_REPORT_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.results] : action.response && action.response.results)
        : action.response && action.response.results,
});

const setCurrentPageReducer = (state = DETENTION_REPORT_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRefreshListReducer = (state = DETENTION_REPORT_STATE) => ({
    ...state,
    refresh_list: !state.refresh_list,
    currentPage: 1,
    listData: undefined,
});

const searchQueryReducer = (state = DETENTION_REPORT_STATE, action: any) => ({
    ...state,
    searchQuery: action.value
});

const setRowPerPageReducer = (state = DETENTION_REPORT_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
});

const setFilterReducer = (state = DETENTION_REPORT_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    listData: undefined,
    refresh_list: !state.refresh_list,
    currentPage: 1,
    // chartData: [],
    // dashboardCount: {}
});

const removeFilterReducer = (state = DETENTION_REPORT_STATE, action: any) => {
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

const ACTION_HANDLERS = {
    [DetentionReportTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [DetentionReportTypes.TOGGLE_MODAL]: toggleModalReducer,
    [DetentionReportTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [DetentionReportTypes.SET_RESPONSE]: setResponseReducer,
    [DetentionReportTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [DetentionReportTypes.REFRESH_LIST]: setRefreshListReducer,
    [DetentionReportTypes.SEARCH_QUERY]: searchQueryReducer,
    [DetentionReportTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [DetentionReportTypes.USER_FILTER]: setFilterReducer,
    [DetentionReportTypes.REMOVE_FILTER]: removeFilterReducer,
}

export default createReducer(DETENTION_REPORT_STATE, ACTION_HANDLERS);