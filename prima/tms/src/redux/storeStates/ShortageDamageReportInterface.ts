export interface ShortageDamageReportState {
    openFilter: boolean,
    selectedItem: ShortageDamageReport | undefined,
    pagination: any,
    listData: Array<ShortageDamageReport> | undefined,
    openModal: boolean,
    currentPage: number,
    refresh_list: boolean,
    searchQuery: string,
    pageSize: number,
    filterChips: any,
    filterParams: any
}

export interface ShortageDamageReport {
    transporter: string,
    vehicleNumber: string,
    laneCode: string,
    tat: string,
    lane: string,
    vehicleType: string,
    freightType: string,
    driverInfo: string,
    startedAt: string
}