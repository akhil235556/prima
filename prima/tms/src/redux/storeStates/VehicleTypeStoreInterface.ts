export interface VehicleTypeState {
    openFilter: boolean,
    openBulkUpload: boolean,
    selectedItem: any | undefined,
    pagination: any,
    listData: Array<VehicleType> | undefined,
    openModal: boolean,
    currentPage: number,
    refresh_list: boolean,
    loading: boolean,
    searchQuery: string,
    pageSize: number,
    filterParams: any,
    filterChips: any
}

export interface VehicleType {
    type: string,
    length: number | null,
    breadth: number | null,
    height: number | null,
    loadCapacity: number | null,
    volumeLoadCapacity: number | null
}