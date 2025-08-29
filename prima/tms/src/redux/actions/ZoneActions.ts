import ZoneTypes from "../types/ZoneTypes";

export const toggleFilter = () => ({
    type: ZoneTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: ZoneTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: any | null) => ({
    type: ZoneTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: ZoneTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: ZoneTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: ZoneTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: ZoneTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: ZoneTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: ZoneTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: ZoneTypes.HIDE_LOADING,
});

export const toggleBulkUpload = () => ({
    type: ZoneTypes.TOGGLE_BULK_UPLOAD,
});

export const setFilter = (chips: any, params: any) => ({
    type: ZoneTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: ZoneTypes.REMOVE_FILTER,
    key
});