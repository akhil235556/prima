import { createTypes } from 'reduxsauce'


export default createTypes<any>(`
    TOGGLE_MODAL
    SET_RESPONSE
    SET_SELECTED_ELEMENT
    SET_CURRENT_PAGE
    SET_ROW_PER_PAGE
    REFRESH_LIST
    SHOW_LOADING
    HIDE_LOADING
`);