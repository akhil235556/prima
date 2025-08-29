import VehicletypesTypes from "../types/VehicletypesTypes";

export const toggleFilter = () => ({
    type: VehicletypesTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: VehicletypesTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: any | null) => ({
    type: VehicletypesTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: VehicletypesTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: VehicletypesTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: VehicletypesTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: VehicletypesTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: VehicletypesTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: VehicletypesTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: VehicletypesTypes.HIDE_LOADING,
});

export const toggleBulkUpload = () => ({
    type: VehicletypesTypes.TOGGLE_BULK_UPLOAD,
});

export const setFilter = (chips: any, params: any) => ({
    type: VehicletypesTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: VehicletypesTypes.REMOVE_FILTER,
    key
});