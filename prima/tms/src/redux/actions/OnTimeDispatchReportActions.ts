import OnTimeDispatchReportTypes from "../types/OnTimeDispatchReportTypes";
import { OnTimeDispatchReport } from "../storeStates/OnTimeDispatchReportInterface";

export const toggleFilter = () => ({
    type: OnTimeDispatchReportTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: OnTimeDispatchReportTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: OnTimeDispatchReport | undefined) => ({
    type: OnTimeDispatchReportTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: OnTimeDispatchReportTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: OnTimeDispatchReportTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: OnTimeDispatchReportTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: OnTimeDispatchReportTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: OnTimeDispatchReportTypes.SET_ROW_PER_PAGE,
    value
});

export const setFilter = (chips: any, params: any) => ({
    type: OnTimeDispatchReportTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: OnTimeDispatchReportTypes.REMOVE_FILTER,
    key
});