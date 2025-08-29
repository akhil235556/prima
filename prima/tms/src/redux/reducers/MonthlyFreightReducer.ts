import { createReducer } from "reduxsauce";
import MonthlyFreightTypes from "../types/MonthlyFreightTypes";
import { MonthlyFreightState } from '../storeStates/MonthlyFreightStoreInterface';
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";

export const MONTHLY_FREIGHT_STATE: MonthlyFreightState = {
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

const toggleFilterReducer = (state = MONTHLY_FREIGHT_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = MONTHLY_FREIGHT_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const togglePointsModalReducer = (state = MONTHLY_FREIGHT_STATE) => ({
    ...state,
    openPointModal: !state.openPointModal
});

const setSelectedElementReducer = (state = MONTHLY_FREIGHT_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = MONTHLY_FREIGHT_STATE, action: any) => ({
    ...state,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.monthlyDeclaration] : action.response && action.response.monthlyDeclaration)
        : action.response && action.response.monthlyDeclaration,
    pagination: action.response && action.response.pagination,
    loading: false,
});

const setCurrentPageReducer = (state = MONTHLY_FREIGHT_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = MONTHLY_FREIGHT_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const refreshListReducer = (state = MONTHLY_FREIGHT_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const setFilterReducer = (state = MONTHLY_FREIGHT_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = MONTHLY_FREIGHT_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];
    switch (action.key) {
        case 'partnerName':
            state.filterParams && state.filterParams['partnerCode'] && delete state.filterParams['partnerCode'];
            break;
        case 'laneName':
            state.filterParams && state.filterParams['laneCode'] && delete state.filterParams['laneCode'];
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
const showLoadingReducer = (state = MONTHLY_FREIGHT_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = MONTHLY_FREIGHT_STATE) => ({
    ...state,
    loading: false
});

const ACTION_HANDLERS = {
    [MonthlyFreightTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [MonthlyFreightTypes.TOGGLE_MODAL]: toggleModalReducer,
    [MonthlyFreightTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [MonthlyFreightTypes.SET_RESPONSE]: setResponseReducer,
    [MonthlyFreightTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [MonthlyFreightTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [MonthlyFreightTypes.REFRESH_LIST]: refreshListReducer,
    [MonthlyFreightTypes.TOGGLE_POINTS_MODAL]: togglePointsModalReducer,
    [MonthlyFreightTypes.USER_FILTER]: setFilterReducer,
    [MonthlyFreightTypes.REMOVE_FILTER]: removeFilterReducer,
    [MonthlyFreightTypes.SHOW_LOADING]: showLoadingReducer,
    [MonthlyFreightTypes.HIDE_LOADING]: hideLoadingReducer,

}

export default createReducer(MONTHLY_FREIGHT_STATE, ACTION_HANDLERS);