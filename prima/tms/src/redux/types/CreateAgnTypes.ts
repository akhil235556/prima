import { createTypes } from 'reduxsauce'


export default createTypes<any>(`
    SHOW_LOADING
    HIDE_LOADING
    USER_PARAMS
    SHOW_AGN_DETAILS
    SHOW_PRODUCT_DETAILS
    CLEAR_USER_PARAMS
    SET_ERROR
`);