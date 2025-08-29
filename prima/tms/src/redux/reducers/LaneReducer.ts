import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { LaneState } from '../storeStates/LaneStoreInterface';
import LaneTypes from "../types/LaneTypes";

export const LANE_STATE: LaneState = {
    openFilter: false,
    openBulkUploadWithSOB: false,
    openBulkUploadWithLane: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    openModal: false,
    currentPage: 1,
    pageSize: rowsPerPageOptions[0],
    refreshList: false,
    openPointModal: false,
    loading: false,
    filterParams: {},
    filterChips: {},
}

const toggleFilterReducer = (state = LANE_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = LANE_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const togglePointsModalReducer = (state = LANE_STATE) => ({
    ...state,
    openPointModal: !state.openPointModal
});

const setSelectedElementReducer = (state = LANE_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = LANE_STATE, action: any) => ({
    ...state,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.lanes] : action.response && action.response.lanes)
        : action.response && action.response.lanes,
    pagination: action.response && action.response.pagination,
    loading: false,
});

const setCurrentPageReducer = (state = LANE_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = LANE_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const refreshListReducer = (state = LANE_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const showLoadingReducer = (state = LANE_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = LANE_STATE) => ({
    ...state,
    loading: false
});

const toggleBulkUploadWithSOBReducer = (state = LANE_STATE) => ({
    ...state,
    openBulkUploadWithSOB: !state.openBulkUploadWithSOB
});

const toggleBulkUploadWithLaneReducer = (state = LANE_STATE) => ({
    ...state,
    openBulkUploadWithLane: !state.openBulkUploadWithLane
});

const setFilterReducer = (state = LANE_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = LANE_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];
    switch (action.key) {
        case 'originLocationName':
            state.filterParams && state.filterParams['originCode'] && delete state.filterParams['originCode'];
            break;
        case 'destinationLocationName':
            state.filterParams && state.filterParams['destinationCode'] && delete state.filterParams['destinationCode'];
            break;
        case 'laneName':
            state.filterParams && state.filterParams['laneCode'] && delete state.filterParams['laneCode'];
            break;
        default:
            state.filterParams && state.filterParams[action.key] && delete state.filterParams[action.key];
            break;
    }
    return {
        ...state,
        filterChips: { ...state.filterChips },
        filterParams: { ...state.filterParams },
        currentPage: 1,
        listData: undefined,
        refreshList: !state.refreshList,
    }
};

const clearListData = (state = LANE_STATE) => ({
    ...state,
    listData: undefined
})

const ACTION_HANDLERS = {
    [LaneTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [LaneTypes.TOGGLE_MODAL]: toggleModalReducer,
    [LaneTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [LaneTypes.SET_RESPONSE]: setResponseReducer,
    [LaneTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [LaneTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [LaneTypes.REFRESH_LIST]: refreshListReducer,
    [LaneTypes.TOGGLE_POINTS_MODAL]: togglePointsModalReducer,
    [LaneTypes.SHOW_LOADING]: showLoadingReducer,
    [LaneTypes.HIDE_LOADING]: hideLoadingReducer,
    [LaneTypes.USER_FILTER]: setFilterReducer,
    [LaneTypes.REMOVE_FILTER]: removeFilterReducer,
    [LaneTypes.CLEAR_LIST_DATA]: clearListData,
    [LaneTypes.TOGGLE_BULK_UPLOAD_SOB]: toggleBulkUploadWithSOBReducer,
    [LaneTypes.TOGGLE_BULK_UPLOAD_LANE]: toggleBulkUploadWithLaneReducer
}

export default createReducer(LANE_STATE, ACTION_HANDLERS);