import { LaneDetails } from "../storeStates/LaneStoreInterface";
import ContractTypes from "../types/ContractTypes";

export const toggleFilter = () => ({
    type: ContractTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: ContractTypes.TOGGLE_MODAL,
});

export const togglePointsModal = () => ({
    type: ContractTypes.TOGGLE_POINTS_MODAL,
});

export const setSelectedElement = (value: LaneDetails | null) => ({
    type: ContractTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: ContractTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: ContractTypes.SET_CURRENT_PAGE,
    value
});

export const setRowPerPage = (value: any) => ({
    type: ContractTypes.SET_ROW_PER_PAGE,
    value
});

export const refreshList = () => ({
    type: ContractTypes.REFRESH_LIST,
});

export const setFilter = (chips: any, params: any) => ({
    type: ContractTypes.USER_FILTER,
    chips,
    params,
});


export const removeFilter = (key: any) => ({
    type: ContractTypes.REMOVE_FILTER,
    key
});
export const showLoading = () => ({
    type: ContractTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: ContractTypes.HIDE_LOADING,
});

export const toggleBulkUpload = () => ({
    type: ContractTypes.TOGGLE_BULK_UPLOAD,
});

export const toggleBulkUpdate = () => ({
    type: ContractTypes.TOGGLE_BULK_UPDATE,
});