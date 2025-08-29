import { LaneDetails } from "../storeStates/LaneStoreInterface";
import IndentTypes from "../types/IndentTypes";

export const toggleFilter = () => ({
    type: IndentTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: IndentTypes.TOGGLE_MODAL,
});

export const togglePointsModal = () => ({
    type: IndentTypes.TOGGLE_POINTS_MODAL,
});

export const toggleBulkUpload = () => ({
    type: IndentTypes.TOGGLE_BULK_MODAL,
});

export const setSelectedElement = (value: LaneDetails | null) => ({
    type: IndentTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: IndentTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: IndentTypes.SET_CURRENT_PAGE,
    value
});

export const setRowPerPage = (value: any) => ({
    type: IndentTypes.SET_ROW_PER_PAGE,
    value
});

export const refreshList = () => ({
    type: IndentTypes.REFRESH_LIST,
});

export const setFilter = (chips: any, params: any) => ({
    type: IndentTypes.USER_FILTER,
    chips,
    params,
});


export const removeFilter = (key: any) => ({
    type: IndentTypes.REMOVE_FILTER,
    key
});
export const showLoading = () => ({
    type: IndentTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: IndentTypes.HIDE_LOADING,
});
