import MaterialTypes from "../types/MaterialTypes";
import { Material } from "../storeStates/MaterialStoreInterface";

export const toggleFilter = () => ({
    type: MaterialTypes.TOGGLE_FILTER,
});

export const refreshList = () => ({
    type: MaterialTypes.REFRESH_LIST,
});

export const toggleCreateLocation = () => ({
    type: MaterialTypes.TOGGLE_CREATE_LOCATION,
});

export const setSelectedItem = (value: Material | undefined) => ({
    type: MaterialTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: MaterialTypes.SET_RESPONSE,
    response,
});

export const searchQuery = (value: string) => ({
    type: MaterialTypes.SEARCH_QUERY,
    value
});

export const setCurrentPage = (value: any) => ({
    type: MaterialTypes.SET_CURRENT_PAGE,
    value
});

export const setRowPerPage = (value: any) => ({
    type: MaterialTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: MaterialTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: MaterialTypes.HIDE_LOADING,
});

export const toggleBulkUpload = () => ({
    type: MaterialTypes.TOGGLE_BULK_UPLOAD,
});

export const setFilter = (chips: any, params: any) => ({
    type: MaterialTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: MaterialTypes.REMOVE_FILTER,
    key
});