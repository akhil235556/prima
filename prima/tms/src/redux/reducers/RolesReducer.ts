import { createReducer } from "reduxsauce";
import RolesTypes from "../types/RolesTypes"
import { RoleState } from '../storeStates/RolesStoreInterface';
import { rowsPerPageOptions } from "../../base/constant/ArrayList";

export const ROLES_STATE: RoleState = {
    openModal: false,
    loading: false,
    listData: undefined,
    pagination: undefined,
    selectedElement: undefined,
    currentPage: 1,
    pageSize: rowsPerPageOptions[0],
    refreshList: false,
}

const toggleModalReducer = (state = ROLES_STATE) => ({
    ...state,
    openModal: !state.openModal
});


const setResponseReducer = (state = ROLES_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: action.response && action.response.results
});

const setSelectedElementReducer = (state = ROLES_STATE, action: any) => ({
    ...state,
    selectedElement: action.value
});

const setCurrentPageReducer = (state = ROLES_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = ROLES_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const refreshListReducer = (state = ROLES_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const showLoadingReducer = (state = ROLES_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = ROLES_STATE) => ({
    ...state,
    loading: false
});

const ACTION_HANDLERS = {
    [RolesTypes.TOGGLE_MODAL]: toggleModalReducer,
    [RolesTypes.SET_RESPONSE]: setResponseReducer,
    [RolesTypes.SET_SELECTED_ELEMENT]: setSelectedElementReducer,
    [RolesTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [RolesTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [RolesTypes.REFRESH_LIST]: refreshListReducer,
    [RolesTypes.SHOW_LOADING]: showLoadingReducer,
    [RolesTypes.HIDE_LOADING]: hideLoadingReducer,
}

export default createReducer(ROLES_STATE, ACTION_HANDLERS);