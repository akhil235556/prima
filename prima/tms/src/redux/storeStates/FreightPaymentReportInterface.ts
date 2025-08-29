export interface FreightPaymentReportState {
    openFilter: boolean,
    selectedItem: FreightPaymentReport | undefined,
    pagination: any,
    listData: Array<FreightPaymentReport> | undefined,
    openModal: boolean,
    currentPage: number,
    refresh_list: boolean,
    searchQuery: string,
    pageSize: number,
    filterChips: any,
    filterParams: any,
    dateType: any
}

export interface FreightPaymentReport {
    invoice: string,
    transporter: string,
    lane: string,
    date: string,
    laneCode: string,
    amount: string,
    status: string,
}