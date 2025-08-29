import SalesOrderTypes from "../types/SalesOrderTypes";

export const toggleFilter = () => ({
    type: SalesOrderTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: SalesOrderTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: any) => ({
    type: SalesOrderTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: SalesOrderTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: SalesOrderTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: SalesOrderTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: SalesOrderTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: SalesOrderTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: SalesOrderTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: SalesOrderTypes.HIDE_LOADING,
});

export const setFilter = (chips: any, params: any) => ({
    type: SalesOrderTypes.SET_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: SalesOrderTypes.REMOVE_FILTER,
    key
});
export const toggleBulkUpload = () => ({
    type: SalesOrderTypes.TOGGLE_BULK_UPLOAD,
});
