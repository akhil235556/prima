import InvoiceBulkApprovalTypes from "../types/InvoiceBulkApprovalTypes";

export const toggleFilter = () => ({
    type: InvoiceBulkApprovalTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: InvoiceBulkApprovalTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: any | null) => ({
    type: InvoiceBulkApprovalTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: InvoiceBulkApprovalTypes.SET_RESPONSE,
    response,
});

export const setCheckedListResponse = (response: any) => ({
    type: InvoiceBulkApprovalTypes.SET_CHECKED_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: InvoiceBulkApprovalTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: InvoiceBulkApprovalTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: InvoiceBulkApprovalTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: InvoiceBulkApprovalTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: InvoiceBulkApprovalTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: InvoiceBulkApprovalTypes.HIDE_LOADING,
});

export const toggleBulkUpload = () => ({
    type: InvoiceBulkApprovalTypes.TOGGLE_BULK_UPLOAD,
});

export const setFilter = (chips: any, params: any) => ({
    type: InvoiceBulkApprovalTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: InvoiceBulkApprovalTypes.REMOVE_FILTER,
    key
});