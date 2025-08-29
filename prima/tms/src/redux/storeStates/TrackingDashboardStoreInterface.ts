export interface TrackingDashboardTypeState {
    openFilter: boolean,
    selectedItem: any | undefined,
    pagination: any,
    listData: Array<TrackingDashboardType> | undefined,
    openModal: boolean,
    currentPage: number,
    searchQuery: string,
    pageSize: number,
    status: string,
    filterChips: any,
    filterParams: any,
    countData: any,
    refreshList: boolean
}

export interface TrackingDashboardType {
    vehicleNumber: string
    origin: string
    driverInfo: string
    tat: string
    transientStatus: string
    delayDuration: string
    startedAt: string
    customerRefNumber: string
}