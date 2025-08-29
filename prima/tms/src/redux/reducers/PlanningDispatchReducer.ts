import { createReducer } from "reduxsauce";
import PlanningDispatchTypes from "../types/PlanningDispatchTypes";
import { PlanningDispatchState } from '../storeStates/PlanningSoreInterface';
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";

export const PLANNING_DISPATCH_STATE: PlanningDispatchState = {
    openFilter: false,
    openPlanningModal: false,
    openModal: true,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    currentPage: 1,
    pageSize: rowsPerPageOptions[0],
    filterChips: {},
    filterParams: {},
    loading: false,
    refreshList: false,
    openPointModal: false,
}

const toggleFilterReducer = (state = PLANNING_DISPATCH_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = PLANNING_DISPATCH_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const togglePlanningModalReducer = (state = PLANNING_DISPATCH_STATE) => ({
    ...state,
    openPlanningModal: !state.openPlanningModal
});

const setSelectedElementReducer = (state = PLANNING_DISPATCH_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = PLANNING_DISPATCH_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.dispatch] : action.response && action.response.dispatch)
        : action.response && action.response.dispatch,
    loading: false,
});

const setCurrentPageReducer = (state = PLANNING_DISPATCH_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = PLANNING_DISPATCH_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
});


const setFilterReducer = (state = PLANNING_DISPATCH_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = PLANNING_DISPATCH_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];
    switch (action.key) {
        case "status":
            delete state.filterParams["status"]
            delete state.filterParams["statusComplete"]
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

const showLoadingReducer = (state = PLANNING_DISPATCH_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = PLANNING_DISPATCH_STATE) => ({
    ...state,
    loading: false
});

const togglePointsModalReducer = (state = PLANNING_DISPATCH_STATE) => ({
    ...state,
    openPointModal: !state.openPointModal
});


const refreshListReducer = (state = PLANNING_DISPATCH_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const ACTION_HANDLERS = {
    [PlanningDispatchTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [PlanningDispatchTypes.TOGGLE_MODAL]: toggleModalReducer,
    [PlanningDispatchTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [PlanningDispatchTypes.SET_RESPONSE]: setResponseReducer,
    [PlanningDispatchTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [PlanningDispatchTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [PlanningDispatchTypes.JOB_LISTING_FILTER]: setFilterReducer,
    [PlanningDispatchTypes.REMOVE_FILTER]: removeFilterReducer,
    [PlanningDispatchTypes.SHOW_LOADING]: showLoadingReducer,
    [PlanningDispatchTypes.HIDE_LOADING]: hideLoadingReducer,
    [PlanningDispatchTypes.TOGGLE_POINTS_MODAL]: togglePointsModalReducer,
    [PlanningDispatchTypes.TOGGLE_PLANNING_MODAL]: togglePlanningModalReducer,
    [PlanningDispatchTypes.REFRESH_LIST]: refreshListReducer,
}

export default createReducer(PLANNING_DISPATCH_STATE, ACTION_HANDLERS);