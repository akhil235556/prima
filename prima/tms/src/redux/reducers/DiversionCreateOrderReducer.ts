import { createReducer } from "reduxsauce";
import { DiversionCreateOrderState } from "../storeStates/DiversionCreateOrderInterface";
import DiversionCreateOrderTypes from "../types/DiversionCreateOrderTypes";

export const DIVERSION_CREATE_ORDER_STATE: DiversionCreateOrderState = {
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
}

const showLoadingReducer = (state = DIVERSION_CREATE_ORDER_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = DIVERSION_CREATE_ORDER_STATE) => ({
    ...state,
    loading: false
});


const setUserParams = (state = DIVERSION_CREATE_ORDER_STATE, action: any) => {
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

const setFreightTypeList = (state = DIVERSION_CREATE_ORDER_STATE, action: any) => ({
    ...state,
    freightTypeList: action.value,
});

const setOriginSuggestion = (state = DIVERSION_CREATE_ORDER_STATE, action: any) => ({
    ...state,
    originSuggestion: action.value,
});

const setDestinationSuggestion = (state = DIVERSION_CREATE_ORDER_STATE, action: any) => ({
    ...state,
    destinationSuggestion: action.value,
});

const clearUserParams = (state = DIVERSION_CREATE_ORDER_STATE) => ({
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

const setPartnerList = (state = DIVERSION_CREATE_ORDER_STATE, action: any) => ({
    ...state,
    partnerList: action.value,
});

const setLaneList = (state = DIVERSION_CREATE_ORDER_STATE, action: any) => ({
    ...state,
    laneList: action.value,
});

const setAutoSelected = (state = DIVERSION_CREATE_ORDER_STATE, action: any) => ({
    ...state,
    autoSelected: action.value,
});
const setError = (state = DIVERSION_CREATE_ORDER_STATE, action: any) => ({
    ...state,
    error: action.value,
});

const toggleModal = (state = DIVERSION_CREATE_ORDER_STATE) => ({
    ...state,
    openModal: !state.openModal,
});
const toggleOrderDeatilsReducer = (state = DIVERSION_CREATE_ORDER_STATE) => ({
    ...state,
    showOrderDetails: !state.showOrderDetails,
});

const addShipmetDetailsReducer = (state = DIVERSION_CREATE_ORDER_STATE, action: any) => ({
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

const saveShipmetDetailsReducer = (state = DIVERSION_CREATE_ORDER_STATE, action: any) => ({
    ...state,
    shipmentDeatils: action.value,
});

const removeShipmetDetailsReducer = (state = DIVERSION_CREATE_ORDER_STATE, action: any) => {
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

const toggleBulkUploadReducer = (state = DIVERSION_CREATE_ORDER_STATE) => ({
    ...state,
    openBulkUpload: !state.openBulkUpload
});

const clearShipmentDetailsReducer = (state = DIVERSION_CREATE_ORDER_STATE) => ({
    ...state,
    shipmentDeatils: undefined
});

const addMultipleShipmetDetailsReducer = (state = DIVERSION_CREATE_ORDER_STATE, action: any) => ({
    ...state,
    shipmentDeatils: action.value
});


const ACTION_HANDLERS = {
    [DiversionCreateOrderTypes.SHOW_LOADING]: showLoadingReducer,
    [DiversionCreateOrderTypes.HIDE_LOADING]: hideLoadingReducer,
    [DiversionCreateOrderTypes.USER_PARAMS]: setUserParams,
    [DiversionCreateOrderTypes.CLEAR_USER_PARAMS]: clearUserParams,
    [DiversionCreateOrderTypes.SET_FREIGHT_TYPE]: setFreightTypeList,
    [DiversionCreateOrderTypes.ORIGIN_SUGGESTION]: setOriginSuggestion,
    [DiversionCreateOrderTypes.DESTINATION_SUGGESTION]: setDestinationSuggestion,
    [DiversionCreateOrderTypes.PARTNER_LIST]: setPartnerList,
    [DiversionCreateOrderTypes.LANE_LIST]: setLaneList,
    [DiversionCreateOrderTypes.AUTO_SELECT]: setAutoSelected,
    [DiversionCreateOrderTypes.SET_ERROR]: setError,
    [DiversionCreateOrderTypes.TOGGLE_MODAL]: toggleModal,
    [DiversionCreateOrderTypes.TOGGLE_ORDER_DETAILS]: toggleOrderDeatilsReducer,
    [DiversionCreateOrderTypes.SAVE_SHIPMENT_DETAILS]: saveShipmetDetailsReducer,
    [DiversionCreateOrderTypes.REMOVE_SHIPMENT_DETAILS]: removeShipmetDetailsReducer,
    [DiversionCreateOrderTypes.ADD_SHIPMENT_DETAILS]: addShipmetDetailsReducer,
    [DiversionCreateOrderTypes.TOGGLE_BULK_UPLOAD]: toggleBulkUploadReducer,
    [DiversionCreateOrderTypes.CLEAR_SHIPMENT_DETAILS]: clearShipmentDetailsReducer,
    [DiversionCreateOrderTypes.ADD_MULTIPLE_SHIPMENT_DETAILS]: addMultipleShipmetDetailsReducer,

}
export default createReducer(DIVERSION_CREATE_ORDER_STATE, ACTION_HANDLERS);