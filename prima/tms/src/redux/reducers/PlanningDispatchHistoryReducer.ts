import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { PlanningDispatchHistoryState } from '../storeStates/PlanningSoreInterface';
import PlanningDispatchHistoryTypes from "../types/PlanningDispatchHistoryTypes";

export const PLANNING_DISPATCH_HISTORY_STATE: PlanningDispatchHistoryState = {
    openFilter: false,
    openPointModal: false,
    openModal: false,
    selectedItem: {},
    pagination: undefined,
    listData: undefined,
    currentPage: 1,
    checkedCount: 0,
    loading: false,
    refreshList: false,
    pageSize: rowsPerPageOptions[0],
    filterChips: {},
    filterParams: {},
}

const toggleFilterReducer = (state = PLANNING_DISPATCH_HISTORY_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = PLANNING_DISPATCH_HISTORY_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = PLANNING_DISPATCH_HISTORY_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = PLANNING_DISPATCH_HISTORY_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.dispatch] : action.response && action.response.dispatch)
        : action.response && action.response.dispatch,
    loading: false,
});

const setCurrentPageReducer = (state = PLANNING_DISPATCH_HISTORY_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = PLANNING_DISPATCH_HISTORY_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
});

const showLoadingReducer = (state = PLANNING_DISPATCH_HISTORY_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = PLANNING_DISPATCH_HISTORY_STATE) => ({
    ...state,
    loading: false
});

const setFilterReducer = (state = PLANNING_DISPATCH_HISTORY_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = PLANNING_DISPATCH_HISTORY_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];
    switch (action.key) {
        case "originLocationName":
            state.filterParams && state.filterParams["origin"] && delete state.filterParams["origin"];
            break;
        case "destinationLocationName":
            state.filterParams && state.filterParams["destination"] && delete state.filterParams["destination"];
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
        refreshList: !state.refreshList,
        listData: undefined,
    }
};

const togglePointsModalReducer = (state = PLANNING_DISPATCH_HISTORY_STATE) => ({
    ...state,
    openPointModal: !state.openPointModal
});

const refreshListReducer = (state = PLANNING_DISPATCH_HISTORY_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});


const ACTION_HANDLERS = {
    [PlanningDispatchHistoryTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [PlanningDispatchHistoryTypes.TOGGLE_MODAL]: toggleModalReducer,
    [PlanningDispatchHistoryTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [PlanningDispatchHistoryTypes.SET_RESPONSE]: setResponseReducer,
    [PlanningDispatchHistoryTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [PlanningDispatchHistoryTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [PlanningDispatchHistoryTypes.SHOW_LOADING]: showLoadingReducer,
    [PlanningDispatchHistoryTypes.HIDE_LOADING]: hideLoadingReducer,
    [PlanningDispatchHistoryTypes.SET_FILTER]: setFilterReducer,
    [PlanningDispatchHistoryTypes.REMOVE_FILTER]: removeFilterReducer,
    [PlanningDispatchHistoryTypes.TOGGLE_POINTS_MODAL]: togglePointsModalReducer,
    [PlanningDispatchHistoryTypes.REFRESH_LIST]: refreshListReducer,

}

export default createReducer(PLANNING_DISPATCH_HISTORY_STATE, ACTION_HANDLERS);