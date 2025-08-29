import PartnerTypes from "../types/PartnerTypes";
import { PartnerDetails } from '../storeStates/PartnerStoreInterface';

export const toggleModal = () => ({
    type: PartnerTypes.TOGGLE_MODAL,
});

export const toggleFilter = () => ({
    type: PartnerTypes.TOGGLE_FILTER,
});

export const setResponse = (response: any) => ({
    type: PartnerTypes.SET_RESPONSE,
    response,
});

export const setSelectedElement = (value: PartnerDetails) => ({
    type: PartnerTypes.SET_SELECTED_ELEMENT,
    value,
});

export const setCurrentPage = (value: any) => ({
    type: PartnerTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: PartnerTypes.REFRESH_LIST,
});

export const setRowPerPage = (value: any) => ({
    type: PartnerTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: PartnerTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: PartnerTypes.HIDE_LOADING,
});

export const setFilter = (chips: any, params: any) => ({
    type: PartnerTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: PartnerTypes.REMOVE_FILTER,
    key
});