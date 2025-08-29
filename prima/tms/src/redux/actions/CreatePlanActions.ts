import CreatePlanTypes from "../types/CreatePlanTypes";

export const toggleFilter = () => ({
    type: CreatePlanTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: CreatePlanTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: any) => ({
    type: CreatePlanTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: CreatePlanTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: CreatePlanTypes.SET_CURRENT_PAGE,
    value
});

export const setRowPerPage = (value: any) => ({
    type: CreatePlanTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: CreatePlanTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: CreatePlanTypes.HIDE_LOADING,
});

export const checkAll = (value: boolean) => ({
    type: CreatePlanTypes.CHECK_ALL,
    value,
});

export const toggleCheck = (element: any, value: boolean) => ({
    type: CreatePlanTypes.TOGGLE_CHECK,
    element,
    value,
});

export const setFilter = (chips: any, params: any) => ({
    type: CreatePlanTypes.JOB_LISTING_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: CreatePlanTypes.REMOVE_FILTER,
    key
});

export const togglePointsModal = () => ({
    type: CreatePlanTypes.TOGGLE_POINTS_MODAL,
});

export const refreshList = () => ({
    type: CreatePlanTypes.REFRESH_LIST,
});
