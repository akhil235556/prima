import ForecastTypes from "../types/ForecastTypes";

export const toggleFilter = () => ({
    type: ForecastTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: ForecastTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: any) => ({
    type: ForecastTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: ForecastTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: ForecastTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: ForecastTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: ForecastTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: ForecastTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: ForecastTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: ForecastTypes.HIDE_LOADING,
});

export const setFilter = (chips: any, params: any) => ({
    type: ForecastTypes.SET_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: ForecastTypes.REMOVE_FILTER,
    key
});
