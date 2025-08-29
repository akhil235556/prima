export interface PartnerState {
    openPartnerModal: boolean,
    refreshList: boolean,
    pagination: any,
    listData: Array<PartnerDetails> | undefined,
    selectedElement: Object | undefined,
    currentPage: number,
    pageSize: number,
    loading: boolean,
    filterParams: any,
    filterChips: any,
    openFilter: boolean,
}
export interface PartnerDetails {
    id: number,
    name: string,
    code: string,
    email: string,
    phoneNumber: string,
    companyName: string,
    address: string
}