export interface AllPerformanceReportState {
    openFilter: boolean,
    selectedItem: AllPerformanceReport | undefined,
    pagination: any,
    listData: Array<AllPerformanceReport> | undefined,
    openModal: boolean,
    currentPage: number,
    refresh_list: boolean,
    searchQuery: string,
    pageSize: number,
    filterParams: any,
    filterChips: any,
}

export interface AllPerformanceReport {
    transporter: string,
    vehicleNumber: string,
    tat: string,
    lane: string,
    vehicleType: string,
    freightType: string,
    driverInfo: string,
    startedAt: string,
    reportedAt: string
}