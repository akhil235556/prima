import TrackingDashboardTypes from "../types/TrackingDashboardTypes";

export const toggleFilter = () => ({
    type: TrackingDashboardTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: TrackingDashboardTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: any | null) => ({
    type: TrackingDashboardTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: TrackingDashboardTypes.SET_RESPONSE,
    response,
});

export const setResponseUndefined = () => ({
    type: TrackingDashboardTypes.SET_RESPONSE_UNDEFINED,
});

export const setCountResponse = (response: any) => ({
    type: TrackingDashboardTypes.SET_COUNT_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: TrackingDashboardTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: TrackingDashboardTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: TrackingDashboardTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: TrackingDashboardTypes.SET_ROW_PER_PAGE,
    value
});

export const setStatus = (value: any) => ({
    type: TrackingDashboardTypes.SET_STATUS,
    value
});

export const setFilter = (chips: any, params: any) => ({
    type: TrackingDashboardTypes.TRACKING_DASHBOARD_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: TrackingDashboardTypes.REMOVE_FILTER,
    key
});

export const clearData = () => ({
    type: TrackingDashboardTypes.CLEAR_LIST_DATA,
});

