import { EnableLocationDetails } from '../storeStates/LocationTypeStoreInterface';
import LocationTypes from "../types/LocationTypes";

export const toggleModal = () => ({
    type: LocationTypes.TOGGLE_MODAL,
});

export const setlocationTypeResponse = (response: any) => ({
    type: LocationTypes.SET_RESPONSE,
    response,
});

export const setSelectedElement = (value: EnableLocationDetails) => ({
    type: LocationTypes.SET_SELECTED_ELEMENT,
    value,
});

export const setCurrentPage = (value: any) => ({
    type: LocationTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: LocationTypes.REFRESH_LIST,
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

