import CreateContractTypes from "../types/CreateContractTypes";
import { OptionType } from '../../component/widgets/widgetsInterfaces';

export const showLoading = () => ({
    type: CreateContractTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
    type: CreateContractTypes.HIDE_LOADING,
});

export const setBillingCycleList = (value: Array<OptionType> | undefined) => ({
    type: CreateContractTypes.BILLING_CYCLE_LIST,
    value
});

export const setFreightChargesList = (value: Array<OptionType> | undefined) => ({
    type: CreateContractTypes.CHARGES_LIST,
    value
});

export const setFreightVariableList = (value: Array<OptionType> | undefined) => ({
    type: CreateContractTypes.VARIABLE_LIST,
    value
});

export const setFreightChargeType = (value: Array<OptionType> | undefined) => ({
    type: CreateContractTypes.CHARGE_TYPE,
    value
});

export const setContractDetails = (selectedElement: any, charges: any) => ({
    type: CreateContractTypes.CONTRACT_DETAILS,
    selectedElement,
    charges,
});

export const setUserParams = (value: any) => ({
    type: CreateContractTypes.USER_PARAMS,
    value,
});

export const clearUserParams = () => ({
    type: CreateContractTypes.CLEAR_USER_PARAMS,
});

export const showContractDetails = () => ({
    type: CreateContractTypes.SHOW_CONTRACT_DETAILS,
});

export const showFreightDetails = () => ({
    type: CreateContractTypes.SHOW_FREIGHT_DETAILS,
});