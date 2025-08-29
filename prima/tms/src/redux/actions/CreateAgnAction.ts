import CreateAgnTypes from "../types/CreateAgnTypes";

export const showLoading = () => ({
    type: CreateAgnTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: CreateAgnTypes.HIDE_LOADING,
});

export const setUserParams = (value: any) => ({
    type: CreateAgnTypes.USER_PARAMS,
    value,
});

export const clearUserParams = () => ({
    type: CreateAgnTypes.CLEAR_USER_PARAMS,
});

export const showContractDetails = () => ({
    type: CreateAgnTypes.SHOW_AGN_DETAILS,
});

export const showFreightDetails = () => ({
    type: CreateAgnTypes.SHOW_PRODUCT_DETAILS,
});

export const setError = (value: string) => ({
    type: CreateAgnTypes.SET_ERROR,
    value,
});