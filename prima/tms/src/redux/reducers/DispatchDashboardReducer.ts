import { createReducer } from "reduxsauce";
import { lastWeek } from "../../base/constant/ArrayList";
import { DispatchDashboardState } from "../storeStates/DispatchStoreInterface";
import DispatchDashboardTypes from "../types/DispatchDashboardTypes";

export const DISPATCH_DASHBOARD_STATE: DispatchDashboardState = {
    openFilter: false,
    loading: false,
    refreshList: false,
    filterParams: {
        fromDate: lastWeek.fromDate,
        toDate: lastWeek.toDate
    },
    filterChips: {},
    chartData: [],
    dashboardCount: {},
}

const toggleFilterReducer = (state = DISPATCH_DASHBOARD_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const setFilterReducer = (state = DISPATCH_DASHBOARD_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    chartData: [],
    dashboardCount: {}
});

const removeFilterReducer = (state = DISPATCH_DASHBOARD_STATE, action: any) => {
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
        chartData: [],
        dashboardCount: {},
        refreshList: !state.refreshList
    }
};

const showLoadingReducer = (state = DISPATCH_DASHBOARD_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = DISPATCH_DASHBOARD_STATE) => ({
    ...state,
    loading: false
});
const setDashboardCountReducer = (state = DISPATCH_DASHBOARD_STATE, action: any) => ({
    ...state,
    dashboardCount: action.value,
});

const setDashboardChartDataReducer = (state = DISPATCH_DASHBOARD_STATE, action: any) => ({
    ...state,
    chartData: action.value,
});
const setRefreshListReducer = (state = DISPATCH_DASHBOARD_STATE) => ({
    ...state,
    chartData: [],
    dashboardCount: {},
    refreshList: !state.refreshList
});



const ACTION_HANDLERS = {
    [DispatchDashboardTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [DispatchDashboardTypes.USER_FILTER]: setFilterReducer,
    [DispatchDashboardTypes.REMOVE_FILTER]: removeFilterReducer,
    [DispatchDashboardTypes.SHOW_LOADING]: showLoadingReducer,
    [DispatchDashboardTypes.HIDE_LOADING]: hideLoadingReducer,
    [DispatchDashboardTypes.DASHBOARD_COUNT]: setDashboardCountReducer,
    [DispatchDashboardTypes.DASHBOARD_CHART_DATA]: setDashboardChartDataReducer,
    [DispatchDashboardTypes.REFRESH_LIST]: setRefreshListReducer,

}

export default createReducer(DISPATCH_DASHBOARD_STATE, ACTION_HANDLERS);