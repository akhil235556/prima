import ShortageDamageReportTypes from "../types/ShortageDamageReportTypes";
import { ShortageDamageReport } from "../storeStates/ShortageDamageReportInterface";

export const toggleFilter = () => ({
    type: ShortageDamageReportTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: ShortageDamageReportTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: ShortageDamageReport | undefined) => ({
    type: ShortageDamageReportTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: ShortageDamageReportTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: ShortageDamageReportTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: ShortageDamageReportTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: ShortageDamageReportTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: ShortageDamageReportTypes.SET_ROW_PER_PAGE,
    value
});

export const setFilter = (chips: any, params: any) => ({
    type: ShortageDamageReportTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: ShortageDamageReportTypes.REMOVE_FILTER,
    key
});