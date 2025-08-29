import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { InboundState } from "../storeStates/InboundStoreInterface";
import InboundTypes from "../types/InboundTypes";

export const INBOUND_STATE: InboundState = {
    openFilter: false,
    openModal: false,
    refreshList: false,
    openPointModal: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    loading: false,
    currentPage: 1,
    pageSize: rowsPerPageOptions[0],
    filterParams: {},
    filterChips: {},
}

const toggleFilterReducer = (state = INBOUND_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const refreshListReducer = (state = INBOUND_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const setSelectedItemReducer = (state = INBOUND_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = INBOUND_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? (action.response && action.response.results ?
            [...state.listData, ...action.response && action.response.results] :
            [...state.listData]) : action.response && action.response.results)
        : action.response && action.response.results,

    loading: false,
});


const setCurrentPageReducer = (state = INBOUND_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = INBOUND_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const togglePointsModalReducer = (state = INBOUND_STATE) => ({
    ...state,
    openPointModal: !state.openPointModal
});

const setFilterReducer = (state = INBOUND_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = INBOUND_STATE, action: any) => {
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

const toggleModalReducer = (state = INBOUND_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const showLoadingReducer = (state = INBOUND_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = INBOUND_STATE) => ({
    ...state,
    loading: false
});
const ACTION_HANDLERS = {
    [InboundTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [InboundTypes.SELECTED_ELEMENT]: setSelectedItemReducer,
    [InboundTypes.SET_RESPONSE]: setResponseReducer,
    [InboundTypes.REFRESH_LIST]: refreshListReducer,
    [InboundTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [InboundTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [InboundTypes.TOGGLE_POINTS_MODAL]: togglePointsModalReducer,
    [InboundTypes.USER_FILTER]: setFilterReducer,
    [InboundTypes.REMOVE_FILTER]: removeFilterReducer,
    [InboundTypes.TOGGLE_MODAL]: toggleModalReducer,
    [InboundTypes.SHOW_LOADING]: showLoadingReducer,
    [InboundTypes.HIDE_LOADING]: hideLoadingReducer,

}

export default createReducer(INBOUND_STATE, ACTION_HANDLERS);