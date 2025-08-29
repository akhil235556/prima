import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { OrderState } from '../storeStates/OrderStoreInterface';
import OrderTypes from "../types/OrderTypes";

export const ORDER_STATE: OrderState = {
    openFilter: false,
    openModal: false,
    openCancelModal: false,
    openBulkUpload: false,
    refreshList: false,
    loading: false,
    openPointModal: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    currentPage: 1,
    pageSize: rowsPerPageOptions[0],
    filterParams: {},
    filterChips: {},
}

const toggleFilterReducer = (state = ORDER_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = ORDER_STATE) => ({
    ...state,
    openModal: !state.openModal
});
const toggleCancelModalReducer = (state = ORDER_STATE) => ({
    ...state,
    openCancelModal: !state.openCancelModal
});

const setSelectedElementReducer = (state = ORDER_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = ORDER_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.results] : action.response && action.response.results)
        : action.response && action.response.results,
    loading: false
});

const setCurrentPageReducer = (state = ORDER_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = ORDER_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const togglePointsModalReducer = (state = ORDER_STATE) => ({
    ...state,
    openPointModal: !state.openPointModal
});

const toggleBulkUploadReducer = (state = ORDER_STATE) => ({
    ...state,
    openBulkUpload: !state.openBulkUpload
});

const setFilterReducer = (state = ORDER_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = ORDER_STATE, action: any) => {
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
        case "auctionCode":
            state.filterParams && state.filterParams["auctionCode"] && delete state.filterParams["auctionCode"];
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

const refreshListReducer = (state = ORDER_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const showLoadingReducer = (state = ORDER_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = ORDER_STATE) => ({
    ...state,
    loading: false
});

const ACTION_HANDLERS = {
    [OrderTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [OrderTypes.TOGGLE_MODAL]: toggleModalReducer,
    [OrderTypes.TOGGLE_CANCEL_MODAL]: toggleCancelModalReducer,
    [OrderTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [OrderTypes.SET_RESPONSE]: setResponseReducer,
    [OrderTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [OrderTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [OrderTypes.TOGGLE_POINTS_MODAL]: togglePointsModalReducer,
    [OrderTypes.USER_FILTER]: setFilterReducer,
    [OrderTypes.REMOVE_FILTER]: removeFilterReducer,
    [OrderTypes.REFRESH_LIST]: refreshListReducer,
    [OrderTypes.SHOW_LOADING]: showLoadingReducer,
    [OrderTypes.TOGGLE_BULK_UPLOAD]: toggleBulkUploadReducer,
    [OrderTypes.HIDE_LOADING]: hideLoadingReducer,

}

export default createReducer(ORDER_STATE, ACTION_HANDLERS);