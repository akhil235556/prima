import AgnTypes from "../types/AgnTypes";

export const toggleFilter = () => ({
    type: AgnTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: AgnTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: any) => ({
    type: AgnTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: AgnTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: AgnTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: AgnTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: AgnTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: AgnTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: AgnTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: AgnTypes.HIDE_LOADING,
});

export const setFilter = (chips: any, params: any) => ({
    type: AgnTypes.SET_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: AgnTypes.REMOVE_FILTER,
    key
});

export const toggleCancelModal = () => ({
    type: AgnTypes.TOGGLE_CANCEL_MODAL,
});
