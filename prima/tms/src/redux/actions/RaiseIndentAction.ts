import { OptionType } from '../../component/widgets/widgetsInterfaces';
import RaiseIndentTypes from "../types/RaiseIndentTypes";

export const showLoading = () => ({
    type: RaiseIndentTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: RaiseIndentTypes.HIDE_LOADING,
});


export const setUserParams = (value: any) => ({
    type: RaiseIndentTypes.USER_PARAMS,
    value,
});

export const clearUserParams = () => ({
    type: RaiseIndentTypes.CLEAR_USER_PARAMS,
});

export const setFreightTypeList = (value: Array<OptionType> | undefined) => ({
    type: RaiseIndentTypes.SET_FREIGHT_TYPE,
    value,
});


export const setOriginSuggestion = (value: Array<OptionType> | undefined) => ({
    type: RaiseIndentTypes.ORIGIN_SUGGESTION,
    value,
});

export const setDestinationSuggestion = (value: Array<OptionType> | undefined) => ({
    type: RaiseIndentTypes.DESTINATION_SUGGESTION,
    value,
});

export const setPartnerList = (value: Array<OptionType> | undefined) => ({
    type: RaiseIndentTypes.PARTNER_LIST,
    value,
});

export const setLaneList = (value: Array<OptionType> | undefined) => ({
    type: RaiseIndentTypes.LANE_LIST,
    value,
});

export const setAutoSelected = (value: boolean) => ({
    type: RaiseIndentTypes.AUTO_SELECT,
    value,
});
export const setError = (value: string) => ({
    type: RaiseIndentTypes.SET_ERROR,
    value,
});


export const toggleModal = () => ({
    type: RaiseIndentTypes.TOGGLE_MODAL,
});

export const toggleOrderDeatils = () => ({
    type: RaiseIndentTypes.TOGGLE_ORDER_DETAILS,
});

export const addShipmetDetails = (value: any, error: any) => ({
    type: RaiseIndentTypes.ADD_SHIPMENT_DETAILS,
    value,
    error,
});
export const saveShipmetDetails = (value: any) => ({
    type: RaiseIndentTypes.SAVE_SHIPMENT_DETAILS,
    value,
});

export const removeShipmetDetails = (index: any) => ({
    type: RaiseIndentTypes.REMOVE_SHIPMENT_DETAILS,
    index,
});

export const toggleBulkUpload = () => ({
    type: RaiseIndentTypes.TOGGLE_BULK_UPLOAD,
});

export const clearShipmentDetails = () => ({
    type: RaiseIndentTypes.CLEAR_SHIPMENT_DETAILS,
});

export const addMultipleShipmetDetails = (value: any) => ({
    type: RaiseIndentTypes.ADD_MULTIPLE_SHIPMENT_DETAILS,
    value,
});

export const setPtlStatus = (value: boolean) => ({
    type: RaiseIndentTypes.SET_PTL_STATUS,
    value,
});
