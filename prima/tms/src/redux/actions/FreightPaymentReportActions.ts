import { FreightPaymentReport } from "../storeStates/FreightPaymentReportInterface";
import FreightPaymentReportTypes from "../types/FreightPaymentReportTypes";

export const toggleFilter = () => ({
    type: FreightPaymentReportTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: FreightPaymentReportTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: FreightPaymentReport | undefined) => ({
    type: FreightPaymentReportTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: FreightPaymentReportTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: FreightPaymentReportTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: FreightPaymentReportTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: FreightPaymentReportTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: FreightPaymentReportTypes.SET_ROW_PER_PAGE,
    value
});

export const setFilter = (chips: any, params: any) => ({
    type: FreightPaymentReportTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: FreightPaymentReportTypes.REMOVE_FILTER,
    key
});

export const setDateType = (value: any) => ({
    type: FreightPaymentReportTypes.SET_DATE_TYPE,
    value
});