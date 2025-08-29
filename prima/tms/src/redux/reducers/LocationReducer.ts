import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from '../../base/constant/ArrayList';
import { isMobile } from "../../base/utility/ViewUtils";
import { LocationState } from '../storeStates/LocationStoreInterface';
import LocationTypes from "../types/LocationTypes";

export const LOCATION_STATE: LocationState = {
    openFilter: false,
    openBulkUpload: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    openModal: false,
    currentPage: 1,
    refreshList: false,
    loading: false,
    pageSize: rowsPerPageOptions[0],
    searchQuery: "",
    filterParams: {},
    filterChips: {},
}

const toggleFilterReducer = (state = LOCATION_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = LOCATION_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = LOCATION_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = LOCATION_STATE, action: any) => ({
    ...state,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.locations] : action.response && action.response.locations)
        : action.response && action.response.locations,
    pagination: action.response && action.response.pagination,
    loading: false,
});

const setCurrentPageReducer = (state = LOCATION_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const refreshListReducer = (state = LOCATION_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});
const searchQueryReducer = (state = LOCATION_STATE, action: any) => ({
    ...state,
    searchQuery: action.value
});

const setRowPerPageReducer = (state = LOCATION_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const showLoadingReducer = (state = LOCATION_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = LOCATION_STATE) => ({
    ...state,
    loading: false
});

const setFilterReducer = (state = LOCATION_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = LOCATION_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];
    switch (action.key) {
        case "locationName":
            state.filterParams && state.filterParams["locationCode"] && delete state.filterParams["locationCode"];
            break;
        case "locationTypeName":
            state.filterParams && state.filterParams["locationType"] && delete state.filterParams["locationType"];
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
const toggleBulkUploadReducer = (state = LOCATION_STATE) => ({
    ...state,
    openBulkUpload: !state.openBulkUpload
});



const ACTION_HANDLERS = {
    [LocationTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [LocationTypes.TOGGLE_MODAL]: toggleModalReducer,
    [LocationTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [LocationTypes.SET_RESPONSE]: setResponseReducer,
    [LocationTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [LocationTypes.REFRESH_LIST]: refreshListReducer,
    [LocationTypes.SEARCH_QUERY]: searchQueryReducer,
    [LocationTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [LocationTypes.SHOW_LOADING]: showLoadingReducer,
    [LocationTypes.HIDE_LOADING]: hideLoadingReducer,
    [LocationTypes.SET_FILTER]: setFilterReducer,
    [LocationTypes.REMOVE_FILTER]: removeFilterReducer,
    [LocationTypes.TOGGLE_BULK_UPLOAD]: toggleBulkUploadReducer,
}

export default createReducer(LOCATION_STATE, ACTION_HANDLERS);