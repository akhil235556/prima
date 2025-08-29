import MonthlyFreightReportTypes from "../types/MonthlyFreightReportTypes";
import { MonthlyFreightReport } from "../storeStates/MonthlyFreightReportInterface";

export const toggleFilter = () => ({
    type: MonthlyFreightReportTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: MonthlyFreightReportTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: MonthlyFreightReport | undefined) => ({
    type: MonthlyFreightReportTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: MonthlyFreightReportTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: MonthlyFreightReportTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: MonthlyFreightReportTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: MonthlyFreightReportTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: MonthlyFreightReportTypes.SET_ROW_PER_PAGE,
    value
});

export const setFilter = (chips: any, params: any) => ({
    type: MonthlyFreightReportTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: MonthlyFreightReportTypes.REMOVE_FILTER,
    key
});