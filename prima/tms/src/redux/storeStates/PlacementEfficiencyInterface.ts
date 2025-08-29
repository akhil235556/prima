export interface PlacementEfficiencyState {
    openFilter: boolean,
    selectedItem: PlacementEfficiency | undefined,
    pagination: any,
    listData: Array<PlacementEfficiency> | undefined,
    openModal: boolean,
    currentPage: number,
    refresh_list: boolean,
    searchQuery: string,
    pageSize: number,
    filterParams: any,
    filterChips: any,
}

export interface PlacementEfficiency {
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