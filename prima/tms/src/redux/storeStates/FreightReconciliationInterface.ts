export interface FreightReconciliationState {
    openFilter: boolean,
    loading: boolean,
    selectedItem: FreightReconciliation | undefined,
    pagination: any,
    listData: Array<FreightReconciliation> | undefined,
    openModal: boolean,
    currentPage: number,
    refresh_list: boolean,
    searchQuery: string,
    pageSize: number,
    filterParams: any,
    filterChips: any,
    openPointModal: boolean,
    defaultExpandRowIndex: any,
    refreshPeriodicList: boolean,
    orderDetails: any,
    aggregateDetails: any
}

export interface FreightReconciliation {
    vehicleNumber: string,
    transporter: string,
    lane: string | undefined,
    vehicleType: string,
    freightType: string
    status: string,
    laneCode: string
}