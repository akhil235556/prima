import ShipmentLogTypes from "../types/ShipmentLogTypes";

export const toggleFilter = () => ({
    type: ShipmentLogTypes.TOGGLE_FILTER,
});

export const refreshList = () => ({
    type: ShipmentLogTypes.REFRESH_LIST,
});

export const toggleModal = () => ({
    type: ShipmentLogTypes.TOGGLE_MODAL,
});

export const toggleCancelModal = () => ({
    type: ShipmentLogTypes.TOGGLE_CANCEL_MODAL,
});

export const setSelectedElement = (value: any) => ({
    type: ShipmentLogTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: ShipmentLogTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: ShipmentLogTypes.SET_CURRENT_PAGE,
    value
});
export const setRowPerPage = (value: any) => ({
    type: ShipmentLogTypes.SET_ROW_PER_PAGE,
    value
});

export const togglePointsModal = () => ({
    type: ShipmentLogTypes.TOGGLE_POINTS_MODAL,
});

export const setFilter = (chips: any, params: any) => ({
    type: ShipmentLogTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: ShipmentLogTypes.REMOVE_FILTER,
    key
});

export const showLoading = () => ({
    type: ShipmentLogTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: ShipmentLogTypes.HIDE_LOADING,
});

