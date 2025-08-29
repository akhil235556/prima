import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { AuctionState } from '../storeStates/AuctionInterface';
import AuctionTypes from "../types/AuctionTypes";

export const AUCTION_STATE: AuctionState = {
    openFilter: false,
    openBulkUpload: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    openModal: false,
    currentPage: 1,
    searchQuery: "",
    pageSize: rowsPerPageOptions[0],
    status: "INIT",
    filterChips: {},
    filterParams: {},
    countData: undefined,
    refreshList: false,
    openLaneModal: false
}

const toggleFilterReducer = (state = AUCTION_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = AUCTION_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const toggleLaneModalReducer = (state = AUCTION_STATE) => ({
    ...state,
    openLaneModal: !state.openLaneModal
});

const toggleBulkModalReducer = (state = AUCTION_STATE) => ({
    ...state,
    openBulkUpload: !state.openBulkUpload
});

const setSelectedElementReducer = (state = AUCTION_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = AUCTION_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.auctions] : action.response && action.response.auctions)
        : action.response && action.response.auctions,
});

const setResponseUndefined = (state = AUCTION_STATE, action: any) => ({
    ...state,
    listData: undefined
});

const setCountResponseReducer = (state = AUCTION_STATE, action: any) => ({
    ...state,
    // pagination: action.response && action.response.pagination,
    countData: action.response
});

const setCurrentPageReducer = (state = AUCTION_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRefreshListReducer = (state = AUCTION_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const searchQueryReducer = (state = AUCTION_STATE, action: any) => ({
    ...state,
    searchQuery: action.value
});

const setRowPerPageReducer = (state = AUCTION_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
});

const setStatusReducer = (state = AUCTION_STATE, action: any) => ({
    ...state,
    status: action.value
});

const setFilterReducer = (state = AUCTION_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
    refreshList: !state.refreshList,
});

const removeFilterReducer = (state = AUCTION_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];
    switch (action.key) {
        case "status":
            delete state.filterParams["status"]
            break;
        case "laneName":
            delete state.filterParams["laneCode"]
            break;
        case "fromDateTime":
            state.filterParams && state.filterParams["fromDateTime"] && delete state.filterParams["fromDateTime"];
            state.filterParams && state.filterParams["toDateTime"] && delete state.filterParams["toDateTime"];
            state.filterParams && state.filterChips["toDateTime"] && delete state.filterChips["toDateTime"];
            break;
        case "toDateTime":
            state.filterParams && state.filterParams["fromDateTime"] && delete state.filterParams["fromDateTime"];
            state.filterParams && state.filterParams["toDateTime"] && delete state.filterParams["toDateTime"];
            state.filterParams && state.filterChips["fromDateTime"] && delete state.filterChips["fromDateTime"];
            break;
    }
    return {
        ...state,
        filterChips: state.filterChips,
        filterParams: state.filterParams,
        currentPage: 1,
        // tripList: undefined,
        refreshList: !state.refreshList,
    }
};

const ACTION_HANDLERS = {
    [AuctionTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [AuctionTypes.TOGGLE_MODAL]: toggleModalReducer,
    [AuctionTypes.TOGGLE_LANE_MODAL]: toggleLaneModalReducer,
    [AuctionTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [AuctionTypes.SET_RESPONSE]: setResponseReducer,
    [AuctionTypes.SET_RESPONSE_UNDEFINED]: setResponseUndefined,
    [AuctionTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [AuctionTypes.REFRESH_LIST]: setRefreshListReducer,
    [AuctionTypes.SEARCH_QUERY]: searchQueryReducer,
    [AuctionTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [AuctionTypes.SET_STATUS]: setStatusReducer,
    [AuctionTypes.TRACKING_DASHBOARD_FILTER]: setFilterReducer,
    [AuctionTypes.REMOVE_FILTER]: removeFilterReducer,
    [AuctionTypes.SET_COUNT_RESPONSE]: setCountResponseReducer,
    [AuctionTypes.TOGGLE_BULK_MODAL]: toggleBulkModalReducer

}

export default createReducer(AUCTION_STATE, ACTION_HANDLERS);