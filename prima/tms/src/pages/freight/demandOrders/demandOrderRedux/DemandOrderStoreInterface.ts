export interface DemandOrderState {
    openFilter: boolean,
    refreshList: boolean,
    openModal: boolean,
    loading: boolean,
    openBulkUpload: boolean,
    selectedItem: any | undefined,
    pagination: any
    listData: Array<any> | undefined,
    currentPage: number,
    pageSize: number,
    searchQuery: string,
    filterParams: any,
    filterChips: any,
    selectedTabIndex: number | undefined,
}