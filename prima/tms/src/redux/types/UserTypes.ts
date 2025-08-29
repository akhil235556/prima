import { createTypes } from 'reduxsauce'


export default createTypes<any>(`
    TOGGLE_FILTER
    TOGGLE_MODAL
    SELECTED_ELEMENT
    SET_RESPONSE
    REFRESH_LIST
    SET_CURRENT_PAGE
    SET_ROW_PER_PAGE
    USER_FILTER
    REMOVE_FILTER
    SHOW_LOADING
    HIDE_LOADING
`);