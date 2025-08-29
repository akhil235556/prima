import { createReducer } from "reduxsauce";
import { chargesTypes } from '../../base/constant/ArrayList';
import { isMobile } from "../../base/utility/ViewUtils";
import { ContractCreateState } from "../storeStates/ContractStoreInterface";
import CreateContractTypes from "../types/CreateContractTypes";

export const CREATE_CONTRACT_STATE: ContractCreateState = {
    partnerList: undefined,
    laneList: undefined,
    freightTypeList: undefined,
    billingCycleList: undefined,
    freightChargesList: undefined,
    freightChargesType: undefined,
    freightVariableList: undefined,
    userParams: {},
    loading: false,
    showContractDetails: !isMobile,
    showFreightDetails: true,
    contractMode: undefined
}

const showLoadingReducer = (state = CREATE_CONTRACT_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = CREATE_CONTRACT_STATE) => ({
    ...state,
    loading: false
});

const setBillingCycleList = (state = CREATE_CONTRACT_STATE, action: any) => ({
    ...state,
    billingCycleList: action.value
});

const setFreightChargesList = (state = CREATE_CONTRACT_STATE, action: any) => ({
    ...state,
    freightChargesList: action.value
});


const setFreightVariableList = (state = CREATE_CONTRACT_STATE, action: any) => ({
    ...state,
    freightVariableList: action.value
});

const setChargeTypeList = (state = CREATE_CONTRACT_STATE, action: any) => ({
    ...state,
    freightChargesType: action.value
});

const setUserParams = (state = CREATE_CONTRACT_STATE, action: any) => {
    let value = action.value;
    return {
        ...state,
        userParams: {
            ...state.userParams,
            ...value,
        },
    }
};

const setContractDetails = (state = CREATE_CONTRACT_STATE, action: any) => {
    let selectedElement = action.selectedElement;
    let charges: any = action.charges;
    if (charges) {
        charges = charges.map((element: any, index: number) => (
            {
                index: index,
                variable: state.freightVariableList?.filter((innerElement: any) => innerElement.value === element.variable),
                chargeType: chargesTypes.filter((innerElement: any) => innerElement.value === element.operation)[0],
                charge: state.freightChargesList?.filter((innerElement: any) => innerElement.value === element.chargeName)[0],
                chargeAmount: element.amount

            }
        ))
    }
    return {
        ...state,
        userParams: {
            ...selectedElement,
            laneName: "",
            partner: {
                label: selectedElement.partner.name,
                value: selectedElement.partner.code
            },
            partnerName: selectedElement.partner.name,
            vehicleType: {
                label: selectedElement.vehicleType.name,
                value: selectedElement.vehicleType.code,
            },
            billingCycle: {
                label: selectedElement.billingCycle,
                value: selectedElement.billingCycle,
            },
            freightType: {
                label: selectedElement.contractType,
                value: selectedElement.contractType,
            },
            charges: charges,
            contractReferenceNo: selectedElement.contractReferenceNo || "NA"
        }
    }
};

const showContractDetails = (state = CREATE_CONTRACT_STATE) => ({
    ...state,
    showContractDetails: isMobile ? !state.showContractDetails : true
});

const showFreightDetails = (state = CREATE_CONTRACT_STATE) => ({
    ...state,
    showFreightDetails: isMobile ? !state.showFreightDetails : true
});

const clearUserParams = (state = CREATE_CONTRACT_STATE) => ({
    ...state,
    userParams: {
        charges: [{
            index: 0
        }],
        gst: 18
    }
});

const ACTION_HANDLERS = {
    [CreateContractTypes.SHOW_LOADING]: showLoadingReducer,
    [CreateContractTypes.HIDE_LOADING]: hideLoadingReducer,
    [CreateContractTypes.BILLING_CYCLE_LIST]: setBillingCycleList,
    [CreateContractTypes.CHARGES_LIST]: setFreightChargesList,
    [CreateContractTypes.USER_PARAMS]: setUserParams,
    [CreateContractTypes.CONTRACT_DETAILS]: setContractDetails,
    [CreateContractTypes.VARIABLE_LIST]: setFreightVariableList,
    [CreateContractTypes.CHARGE_TYPE]: setChargeTypeList,
    [CreateContractTypes.SHOW_CONTRACT_DETAILS]: showContractDetails,
    [CreateContractTypes.SHOW_FREIGHT_DETAILS]: showFreightDetails,
    [CreateContractTypes.CLEAR_USER_PARAMS]: clearUserParams,

}

export default createReducer(CREATE_CONTRACT_STATE, ACTION_HANDLERS);