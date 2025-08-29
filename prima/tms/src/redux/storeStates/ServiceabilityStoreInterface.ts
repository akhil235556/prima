export interface ServiceabilityState {
    openModal: boolean,
    openPointsModal: boolean,
    openBulkUpload: boolean,
    refreshList: boolean,
    pagination: any,
    listData: Array<ServiceabilityDetails> | undefined,
    selectedElement: any | undefined,
    currentPage: number,
    pageSize: number,
    loading: boolean,
    filterParams: any,
    filterChips: any,  
    openFilter: boolean,
}
export interface ServiceabilityDetails {
    id: number,
    name: string,
    code: string,
    email: string,
    phoneNumber: string,
    companyName: string,
    address: string
}