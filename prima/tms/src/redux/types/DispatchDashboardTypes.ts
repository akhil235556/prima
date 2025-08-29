import { createTypes } from 'reduxsauce';


export default createTypes<any>(`
    TOGGLE_FILTER
    USER_FILTER
    REMOVE_FILTER
    SHOW_LOADING
    HIDE_LOADING
    DASHBOARD_COUNT
    DASHBOARD_CHART_DATA
    REFRESH_LIST
`);