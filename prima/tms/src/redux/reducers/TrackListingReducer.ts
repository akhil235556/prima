import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { TrackListingState } from "../storeStates/TrackListingInterface";
import TrackListingTypes from "../types/TrackListingTypes";


export const TRACK_LIST_STATE: TrackListingState = {
    openFilter: false,
    loading: false,
    refreshList: false,
    openBulkUpload: false,
    openModal: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    currentPage: 1,
    pageSize: rowsPerPageOptions[0],
    searchQuery: "",
    filterParams: {},
    filterChips: {},
    selectedTabIndex: undefined,
    openPointModal: false
}

const toggleFilterReducer = (state = TRACK_LIST_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const refreshListReducer = (state = TRACK_LIST_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    pageSize: rowsPerPageOptions[0],
    listData: undefined,
});

const toggleModalReducer = (state = TRACK_LIST_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const setSelectedElementReducer = (state = TRACK_LIST_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = TRACK_LIST_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.data] : action.response && action.response.data)
        : action.response && action.response.data
});


const setCurrentPageReducer = (state = TRACK_LIST_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = TRACK_LIST_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const setFilterReducer = (state = TRACK_LIST_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const toggleBulkUploadReducer = (state = TRACK_LIST_STATE) => ({
    ...state,
    openBulkUpload: !state.openBulkUpload
});

const showLoadingReducer = (state = TRACK_LIST_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = TRACK_LIST_STATE) => ({
    ...state,
    loading: false
});

const setSelectedTabReducer = (state = TRACK_LIST_STATE, action: any) => ({
    ...state,
    selectedTabIndex: action.value,
    listData: undefined,
});

const setCheckedListResponse = (state = TRACK_LIST_STATE, action: any) => ({
    ...state,
    listData: action.response
})

const togglePointsModalReducer = (state = TRACK_LIST_STATE) => ({
    ...state,
    openPointModal: !state.openPointModal
});
const ACTION_HANDLERS = {
    [TrackListingTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [TrackListingTypes.TOGGLE_MODAL]: toggleModalReducer,
    [TrackListingTypes.SET_RESPONSE]: setResponseReducer,
    [TrackListingTypes.SET_FILTER]: setFilterReducer,
    [TrackListingTypes.REFRESH_LIST]: refreshListReducer,
    [TrackListingTypes.SHOW_LOADING]: showLoadingReducer,
    [TrackListingTypes.HIDE_LOADING]: hideLoadingReducer,
    [TrackListingTypes.TOGGLE_BULK_UPLOAD]: toggleBulkUploadReducer,
    [TrackListingTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [TrackListingTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [TrackListingTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [TrackListingTypes.SELECTED_INDEX]: setSelectedTabReducer,
    [TrackListingTypes.SET_CHECKED_RESPONSE]: setCheckedListResponse,
    [TrackListingTypes.TOGGLE_POINTS_MODAL]: togglePointsModalReducer

}

export default createReducer(TRACK_LIST_STATE, ACTION_HANDLERS);