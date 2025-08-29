import { createReducer } from "reduxsauce";
import FreightTypes from "../types/FreightTypes";
import { FreightState } from '../storeStates/FreightStoreInterface';
import { rowsPerPageOptions, lastWeek, DispatchPeriodsEnum } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";

export const FREIGHT_STATE: FreightState = {
    openFilter: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    openModal: false,
    currentPage: 1,
    pageSize: rowsPerPageOptions[0],
    refreshList: false,
    loading: false,
    openPointModal: false,
    filterParams: {
        fromDate: lastWeek.fromDate,
        toDate: lastWeek.toDate
    },
    filterChips: {
        period: DispatchPeriodsEnum.Last_Week
    },
}

const toggleFilterReducer = (state = FREIGHT_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = FREIGHT_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const togglePointsModalReducer = (state = FREIGHT_STATE) => ({
    ...state,
    openPointModal: !state.openPointModal
});

const setSelectedElementReducer = (state = FREIGHT_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = FREIGHT_STATE, action: any) => ({
    ...state,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.declaration] : action.response && action.response.declaration)
        : action.response && action.response.declaration,
    pagination: action.response && action.response.pagination,
    loading: false,

});

const setCurrentPageReducer = (state = FREIGHT_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = FREIGHT_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const refreshListReducer = (state = FREIGHT_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const setFilterReducer = (state = FREIGHT_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = FREIGHT_STATE, action: any) => {
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

const showLoadingReducer = (state = FREIGHT_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = FREIGHT_STATE) => ({
    ...state,
    loading: false
});

const ACTION_HANDLERS = {
    [FreightTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [FreightTypes.TOGGLE_MODAL]: toggleModalReducer,
    [FreightTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [FreightTypes.SET_RESPONSE]: setResponseReducer,
    [FreightTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [FreightTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [FreightTypes.REFRESH_LIST]: refreshListReducer,
    [FreightTypes.TOGGLE_POINTS_MODAL]: togglePointsModalReducer,
    [FreightTypes.USER_FILTER]: setFilterReducer,
    [FreightTypes.REMOVE_FILTER]: removeFilterReducer,
    [FreightTypes.SHOW_LOADING]: showLoadingReducer,
    [FreightTypes.HIDE_LOADING]: hideLoadingReducer,

}

export default createReducer(FREIGHT_STATE, ACTION_HANDLERS);