export interface OnTimeDispatchReportState {
    openFilter: boolean,
    selectedItem: OnTimeDispatchReport | undefined,
    pagination: any,
    listData: Array<OnTimeDispatchReport> | undefined,
    openModal: boolean,
    currentPage: number,
    refresh_list: boolean,
    searchQuery: string,
    pageSize: number,
    filterParams: any,
    filterChips: any,
}

export interface OnTimeDispatchReport {
    date: string,
    vehicleNumber: string,
    location: string,
    laneCode: string,
    lane: string,
    vehicleType: string
    freightType: string
}