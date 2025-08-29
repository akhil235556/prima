import { createReducer } from "reduxsauce";
import ShortageDamageReportTypes from "../types/ShortageDamageReportTypes";
import { ShortageDamageReportState } from '../storeStates/ShortageDamageReportInterface';
import { rowsPerPageOptions, lastWeek } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";

export const SHORTAGE_DAMAGE_REPORT_STATE: ShortageDamageReportState = {
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

const toggleFilterReducer = (state = SHORTAGE_DAMAGE_REPORT_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = SHORTAGE_DAMAGE_REPORT_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = SHORTAGE_DAMAGE_REPORT_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = SHORTAGE_DAMAGE_REPORT_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.results] : action.response && action.response.results)
        : action.response && action.response.results,
});

const setCurrentPageReducer = (state = SHORTAGE_DAMAGE_REPORT_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRefreshListReducer = (state = SHORTAGE_DAMAGE_REPORT_STATE) => ({
    ...state,
    refresh_list: !state.refresh_list,
    currentPage: 1,
    listData: undefined,
});

const searchQueryReducer = (state = SHORTAGE_DAMAGE_REPORT_STATE, action: any) => ({
    ...state,
    searchQuery: action.value
});

const setRowPerPageReducer = (state = SHORTAGE_DAMAGE_REPORT_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
});

const setFilterReducer = (state = SHORTAGE_DAMAGE_REPORT_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    listData: undefined,
    refresh_list: !state.refresh_list,
    currentPage: 1,
    // chartData: [],
    // dashboardCount: {}
});

const removeFilterReducer = (state = SHORTAGE_DAMAGE_REPORT_STATE, action: any) => {
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
    [ShortageDamageReportTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [ShortageDamageReportTypes.TOGGLE_MODAL]: toggleModalReducer,
    [ShortageDamageReportTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [ShortageDamageReportTypes.SET_RESPONSE]: setResponseReducer,
    [ShortageDamageReportTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [ShortageDamageReportTypes.REFRESH_LIST]: setRefreshListReducer,
    [ShortageDamageReportTypes.SEARCH_QUERY]: searchQueryReducer,
    [ShortageDamageReportTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [ShortageDamageReportTypes.USER_FILTER]: setFilterReducer,
    [ShortageDamageReportTypes.REMOVE_FILTER]: removeFilterReducer,
}

export default createReducer(SHORTAGE_DAMAGE_REPORT_STATE, ACTION_HANDLERS);