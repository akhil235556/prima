import { createReducer } from "reduxsauce";
import TrackingDashboardTypes from "../types/TrackingDashboardTypes";
import { TrackingDashboardTypeState } from '../storeStates/TrackingDashboardStoreInterface';
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";

export const TRACKING_DASHBOARD_TYPE_STATE: TrackingDashboardTypeState = {
    openFilter: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    openModal: false,
    currentPage: 1,
    searchQuery: "",
    pageSize: rowsPerPageOptions[0],
    status: "INIT",
    filterChips: {},
    filterParams: {},
    countData: undefined,
    refreshList: false
}

const toggleFilterReducer = (state = TRACKING_DASHBOARD_TYPE_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = TRACKING_DASHBOARD_TYPE_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = TRACKING_DASHBOARD_TYPE_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = TRACKING_DASHBOARD_TYPE_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.trips] : action.response && action.response.trips)
        : action.response && action.response.trips,
});

const setResponseUndefined = (state = TRACKING_DASHBOARD_TYPE_STATE, action: any) => ({
    ...state,
    listData: undefined
});

const setCountResponseReducer = (state = TRACKING_DASHBOARD_TYPE_STATE, action: any) => ({
    ...state,
    // pagination: action.response && action.response.pagination,
    countData: action.response
});

const setCurrentPageReducer = (state = TRACKING_DASHBOARD_TYPE_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRefreshListReducer = (state = TRACKING_DASHBOARD_TYPE_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const searchQueryReducer = (state = TRACKING_DASHBOARD_TYPE_STATE, action: any) => ({
    ...state,
    searchQuery: action.value
});

const setRowPerPageReducer = (state = TRACKING_DASHBOARD_TYPE_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
});

const setStatusReducer = (state = TRACKING_DASHBOARD_TYPE_STATE, action: any) => ({
    ...state,
    status: action.value
});

const setFilterReducer = (state = TRACKING_DASHBOARD_TYPE_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
    // tripList: undefined,
});

const clearListData = (state = TRACKING_DASHBOARD_TYPE_STATE) => ({
    ...state,
    listData: undefined,
    currentPage: 1
})

const removeFilterReducer = (state = TRACKING_DASHBOARD_TYPE_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];
    switch (action.key) {
        case "originCode":
            delete state.filterParams["originCode"]
            delete state.filterParams["originName"]
            delete state.filterParams["origin"]
            break;
        case "destinationCode":
            delete state.filterParams["destinationCode"]
            delete state.filterParams["destinationName"]
            delete state.filterParams["destination"]
            break;
        case "vehicleCode":
            delete state.filterParams["vehicle"]
            delete state.filterParams["vehicleNumber"]
            delete state.filterParams["vehicleCode"]
            break;
        case "fromDate":
            delete state.filterParams["fromDate"]
            delete state.filterParams["toDate"]
            delete state.filterChips["toDate"]
            break;
        case "toDate":
            delete state.filterParams["fromDate"]
            delete state.filterChips["fromDate"]
            delete state.filterParams["toDate"]
            break;
    }
    return {
        ...state,
        filterChips: { ...state.filterChips },
        filterParams: { ...state.filterParams },
        currentPage: 1,
        listData: undefined,
        // tripList: undefined,
        refreshList: !state.refreshList,
    }
};

const ACTION_HANDLERS = {
    [TrackingDashboardTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [TrackingDashboardTypes.TOGGLE_MODAL]: toggleModalReducer,
    [TrackingDashboardTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [TrackingDashboardTypes.SET_RESPONSE]: setResponseReducer,
    [TrackingDashboardTypes.SET_RESPONSE_UNDEFINED]: setResponseUndefined,
    [TrackingDashboardTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [TrackingDashboardTypes.REFRESH_LIST]: setRefreshListReducer,
    [TrackingDashboardTypes.SEARCH_QUERY]: searchQueryReducer,
    [TrackingDashboardTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [TrackingDashboardTypes.SET_STATUS]: setStatusReducer,
    [TrackingDashboardTypes.TRACKING_DASHBOARD_FILTER]: setFilterReducer,
    [TrackingDashboardTypes.REMOVE_FILTER]: removeFilterReducer,
    [TrackingDashboardTypes.SET_COUNT_RESPONSE]: setCountResponseReducer,
    [TrackingDashboardTypes.CLEAR_LIST_DATA]: clearListData,
}

export default createReducer(TRACKING_DASHBOARD_TYPE_STATE, ACTION_HANDLERS);