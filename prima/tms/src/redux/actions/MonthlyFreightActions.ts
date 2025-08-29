import MonthlyFreightTypes from "../types/MonthlyFreightTypes";
import { LaneDetails } from "../storeStates/LaneStoreInterface";

export const toggleFilter = () => ({
    type: MonthlyFreightTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: MonthlyFreightTypes.TOGGLE_MODAL,
});

export const togglePointsModal = () => ({
    type: MonthlyFreightTypes.TOGGLE_POINTS_MODAL,
});

export const setSelectedElement = (value: LaneDetails | null) => ({
    type: MonthlyFreightTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: MonthlyFreightTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: MonthlyFreightTypes.SET_CURRENT_PAGE,
    value
});

export const setRowPerPage = (value: any) => ({
    type: MonthlyFreightTypes.SET_ROW_PER_PAGE,
    value
});

export const refreshList = () => ({
    type: MonthlyFreightTypes.REFRESH_LIST,
});
export const setFilter = (chips: any, params: any) => ({
    type: MonthlyFreightTypes.USER_FILTER,
    chips,
    params,
});


export const removeFilter = (key: any) => ({
    type: MonthlyFreightTypes.REMOVE_FILTER,
    key
});
export const showLoading = () => ({
    type: MonthlyFreightTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: MonthlyFreightTypes.HIDE_LOADING,
});
