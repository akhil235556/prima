import stockOrdersTypes from "./stockOrdersTypes";

export const toggleFilter = () => ({
    type: stockOrdersTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: stockOrdersTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: any) => ({
    type: stockOrdersTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any, tabName?: any) => ({
    type: stockOrdersTypes.SET_RESPONSE,
    response,
    tabName,
});

export const setCurrentPage = (value: any) => ({
    type: stockOrdersTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: stockOrdersTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: stockOrdersTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: stockOrdersTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: stockOrdersTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: stockOrdersTypes.HIDE_LOADING,
});

export const setFilter = (chips: any, params: any) => ({
    type: stockOrdersTypes.USER_FILTER,
    chips,
    params,
});


export const removeFilter = (key: any) => ({
    type: stockOrdersTypes.REMOVE_FILTER,
    key
});

export const setSelectedTab = (value: any) => ({
    type: stockOrdersTypes.SELECTED_INDEX,
    value
});

export const togglePointsModal = () => ({
    type: stockOrdersTypes.TOGGLE_POINTS_MODAL,
});

export const setInitialValue = (value: any) => ({
    type: stockOrdersTypes.SET_INITIAL_VALUE,
    value
});

export const setCheckedListResponse = (response: any) => ({
    type: stockOrdersTypes.SET_CHECKED_RESPONSE,
    response,
});