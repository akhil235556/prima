import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { DiversionState } from "../storeStates/DiversionInterface";
import DiversionTypes from "../types/DiversionTypes";


export const DIVERSION_STATE: DiversionState = {
    openFilter: false,
    loading: false,
    refreshList: false,
    openPointModal: false,
    openModal: false,
    selectedItem: undefined,
    selectedTabIndex: 0,
    pagination: undefined,
    listData: undefined,
    currentPage: 1,
    pageSize: rowsPerPageOptions[0],
    searchQuery: "",
    filterParams: {},
    filterChips: {},
}

const toggleFilterReducer = (state = DIVERSION_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = DIVERSION_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = DIVERSION_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = DIVERSION_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.results] : action.response && action.response.results)
        : action.response && action.response.results,
});

const setCurrentPageReducer = (state = DIVERSION_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRefreshListReducer = (state = DIVERSION_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const searchQueryReducer = (state = DIVERSION_STATE, action: any) => ({
    ...state,
    searchQuery: action.value
});

const setRowPerPageReducer = (state = DIVERSION_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
});

const setSelectedTabReducer = (state = DIVERSION_STATE, action: any) => ({
    ...state,
    selectedTabIndex: action.value,
    listData: undefined,
});

const showLoadingReducer = (state = DIVERSION_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = DIVERSION_STATE) => ({
    ...state,
    loading: false
});

const setFilterReducer = (state = DIVERSION_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    listData: undefined,
    refreshList: !state.refreshList,
    currentPage: 1,
});

const togglePointsModalReducer = (state = DIVERSION_STATE) => ({
    ...state,
    openPointModal: !state.openPointModal
});


const removeFilterReducer = (state = DIVERSION_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];

    switch (action.key) {
        case "sourceNumber":
            state.filterParams && state.filterParams["sourceNumber"] && delete state.filterParams["sourceNumber"];
            break;
        case "stockOrderId":
            state.filterParams && state.filterParams["stockOrderId"] && delete state.filterParams["stockOrderId"];
            break;
        case "quantity":
            state.filterParams && state.filterParams["quantity"] && delete state.filterParams["quantity"];
            break;
        case "startDateTime":
            state.filterParams && state.filterParams["startDateTime"] && delete state.filterParams["startDateTime"];
            state.filterParams && state.filterParams["endDateTime"] && delete state.filterParams["endDateTime"];
            state.filterChips && state.filterChips["endDateTime"] && delete state.filterChips["endDateTime"];
            break;
        case "endDateTime":
            state.filterParams && state.filterParams["startDateTime"] && delete state.filterParams["startDateTime"];
            state.filterParams && state.filterParams["endDateTime"] && delete state.filterParams["endDateTime"];
            state.filterChips && state.filterChips["startDateTime"] && delete state.filterChips["startDateTime"];
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

const ACTION_HANDLERS = {
    [DiversionTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [DiversionTypes.TOGGLE_MODAL]: toggleModalReducer,
    [DiversionTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [DiversionTypes.SET_RESPONSE]: setResponseReducer,
    [DiversionTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [DiversionTypes.REFRESH_LIST]: setRefreshListReducer,
    [DiversionTypes.SEARCH_QUERY]: searchQueryReducer,
    [DiversionTypes.SHOW_LOADING]: showLoadingReducer,
    [DiversionTypes.HIDE_LOADING]: hideLoadingReducer,
    [DiversionTypes.SET_FILTER]: setFilterReducer,
    [DiversionTypes.REMOVE_FILTER]: removeFilterReducer,
    [DiversionTypes.SELECTED_INDEX]: setSelectedTabReducer,
    [DiversionTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [DiversionTypes.TOGGLE_POINTS_MODAL]: togglePointsModalReducer
}

export default createReducer(DIVERSION_STATE, ACTION_HANDLERS);