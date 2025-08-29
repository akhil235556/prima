export interface VehiclePlacementState {
    openFilter: boolean,
    selectedItem: VehiclePlacement | undefined,
    pagination: any,
    listData: Array<VehiclePlacement> | undefined,
    openModal: boolean,
    currentPage: number,
    refresh_list: boolean,
    searchQuery: string,
    pageSize: number,
    filterParams: any,
    filterChips: any,
}

export interface VehiclePlacement {
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