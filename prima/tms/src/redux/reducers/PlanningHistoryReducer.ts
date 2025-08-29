import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { PlanningHistoryState } from '../storeStates/PlanningSoreInterface';
import PlanningHistoryTypes from "../types/PlanningHistoryTypes";

export const PLANNING_HISTORY_STATE: PlanningHistoryState = {
    openFilter: false,
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

const toggleFilterReducer = (state = PLANNING_HISTORY_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = PLANNING_HISTORY_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = PLANNING_HISTORY_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

// const setResponseReducer = (state = PLANNING_HISTORY_STATE, action: any) => ({
//     ...state,
//     pagination: action.response && action.response.pagination,
//     listData: isMobile ?
//         (state.listData ? [...state.listData, ...action.response && action.response.history] : action.response && action.response.history)
//         : action.response && action.response.history,
//     loading: false,
// });

const setResponseReducer = (state = PLANNING_HISTORY_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.results] : action.response && action.response.results)
        : action.response && action.response.results,
    loading: false,
});

const refreshListReducer = (state = PLANNING_HISTORY_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const setCurrentPageReducer = (state = PLANNING_HISTORY_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = PLANNING_HISTORY_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
});

const showLoadingReducer = (state = PLANNING_HISTORY_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = PLANNING_HISTORY_STATE) => ({
    ...state,
    loading: false
});


const setFilterReducer = (state = PLANNING_HISTORY_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = PLANNING_HISTORY_STATE, action: any) => {
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


const ACTION_HANDLERS = {
    [PlanningHistoryTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [PlanningHistoryTypes.TOGGLE_MODAL]: toggleModalReducer,
    [PlanningHistoryTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [PlanningHistoryTypes.SET_RESPONSE]: setResponseReducer,
    [PlanningHistoryTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [PlanningHistoryTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [PlanningHistoryTypes.SHOW_LOADING]: showLoadingReducer,
    [PlanningHistoryTypes.HIDE_LOADING]: hideLoadingReducer,
    [PlanningHistoryTypes.JOB_LISTING_FILTER]: setFilterReducer,
    [PlanningHistoryTypes.REMOVE_FILTER]: removeFilterReducer,
    [PlanningHistoryTypes.REFRESH_LIST]: refreshListReducer,

}

export default createReducer(PLANNING_HISTORY_STATE, ACTION_HANDLERS);