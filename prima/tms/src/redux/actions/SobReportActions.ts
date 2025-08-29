import SobReportTypes from "../types/SobReportTypes";
import { Sob } from "../storeStates/SobInterface";

export const toggleFilter = () => ({
    type: SobReportTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: SobReportTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: Sob | undefined) => ({
    type: SobReportTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: SobReportTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: SobReportTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: SobReportTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: SobReportTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: SobReportTypes.SET_ROW_PER_PAGE,
    value
});

export const setFilter = (chips: any, params: any) => ({
    type: SobReportTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: SobReportTypes.REMOVE_FILTER,
    key
});