import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { ShipmentState } from '../storeStates/ShipmentInterface';
import ShipmentTypes from "../types/ShipmentTypes";

export const SHIPMENT_STATE: ShipmentState = {
    openFilter: false,
    openModal: false,
    openCancelModal: false,
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

const toggleFilterReducer = (state = SHIPMENT_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = SHIPMENT_STATE) => ({
    ...state,
    openModal: !state.openModal
});
const toggleCancelModalReducer = (state = SHIPMENT_STATE) => ({
    ...state,
    openCancelModal: !state.openCancelModal
});

const setSelectedElementReducer = (state = SHIPMENT_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = SHIPMENT_STATE, action: any) => {
    return {
        ...state,
        pagination: action.response && action.response.pagination,
        listData: isMobile ?
            (state.listData ? (action.response && action.response.results ? [...state.listData, ...action.response.results] : state.listData)
                : action.response && action.response.results)
            : action.response && action.response.results,
        loading: false
    }
};

const setCurrentPageReducer = (state = SHIPMENT_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = SHIPMENT_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const togglePointsModalReducer = (state = SHIPMENT_STATE) => ({
    ...state,
    openPointModal: !state.openPointModal
});

const setFilterReducer = (state = SHIPMENT_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = SHIPMENT_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];
    switch (action.key) {
        case "clientName":
            delete state.filterParams["partition"]
            break
        case "shipmentStatusCode":
            delete state.filterParams["shipmentStatusCode"]
            break;
        case "originName":
            delete state.filterParams["originLocationCode"]
            break;
        case "destinationName":
            delete state.filterParams["destinationLocationCode"]
            break;
        case 'vehicleTypeName':
            state.filterParams && state.filterParams['vehicleTypeCode'] && delete state.filterParams['vehicleTypeCode'];
            break;
        case "query":
            state.filterParams && state.filterParams["queryField"] && delete state.filterParams["queryField"];
            state.filterParams && state.filterParams["query"] && delete state.filterParams["query"];
            break;
        case "fromDate":
            state.filterParams && state.filterParams["shipmentCreatedAtFromTime"] && delete state.filterParams["shipmentCreatedAtFromTime"];
            state.filterParams && state.filterParams["shipmentCreatedAtToTime"] && delete state.filterParams["shipmentCreatedAtToTime"];
            state.filterParams && state.filterChips["toDate"] && delete state.filterChips["toDate"];
            break;
        case "toDate":
            state.filterParams && state.filterParams["shipmentCreatedAtFromTime"] && delete state.filterParams["shipmentCreatedAtFromTime"];
            state.filterParams && state.filterParams["shipmentCreatedAtToTime"] && delete state.filterParams["shipmentCreatedAtToTime"];
            state.filterParams && state.filterChips["fromDate"] && delete state.filterChips["fromDate"];
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

const refreshListReducer = (state = SHIPMENT_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const showLoadingReducer = (state = SHIPMENT_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = SHIPMENT_STATE) => ({
    ...state,
    loading: false
});

const ACTION_HANDLERS = {
    [ShipmentTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [ShipmentTypes.TOGGLE_MODAL]: toggleModalReducer,
    [ShipmentTypes.TOGGLE_CANCEL_MODAL]: toggleCancelModalReducer,
    [ShipmentTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [ShipmentTypes.SET_RESPONSE]: setResponseReducer,
    [ShipmentTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [ShipmentTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [ShipmentTypes.TOGGLE_POINTS_MODAL]: togglePointsModalReducer,
    [ShipmentTypes.USER_FILTER]: setFilterReducer,
    [ShipmentTypes.REMOVE_FILTER]: removeFilterReducer,
    [ShipmentTypes.REFRESH_LIST]: refreshListReducer,
    [ShipmentTypes.SHOW_LOADING]: showLoadingReducer,
    [ShipmentTypes.HIDE_LOADING]: hideLoadingReducer,

}

export default createReducer(SHIPMENT_STATE, ACTION_HANDLERS);