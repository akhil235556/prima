import PlanningHistoryTypes from "../types/PlanningHistoryTypes";

export const toggleFilter = () => ({
    type: PlanningHistoryTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: PlanningHistoryTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: any) => ({
    type: PlanningHistoryTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: PlanningHistoryTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: PlanningHistoryTypes.SET_CURRENT_PAGE,
    value
});

export const setRowPerPage = (value: any) => ({
    type: PlanningHistoryTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: PlanningHistoryTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: PlanningHistoryTypes.HIDE_LOADING,
});

export const checkAll = (value: boolean) => ({
    type: PlanningHistoryTypes.CHECK_ALL,
    value,
});


export const toggleCheck = (element: any, value: boolean) => ({
    type: PlanningHistoryTypes.TOGGLE_CHECK,
    element,
    value,
});

export const setFilter = (chips: any, params: any) => ({
    type: PlanningHistoryTypes.JOB_LISTING_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: PlanningHistoryTypes.REMOVE_FILTER,
    key
});

export const togglePointsModal = () => ({
    type: PlanningHistoryTypes.TOGGLE_POINTS_MODAL,
});

export const refreshList = () => ({
    type: PlanningHistoryTypes.REFRESH_LIST,
});
