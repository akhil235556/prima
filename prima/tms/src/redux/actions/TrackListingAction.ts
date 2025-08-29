import TrackListingTypes from "../types/TrackListingTypes";

export const toggleFilter = () => ({
    type: TrackListingTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: TrackListingTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: any) => ({
    type: TrackListingTypes.SELECTED_ELEMENT,
    value,
});

export const setCheckedListResponse = (response: any) => ({
    type: TrackListingTypes.SET_CHECKED_RESPONSE,
    response,
});

export const setResponse = (response: any) => ({
    type: TrackListingTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: TrackListingTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: TrackListingTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: TrackListingTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: TrackListingTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: TrackListingTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: TrackListingTypes.HIDE_LOADING,
});

export const setFilter = (chips: any, params: any) => ({
    type: TrackListingTypes.SET_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: TrackListingTypes.REMOVE_FILTER,
    key
});

export const toggleBulkUpload = () => ({
    type: TrackListingTypes.TOGGLE_BULK_UPLOAD,
});

export const setSelectedTab = (value: any) => ({
    type: TrackListingTypes.SELECTED_INDEX,
    value
});

export const togglePointsModal = () => ({
    type: TrackListingTypes.TOGGLE_POINTS_MODAL,
});
