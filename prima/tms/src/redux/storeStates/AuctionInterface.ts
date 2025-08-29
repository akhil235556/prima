export interface AuctionState {
    openFilter: boolean,
    openBulkUpload: boolean,
    selectedItem: any | undefined,
    pagination: any,
    listData: Array<Auction> | undefined,
    openModal: boolean,
    currentPage: number,
    searchQuery: string,
    pageSize: number,
    status: string,
    filterChips: any,
    filterParams: any,
    countData: any,
    refreshList: boolean,
    openLaneModal: boolean
}

export interface Auction {
    freightType: string
    laneCode: string
    vehicleType: string
    tat: string
    lanePrice: string
    remainingTime: string
    status: string
}