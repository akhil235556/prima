import { createReducer } from "reduxsauce";
import UserTypes from "../types/UserTypes";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { UserState } from '../storeStates/UserStateInterface';

export const USER_STATE: UserState = {
    openFilter: false,
    refreshList: false,
    openModal: false,
    loading: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    currentPage: 1,
    pageSize: rowsPerPageOptions[0],
    searchQuery: "",
    filterParams: {},
    filterChips: {},
}

const toggleFilterReducer = (state = USER_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const refreshListReducer = (state = USER_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const toggleModalReducer = (state = USER_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedItemReducer = (state = USER_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = USER_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: action.response && action.response.results,
    loading: false
});


const setCurrentPageReducer = (state = USER_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = USER_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const setFilterReducer = (state = USER_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = USER_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];
    state.filterParams && state.filterParams[action.key] && delete state.filterParams[action.key];
    return {
        ...state,
        filterChips: state.filterChips,
        filterParams: state.filterParams,
        currentPage: 1,
        listData: undefined,
        refreshList: !state.refreshList,
    }
};

const showLoadingReducer = (state = USER_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = USER_STATE) => ({
    ...state,
    loading: false
});


const ACTION_HANDLERS = {
    [UserTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [UserTypes.TOGGLE_MODAL]: toggleModalReducer,
    [UserTypes.SELECTED_ELEMENT]: setSelectedItemReducer,
    [UserTypes.SET_RESPONSE]: setResponseReducer,
    [UserTypes.REFRESH_LIST]: refreshListReducer,
    [UserTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [UserTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [UserTypes.USER_FILTER]: setFilterReducer,
    [UserTypes.REMOVE_FILTER]: removeFilterReducer,
    [UserTypes.SHOW_LOADING]: showLoadingReducer,
    [UserTypes.HIDE_LOADING]: hideLoadingReducer,

}

export default createReducer(USER_STATE, ACTION_HANDLERS);