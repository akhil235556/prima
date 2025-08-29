import LoadabilityTypes from "../types/LoadabilityTypes";
import { Loadability } from "../storeStates/LoadabilityInterface";

export const toggleFilter = () => ({
    type: LoadabilityTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: LoadabilityTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: Loadability | undefined) => ({
    type: LoadabilityTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: LoadabilityTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: LoadabilityTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: LoadabilityTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: LoadabilityTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: LoadabilityTypes.SET_ROW_PER_PAGE,
    value
});

export const setFilter = (chips: any, params: any) => ({
    type: LoadabilityTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: LoadabilityTypes.REMOVE_FILTER,
    key
});