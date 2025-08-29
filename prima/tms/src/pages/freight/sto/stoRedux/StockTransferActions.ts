import StockTransferTypes from "./StockTransferTypes";

export const toggleFilter = () => ({
    type: StockTransferTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: StockTransferTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: any) => ({
    type: StockTransferTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any, tabName?: any) => ({
    type: StockTransferTypes.SET_RESPONSE,
    response,
    tabName,
});

export const setCurrentPage = (value: any) => ({
    type: StockTransferTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: StockTransferTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: StockTransferTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: StockTransferTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: StockTransferTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: StockTransferTypes.HIDE_LOADING,
});

export const setFilter = (chips: any, params: any) => ({
    type: StockTransferTypes.USER_FILTER,
    chips,
    params,
});


export const removeFilter = (key: any) => ({
    type: StockTransferTypes.REMOVE_FILTER,
    key
});

export const setSelectedTab = (value: any) => ({
    type: StockTransferTypes.SELECTED_INDEX,
    value
});

export const togglePointsModal = () => ({
    type: StockTransferTypes.TOGGLE_POINTS_MODAL,
});

export const setInitialValue = (value: any) => ({
    type: StockTransferTypes.SET_INITIAL_VALUE,
    value
});

export const setCheckedListResponse = (response: any) => ({
    type: StockTransferTypes.SET_CHECKED_RESPONSE,
    response,
});