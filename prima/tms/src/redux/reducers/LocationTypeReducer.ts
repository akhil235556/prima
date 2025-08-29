import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from '../../base/constant/ArrayList';
import { isMobile } from "../../base/utility/ViewUtils";
import { LocationTypeState } from "../storeStates/LocationTypeStoreInterface";
import LocationTypes from "../types/LocationTypes";



export const LOCATION_TYPE_STATE: LocationTypeState = {
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

const toggleModalReducer = (state = LOCATION_TYPE_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = LOCATION_TYPE_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = LOCATION_TYPE_STATE, action: any) => ({
    ...state,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response] : action.response && action.response)
        : action.response && action.response,
    pagination: action.response && action.response.pagination,
    loading: false,
});

const setCurrentPageReducer = (state = LOCATION_TYPE_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const refreshListReducer = (state = LOCATION_TYPE_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});
const searchQueryReducer = (state = LOCATION_TYPE_STATE, action: any) => ({
    ...state,
    searchQuery: action.value
});

const setRowPerPageReducer = (state = LOCATION_TYPE_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const showLoadingReducer = (state = LOCATION_TYPE_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = LOCATION_TYPE_STATE) => ({
    ...state,
    loading: false
});



const ACTION_HANDLERS = {
    [LocationTypes.TOGGLE_MODAL]: toggleModalReducer,
    [LocationTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [LocationTypes.SET_RESPONSE]: setResponseReducer,
    [LocationTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [LocationTypes.REFRESH_LIST]: refreshListReducer,
    [LocationTypes.SEARCH_QUERY]: searchQueryReducer,
    [LocationTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [LocationTypes.SHOW_LOADING]: showLoadingReducer,
    [LocationTypes.HIDE_LOADING]: hideLoadingReducer,
}

export default createReducer(LOCATION_TYPE_STATE, ACTION_HANDLERS);