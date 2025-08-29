import RolesTypes from "../types/RolesTypes";

export const toggleModal = () => ({
    type: RolesTypes.TOGGLE_MODAL,
});

export const setResponse = (response: any) => ({
    type: RolesTypes.SET_RESPONSE,
    response,
});

export const setSelectedElement = (value: any) => ({
    type: RolesTypes.SET_SELECTED_ELEMENT,
    value,
});

export const setCurrentPage = (value: any) => ({
    type: RolesTypes.SET_CURRENT_PAGE,
    value
});

export const setRowPerPage = (value: any) => ({
    type: RolesTypes.SET_ROW_PER_PAGE,
    value,
});

export const refreshList = () => ({
    type: RolesTypes.REFRESH_LIST,
});

export const showLoading = () => ({
    type: RolesTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: RolesTypes.HIDE_LOADING,
});