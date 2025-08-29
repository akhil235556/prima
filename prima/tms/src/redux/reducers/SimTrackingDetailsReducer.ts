import { createReducer } from "reduxsauce";
import SimTrackingDetailTypes from "../types/SimTrackingDetailTypes";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { SimTrackingDetailsState } from "../storeStates/SimTrackingDetailsInterface";

import { isMobile } from "../../base/utility/ViewUtils";

export const SIM_TRACKING_DETAILS_STATE: SimTrackingDetailsState = {
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

const toggleFilterReducer = (state = SIM_TRACKING_DETAILS_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

// const refreshListReducer = (state = SIM_TRACKING_DETAILS_STATE) => ({
//     ...state,
//     refreshList: !state.refreshList,
//     currentPage: 1,
//     listData: undefined,
// });

const toggleModalReducer = (state = SIM_TRACKING_DETAILS_STATE) => ({
    ...state,
    openModal: !state.openModal
});

// const setSelectedElementReducer = (state = SIM_TRACKING_DETAILS_STATE, action: any) => ({
//     ...state,
//     selectedItem: action.value
// });

const setResponseReducer = (state = SIM_TRACKING_DETAILS_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.logs] : action.response && action.response.logs)
        : action.response && action.response.logs,

    loading: false,
});


const setCurrentPageReducer = (state = SIM_TRACKING_DETAILS_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = SIM_TRACKING_DETAILS_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const setFilterReducer = (state = SIM_TRACKING_DETAILS_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = SIM_TRACKING_DETAILS_STATE, action: any) => {
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

// const togglePointsModalReducer = (state = SIM_TRACKING_DETAILS_STATE) => ({
//     ...state,
//     openPointModal: !state.openPointModal
// });

const showLoadingReducer = (state = SIM_TRACKING_DETAILS_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = SIM_TRACKING_DETAILS_STATE) => ({
    ...state,
    loading: false
});


const ACTION_HANDLERS = {
    [SimTrackingDetailTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [SimTrackingDetailTypes.TOGGLE_MODAL]: toggleModalReducer,
    [SimTrackingDetailTypes.SET_RESPONSE]: setResponseReducer,
    [SimTrackingDetailTypes.SET_FILTER]: setFilterReducer,
    [SimTrackingDetailTypes.REMOVE_FILTER]: removeFilterReducer,
    [SimTrackingDetailTypes.SHOW_LOADING]: showLoadingReducer,
    [SimTrackingDetailTypes.HIDE_LOADING]: hideLoadingReducer,
    [SimTrackingDetailTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [SimTrackingDetailTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,


}

export default createReducer(SIM_TRACKING_DETAILS_STATE, ACTION_HANDLERS);