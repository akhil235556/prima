// import { SobDetails } from "../storeStates/SobStoreInterface";
import SobTypes from "../types/SobTypes";

export const toggleFilter = () => ({
    type: SobTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: SobTypes.TOGGLE_MODAL,
});

export const togglePointsModal = () => ({
    type: SobTypes.TOGGLE_POINTS_MODAL,
});

export const setSelectedElement = (value: any | null) => ({
    type: SobTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: SobTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: SobTypes.SET_CURRENT_PAGE,
    value
});

export const setRowPerPage = (value: any) => ({
    type: SobTypes.SET_ROW_PER_PAGE,
    value
});

export const refreshList = () => ({
    type: SobTypes.REFRESH_LIST,
});

export const showLoading = () => ({
    type: SobTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: SobTypes.HIDE_LOADING,
});

export const setFilter = (chips: any, params: any) => ({
    type: SobTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: SobTypes.REMOVE_FILTER,
    key
});

export const clearData = () => ({
    type: SobTypes.CLEAR_LIST_DATA,
});
