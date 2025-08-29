import DetentionReportTypes from "../types/DetentionReportTypes";
import { DetentionReport } from "../storeStates/DetentionReportInterface";

export const toggleFilter = () => ({
    type: DetentionReportTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: DetentionReportTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: DetentionReport | undefined) => ({
    type: DetentionReportTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: DetentionReportTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: DetentionReportTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: DetentionReportTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: DetentionReportTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: DetentionReportTypes.SET_ROW_PER_PAGE,
    value
});

export const setFilter = (chips: any, params: any) => ({
    type: DetentionReportTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: DetentionReportTypes.REMOVE_FILTER,
    key
});