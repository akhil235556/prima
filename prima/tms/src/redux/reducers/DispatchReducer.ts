import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { DispatchState } from '../storeStates/DispatchStoreInterface';
import DispatchTypes from "../types/DispatchTypes";

export const DISPATCH_STATE: DispatchState = {
    openFilter: false,
    loading: false,
    refreshList: false,
    openBulkUpload: false,
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

const toggleFilterReducer = (state = DISPATCH_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const refreshListReducer = (state = DISPATCH_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const toggleModalReducer = (state = DISPATCH_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = DISPATCH_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = DISPATCH_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.results] : action.response && action.response.results)
        : action.response && action.response.results,

    loading: false,
});


const setCurrentPageReducer = (state = DISPATCH_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = DISPATCH_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const setFilterReducer = (state = DISPATCH_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = DISPATCH_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];

    switch (action.key) {
        case "vehicleNumber":
            state.filterParams && state.filterParams["vehicleRegistrationNumber"] && delete state.filterParams["vehicleRegistrationNumber"];
            break;
        case "laneName":
            state.filterParams && state.filterParams["laneCode"] && delete state.filterParams["laneCode"];
            break;
        case "partnerName":
            state.filterParams && state.filterParams["partnerCode"] && delete state.filterParams["partnerCode"];
            break;
        case "vehicleRegistrationNumber":
            state.filterParams && state.filterParams["vehicleCode"] && delete state.filterParams["vehicleCode"];
            break;
        case "orderCreatedAtFromTime":
            state.filterParams && state.filterParams["orderCreatedAtFromTime"] && delete state.filterParams["orderCreatedAtFromTime"];
            state.filterParams && state.filterParams["orderCreatedAtToTime"] && delete state.filterParams["orderCreatedAtToTime"];
            state.filterParams && state.filterChips["orderCreatedAtToTime"] && delete state.filterChips["orderCreatedAtToTime"];
            break;
        case "orderCreatedAtToTime":
            state.filterParams && state.filterParams["orderCreatedAtFromTime"] && delete state.filterParams["orderCreatedAtFromTime"];
            state.filterParams && state.filterParams["orderCreatedAtToTime"] && delete state.filterParams["orderCreatedAtToTime"];
            state.filterParams && state.filterChips["orderCreatedAtFromTime"] && delete state.filterChips["orderCreatedAtFromTime"];
            break;
        case "query":
            state.filterParams && state.filterParams["queryField"] && delete state.filterParams["queryField"];
            state.filterParams && state.filterParams["query"] && delete state.filterParams["query"];
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

const togglePointsModalReducer = (state = DISPATCH_STATE) => ({
    ...state,
    openPointModal: !state.openPointModal
});

const toggleBulkModalReducer = (state = DISPATCH_STATE) => ({
    ...state,
    openBulkUpload: !state.openBulkUpload
});

const showLoadingReducer = (state = DISPATCH_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = DISPATCH_STATE) => ({
    ...state,
    loading: false
});


const ACTION_HANDLERS = {
    [DispatchTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [DispatchTypes.TOGGLE_MODAL]: toggleModalReducer,
    [DispatchTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [DispatchTypes.SET_RESPONSE]: setResponseReducer,
    [DispatchTypes.REFRESH_LIST]: refreshListReducer,
    [DispatchTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [DispatchTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [DispatchTypes.USER_FILTER]: setFilterReducer,
    [DispatchTypes.REMOVE_FILTER]: removeFilterReducer,
    [DispatchTypes.TOGGLE_POINTS_MODAL]: togglePointsModalReducer,
    [DispatchTypes.SHOW_LOADING]: showLoadingReducer,
    [DispatchTypes.HIDE_LOADING]: hideLoadingReducer,
    [DispatchTypes.TOGGLE_BULK_MODAL]: toggleBulkModalReducer

}

export default createReducer(DISPATCH_STATE, ACTION_HANDLERS);