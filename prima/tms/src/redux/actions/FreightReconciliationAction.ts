import FreightReconciliationTypes from "../types/FreightReconciliationTypes";

export const toggleFilter = () => ({
    type: FreightReconciliationTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: FreightReconciliationTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: any) => ({
    type: FreightReconciliationTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: FreightReconciliationTypes.SET_RESPONSE,
    response,
});

export const setOrderDetails = (response: any) => ({
    type: FreightReconciliationTypes.SET_ORDER_DETAILS,
    response
});

export const setCurrentPage = (value: any) => ({
    type: FreightReconciliationTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: FreightReconciliationTypes.REFRESH_LIST,
});

export const refreshPeriodicList = (value: any) => ({
    type: FreightReconciliationTypes.REFRESH_PERIODIC_LIST,
    value
});

export const searchQuery = (value: string) => ({
    type: FreightReconciliationTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: FreightReconciliationTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: FreightReconciliationTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: FreightReconciliationTypes.HIDE_LOADING,
});

export const setFilter = (chips: any, params: any) => ({
    type: FreightReconciliationTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: FreightReconciliationTypes.REMOVE_FILTER,
    key
});

export const togglePointsModal = () => ({
    type: FreightReconciliationTypes.TOGGLE_POINTS_MODAL,
});

export const setDefaultExpandRowIndex = (defaultExpandRowIndex: any) => ({
    type: FreightReconciliationTypes.SET_DEFAULT_EXPAND_ROW_INDEX,
    defaultExpandRowIndex
})
