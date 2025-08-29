import PendingContractTypes from "../types/PendingContractTypes";

export const toggleFilter = () => ({
    type: PendingContractTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: PendingContractTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: any | null) => ({
    type: PendingContractTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: PendingContractTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: PendingContractTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: PendingContractTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: PendingContractTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: PendingContractTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: PendingContractTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: PendingContractTypes.HIDE_LOADING,
});

export const toggleBulkUpload = () => ({
    type: PendingContractTypes.TOGGLE_BULK_UPLOAD,
});

export const setFilter = (chips: any, params: any) => ({
    type: PendingContractTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: PendingContractTypes.REMOVE_FILTER,
    key
});