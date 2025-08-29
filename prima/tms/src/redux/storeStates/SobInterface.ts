export interface SobState {
    openFilter: boolean,
    selectedItem: Sob | undefined,
    pagination: any,
    listData: Array<Sob> | undefined,
    openModal: boolean,
    currentPage: number,
    refresh_list: boolean,
    searchQuery: string,
    pageSize: number,
    filterParams: any,
    filterChips: any,
}

export interface Sob {
    transporter: string,
    vehicleNumber: string,
    tat: string,
    lane: string,
    laneCode: string,
    vehicleType: string,
    freightType: string,
    driverInfo: string,
    startedAt: string,
    filterParams: any,
    filterChips: any,
}