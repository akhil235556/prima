import DiversionTypes from "../types/DiversionTypes";

export const toggleFilter = () => ({
    type: DiversionTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: DiversionTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: any) => ({
    type: DiversionTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any, tabName?: any) => ({
    type: DiversionTypes.SET_RESPONSE,
    response,
    tabName,
});

export const setCurrentPage = (value: any) => ({
    type: DiversionTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: DiversionTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: DiversionTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: DiversionTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: DiversionTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: DiversionTypes.HIDE_LOADING,
});

export const setFilter = (chips: any, params: any) => ({
    type: DiversionTypes.USER_FILTER,
    chips,
    params,
});


export const removeFilter = (key: any) => ({
    type: DiversionTypes.REMOVE_FILTER,
    key
});

export const setSelectedTab = (value: any) => ({
    type: DiversionTypes.SELECTED_INDEX,
    value
});

export const togglePointsModal = () => ({
    type: DiversionTypes.TOGGLE_POINTS_MODAL,
});

export const setInitialValue = (value: any) => ({
    type: DiversionTypes.SET_INITIAL_VALUE,
    value
});