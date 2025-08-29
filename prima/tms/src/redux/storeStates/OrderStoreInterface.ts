export interface OrderState {
    openFilter: boolean,
    selectedItem: Order | undefined,
    pagination: any,
    listData: Array<Order> | undefined,
    currentPage: number,
    openModal: boolean
    loading: boolean
    openCancelModal: boolean
    pageSize: number,
    filterParams: any,
    filterChips: any,
    refreshList: boolean,
    openPointModal: boolean,
    openBulkUpload: boolean
}

export interface Order {
    vehicle_number: string,
    transporter: string,
    origin: string,
    destination: string,
    vehicle_type: string,
    driver_info: string,
    status: string
    laneCode: string
}