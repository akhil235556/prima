import DemandOrderTypes from "./DemandOrderTypes";

export const toggleFilter = () => ({
    type: DemandOrderTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: DemandOrderTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: any) => ({
    type: DemandOrderTypes.SELECTED_ELEMENT,
    value,
});

export const setCheckedListResponse = (response: any) => ({
    type: DemandOrderTypes.SET_CHECKED_RESPONSE,
    response,
});

export const setResponse = (response: any) => ({
    type: DemandOrderTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: DemandOrderTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: DemandOrderTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: DemandOrderTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: DemandOrderTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: DemandOrderTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: DemandOrderTypes.HIDE_LOADING,
});

export const setFilter = (chips: any, params: any) => ({
    type: DemandOrderTypes.SET_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: DemandOrderTypes.REMOVE_FILTER,
    key
});

export const toggleBulkUpload = () => ({
    type: DemandOrderTypes.TOGGLE_BULK_UPLOAD,
});

export const setSelectedTab = (value: any) => ({
    type: DemandOrderTypes.SELECTED_INDEX,
    value
});
