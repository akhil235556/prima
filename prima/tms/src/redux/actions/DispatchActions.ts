import DispatchTypes from "../types/DispatchTypes";

export const toggleFilter = () => ({
    type: DispatchTypes.TOGGLE_FILTER,
});

export const refreshList = () => ({
    type: DispatchTypes.REFRESH_LIST,
});

export const toggleModal = () => ({
    type: DispatchTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: any | undefined) => ({
    type: DispatchTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: DispatchTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: DispatchTypes.SET_CURRENT_PAGE,
    value
});

export const toggleBulkUpload = () => ({
    type: DispatchTypes.TOGGLE_BULK_MODAL,
});

export const setRowPerPage = (value: any) => ({
    type: DispatchTypes.SET_ROW_PER_PAGE,
    value,
});

export const setFilter = (chips: any, params: any) => ({
    type: DispatchTypes.USER_FILTER,
    chips,
    params,
});


export const removeFilter = (key: any) => ({
    type: DispatchTypes.REMOVE_FILTER,
    key
});

export const togglePointsModal = () => ({
    type: DispatchTypes.TOGGLE_POINTS_MODAL,
});

export const showLoading = () => ({
    type: DispatchTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: DispatchTypes.HIDE_LOADING,
});

export const showShipmentDetails = () => ({
    type: DispatchTypes.SHOW_SHIPMENT_DETAILS,
});

