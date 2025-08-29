import PlanningDispatchHistoryTypes from "../types/PlanningDispatchHistoryTypes";

export const toggleFilter = () => ({
    type: PlanningDispatchHistoryTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: PlanningDispatchHistoryTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: any) => ({
    type: PlanningDispatchHistoryTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: PlanningDispatchHistoryTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: PlanningDispatchHistoryTypes.SET_CURRENT_PAGE,
    value
});

export const setRowPerPage = (value: any) => ({
    type: PlanningDispatchHistoryTypes.SET_ROW_PER_PAGE,
    value
});

export const showLoading = () => ({
    type: PlanningDispatchHistoryTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: PlanningDispatchHistoryTypes.HIDE_LOADING,
});


export const setFilter = (chips: any, params: any) => ({
    type: PlanningDispatchHistoryTypes.SET_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: PlanningDispatchHistoryTypes.REMOVE_FILTER,
    key
});

export const togglePointsModal = () => ({
    type: PlanningDispatchHistoryTypes.TOGGLE_POINTS_MODAL,
});

export const refreshList = () => ({
    type: PlanningDispatchHistoryTypes.REFRESH_LIST,
});
