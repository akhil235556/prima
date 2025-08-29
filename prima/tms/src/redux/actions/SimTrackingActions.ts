import { LaneDetails } from "../storeStates/LaneStoreInterface";
import SimTrackingTypes from "../types/SimTrackingTypes";

export const toggleFilter = () => ({
    type: SimTrackingTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: SimTrackingTypes.TOGGLE_MODAL,
});

export const togglePointsModal = () => ({
    type: SimTrackingTypes.TOGGLE_POINTS_MODAL,
});

export const setSelectedElement = (value: LaneDetails | null) => ({
    type: SimTrackingTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: SimTrackingTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: SimTrackingTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: SimTrackingTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: SimTrackingTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: SimTrackingTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: SimTrackingTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: SimTrackingTypes.HIDE_LOADING,
});

export const setFilter = (chips: any, params: any) => ({
    type: SimTrackingTypes.SET_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: SimTrackingTypes.REMOVE_FILTER,
    key
});
