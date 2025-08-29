import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { CreatePlanState } from '../storeStates/PlanningSoreInterface';
import CreatePlanTypes from "../types/CreatePlanTypes";

export const CREATE_PLAN_STATE: CreatePlanState = {
    openFilter: false,
    openModal: false,
    selectedItem: {},
    pagination: undefined,
    listData: [],
    currentPage: 1,
    checkedCount: 0,
    loading: false,
    refreshList: false,
    pageSize: rowsPerPageOptions[0],
    filterChips: {},
    filterParams: {},
}

const toggleFilterReducer = (state = CREATE_PLAN_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = CREATE_PLAN_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = CREATE_PLAN_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = CREATE_PLAN_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData?.length > 0 ? [...state.listData, ...action.response && action.response.results] : action.response && action.response.results)
        : action.response && action.response.results,
    loading: false,
});

const refreshListReducer = (state = CREATE_PLAN_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: [],
});

const setCurrentPageReducer = (state = CREATE_PLAN_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = CREATE_PLAN_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
});

const showLoadingReducer = (state = CREATE_PLAN_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = CREATE_PLAN_STATE) => ({
    ...state,
    loading: false
});


const setFilterReducer = (state = CREATE_PLAN_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: [],
});

const removeFilterReducer = (state = CREATE_PLAN_STATE, action: any) => {
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
        listData: [],
    }
};


const ACTION_HANDLERS = {
    [CreatePlanTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [CreatePlanTypes.TOGGLE_MODAL]: toggleModalReducer,
    [CreatePlanTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [CreatePlanTypes.SET_RESPONSE]: setResponseReducer,
    [CreatePlanTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [CreatePlanTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [CreatePlanTypes.SHOW_LOADING]: showLoadingReducer,
    [CreatePlanTypes.HIDE_LOADING]: hideLoadingReducer,
    [CreatePlanTypes.JOB_LISTING_FILTER]: setFilterReducer,
    [CreatePlanTypes.REMOVE_FILTER]: removeFilterReducer,
    [CreatePlanTypes.REFRESH_LIST]: refreshListReducer,

}

export default createReducer(CREATE_PLAN_STATE, ACTION_HANDLERS);