import IntransitEfficiencyTypes from "../types/IntransitEfficiencyTypes";
import { IntransitEfficiency } from "../storeStates/IntransitEfficiencyInterface";

export const toggleFilter = () => ({
    type: IntransitEfficiencyTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: IntransitEfficiencyTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: IntransitEfficiency | undefined) => ({
    type: IntransitEfficiencyTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: IntransitEfficiencyTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: IntransitEfficiencyTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: IntransitEfficiencyTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: IntransitEfficiencyTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: IntransitEfficiencyTypes.SET_ROW_PER_PAGE,
    value
});

export const setFilter = (chips: any, params: any) => ({
    type: IntransitEfficiencyTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: IntransitEfficiencyTypes.REMOVE_FILTER,
    key
});