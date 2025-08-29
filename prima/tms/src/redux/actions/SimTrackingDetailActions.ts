import SimTrackingDetailTypes from "../types/SimTrackingDetailTypes";

export const toggleFilter = () => ({
    type: SimTrackingDetailTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: SimTrackingDetailTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: any) => ({
    type: SimTrackingDetailTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: SimTrackingDetailTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: SimTrackingDetailTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: SimTrackingDetailTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: SimTrackingDetailTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: SimTrackingDetailTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: SimTrackingDetailTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: SimTrackingDetailTypes.HIDE_LOADING,
});

export const setFilter = (chips: any, params: any) => ({
    type: SimTrackingDetailTypes.SET_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: SimTrackingDetailTypes.REMOVE_FILTER,
    key
});
