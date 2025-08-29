import PlanningDashboardTypes from "../types/PlanningDashboardTypes";

export const toggleFilter = () => ({
    type: PlanningDashboardTypes.TOGGLE_FILTER,
});

export const refreshList = () => ({
    type: PlanningDashboardTypes.REFRESH_LIST,
});

export const setSelectedElement = (value: any | undefined) => ({
    type: PlanningDashboardTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: PlanningDashboardTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: PlanningDashboardTypes.SET_CURRENT_PAGE,
    value
});

export const setRowPerPage = (value: any) => ({
    type: PlanningDashboardTypes.SET_ROW_PER_PAGE,
    value
});

export const togglePointsModal = () => ({
    type: PlanningDashboardTypes.TOGGLE_POINTS_MODAL,
});

export const setFilter = (chips: any, params: any) => ({
    type: PlanningDashboardTypes.USER_FILTER,
    chips,
    params,
});


export const removeFilter = (key: any) => ({
    type: PlanningDashboardTypes.REMOVE_FILTER,
    key
});

export const toggleModal = () => ({
    type: PlanningDashboardTypes.TOGGLE_MODAL,
});

export const showLoading = () => ({
    type: PlanningDashboardTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: PlanningDashboardTypes.HIDE_LOADING,
});