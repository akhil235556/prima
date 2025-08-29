export interface ZoneState {
    openFilter: boolean,
    openBulkUpload: boolean,
    selectedItem: any | undefined,
    pagination: any,
    listData: Array<Zone> | undefined,
    openModal: boolean,
    currentPage: number,
    refresh_list: boolean,
    loading: boolean,
    searchQuery: string,
    pageSize: number,
    filterParams: any,
    filterChips: any
}

export interface Zone {
    type: string,
    length: number | null,
    breadth: number | null,
    height: number | null,
    loadCapacity: number | null,
    volumeLoadCapacity: number | null
}