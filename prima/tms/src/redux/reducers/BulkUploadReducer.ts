import { createReducer } from "reduxsauce";
import BulkUploadTypes from "../types/BulkUploadTypes";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { BulkUploadState } from "../storeStates/BulkUploadInterface";

import { isMobile } from "../../base/utility/ViewUtils";

export const Bulk_Upload_STATE: BulkUploadState = {
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

const toggleFilterReducer = (state = Bulk_Upload_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

// const refreshListReducer = (state = Bulk_Upload_STATE) => ({
//     ...state,
//     refreshList: !state.refreshList,
//     currentPage: 1,
//     listData: undefined,
// });

const toggleModalReducer = (state = Bulk_Upload_STATE) => ({
    ...state,
    openModal: !state.openModal
});

// const setSelectedElementReducer = (state = Bulk_Upload_STATE, action: any) => ({
//     ...state,
//     selectedItem: action.value
// });

const setResponseReducer = (state = Bulk_Upload_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.jobs] : action.response && action.response.jobs)
        : action.response && action.response.jobs,

    loading: false,
});


const setCurrentPageReducer = (state = Bulk_Upload_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = Bulk_Upload_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const setFilterReducer = (state = Bulk_Upload_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = Bulk_Upload_STATE, action: any) => {
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

// const togglePointsModalReducer = (state = Bulk_Upload_STATE) => ({
//     ...state,
//     openPointModal: !state.openPointModal
// });

const showLoadingReducer = (state = Bulk_Upload_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = Bulk_Upload_STATE) => ({
    ...state,
    loading: false
});


const ACTION_HANDLERS = {
    [BulkUploadTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [BulkUploadTypes.TOGGLE_MODAL]: toggleModalReducer,
    [BulkUploadTypes.SET_RESPONSE]: setResponseReducer,
    [BulkUploadTypes.SET_FILTER]: setFilterReducer,
    [BulkUploadTypes.REMOVE_FILTER]: removeFilterReducer,
    [BulkUploadTypes.SHOW_LOADING]: showLoadingReducer,
    [BulkUploadTypes.HIDE_LOADING]: hideLoadingReducer,
    [BulkUploadTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [BulkUploadTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,


}

export default createReducer(Bulk_Upload_STATE, ACTION_HANDLERS);