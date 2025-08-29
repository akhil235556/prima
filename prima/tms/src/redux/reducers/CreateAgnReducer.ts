import { AgnCreateState } from "../storeStates/CreateAgnStoreInterface";
import CreateAgnTypes from "../types/CreateAgnTypes";
import { createReducer } from "reduxsauce";
import { isMobile } from "../../base/utility/ViewUtils";

export const CREATE_AGN_STATE: AgnCreateState = {
    userParams: {
        products: [{
            index: 0
        }],
    },
    loading: false,
    showAgnDetails: !isMobile,
    showProductDetails: true,
    error: {},
}

const showLoadingReducer = (state = CREATE_AGN_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = CREATE_AGN_STATE) => ({
    ...state,
    loading: false
});

const setUserParams = (state = CREATE_AGN_STATE, action: any) => {
    let value = action.value;
    return {
        ...state,
        error: {},
        userParams: {
            ...state.userParams,
            ...value,
        },
    }
};

const showAgnDetails = (state = CREATE_AGN_STATE) => ({
    ...state,
    showAgnDetails: isMobile ? !state.showAgnDetails : true
});

const showProductDetails = (state = CREATE_AGN_STATE) => ({
    ...state,
    showProductDetails: isMobile ? !state.showProductDetails : true
});

const clearUserParams = (state = CREATE_AGN_STATE) => ({
    ...state,
    error: {},
    userParams: {
        products: [{
            index: 0
        }],
    }
});

const setError = (state = CREATE_AGN_STATE, action: any) => ({
    ...state,
    error: action.value,
});

const showContractDetails = (state = CREATE_AGN_STATE) => ({
    ...state,
    showAgnDetails: isMobile ? !state.showAgnDetails : true
});

const showFreightDetails = (state = CREATE_AGN_STATE) => ({
    ...state,
    showProductDetails: isMobile ? !state.showProductDetails : true
});

const ACTION_HANDLERS = {
    [CreateAgnTypes.SHOW_LOADING]: showLoadingReducer,
    [CreateAgnTypes.HIDE_LOADING]: hideLoadingReducer,
    [CreateAgnTypes.USER_PARAMS]: setUserParams,
    [CreateAgnTypes.SHOW_AGN_DETAILS]: showAgnDetails,
    [CreateAgnTypes.SHOW_PRODUCT_DETAILS]: showProductDetails,
    [CreateAgnTypes.CLEAR_USER_PARAMS]: clearUserParams,
    [CreateAgnTypes.SET_ERROR]: setError,
    [CreateAgnTypes.SHOW_AGN_DETAILS]: showContractDetails,
    [CreateAgnTypes.SHOW_PRODUCT_DETAILS]: showFreightDetails,


}

export default createReducer(CREATE_AGN_STATE, ACTION_HANDLERS);