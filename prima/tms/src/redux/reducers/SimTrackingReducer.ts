import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { SimTrackingState } from "../storeStates/SimTrackingInterface";
import SimTrackingTypes from "../types/SimTrackingTypes";


export const SIM_TRACKING_STATE: SimTrackingState = {
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

const toggleFilterReducer = (state = SIM_TRACKING_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

// const refreshListReducer = (state = SIM_TRACKING_STATE) => ({
//     ...state,
//     refreshList: !state.refreshList,
//     currentPage: 1,
//     listData: undefined,
// });

const toggleModalReducer = (state = SIM_TRACKING_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const togglePointsModalReducer = (state = SIM_TRACKING_STATE) => ({
    ...state,
    openPointModal: !state.openPointModal
});

const setSelectedElementReducer = (state = SIM_TRACKING_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = SIM_TRACKING_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.logs] : action.response && action.response.logs)
        : action.response && action.response.logs,

    loading: false,
});


const setCurrentPageReducer = (state = SIM_TRACKING_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = SIM_TRACKING_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const setFilterReducer = (state = SIM_TRACKING_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = SIM_TRACKING_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];

    switch (action.key) {
        case "period":
            state.filterParams && state.filterParams["period"] && delete state.filterParams["period"];
            state.filterParams && state.filterParams["fromDate"] && delete state.filterParams["fromDate"];
            state.filterParams && state.filterParams["toDate"] && delete state.filterParams["toDate"];
            state.filterChips && state.filterChips["fromDate"] && delete state.filterChips["fromDate"];
            state.filterChips && state.filterChips["toDate"] && delete state.filterChips["toDate"];
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

// const togglePointsModalReducer = (state = SIM_TRACKING_STATE) => ({
//     ...state,
//     openPointModal: !state.openPointModal
// });

const showLoadingReducer = (state = SIM_TRACKING_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = SIM_TRACKING_STATE) => ({
    ...state,
    loading: false
});


const ACTION_HANDLERS = {
    [SimTrackingTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [SimTrackingTypes.TOGGLE_MODAL]: toggleModalReducer,
    [SimTrackingTypes.TOGGLE_POINTS_MODAL]: togglePointsModalReducer,
    [SimTrackingTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [SimTrackingTypes.SET_RESPONSE]: setResponseReducer,
    [SimTrackingTypes.SET_FILTER]: setFilterReducer,
    [SimTrackingTypes.REMOVE_FILTER]: removeFilterReducer,
    [SimTrackingTypes.SHOW_LOADING]: showLoadingReducer,
    [SimTrackingTypes.HIDE_LOADING]: hideLoadingReducer,
    [SimTrackingTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [SimTrackingTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
}

export default createReducer(SIM_TRACKING_STATE, ACTION_HANDLERS);