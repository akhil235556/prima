import { createReducer } from "reduxsauce";
import PartnerTypes from "../types/PartnerTypes";
import { PartnerState } from '../storeStates/PartnerStoreInterface';
import { rowsPerPageOptions } from '../../base/constant/ArrayList';
import { isMobile } from "../../base/utility/ViewUtils";

export const PARTNER_STATE: PartnerState = {
    openPartnerModal: false,
    refreshList: false,
    loading: false,
    listData: undefined,
    pagination: undefined,
    selectedElement: undefined,
    currentPage: 1,
    pageSize: rowsPerPageOptions[0],
    filterParams: {},
    filterChips: {},
    openFilter: false,
}

const toggleModalReducer = (state = PARTNER_STATE) => ({
    ...state,
    openPartnerModal: !state.openPartnerModal
});

const toggleFilterReducer = (state = PARTNER_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const setFilterReducer = (state = PARTNER_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = PARTNER_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];
    switch (action.key) {
        case 'partnerName':
            state.filterParams && state.filterParams['partnerCode'] && delete state.filterParams['partnerCode'];
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

const setResponseReducer = (state = PARTNER_STATE, action: any) => ({
    ...state,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.results] : action.response && action.response.results)
        : action.response && action.response.results,
    pagination: action.response && action.response.pagination,
    loading: false,
});

const setSelectedElementReducer = (state = PARTNER_STATE, action: any) => ({
    ...state,
    selectedElement: action.value
});

const setCurrentPageReducer = (state = PARTNER_STATE, action: any) => ({
    ...state,
    currentPage: action.value,
});

const refreshListReducer = (state = PARTNER_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const setRowPerPageReducer = (state = PARTNER_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const toggleLoadingReducer = (state = PARTNER_STATE) => ({
    ...state,
    loading: !state.loading
});

const showLoadingReducer = (state = PARTNER_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = PARTNER_STATE) => ({
    ...state,
    loading: false
});

const ACTION_HANDLERS = {
    [PartnerTypes.TOGGLE_MODAL]: toggleModalReducer,
    [PartnerTypes.SET_RESPONSE]: setResponseReducer,
    [PartnerTypes.SET_SELECTED_ELEMENT]: setSelectedElementReducer,
    [PartnerTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [PartnerTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [PartnerTypes.REFRESH_LIST]: refreshListReducer,
    [PartnerTypes.TOGGLE_LOADING]: toggleLoadingReducer,
    [PartnerTypes.SHOW_LOADING]: showLoadingReducer,
    [PartnerTypes.HIDE_LOADING]: hideLoadingReducer,
    [PartnerTypes.USER_FILTER]: setFilterReducer,
    [PartnerTypes.REMOVE_FILTER]: removeFilterReducer,
    [PartnerTypes.TOGGLE_FILTER]: toggleFilterReducer,
}

export default createReducer(PARTNER_STATE, ACTION_HANDLERS);