import DispatchDashboardTypes from "../types/DispatchDashboardTypes";

export const toggleFilter = () => ({
    type: DispatchDashboardTypes.TOGGLE_FILTER,
});

export const setFilter = (chips: any, params: any) => ({
    type: DispatchDashboardTypes.USER_FILTER,
    chips,
    params,
});


export const removeFilter = (key: any) => ({
    type: DispatchDashboardTypes.REMOVE_FILTER,
    key
});

export const showLoading = () => ({
    type: DispatchDashboardTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: DispatchDashboardTypes.HIDE_LOADING,
});

export const setDashboardCount = (value: any) => ({
    type: DispatchDashboardTypes.DASHBOARD_COUNT,
    value,
});

export const setDashboardChartData = (value: any) => ({
    type: DispatchDashboardTypes.DASHBOARD_CHART_DATA,
    value,
});

export const refreshList = () => ({
    type: DispatchDashboardTypes.REFRESH_LIST,
});