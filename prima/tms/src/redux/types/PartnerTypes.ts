import { createTypes } from 'reduxsauce'


export default createTypes<any>(`
    TOGGLE_MODAL
    SET_RESPONSE
    SET_SELECTED_ELEMENT
    SET_CURRENT_PAGE
    REFRESH_LIST
    SET_ROW_PER_PAGE
    TOGGLE_LOADING
    SHOW_LOADING
    HIDE_LOADING
    TOGGLE_FILTER
    REMOVE_FILTER
    USER_FILTER
`);