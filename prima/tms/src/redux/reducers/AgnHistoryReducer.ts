import { createReducer } from "reduxsauce";
import AgnHistoryTypes from "../types/AgnHistoryTypes";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { AgnHistoryState } from "../storeStates/AgnHistoryInterface";
import { isMobile } from "../../base/utility/ViewUtils";

export const AGN_History_STATE: AgnHistoryState = {
    openFilter: false,
    loading: false,
    refreshList: false,
    openPointModal: false,
    openModal: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    currentPage: 1,
    pageSize: rowsPerPageOptions[0],
    searchQuery: "",
    filterParams: {},
    filterChips: {},
}

const toggleFilterReducer = (state = AGN_History_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const refreshListReducer = (state = AGN_History_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const toggleModalReducer = (state = AGN_History_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = AGN_History_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = AGN_History_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.results] : action.response && action.response.results)
        : action.response && action.response.results,

    loading: false,
});


const setCurrentPageReducer = (state = AGN_History_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = AGN_History_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const setFilterReducer = (state = AGN_History_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
    refreshList: !state.refreshList,
});

const removeFilterReducer = (state = AGN_History_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];

    switch (action.key) {
        case "originLocationName":
            state.filterParams && state.filterParams["originLocationCode"] && delete state.filterParams["originLocationCode"];
            break;
        case "destinationLocationName":
            state.filterParams && state.filterParams["destinationLocationCode"] && delete state.filterParams["destinationLocationCode"];
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


const showLoadingReducer = (state = AGN_History_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = AGN_History_STATE) => ({
    ...state,
    loading: false
});


const ACTION_HANDLERS = {
    [AgnHistoryTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [AgnHistoryTypes.TOGGLE_MODAL]: toggleModalReducer,
    [AgnHistoryTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [AgnHistoryTypes.SET_RESPONSE]: setResponseReducer,
    [AgnHistoryTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [AgnHistoryTypes.REFRESH_LIST]: refreshListReducer,
    [AgnHistoryTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [AgnHistoryTypes.SHOW_LOADING]: showLoadingReducer,
    [AgnHistoryTypes.HIDE_LOADING]: hideLoadingReducer,
    [AgnHistoryTypes.SET_FILTER]: setFilterReducer,
    [AgnHistoryTypes.REMOVE_FILTER]: removeFilterReducer,
}

export default createReducer(AGN_History_STATE, ACTION_HANDLERS);