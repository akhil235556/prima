import { createTypes } from 'reduxsauce';


export default createTypes<any>(`
    TOGGLE_FILTER
    TOGGLE_MODAL
    SELECTED_ELEMENT
    SET_RESPONSE
    SET_CURRENT_PAGE
    SET_ROW_PER_PAGE
    SHOW_LOADING
    HIDE_LOADING
    JOB_LISTING_FILTER
    REMOVE_FILTER
    TOGGLE_POINTS_MODAL
    REFRESH_LIST
`);