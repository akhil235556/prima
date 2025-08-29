import ShipmentTypes from "../types/ShipmentTypes";

export const toggleFilter = () => ({
    type: ShipmentTypes.TOGGLE_FILTER,
});

export const refreshList = () => ({
    type: ShipmentTypes.REFRESH_LIST,
});

export const toggleModal = () => ({
    type: ShipmentTypes.TOGGLE_MODAL,
});

export const toggleCancelModal = () => ({
    type: ShipmentTypes.TOGGLE_CANCEL_MODAL,
});

export const setSelectedElement = (value: any) => ({
    type: ShipmentTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: ShipmentTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: ShipmentTypes.SET_CURRENT_PAGE,
    value
});
export const setRowPerPage = (value: any) => ({
    type: ShipmentTypes.SET_ROW_PER_PAGE,
    value
});

export const togglePointsModal = () => ({
    type: ShipmentTypes.TOGGLE_POINTS_MODAL,
});

export const setFilter = (chips: any, params: any) => ({
    type: ShipmentTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: ShipmentTypes.REMOVE_FILTER,
    key
});

export const showLoading = () => ({
    type: ShipmentTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: ShipmentTypes.HIDE_LOADING,
});

