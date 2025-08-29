export interface VehicleState {
    openFilter: boolean,
    openBulkUpload: boolean,
    selectedItem: Vehicle | undefined,
    pagination: any,
    listData: Array<Vehicle> | undefined,
    openModal: boolean,
    currentPage: number,
    refresh_list: boolean,
    loading: boolean,
    searchQuery: string,
    pageSize: number,
    filterParams: any,
    filterChips: any,
}

export interface Vehicle {
    vehicleNumber: string,
    vehicleCode: string,
    addVehicleArr: any,
    vehicleTypeId: string | undefined,
    partnerCode?: string,
    partnerName?: string,
    rcNumber?: string,
    pucNumber?: string,
    trackingAssetId?: number | null,
    id?: number,
    isDedicated?: string,
    node?: string,

}