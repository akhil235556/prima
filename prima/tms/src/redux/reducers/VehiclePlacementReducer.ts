import { createReducer } from "reduxsauce";
import { lastWeek, rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { VehiclePlacementState } from '../storeStates/VehiclePlacementInterface';
import VehiclePlacementTypes from "../types/VehiclePlacementTypes";

export const VEHICLE_PLACEMENT_STATE: VehiclePlacementState = {
    openFilter: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    openModal: false,
    currentPage: 1,
    refresh_list: false,
    searchQuery: "",
    pageSize: rowsPerPageOptions[0],
    filterParams: {
        fromDate: lastWeek.fromDate,
        toDate: lastWeek.toDate
    },
    filterChips: {},
}

const toggleFilterReducer = (state = VEHICLE_PLACEMENT_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = VEHICLE_PLACEMENT_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = VEHICLE_PLACEMENT_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = VEHICLE_PLACEMENT_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.results] : action.response && action.response.results)
        : action.response && action.response.results,
});

const setCurrentPageReducer = (state = VEHICLE_PLACEMENT_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRefreshListReducer = (state = VEHICLE_PLACEMENT_STATE) => ({
    ...state,
    refresh_list: !state.refresh_list,
    currentPage: 1,
    listData: undefined,
});

const searchQueryReducer = (state = VEHICLE_PLACEMENT_STATE, action: any) => ({
    ...state,
    searchQuery: action.value
});

const setRowPerPageReducer = (state = VEHICLE_PLACEMENT_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
});

const setFilterReducer = (state = VEHICLE_PLACEMENT_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
    refresh_list: !state.refresh_list,
    // chartData: [],
    // dashboardCount: {}
});

const removeFilterReducer = (state = VEHICLE_PLACEMENT_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];

    switch (action.key) {
        case "period":
            state.filterParams && state.filterParams["period"] && delete state.filterParams["period"];
            state.filterParams && state.filterParams["fromDate"] && delete state.filterParams["fromDate"];
            state.filterParams && state.filterParams["toDate"] && delete state.filterParams["toDate"];
            state.filterChips && state.filterChips["fromDate"] && delete state.filterChips["fromDate"];
            state.filterChips && state.filterChips["toDate"] && delete state.filterChips["toDate"];
            break;
        case "partnerName":
            state.filterParams && state.filterParams["partnerCode"] && delete state.filterParams["partnerCode"];
            break;
        case "laneName":
            state.filterParams && state.filterParams["laneCode"] && delete state.filterParams["laneCode"];
            break;
        case "destinationLocationName":
            state.filterParams && state.filterParams["originLocationCode"] && delete state.filterParams["originLocationCode"];
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
    [VehiclePlacementTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [VehiclePlacementTypes.TOGGLE_MODAL]: toggleModalReducer,
    [VehiclePlacementTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [VehiclePlacementTypes.SET_RESPONSE]: setResponseReducer,
    [VehiclePlacementTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [VehiclePlacementTypes.REFRESH_LIST]: setRefreshListReducer,
    [VehiclePlacementTypes.SEARCH_QUERY]: searchQueryReducer,
    [VehiclePlacementTypes.USER_FILTER]: setFilterReducer,
    [VehiclePlacementTypes.REMOVE_FILTER]: removeFilterReducer,
    [VehiclePlacementTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
}

export default createReducer(VEHICLE_PLACEMENT_STATE, ACTION_HANDLERS);