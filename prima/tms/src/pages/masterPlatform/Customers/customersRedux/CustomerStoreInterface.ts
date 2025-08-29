export interface CustomerState {
    openFilter: boolean,
    openBulkUpload: boolean,
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
export interface Customer {
    name: string,
    address: string,
    email: string,
    panNumber: string,
    phoneNumber: string,
    gstinNumber: string,
    companyName: string,
}