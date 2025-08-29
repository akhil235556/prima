import AllPerformanceReportTypes from "../types/AllPerformanceReportTypes";
import { AllPerformanceReport } from "../storeStates/AllPerformanceReportInterface";

export const toggleFilter = () => ({
    type: AllPerformanceReportTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: AllPerformanceReportTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: AllPerformanceReport | null) => ({
    type: AllPerformanceReportTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: AllPerformanceReportTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: AllPerformanceReportTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: AllPerformanceReportTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: AllPerformanceReportTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: AllPerformanceReportTypes.SET_ROW_PER_PAGE,
    value
});

export const setFilter = (chips: any, params: any) => ({
    type: AllPerformanceReportTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: AllPerformanceReportTypes.REMOVE_FILTER,
    key
});