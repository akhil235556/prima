import { createReducer } from "reduxsauce";
import { RaiseIndentState } from '../storeStates/RaiseIndentStoreState';
import RaiseIndentTypes from "../types/RaiseIndentTypes";

export const RAISE_INDENT_STATE: RaiseIndentState = {
    partnerList: undefined,
    laneList: undefined,
    freightTypeList: undefined,
    originSuggestion: undefined,
    destinationSuggestion: undefined,
    userParams: {
        articles: [{
            index: 0,
        }]
    },
    loading: false,
    openModal: false,
    autoSelected: false,
    showOrderDetails: false,
    error: {},
    shipmentDeatils: undefined,
    openBulkUpload: false,
    zoneEnabled: null
}

const showLoadingReducer = (state = RAISE_INDENT_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = RAISE_INDENT_STATE) => ({
    ...state,
    loading: false
});

const setUserParams = (state = RAISE_INDENT_STATE, action: any) => {
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

const setFreightTypeList = (state = RAISE_INDENT_STATE, action: any) => ({
    ...state,
    freightTypeList: action.value,
});

const setOriginSuggestion = (state = RAISE_INDENT_STATE, action: any) => ({
    ...state,
    originSuggestion: action.value,
});

const setDestinationSuggestion = (state = RAISE_INDENT_STATE, action: any) => ({
    ...state,
    destinationSuggestion: action.value,
});

const clearUserParams = (state = RAISE_INDENT_STATE) => ({
    ...state,
    autoSelected: false,
    laneList: undefined,
    partnerList: undefined,
    originSuggestion: undefined,
    destinationSuggestion: undefined,
    error: {},
    userParams: {
        articles: [{
            index: 0,
        }]
    }
});

const setPartnerList = (state = RAISE_INDENT_STATE, action: any) => ({
    ...state,
    partnerList: action.value,
});

const setLaneList = (state = RAISE_INDENT_STATE, action: any) => ({
    ...state,
    laneList: action.value,
});

const setAutoSelected = (state = RAISE_INDENT_STATE, action: any) => ({
    ...state,
    autoSelected: action.value,
});
const setError = (state = RAISE_INDENT_STATE, action: any) => ({
    ...state,
    error: action.value,
});

const toggleModal = (state = RAISE_INDENT_STATE) => ({
    ...state,
    openModal: !state.openModal,
});
const toggleOrderDeatilsReducer = (state = RAISE_INDENT_STATE) => ({
    ...state,
    showOrderDetails: !state.showOrderDetails,
});

const addShipmetDetailsReducer = (state = RAISE_INDENT_STATE, action: any) => ({
    ...state,
    shipmentDeatils: state.shipmentDeatils !== undefined ? [...state.shipmentDeatils, {
        index: state.shipmentDeatils.length,
        details: action.value,
        error: action.error ? action.error : {},
    }] : [{
        index: 0,
        details: action.value,
        error: action.error ? action.error : {},
    }],
});

const saveShipmetDetailsReducer = (state = RAISE_INDENT_STATE, action: any) => ({
    ...state,
    shipmentDeatils: action.value,
});

const removeShipmetDetailsReducer = (state = RAISE_INDENT_STATE, action: any) => {
    let shipmentDeatils = state.shipmentDeatils?.filter((element: any) => element.index !== action.index)
    shipmentDeatils = shipmentDeatils.map((item: any, index: any) => {
        return {
            ...item,
            index: index,
        }
    })
    return {
        ...state,
        shipmentDeatils: shipmentDeatils
    }
};

const toggleBulkUploadReducer = (state = RAISE_INDENT_STATE) => ({
    ...state,
    openBulkUpload: !state.openBulkUpload
});

const clearShipmentDetailsReducer = (state = RAISE_INDENT_STATE) => ({
    ...state,
    shipmentDeatils: undefined
});

const addMultipleShipmetDetailsReducer = (state = RAISE_INDENT_STATE, action: any) => ({
    ...state,
    shipmentDeatils: action.value
});

const setPtlStatusReducer = (state = RAISE_INDENT_STATE, action: any) => ({
    ...state,
    zoneEnabled: action.value
});

const ACTION_HANDLERS = {
    [RaiseIndentTypes.SHOW_LOADING]: showLoadingReducer,
    [RaiseIndentTypes.HIDE_LOADING]: hideLoadingReducer,
    [RaiseIndentTypes.USER_PARAMS]: setUserParams,
    [RaiseIndentTypes.CLEAR_USER_PARAMS]: clearUserParams,
    [RaiseIndentTypes.SET_FREIGHT_TYPE]: setFreightTypeList,
    [RaiseIndentTypes.ORIGIN_SUGGESTION]: setOriginSuggestion,
    [RaiseIndentTypes.DESTINATION_SUGGESTION]: setDestinationSuggestion,
    [RaiseIndentTypes.PARTNER_LIST]: setPartnerList,
    [RaiseIndentTypes.LANE_LIST]: setLaneList,
    [RaiseIndentTypes.AUTO_SELECT]: setAutoSelected,
    [RaiseIndentTypes.SET_ERROR]: setError,
    [RaiseIndentTypes.TOGGLE_MODAL]: toggleModal,
    [RaiseIndentTypes.TOGGLE_ORDER_DETAILS]: toggleOrderDeatilsReducer,
    [RaiseIndentTypes.SAVE_SHIPMENT_DETAILS]: saveShipmetDetailsReducer,
    [RaiseIndentTypes.REMOVE_SHIPMENT_DETAILS]: removeShipmetDetailsReducer,
    [RaiseIndentTypes.ADD_SHIPMENT_DETAILS]: addShipmetDetailsReducer,
    [RaiseIndentTypes.TOGGLE_BULK_UPLOAD]: toggleBulkUploadReducer,
    [RaiseIndentTypes.CLEAR_SHIPMENT_DETAILS]: clearShipmentDetailsReducer,
    [RaiseIndentTypes.ADD_MULTIPLE_SHIPMENT_DETAILS]: addMultipleShipmetDetailsReducer,
    [RaiseIndentTypes.SET_PTL_STATUS]: setPtlStatusReducer

}
export default createReducer(RAISE_INDENT_STATE, ACTION_HANDLERS);