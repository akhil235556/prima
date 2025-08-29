import ProductTypes from "../types/ProductTypes";

export const toggleFilter = () => ({
    type: ProductTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: ProductTypes.TOGGLE_MODAL,
});

export const toggleBulkUpload = () => ({
    type: ProductTypes.BULK_UPLOAD,
});

export const setSelectedElement = (value: any | null) => ({
    type: ProductTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: ProductTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: ProductTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: ProductTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: ProductTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: ProductTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: ProductTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: ProductTypes.HIDE_LOADING,
});

export const setFilter = (chips: any, params: any) => ({
    type: ProductTypes.SET_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: ProductTypes.REMOVE_FILTER,
    key
});
