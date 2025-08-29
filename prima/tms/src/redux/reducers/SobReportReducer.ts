import { createReducer } from "reduxsauce";
import SobReportTypes from "../types/SobReportTypes";
import { SobState } from '../storeStates/SobInterface';
import { rowsPerPageOptions, lastWeek } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";

export const SOB_STATE: SobState = {
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

const toggleFilterReducer = (state = SOB_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = SOB_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = SOB_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = SOB_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.results] : action.response && action.response.results)
        : action.response && action.response.results,
});

const setCurrentPageReducer = (state = SOB_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRefreshListReducer = (state = SOB_STATE) => ({
    ...state,
    refresh_list: !state.refresh_list,
    currentPage: 1,
    listData: undefined,
});

const searchQueryReducer = (state = SOB_STATE, action: any) => ({
    ...state,
    searchQuery: action.value
});

const setRowPerPageReducer = (state = SOB_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
});

const setFilterReducer = (state = SOB_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    listData: undefined,
    refresh_list: !state.refresh_list,
    currentPage: 1,
    // chartData: [],
    // dashboardCount: {}
});

const removeFilterReducer = (state = SOB_STATE, action: any) => {
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
        case "laneName":
            state.filterParams && state.filterParams["laneCode"] && delete state.filterParams["laneCode"];
            break;
        case "destinationLocationName":
            state.filterParams && state.filterParams["originCode"] && delete state.filterParams["originCode"];
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
    [SobReportTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [SobReportTypes.TOGGLE_MODAL]: toggleModalReducer,
    [SobReportTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [SobReportTypes.SET_RESPONSE]: setResponseReducer,
    [SobReportTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [SobReportTypes.REFRESH_LIST]: setRefreshListReducer,
    [SobReportTypes.SEARCH_QUERY]: searchQueryReducer,
    [SobReportTypes.USER_FILTER]: setFilterReducer,
    [SobReportTypes.REMOVE_FILTER]: removeFilterReducer,
    [SobReportTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
}

export default createReducer(SOB_STATE, ACTION_HANDLERS);