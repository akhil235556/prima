import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { SobState } from '../storeStates/SobStoreInterface';
import SobTypes from "../types/SobTypes";

export const SOB_STATE: SobState = {
    openFilter: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    openModal: false,
    currentPage: 1,
    pageSize: rowsPerPageOptions[0],
    refreshList: false,
    openPointModal: false,
    loading: false,
    filterParams: {},
    filterChips: {},
}

const toggleFilterReducer = (state = SOB_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = SOB_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const togglePointsModalReducer = (state = SOB_STATE) => ({
    ...state,
    openPointModal: !state.openPointModal
});

const setSelectedElementReducer = (state = SOB_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = SOB_STATE, action: any) => ({
    ...state,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.results] : action.response && action.response.results)
        : action.response && action.response.results,
    pagination: action.response && action.response.pagination,
    loading: false,
});

const setCurrentPageReducer = (state = SOB_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = SOB_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const refreshListReducer = (state = SOB_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const showLoadingReducer = (state = SOB_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = SOB_STATE) => ({
    ...state,
    loading: false
});

const setFilterReducer = (state = SOB_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = SOB_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];
    switch (action.key) {
        case 'originLocationName':
            state.filterParams && state.filterParams['originCode'] && delete state.filterParams['originCode'];
            break;
        case 'destinationLocationName':
            state.filterParams && state.filterParams['destinationCode'] && delete state.filterParams['destinationCode'];
            break;
        case 'laneName':
            state.filterParams && state.filterParams['laneCode'] && delete state.filterParams['laneCode'];
            break;
        default:
            state.filterParams && state.filterParams[action.key] && delete state.filterParams[action.key];
            break;
    }
    return {
        ...state,
        filterChips: { ...state.filterChips },
        filterParams: { ...state.filterParams },
        currentPage: 1,
        listData: undefined,
        refreshList: !state.refreshList,
    }
};

const clearListData = (state = SOB_STATE) => ({
    ...state,
    listData: undefined
})

const ACTION_HANDLERS = {
    [SobTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [SobTypes.TOGGLE_MODAL]: toggleModalReducer,
    [SobTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [SobTypes.SET_RESPONSE]: setResponseReducer,
    [SobTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [SobTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [SobTypes.REFRESH_LIST]: refreshListReducer,
    [SobTypes.TOGGLE_POINTS_MODAL]: togglePointsModalReducer,
    [SobTypes.SHOW_LOADING]: showLoadingReducer,
    [SobTypes.HIDE_LOADING]: hideLoadingReducer,
    [SobTypes.USER_FILTER]: setFilterReducer,
    [SobTypes.REMOVE_FILTER]: removeFilterReducer,
    [SobTypes.CLEAR_LIST_DATA]: clearListData,
}

export default createReducer(SOB_STATE, ACTION_HANDLERS);