import PlanningDispatchTypes from "../types/PlanningDispatchTypes";

export const toggleFilter = () => ({
    type: PlanningDispatchTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: PlanningDispatchTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: any) => ({
    type: PlanningDispatchTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: PlanningDispatchTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: PlanningDispatchTypes.SET_CURRENT_PAGE,
    value
});

export const setRowPerPage = (value: any) => ({
    type: PlanningDispatchTypes.SET_ROW_PER_PAGE,
    value
});

export const setFilter = (chips: any, params: any) => ({
    type: PlanningDispatchTypes.JOB_LISTING_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: PlanningDispatchTypes.REMOVE_FILTER,
    key
});

export const showLoading = () => ({
    type: PlanningDispatchTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: PlanningDispatchTypes.HIDE_LOADING,
});

export const togglePointsModal = () => ({
    type: PlanningDispatchTypes.TOGGLE_POINTS_MODAL,
});

export const togglePlanningModal = () => ({
    type: PlanningDispatchTypes.TOGGLE_PLANNING_MODAL,
});

export const refreshList = () => ({
    type: PlanningDispatchTypes.REFRESH_LIST,
});

