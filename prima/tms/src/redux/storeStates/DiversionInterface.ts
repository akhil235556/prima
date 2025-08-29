export interface DiversionState {
    openFilter: boolean,
    refreshList: boolean,
    openModal: boolean,
    loading: boolean,
    openPointModal: boolean,
    selectedTabIndex: number,
    selectedItem: any | undefined,
    pagination: any
    listData: Array<any> | undefined,
    currentPage: number,
    pageSize: number,
    searchQuery: string,
    filterParams: any,
    filterChips: any,
}