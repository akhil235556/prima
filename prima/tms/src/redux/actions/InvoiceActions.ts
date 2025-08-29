import InvoiceTypes from "../types/InvoiceTypes";

export const toggleFilter = () => ({
    type: InvoiceTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: InvoiceTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: any) => ({
    type: InvoiceTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any, tabName: any) => ({
    type: InvoiceTypes.SET_RESPONSE,
    response,
    tabName,
});

export const setCurrentPage = (value: any) => ({
    type: InvoiceTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: InvoiceTypes.REFRESH_LIST,
});

export const refreshPeriodicList = (value: any) => ({
    type: InvoiceTypes.REFRESH_PERIODIC_LIST,
    value
});

export const searchQuery = (value: string) => ({
    type: InvoiceTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: InvoiceTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: InvoiceTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: InvoiceTypes.HIDE_LOADING,
});

export const setFilter = (chips: any, params: any) => ({
    type: InvoiceTypes.USER_FILTER,
    chips,
    params,
});


export const removeFilter = (key: any) => ({
    type: InvoiceTypes.REMOVE_FILTER,
    key
});

export const setSelectedTab = (value: any) => ({
    type: InvoiceTypes.SELECTED_INDEX,
    value
});

export const togglePointsModal = () => ({
    type: InvoiceTypes.TOGGLE_POINTS_MODAL,
});

export const setInitialValue = (value: any) => ({
    type: InvoiceTypes.SET_INITIAL_VALUE,
    value
});

export const setCheckedListResponse = (response: any) => ({
    type: InvoiceTypes.SET_CHECKED_RESPONSE,
    response,
});

export const setDefaultExpandRowIndex = (defaultExpandRowIndex: any) => ({
    type: InvoiceTypes.SET_DEFAULT_EXPAND_ROW_INDEX,
    defaultExpandRowIndex
})

export const setShowSubmitButton = (value: any) => ({
    type: InvoiceTypes.SET_SHOW_SUBMIT_BUTTON,
    value
})