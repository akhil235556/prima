import purchaseOrdersTypes from "./purchaseOrdersTypes";

export const toggleFilter = () => ({
    type: purchaseOrdersTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: purchaseOrdersTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: any) => ({
    type: purchaseOrdersTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any, tabName?: any) => ({
    type: purchaseOrdersTypes.SET_RESPONSE,
    response,
    tabName,
});

export const setCurrentPage = (value: any) => ({
    type: purchaseOrdersTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: purchaseOrdersTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: purchaseOrdersTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: purchaseOrdersTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: purchaseOrdersTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: purchaseOrdersTypes.HIDE_LOADING,
});

export const setFilter = (chips: any, params: any) => ({
    type: purchaseOrdersTypes.USER_FILTER,
    chips,
    params,
});


export const removeFilter = (key: any) => ({
    type: purchaseOrdersTypes.REMOVE_FILTER,
    key
});

export const setSelectedTab = (value: any) => ({
    type: purchaseOrdersTypes.SELECTED_INDEX,
    value
});

export const togglePointsModal = () => ({
    type: purchaseOrdersTypes.TOGGLE_POINTS_MODAL,
});

export const setInitialValue = (value: any) => ({
    type: purchaseOrdersTypes.SET_INITIAL_VALUE,
    value
});

export const setCheckedListResponse = (response: any) => ({
    type: purchaseOrdersTypes.SET_CHECKED_RESPONSE,
    response,
});