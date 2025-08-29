import { createTypes } from 'reduxsauce';


export default createTypes<any>(`
    TOGGLE_FILTER
    TOGGLE_MODAL
    SELECTED_ELEMENT
    SET_RESPONSE
    SET_CURRENT_PAGE
    REFRESH_LIST
    SEARCH_QUERY
    SET_ROW_PER_PAGE
    SHOW_LOADING
    HIDE_LOADING
    TOGGLE_BULK_UPLOAD
    USER_FILTER
    REMOVE_FILTER
`);