export interface FreightState {
    openFilter: boolean,
    refreshList: boolean,
    selectedItem: any | undefined,
    pagination: any,
    listData: Array<any> | undefined,
    openModal: boolean,
    currentPage: number,
    pageSize: number,
    loading: boolean,
    openPointModal: boolean,
    filterParams: any,
    filterChips: any,
}
