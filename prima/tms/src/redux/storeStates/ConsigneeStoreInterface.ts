export interface ConsigneeState {
    openFilter: boolean,
    openBulkUpload: boolean,
    openBulkUpdate: boolean,
    refreshList: boolean,
    loading: boolean,
    openCreateLocation: boolean,
    selectedItem: any,
    pagination: any
    listData: any,
    currentPage: number,
    pageSize: number,
    searchQuery: string,
    filterParams: any,
    filterChips: any,
}
export interface Consignee {
    name: string,
    address: string,
    email: string,
    panNumber: string,
    phoneNumber: string,
    gstinNumber: string,
    companyName: string,
    consigneeCode: string,
    secondaryPhoneNumber: Array<any>
    secondaryEmail: Array<any>
    createUser:boolean
}