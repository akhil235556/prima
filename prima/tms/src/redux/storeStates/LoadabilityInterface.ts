export interface LoadabilityState {
    openFilter: boolean,
    selectedItem: Loadability | undefined,
    pagination: any,
    listData: Array<Loadability> | undefined,
    openModal: boolean,
    currentPage: number,
    refresh_list: boolean,
    searchQuery: string,
    pageSize: number,
    filterChips: any,
    filterParams: any
}

export interface Loadability {
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