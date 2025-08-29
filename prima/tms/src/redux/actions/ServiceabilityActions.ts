import ServiceabilityTypes from "../types/ServiceabilityTypes";

export const toggleModal = () => ({
    type: ServiceabilityTypes.TOGGLE_MODAL,
});

export const toggleLaneModal = () => ({
    type: ServiceabilityTypes.TOGGLE_LANE_MODAL,
});

export const toggleBulkUpload = () => ({
    type: ServiceabilityTypes.TOGGLE_BULK_MODAL,
});

export const toggleFilter = () => ({
    type: ServiceabilityTypes.TOGGLE_FILTER,
});

export const setResponse = (response: any) => ({
    type: ServiceabilityTypes.SET_RESPONSE,
    response,
});

export const setSelectedElement = (value: any) => ({
    type: ServiceabilityTypes.SET_SELECTED_ELEMENT,
    value,
});

export const setCurrentPage = (value: any) => ({
    type: ServiceabilityTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: ServiceabilityTypes.REFRESH_LIST,
});

export const setRowPerPage = (value: any) => ({
    type: ServiceabilityTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: ServiceabilityTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: ServiceabilityTypes.HIDE_LOADING,
});

export const setFilter = (chips: any, params: any) => ({
    type: ServiceabilityTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: ServiceabilityTypes.REMOVE_FILTER,
    key
});