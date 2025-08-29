import TrackingAssetsTypes from "../types/TrackingAssetsTypes";
import { TrackingAssets } from "../storeStates/TrackingAssetsStoreInterface";

export const toggleFilter = () => ({
    type: TrackingAssetsTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: TrackingAssetsTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: TrackingAssets | null) => ({
    type: TrackingAssetsTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: TrackingAssetsTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: TrackingAssetsTypes.SET_CURRENT_PAGE,
    value
});

export const setRowPerPage = (value: any) => ({
    type: TrackingAssetsTypes.SET_ROW_PER_PAGE,
    value
});

export const refreshList = () => ({
    type: TrackingAssetsTypes.REFRESH_LIST,
});

export const showLoading = () => ({
    type: TrackingAssetsTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: TrackingAssetsTypes.HIDE_LOADING,
});

