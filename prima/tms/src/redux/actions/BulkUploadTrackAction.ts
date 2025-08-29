import BulkUploadTypes from "../types/BulkUploadTypes";

export const toggleFilter = () => ({
    type: BulkUploadTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: BulkUploadTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: any) => ({
    type: BulkUploadTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: BulkUploadTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: BulkUploadTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: BulkUploadTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: BulkUploadTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: BulkUploadTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: BulkUploadTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: BulkUploadTypes.HIDE_LOADING,
});

export const setFilter = (chips: any, params: any) => ({
    type: BulkUploadTypes.SET_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: BulkUploadTypes.REMOVE_FILTER,
    key
});
