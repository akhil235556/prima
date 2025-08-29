import AuctionTypes from "../types/AuctionTypes";

export const toggleFilter = () => ({
    type: AuctionTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: AuctionTypes.TOGGLE_MODAL,
});

export const toggleLaneModal = () => ({
    type: AuctionTypes.TOGGLE_LANE_MODAL,
});

export const toggleBulkUpload = () => ({
    type: AuctionTypes.TOGGLE_BULK_MODAL,
});

export const setSelectedElement = (value: any | null) => ({
    type: AuctionTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: AuctionTypes.SET_RESPONSE,
    response,
});

export const setResponseUndefined = () => ({
    type: AuctionTypes.SET_RESPONSE_UNDEFINED,
});

export const setCountResponse = (response: any) => ({
    type: AuctionTypes.SET_COUNT_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: AuctionTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: AuctionTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: AuctionTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: AuctionTypes.SET_ROW_PER_PAGE,
    value
});

export const setStatus = (value: any) => ({
    type: AuctionTypes.SET_STATUS,
    value
});

export const setFilter = (chips: any, params: any) => ({
    type: AuctionTypes.TRACKING_DASHBOARD_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: AuctionTypes.REMOVE_FILTER,
    key
});
