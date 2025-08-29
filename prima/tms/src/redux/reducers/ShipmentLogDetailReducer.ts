import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { ShipmentLogDetailsState } from "../storeStates/ShipmentLogDetailsInterface";
import ShipmentLogDetailTypes from "../types/ShipmentLogDetailTypes";


export const SHIPMENT_LOG_DETAIL_STATE: ShipmentLogDetailsState = {
    openFilter: false,
    loading: false,
    refreshList: false,
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

const toggleFilterReducer = (state = SHIPMENT_LOG_DETAIL_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

// const refreshListReducer = (state = SHIPMENT_LOG_DETAIL_STATE) => ({
//     ...state,
//     refreshList: !state.refreshList,
//     currentPage: 1,
//     listData: undefined,
// });

const toggleModalReducer = (state = SHIPMENT_LOG_DETAIL_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = SHIPMENT_LOG_DETAIL_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = SHIPMENT_LOG_DETAIL_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.results] : action.response && action.response.results)
        : action.response && action.response.results,

    loading: false,
});


const setCurrentPageReducer = (state = SHIPMENT_LOG_DETAIL_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = SHIPMENT_LOG_DETAIL_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const setFilterReducer = (state = SHIPMENT_LOG_DETAIL_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = SHIPMENT_LOG_DETAIL_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];

    switch (action.key) {
        case "locationName":
            state.filterParams && state.filterParams["location"] && delete state.filterParams["location"];
            break;
        case "fromDate":
            state.filterParams && state.filterParams["fromDate"] && delete state.filterParams["fromDate"];
            state.filterParams && state.filterParams["toDate"] && delete state.filterParams["toDate"];
            state.filterParams && state.filterChips["toDate"] && delete state.filterChips["toDate"];
            break;
        case "toDate":
            state.filterParams && state.filterParams["fromDate"] && delete state.filterParams["fromDate"];
            state.filterParams && state.filterParams["toDate"] && delete state.filterParams["toDate"];
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

// const togglePointsModalReducer = (state = SHIPMENT_LOG_DETAIL_STATE) => ({
//     ...state,
//     openPointModal: !state.openPointModal
// });

const showLoadingReducer = (state = SHIPMENT_LOG_DETAIL_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = SHIPMENT_LOG_DETAIL_STATE) => ({
    ...state,
    loading: false
});


const ACTION_HANDLERS = {
    [ShipmentLogDetailTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [ShipmentLogDetailTypes.TOGGLE_MODAL]: toggleModalReducer,
    [ShipmentLogDetailTypes.SET_RESPONSE]: setResponseReducer,
    [ShipmentLogDetailTypes.SET_FILTER]: setFilterReducer,
    [ShipmentLogDetailTypes.REMOVE_FILTER]: removeFilterReducer,
    [ShipmentLogDetailTypes.SHOW_LOADING]: showLoadingReducer,
    [ShipmentLogDetailTypes.HIDE_LOADING]: hideLoadingReducer,
    [ShipmentLogDetailTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [ShipmentLogDetailTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [ShipmentLogDetailTypes.SELECTED_ELEMENT]: setSelectedElementReducer,

}

export default createReducer(SHIPMENT_LOG_DETAIL_STATE, ACTION_HANDLERS);