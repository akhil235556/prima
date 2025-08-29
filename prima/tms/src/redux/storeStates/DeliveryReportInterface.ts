export interface DeliveryReportState {
    openFilter: boolean,
    selectedItem: DeliveryReport | undefined,
    pagination: any,
    listData: Array<DeliveryReport> | undefined,
    openModal: boolean,
    currentPage: number,
    refresh_list: boolean,
    searchQuery: string,
    pageSize: number,
    filterParams: any,
    filterChips: any,
}

export interface DeliveryReport {
    transporter: string,
    delivered: number,
    dispatch: number,
    inTransit: number,
    undelivered: number,
    returnToOrigin: number,
}