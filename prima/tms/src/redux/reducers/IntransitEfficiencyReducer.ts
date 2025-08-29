import { createReducer } from "reduxsauce";
import IntransitEfficiencyTypes from "../types/IntransitEfficiencyTypes";
import { IntransitEfficiencyState } from '../storeStates/IntransitEfficiencyInterface';
import { rowsPerPageOptions, lastWeek } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";

export const IN_TRANSIT_EFFICIENCY_STATE: IntransitEfficiencyState = {
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

const toggleFilterReducer = (state = IN_TRANSIT_EFFICIENCY_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = IN_TRANSIT_EFFICIENCY_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = IN_TRANSIT_EFFICIENCY_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = IN_TRANSIT_EFFICIENCY_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.results] : action.response && action.response.results)
        : action.response && action.response.results,
});

const setCurrentPageReducer = (state = IN_TRANSIT_EFFICIENCY_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRefreshListReducer = (state = IN_TRANSIT_EFFICIENCY_STATE) => ({
    ...state,
    refresh_list: !state.refresh_list,
    currentPage: 1,
    listData: undefined,
});

const searchQueryReducer = (state = IN_TRANSIT_EFFICIENCY_STATE, action: any) => ({
    ...state,
    searchQuery: action.value
});

const setRowPerPageReducer = (state = IN_TRANSIT_EFFICIENCY_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
});

const setFilterReducer = (state = IN_TRANSIT_EFFICIENCY_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    listData: undefined,
    refresh_list: !state.refresh_list,
    currentPage: 1,
    // chartData: [],
    // dashboardCount: {}
});

const removeFilterReducer = (state = IN_TRANSIT_EFFICIENCY_STATE, action: any) => {
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
    [IntransitEfficiencyTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [IntransitEfficiencyTypes.TOGGLE_MODAL]: toggleModalReducer,
    [IntransitEfficiencyTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [IntransitEfficiencyTypes.SET_RESPONSE]: setResponseReducer,
    [IntransitEfficiencyTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [IntransitEfficiencyTypes.REFRESH_LIST]: setRefreshListReducer,
    [IntransitEfficiencyTypes.SEARCH_QUERY]: searchQueryReducer,
    [IntransitEfficiencyTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [IntransitEfficiencyTypes.USER_FILTER]: setFilterReducer,
    [IntransitEfficiencyTypes.REMOVE_FILTER]: removeFilterReducer,
}

export default createReducer(IN_TRANSIT_EFFICIENCY_STATE, ACTION_HANDLERS);