export interface MonthlyFreightState {
    openFilter: boolean,
    refreshList: boolean,
    loading: boolean,
    selectedItem: any | undefined,
    pagination: any,
    listData: Array<any> | undefined,
    openModal: boolean,
    currentPage: number,
    pageSize: number,
    openPointModal: boolean
    filterParams: any,
    filterChips: any,
}
