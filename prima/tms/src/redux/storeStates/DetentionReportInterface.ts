export interface DetentionReportState {
    openFilter: boolean,
    selectedItem: DetentionReport | undefined,
    pagination: any,
    listData: Array<DetentionReport> | undefined,
    openModal: boolean,
    currentPage: number,
    refresh_list: boolean,
    searchQuery: string,
    pageSize: number,
    filterParams: any,
    filterChips: any,
}

export interface DetentionReport {
    transporter: string,
    vehicleNumber: string,
    tat: string,
    lane: string,
    laneCode: string,
    vehicleType: string,
    freightType: string,
    driverInfo: string,
    startedAt: string
}