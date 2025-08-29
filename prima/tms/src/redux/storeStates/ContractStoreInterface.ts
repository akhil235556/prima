import { OptionType } from "../../component/widgets/widgetsInterfaces";

export interface ContractState {
    openBulkUpdate: boolean;
    openBulkUpload: boolean;
    openFilter: boolean,
    refreshList: boolean,
    loading: boolean,
    selectedItem: any | undefined,
    pagination: any,
    listData: Array<any> | undefined,
    openModal: boolean,
    currentPage: number,
    pageSize: number,
    openPointModal: boolean,
    filterParams: any,
    filterChips: any,
}

export interface ContractCreateState {
    partnerList: Array<OptionType> | undefined,
    laneList: Array<OptionType> | undefined,
    freightTypeList: Array<OptionType> | undefined,
    billingCycleList: Array<OptionType> | undefined,
    freightChargesList: Array<OptionType> | undefined,
    freightChargesType: Array<OptionType> | undefined,
    freightVariableList: Array<OptionType> | undefined,
    userParams: any,
    loading: boolean,
    showContractDetails: boolean,
    showFreightDetails: boolean,
    contractMode?: string,
}