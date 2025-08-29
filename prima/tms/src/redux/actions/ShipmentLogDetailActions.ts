import ShipmentLogDetailTypes from "../types/ShipmentLogDetailTypes";

export const toggleFilter = () => ({
    type: ShipmentLogDetailTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: ShipmentLogDetailTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: any) => ({
    type: ShipmentLogDetailTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: ShipmentLogDetailTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: ShipmentLogDetailTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: ShipmentLogDetailTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: ShipmentLogDetailTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: ShipmentLogDetailTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: ShipmentLogDetailTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: ShipmentLogDetailTypes.HIDE_LOADING,
});

export const setFilter = (chips: any, params: any) => ({
    type: ShipmentLogDetailTypes.SET_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: ShipmentLogDetailTypes.REMOVE_FILTER,
    key
});
