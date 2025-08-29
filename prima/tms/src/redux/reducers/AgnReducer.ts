import { createReducer } from "reduxsauce";
import AgnTypes from "../types/AgnTypes";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { AgnState } from "../storeStates/AgnStoreInterface";
import { isMobile } from "../../base/utility/ViewUtils";

export const AGN_STATE: AgnState = {
    openFilter: false,
    openCancelModal: false,
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

const toggleFilterReducer = (state = AGN_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const refreshListReducer = (state = AGN_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const toggleModalReducer = (state = AGN_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = AGN_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = AGN_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.results] : action.response && action.response.results)
        : action.response && action.response.results,

    loading: false,
});


const setCurrentPageReducer = (state = AGN_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = AGN_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const setFilterReducer = (state = AGN_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
    refreshList: !state.refreshList,
});

const removeFilterReducer = (state = AGN_STATE, action: any) => {
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

const showLoadingReducer = (state = AGN_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = AGN_STATE) => ({
    ...state,
    loading: false
});

const toggleCancelModalReducer = (state = AGN_STATE) => ({
    ...state,
    openCancelModal: !state.openCancelModal
});

const ACTION_HANDLERS = {
    [AgnTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [AgnTypes.TOGGLE_MODAL]: toggleModalReducer,
    [AgnTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [AgnTypes.SET_RESPONSE]: setResponseReducer,
    [AgnTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [AgnTypes.REFRESH_LIST]: refreshListReducer,
    [AgnTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [AgnTypes.SHOW_LOADING]: showLoadingReducer,
    [AgnTypes.HIDE_LOADING]: hideLoadingReducer,
    [AgnTypes.SET_FILTER]: setFilterReducer,
    [AgnTypes.REMOVE_FILTER]: removeFilterReducer,
    [AgnTypes.TOGGLE_CANCEL_MODAL]: toggleCancelModalReducer,


}

export default createReducer(AGN_STATE, ACTION_HANDLERS);