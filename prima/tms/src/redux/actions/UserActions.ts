import UserTypes from "../types/UserTypes";
import { UserDetails } from '../storeStates/UserStateInterface';

export const toggleFilter = () => ({
    type: UserTypes.TOGGLE_FILTER,
});

export const refreshList = () => ({
    type: UserTypes.REFRESH_LIST,
});

export const toggleModal = () => ({
    type: UserTypes.TOGGLE_MODAL,
});

export const setSelectedItem = (value: UserDetails | undefined) => ({
    type: UserTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: UserTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: UserTypes.SET_CURRENT_PAGE,
    value
});

export const setRowPerPage = (value: any) => ({
    type: UserTypes.SET_ROW_PER_PAGE,
    value,
});

export const setFilter = (chips: any, params: any) => ({
    type: UserTypes.USER_FILTER,
    chips,
    params,
});


export const removeFilter = (key: any) => ({
    type: UserTypes.REMOVE_FILTER,
    key
});

export const showLoading = () => ({
    type: UserTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: UserTypes.HIDE_LOADING,
});

