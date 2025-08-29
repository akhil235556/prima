import LocationTypes from "../types/LocationTypes";
import { LocationDetails } from "../storeStates/LocationStoreInterface";

export const toggleFilter = () => ({
    type: LocationTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: LocationTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: LocationDetails | null) => ({
    type: LocationTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: LocationTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: LocationTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: LocationTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: LocationTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: LocationTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: LocationTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: LocationTypes.HIDE_LOADING,
});

export const setFilter = (chips: any, params: any) => ({
    type: LocationTypes.SET_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: LocationTypes.REMOVE_FILTER,
    key
});

export const toggleBulkUpload = () => ({
    type: LocationTypes.TOGGLE_BULK_UPLOAD,
});
