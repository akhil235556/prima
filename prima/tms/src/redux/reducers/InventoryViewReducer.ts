import { createReducer } from "reduxsauce";
import InventoryViewTypes from "../types/InventoryViewTypes";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { InventoryViewState } from "../storeStates/InventoryViewInterface";
import { isMobile } from "../../base/utility/ViewUtils";

export const InventoryView_STATE: InventoryViewState = {
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

const toggleFilterReducer = (state = InventoryView_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const refreshListReducer = (state = InventoryView_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const toggleModalReducer = (state = InventoryView_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = InventoryView_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = InventoryView_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.stocks] : action.response && action.response.stocks)
        : action.response && action.response.stocks,

    loading: false,
});


const setCurrentPageReducer = (state = InventoryView_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = InventoryView_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const setFilterReducer = (state = InventoryView_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = InventoryView_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];

    switch (action.key) {
        case "locationName":
            state.filterParams && state.filterParams["location"] && delete state.filterParams["location"];
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


const showLoadingReducer = (state = InventoryView_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = InventoryView_STATE) => ({
    ...state,
    loading: false
});


const ACTION_HANDLERS = {
    [InventoryViewTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [InventoryViewTypes.TOGGLE_MODAL]: toggleModalReducer,
    [InventoryViewTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [InventoryViewTypes.SET_RESPONSE]: setResponseReducer,
    [InventoryViewTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [InventoryViewTypes.REFRESH_LIST]: refreshListReducer,
    [InventoryViewTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [InventoryViewTypes.SHOW_LOADING]: showLoadingReducer,
    [InventoryViewTypes.HIDE_LOADING]: hideLoadingReducer,
    [InventoryViewTypes.SET_FILTER]: setFilterReducer,
    [InventoryViewTypes.REMOVE_FILTER]: removeFilterReducer,

}

export default createReducer(InventoryView_STATE, ACTION_HANDLERS);