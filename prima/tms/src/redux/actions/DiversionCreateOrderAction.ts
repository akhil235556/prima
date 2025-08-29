import { OptionType } from '../../component/widgets/widgetsInterfaces';
import DiversionCreateOrderTypes from "../types/DiversionCreateOrderTypes";

export const showLoading = () => ({
    type: DiversionCreateOrderTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: DiversionCreateOrderTypes.HIDE_LOADING,
});


export const setUserParams = (value: any) => ({
    type: DiversionCreateOrderTypes.USER_PARAMS,
    value,
});

export const clearUserParams = () => ({
    type: DiversionCreateOrderTypes.CLEAR_USER_PARAMS,
});

export const setFreightTypeList = (value: Array<OptionType> | undefined) => ({
    type: DiversionCreateOrderTypes.SET_FREIGHT_TYPE,
    value,
});


export const setOriginSuggestion = (value: Array<OptionType> | undefined) => ({
    type: DiversionCreateOrderTypes.ORIGIN_SUGGESTION,
    value,
});

export const setDestinationSuggestion = (value: Array<OptionType> | undefined) => ({
    type: DiversionCreateOrderTypes.DESTINATION_SUGGESTION,
    value,
});

export const setPartnerList = (value: Array<OptionType> | undefined) => ({
    type: DiversionCreateOrderTypes.PARTNER_LIST,
    value,
});

export const setLaneList = (value: Array<OptionType> | undefined) => ({
    type: DiversionCreateOrderTypes.LANE_LIST,
    value,
});

export const setAutoSelected = (value: boolean) => ({
    type: DiversionCreateOrderTypes.AUTO_SELECT,
    value,
});
export const setError = (value: string) => ({
    type: DiversionCreateOrderTypes.SET_ERROR,
    value,
});


export const toggleModal = () => ({
    type: DiversionCreateOrderTypes.TOGGLE_MODAL,
});

export const toggleOrderDeatils = () => ({
    type: DiversionCreateOrderTypes.TOGGLE_ORDER_DETAILS,
});

export const addShipmetDetails = (value: any, error: any) => ({
    type: DiversionCreateOrderTypes.ADD_SHIPMENT_DETAILS,
    value,
    error,
});
export const saveShipmetDetails = (value: any) => ({
    type: DiversionCreateOrderTypes.SAVE_SHIPMENT_DETAILS,
    value,
});

export const removeShipmetDetails = (index: any) => ({
    type: DiversionCreateOrderTypes.REMOVE_SHIPMENT_DETAILS,
    index,
});

export const toggleBulkUpload = () => ({
    type: DiversionCreateOrderTypes.TOGGLE_BULK_UPLOAD,
});

export const clearShipmentDetails = () => ({
    type: DiversionCreateOrderTypes.CLEAR_SHIPMENT_DETAILS,
});

export const addMultipleShipmetDetails = (value: any) => ({
    type: DiversionCreateOrderTypes.ADD_MULTIPLE_SHIPMENT_DETAILS,
    value,
});

