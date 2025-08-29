import { OptionType } from "../../component/widgets/widgetsInterfaces";

export interface RaiseIndentState {
    partnerList: Array<OptionType> | undefined,
    laneList: Array<OptionType> | undefined,
    freightTypeList: Array<OptionType> | undefined,
    originSuggestion: Array<OptionType> | undefined,
    destinationSuggestion: Array<OptionType> | undefined,
    userParams: any,
    loading: boolean,
    openModal: boolean,
    autoSelected: boolean,
    showOrderDetails: boolean,
    error: any,
    shipmentDeatils: any,
    openBulkUpload: boolean,
    zoneEnabled: boolean | null
}