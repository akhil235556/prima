export interface PlanningDashboardState {
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

export interface PlanningDispatchState {
    openFilter: boolean,
    openPlanningModal: boolean,
    selectedItem: any | undefined,
    pagination: any,
    listData: Array<any> | undefined,
    currentPage: number,
    openModal: boolean,
    openPointModal: boolean,
    pageSize: number,
    filterChips: any,
    loading: boolean,
    filterParams: any,
    refreshList: boolean
}

export interface PlanningDispatchHistoryState {
    openFilter: boolean,
    openPointModal: boolean,
    selectedItem: any | undefined,
    pagination: any,
    listData: Array<any> | undefined,
    currentPage: number,
    openModal: boolean,
    loading: boolean,
    refreshList: boolean,
    pageSize: number,
    checkedCount: number,
    filterParams: any,
    filterChips: any,
}

export interface PlanningHistoryState {
    openFilter: boolean,
    selectedItem: any | undefined,
    pagination: any,
    listData: Array<any> | undefined,
    currentPage: number,
    openModal: boolean,
    loading: boolean,
    refreshList: boolean,
    pageSize: number,
    checkedCount: number,
    filterParams: any,
    filterChips: any,
}

export interface CreatePlanState {
    openFilter: boolean,
    selectedItem: any | undefined,
    pagination: any,
    listData: Array<any>,
    currentPage: number,
    openModal: boolean,
    loading: boolean,
    refreshList: boolean,
    pageSize: number,
    checkedCount: number,
    filterParams: any,
    filterChips: any,
}

