import DeliveryReportTypes from "../types/DeliveryReportTypes";
import { DeliveryReport } from "../storeStates/DeliveryReportInterface";

export const toggleFilter = () => ({
    type: DeliveryReportTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: DeliveryReportTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: DeliveryReport | undefined) => ({
    type: DeliveryReportTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: DeliveryReportTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: DeliveryReportTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: DeliveryReportTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: DeliveryReportTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: DeliveryReportTypes.SET_ROW_PER_PAGE,
    value
});

export const setFilter = (chips: any, params: any) => ({
    type: DeliveryReportTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: DeliveryReportTypes.REMOVE_FILTER,
    key
});