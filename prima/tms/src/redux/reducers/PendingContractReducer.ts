import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import PendingContractTypes from "../types/PendingContractTypes";

export const PENDING_CONTRACT_STATE: any = {
    openFilter: false,
    openBulkUpload: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    openModal: false,
    currentPage: 1,
    refresh_list: false,
    loading: false,
    searchQuery: "",
    pageSize: rowsPerPageOptions[0],
    filterParams: {},
    filterChips: {},
}

const toggleFilterReducer = (state = PENDING_CONTRACT_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = PENDING_CONTRACT_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = PENDING_CONTRACT_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = PENDING_CONTRACT_STATE, action: any) => ({
    ...state,
    listData: action.response,
    loading: false,
});

const setCurrentPageReducer = (state = PENDING_CONTRACT_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRefreshListReducer = (state = PENDING_CONTRACT_STATE) => ({
    ...state,
    refresh_list: !state.refresh_list,
    currentPage: 1,
    listData: undefined,
});

const searchQueryReducer = (state = PENDING_CONTRACT_STATE, action: any) => ({
    ...state,
    searchQuery: action.value
});

const setRowPerPageReducer = (state = PENDING_CONTRACT_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
});

const showLoadingReducer = (state = PENDING_CONTRACT_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = PENDING_CONTRACT_STATE) => ({
    ...state,
    loading: false
});
const toggleBulkUploadReducer = (state = PENDING_CONTRACT_STATE) => ({
    ...state,
    openBulkUpload: !state.openBulkUpload
});

const setFilterReducer = (state = PENDING_CONTRACT_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = PENDING_CONTRACT_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];
    switch (action.key) {
        case 'partnerName':
            state.filterParams && state.filterParams['partnerCode'] && delete state.filterParams['partnerCode'];
            break;
        case 'freightTypeCode':
            state.filterParams && state.filterParams['contractType'] && delete state.filterParams['contractType'];
            break;
        case 'serviceabilityModeName':
            state.filterParams && state.filterParams['serviceabilityModeCode'] && delete state.filterParams['serviceabilityModeCode'];
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
        refresh_list: !state.refresh_list,
    }
};

const ACTION_HANDLERS = {
    [PendingContractTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [PendingContractTypes.TOGGLE_MODAL]: toggleModalReducer,
    [PendingContractTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [PendingContractTypes.SET_RESPONSE]: setResponseReducer,
    [PendingContractTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [PendingContractTypes.REFRESH_LIST]: setRefreshListReducer,
    [PendingContractTypes.SEARCH_QUERY]: searchQueryReducer,
    [PendingContractTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [PendingContractTypes.SHOW_LOADING]: showLoadingReducer,
    [PendingContractTypes.HIDE_LOADING]: hideLoadingReducer,
    [PendingContractTypes.TOGGLE_BULK_UPLOAD]: toggleBulkUploadReducer,
    [PendingContractTypes.USER_FILTER]: setFilterReducer,
    [PendingContractTypes.REMOVE_FILTER]: removeFilterReducer,
}

export default createReducer(PENDING_CONTRACT_STATE, ACTION_HANDLERS);