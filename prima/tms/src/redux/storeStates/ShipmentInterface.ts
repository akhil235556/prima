export interface ShipmentState {
    openFilter: boolean,
    selectedItem: any | undefined,
    pagination: any,
    listData: Array<any> | undefined,
    currentPage: number,
    openModal: boolean
    loading: boolean
    openCancelModal: boolean
    pageSize: number,
    filterParams: any,
    filterChips: any,
    refreshList: boolean,
    openPointModal: boolean,
}