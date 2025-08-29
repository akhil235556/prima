import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { IndentState } from "../storeStates/IndentStoreInterface";
import IndentTypes from "../types/IndentTypes";

export const INDENT_STATE: IndentState = {
    openFilter: false,
    openBulkUpload: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    openModal: false,
    currentPage: 1,
    pageSize: rowsPerPageOptions[0],
    refreshList: false,
    loading: false,
    openPointModal: false,
    filterParams: {},
    filterChips: {},
}

const toggleFilterReducer = (state = INDENT_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleBulkReducer = (state = INDENT_STATE) => ({
    ...state,
    openBulkUpload: !state.openBulkUpload
});

const toggleModalReducer = (state = INDENT_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const togglePointsModalReducer = (state = INDENT_STATE) => ({
    ...state,
    openPointModal: !state.openPointModal
});

const setSelectedElementReducer = (state = INDENT_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = INDENT_STATE, action: any) => ({
    ...state,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.indents] : action.response && action.response.indents)
        : action.response && action.response.indents,
    pagination: action.response && action.response.pagination,
    loading: false,
});

const setCurrentPageReducer = (state = INDENT_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = INDENT_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const refreshListReducer = (state = INDENT_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const setFilterReducer = (state = INDENT_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = INDENT_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];
    switch (action.key) {
        case 'laneName':
            state.filterParams && state.filterParams['laneCode'] && delete state.filterParams['laneCode'];
            break;
        case 'placementFromDate':
            state.filterParams && state.filterParams['placementFromDate'] && delete state.filterParams['placementFromDate'];
            state.filterChips && state.filterChips['placementToDate'] && delete state.filterChips['placementToDate'];
            state.filterParams && state.filterParams['placementToDate'] && delete state.filterParams['placementToDate'];
            break;
        case 'placementToDate':
            state.filterParams && state.filterParams['placementFromDate'] && delete state.filterParams['placementFromDate'];
            state.filterChips && state.filterChips['placementFromDate'] && delete state.filterChips['placementFromDate'];
            state.filterParams && state.filterParams['placementToDate'] && delete state.filterParams['placementToDate'];
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
const showLoadingReducer = (state = INDENT_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = INDENT_STATE) => ({
    ...state,
    loading: false
});
const ACTION_HANDLERS = {
    [IndentTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [IndentTypes.TOGGLE_MODAL]: toggleModalReducer,
    [IndentTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [IndentTypes.SET_RESPONSE]: setResponseReducer,
    [IndentTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [IndentTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [IndentTypes.REFRESH_LIST]: refreshListReducer,
    [IndentTypes.TOGGLE_POINTS_MODAL]: togglePointsModalReducer,
    [IndentTypes.USER_FILTER]: setFilterReducer,
    [IndentTypes.REMOVE_FILTER]: removeFilterReducer,
    [IndentTypes.SHOW_LOADING]: showLoadingReducer,
    [IndentTypes.HIDE_LOADING]: hideLoadingReducer,
    [IndentTypes.TOGGLE_BULK_MODAL]: toggleBulkReducer
}

export default createReducer(INDENT_STATE, ACTION_HANDLERS);