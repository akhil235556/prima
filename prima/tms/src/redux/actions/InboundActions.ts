import InboundTypes from "../types/InboundTypes";

export const toggleFilter = () => ({
    type: InboundTypes.TOGGLE_FILTER,
});

export const refreshList = () => ({
    type: InboundTypes.REFRESH_LIST,
});

export const setSelectedElement = (value: any | undefined) => ({
    type: InboundTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: InboundTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: InboundTypes.SET_CURRENT_PAGE,
    value
});

export const setRowPerPage = (value: any) => ({
    type: InboundTypes.SET_ROW_PER_PAGE,
    value
});

export const togglePointsModal = () => ({
    type: InboundTypes.TOGGLE_POINTS_MODAL,
});

export const setFilter = (chips: any, params: any) => ({
    type: InboundTypes.USER_FILTER,
    chips,
    params,
});


export const removeFilter = (key: any) => ({
    type: InboundTypes.REMOVE_FILTER,
    key
});

export const toggleModal = () => ({
    type: InboundTypes.TOGGLE_MODAL,
});

export const showLoading = () => ({
    type: InboundTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: InboundTypes.HIDE_LOADING,
});