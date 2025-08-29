import { LaneDetails } from "../storeStates/LaneStoreInterface";
import LaneTypes from "../types/LaneTypes";

export const toggleFilter = () => ({
    type: LaneTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: LaneTypes.TOGGLE_MODAL,
});

export const togglePointsModal = () => ({
    type: LaneTypes.TOGGLE_POINTS_MODAL,
});

export const toggleBulkUploadWithSOB = () => ({
    type: LaneTypes.TOGGLE_BULK_UPLOAD_SOB,
});

export const toggleBulkUploadWithLane = () => ({
    type: LaneTypes.TOGGLE_BULK_UPLOAD_LANE,
});

export const setSelectedElement = (value: LaneDetails | null) => ({
    type: LaneTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: LaneTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: LaneTypes.SET_CURRENT_PAGE,
    value
});

export const setRowPerPage = (value: any) => ({
    type: LaneTypes.SET_ROW_PER_PAGE,
    value
});

export const refreshList = () => ({
    type: LaneTypes.REFRESH_LIST,
});

export const showLoading = () => ({
    type: LaneTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: LaneTypes.HIDE_LOADING,
});

export const setFilter = (chips: any, params: any) => ({
    type: LaneTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: LaneTypes.REMOVE_FILTER,
    key
});

export const clearData = () => ({
    type: LaneTypes.CLEAR_LIST_DATA,
});
