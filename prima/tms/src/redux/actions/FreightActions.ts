import FreightTypes from "../types/FreightTypes";

export const toggleFilter = () => ({
    type: FreightTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: FreightTypes.TOGGLE_MODAL,
});

export const togglePointsModal = () => ({
    type: FreightTypes.TOGGLE_POINTS_MODAL,
});

export const setSelectedElement = (value: any | null) => ({
    type: FreightTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: FreightTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: FreightTypes.SET_CURRENT_PAGE,
    value
});

export const setRowPerPage = (value: any) => ({
    type: FreightTypes.SET_ROW_PER_PAGE,
    value
});

export const refreshList = () => ({
    type: FreightTypes.REFRESH_LIST,
});

export const setFilter = (chips: any, params: any) => ({
    type: FreightTypes.USER_FILTER,
    chips,
    params,
});


export const removeFilter = (key: any) => ({
    type: FreightTypes.REMOVE_FILTER,
    key
});

export const showLoading = () => ({
    type: FreightTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: FreightTypes.HIDE_LOADING,
});