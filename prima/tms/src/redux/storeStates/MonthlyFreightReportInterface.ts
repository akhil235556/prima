export interface MonthlyFreightReportState {
    openFilter: boolean,
    selectedItem: MonthlyFreightReport | undefined,
    pagination: any,
    listData: Array<MonthlyFreightReport> | undefined,
    openModal: boolean,
    currentPage: number,
    refresh_list: boolean,
    searchQuery: string,
    pageSize: number,
    filterChips: any,
    filterParams: any
}

export interface MonthlyFreightReport {
    name: string,
    transporter: string,
    laneCode: string,
    lane: string,
    vehicleType: string,
    freightType: string
}