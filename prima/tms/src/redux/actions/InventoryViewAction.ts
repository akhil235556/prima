import InventoryViewTypes from "../types/InventoryViewTypes";

export const toggleFilter = () => ({
    type: InventoryViewTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: InventoryViewTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: any) => ({
    type: InventoryViewTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: InventoryViewTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: InventoryViewTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: InventoryViewTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: InventoryViewTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: InventoryViewTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: InventoryViewTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: InventoryViewTypes.HIDE_LOADING,
});

export const setFilter = (chips: any, params: any) => ({
    type: InventoryViewTypes.SET_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: InventoryViewTypes.REMOVE_FILTER,
    key
});
