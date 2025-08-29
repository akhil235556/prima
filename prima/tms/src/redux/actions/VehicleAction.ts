import VehicleTypes from "../types/VehicleTypes";
import { Vehicle } from "../storeStates/VehicleStoreInterface";

export const toggleFilter = () => ({
    type: VehicleTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: VehicleTypes.TOGGLE_MODAL,
});

export const toggleBulkUpload = () => ({
    type: VehicleTypes.TOGGLE_BULK_UPLOAD,
});

export const setSelectedElement = (value: Vehicle | null) => ({
    type: VehicleTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: VehicleTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: VehicleTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: VehicleTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: VehicleTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: VehicleTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: VehicleTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: VehicleTypes.HIDE_LOADING,
});

export const setFilter = (chips: any, params: any) => ({
    type: VehicleTypes.SET_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: VehicleTypes.REMOVE_FILTER,
    key
});
