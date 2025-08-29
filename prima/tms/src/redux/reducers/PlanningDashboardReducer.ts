import { createReducer } from "reduxsauce";
import PlanningDashboardTypes from "../types/PlanningDashboardTypes";
import { rowsPerPageOptions, lastWeek } from "../../base/constant/ArrayList";
import { PlanningDashboardState } from "../storeStates/PlanningSoreInterface";
import { isMobile } from "../../base/utility/ViewUtils";

export const PLANNING_DASHBOARD_STATE: PlanningDashboardState = {
    openFilter: false,
    openModal: false,
    refreshList: false,
    openPointModal: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    loading: false,
    currentPage: 1,
    pageSize: rowsPerPageOptions[0],
    filterParams: {
        fromDatetime: lastWeek.fromDate,
        toDatetime: lastWeek.toDate
    },
    filterChips: {},
}

const toggleFilterReducer = (state = PLANNING_DASHBOARD_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const refreshListReducer = (state = PLANNING_DASHBOARD_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const setSelectedItemReducer = (state = PLANNING_DASHBOARD_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = PLANNING_DASHBOARD_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.results] : action.response && action.response.results)
        : action.response && action.response.results,

    loading: false,
});


const setCurrentPageReducer = (state = PLANNING_DASHBOARD_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = PLANNING_DASHBOARD_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const togglePointsModalReducer = (state = PLANNING_DASHBOARD_STATE) => ({
    ...state,
    openPointModal: !state.openPointModal
});

const setFilterReducer = (state = PLANNING_DASHBOARD_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = PLANNING_DASHBOARD_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];
    switch (action.key) {
        case "period":
            state.filterParams && state.filterParams["period"] && delete state.filterParams["period"];
            state.filterParams && state.filterParams["fromDatetime"] && delete state.filterParams["fromDatetime"];
            state.filterParams && state.filterParams["toDatetime"] && delete state.filterParams["toDatetime"];
            state.filterChips && state.filterChips["fromDatetime"] && delete state.filterChips["fromDatetime"];
            state.filterChips && state.filterChips["toDatetime"] && delete state.filterChips["toDatetime"];
            break;
        case "originLocationName":
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
        refreshList: !state.refreshList,
    }
};

const toggleModalReducer = (state = PLANNING_DASHBOARD_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const showLoadingReducer = (state = PLANNING_DASHBOARD_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = PLANNING_DASHBOARD_STATE) => ({
    ...state,
    loading: false
});
const ACTION_HANDLERS = {
    [PlanningDashboardTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [PlanningDashboardTypes.SELECTED_ELEMENT]: setSelectedItemReducer,
    [PlanningDashboardTypes.SET_RESPONSE]: setResponseReducer,
    [PlanningDashboardTypes.REFRESH_LIST]: refreshListReducer,
    [PlanningDashboardTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [PlanningDashboardTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [PlanningDashboardTypes.TOGGLE_POINTS_MODAL]: togglePointsModalReducer,
    [PlanningDashboardTypes.USER_FILTER]: setFilterReducer,
    [PlanningDashboardTypes.REMOVE_FILTER]: removeFilterReducer,
    [PlanningDashboardTypes.TOGGLE_MODAL]: toggleModalReducer,
    [PlanningDashboardTypes.SHOW_LOADING]: showLoadingReducer,
    [PlanningDashboardTypes.HIDE_LOADING]: hideLoadingReducer,

}

export default createReducer(PLANNING_DASHBOARD_STATE, ACTION_HANDLERS);