import { OptionType } from "../../component/widgets/widgetsInterfaces";

export interface CreateAgnState {
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

export interface AgnCreateState {
    userParams: any,
    loading: boolean,
    showAgnDetails: boolean,
    showProductDetails: boolean,
    error: any,
}