import OrderTypes from "../types/OrderTypes";

export const toggleFilter = () => ({
    type: OrderTypes.TOGGLE_FILTER,
});

export const refreshList = () => ({
    type: OrderTypes.REFRESH_LIST,
});

export const toggleModal = () => ({
    type: OrderTypes.TOGGLE_MODAL,
});

export const toggleCancelModal = () => ({
    type: OrderTypes.TOGGLE_CANCEL_MODAL,
});

export const setSelectedElement = (value: any) => ({
    type: OrderTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: OrderTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: OrderTypes.SET_CURRENT_PAGE,
    value
});
export const setRowPerPage = (value: any) => ({
    type: OrderTypes.SET_ROW_PER_PAGE,
    value
});

export const togglePointsModal = () => ({
    type: OrderTypes.TOGGLE_POINTS_MODAL,
});

export const setFilter = (chips: any, params: any) => ({
    type: OrderTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: OrderTypes.REMOVE_FILTER,
    key
});

export const showLoading = () => ({
    type: OrderTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: OrderTypes.HIDE_LOADING,
});

export const toggleBulkUpload = () => ({
    type: OrderTypes.TOGGLE_BULK_UPLOAD,
});

