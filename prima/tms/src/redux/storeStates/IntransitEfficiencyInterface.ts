export interface IntransitEfficiencyState {
    openFilter: boolean,
    selectedItem: IntransitEfficiency | undefined,
    pagination: any,
    listData: Array<IntransitEfficiency> | undefined,
    openModal: boolean,
    currentPage: number,
    refresh_list: boolean,
    searchQuery: string,
    pageSize: number,
    filterParams: any,
    filterChips: any,
}

export interface IntransitEfficiency {
    date: string,
    vehicleNumber: string,
    laneCode: string,
    location: string,
    lane: string,
    vehicleType: string
    freightType: string
}