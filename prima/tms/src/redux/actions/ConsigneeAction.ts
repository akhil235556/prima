import { Consignee } from '../storeStates/ConsigneeStoreInterface';
import ConsigneeTypes from "../types/ConsigneeTypes";

export const toggleFilter = () => ({
    type: ConsigneeTypes.TOGGLE_FILTER,
});

export const refreshList = () => ({
    type: ConsigneeTypes.REFRESH_LIST,
});

export const toggleCreateLocation = () => ({
    type: ConsigneeTypes.TOGGLE_CREATE_LOCATION,
});

export const setSelectedItem = (value: Consignee | undefined) => ({
    type: ConsigneeTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: ConsigneeTypes.SET_RESPONSE,
    response,
});

export const searchQuery = (value: string) => ({
    type: ConsigneeTypes.SEARCH_QUERY,
    value
});

export const setCurrentPage = (value: any) => ({
    type: ConsigneeTypes.SET_CURRENT_PAGE,
    value
});

export const setRowPerPage = (value: any) => ({
    type: ConsigneeTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: ConsigneeTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: ConsigneeTypes.HIDE_LOADING,
});

export const toggleBulkUpload = () => ({
    type: ConsigneeTypes.TOGGLE_BULK_UPLOAD,
});
export const toggleBulkUpdate = () => ({
    type: ConsigneeTypes.TOGGLE_BULK_UPDATE,
});


export const setFilter = (chips: any, params: any) => ({
    type: ConsigneeTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: ConsigneeTypes.REMOVE_FILTER,
    key
});