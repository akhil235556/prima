export interface DispatchState {
    //showShipmentDetails: boolean | undefined;
    openFilter: boolean,
    refreshList: boolean,
    openModal: boolean,
    openBulkUpload: boolean,
    loading: boolean,
    openPointModal: boolean,
    selectedItem: any | undefined,
    pagination: any
    listData: Array<any> | undefined,
    currentPage: number,
    pageSize: number,
    searchQuery: string,
    filterParams: any,
    filterChips: any,
}

export interface DispatchDashboardState {
    filterParams: any,
    filterChips: any,
    openFilter: boolean,
    loading: boolean,
    chartData: any | undefined,
    dashboardCount: any,
    refreshList: boolean,
}