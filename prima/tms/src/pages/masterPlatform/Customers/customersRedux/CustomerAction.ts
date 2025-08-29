import { Customer } from './CustomerStoreInterface';
import CustomerTypes from "./CustomerTypes";

export const toggleFilter = () => ({
    type: CustomerTypes.TOGGLE_FILTER,
});

export const refreshList = () => ({
    type: CustomerTypes.REFRESH_LIST,
});

export const toggleCreateCustomer = () => ({
    type: CustomerTypes.TOGGLE_CREATE_CUSTOMER,
});

export const setSelectedItem = (value: Customer | undefined) => ({
    type: CustomerTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: CustomerTypes.SET_RESPONSE,
    response,
});

export const searchQuery = (value: string) => ({
    type: CustomerTypes.SEARCH_QUERY,
    value
});

export const setCurrentPage = (value: any) => ({
    type: CustomerTypes.SET_CURRENT_PAGE,
    value
});

export const setRowPerPage = (value: any) => ({
    type: CustomerTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: CustomerTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: CustomerTypes.HIDE_LOADING,
});

export const toggleBulkUpload = () => ({
    type: CustomerTypes.TOGGLE_BULK_UPLOAD,
});

export const setFilter = (chips: any, params: any) => ({
    type: CustomerTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: CustomerTypes.REMOVE_FILTER,
    key
});