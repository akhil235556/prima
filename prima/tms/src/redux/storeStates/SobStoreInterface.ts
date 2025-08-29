export interface SobState {
    openFilter: boolean,
    refreshList: boolean,
    selectedItem: any | undefined,
    pagination: any,
    listData: Array<any> | undefined,
    openModal: boolean,
    currentPage: number,
    pageSize: number,
    openPointModal: boolean,
    loading: boolean,
    filterParams: any,
    filterChips: any,
}