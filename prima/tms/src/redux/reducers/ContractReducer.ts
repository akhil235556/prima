import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { ContractState } from '../storeStates/ContractStoreInterface';
import ContractTypes from "../types/ContractTypes";

export const CONTRACT_STATE: ContractState = {
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
    filterParams: {},
    filterChips: {},
    openBulkUpload: false,
    openBulkUpdate: false,
}

const toggleFilterReducer = (state = CONTRACT_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = CONTRACT_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const togglePointsModalReducer = (state = CONTRACT_STATE) => ({
    ...state,
    openPointModal: !state.openPointModal
});

const setSelectedElementReducer = (state = CONTRACT_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = CONTRACT_STATE, action: any) => ({
    ...state,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.contracts] : action.response && action.response.contracts)
        : action.response && action.response.contracts,
    pagination: action.response && action.response.pagination,
    loading: false,
});

const setCurrentPageReducer = (state = CONTRACT_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = CONTRACT_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const refreshListReducer = (state = CONTRACT_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const toggleBulkUploadReducer = (state = CONTRACT_STATE) => ({
    ...state,
    openBulkUpload: !state.openBulkUpload
});

const toggleBulkUpdateReducer = (state = CONTRACT_STATE) => ({
    ...state,
    openBulkUpdate: !state.openBulkUpdate
});

const setFilterReducer = (state = CONTRACT_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = CONTRACT_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];
    switch (action.key) {
        case 'partnerName':
            state.filterParams && state.filterParams['partnerCode'] && delete state.filterParams['partnerCode'];
            break;
        case 'contractId':
            state.filterParams && state.filterParams['contractCode'] && delete state.filterParams['contractCode'];
            break;
        case 'laneName':
            state.filterParams && state.filterParams['laneCode'] && delete state.filterParams['laneCode'];
            break;
        case 'contractStatus':
            state.filterParams && state.filterParams['contractStatus'] && delete state.filterParams['contractStatus'];
            break;
        case 'vehicleTypeName':
            state.filterParams && state.filterParams['vehicleTypeCode'] && delete state.filterParams['vehicleTypeCode'];
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
        refreshList: !state.refreshList,
    }
};
const showLoadingReducer = (state = CONTRACT_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = CONTRACT_STATE) => ({
    ...state,
    loading: false
});

const ACTION_HANDLERS = {
    [ContractTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [ContractTypes.TOGGLE_MODAL]: toggleModalReducer,
    [ContractTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [ContractTypes.SET_RESPONSE]: setResponseReducer,
    [ContractTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [ContractTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [ContractTypes.REFRESH_LIST]: refreshListReducer,
    [ContractTypes.TOGGLE_POINTS_MODAL]: togglePointsModalReducer,
    [ContractTypes.USER_FILTER]: setFilterReducer,
    [ContractTypes.REMOVE_FILTER]: removeFilterReducer,
    [ContractTypes.SHOW_LOADING]: showLoadingReducer,
    [ContractTypes.HIDE_LOADING]: hideLoadingReducer,
    [ContractTypes.TOGGLE_BULK_UPLOAD]: toggleBulkUploadReducer,
    [ContractTypes.TOGGLE_BULK_UPDATE]: toggleBulkUpdateReducer,

}

export default createReducer(CONTRACT_STATE, ACTION_HANDLERS);