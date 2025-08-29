export interface InboundState {
    openFilter: boolean,
    openModal: boolean,
    refreshList: boolean,
    loading: boolean,
    openPointModal: boolean,
    selectedItem: any | undefined,
    pagination: any
    listData: Array<any> | undefined,
    currentPage: number,
    pageSize: number,
    filterParams: any,
    filterChips: any,
}