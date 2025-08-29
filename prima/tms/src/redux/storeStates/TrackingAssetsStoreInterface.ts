export interface TrackingAssetsState {
    openFilter: boolean,
    loading: boolean,
    refreshList: boolean,
    selectedItem: any | undefined,
    pagination: any,
    listData: Array<any> | undefined,
    openModal: boolean,
    currentPage: number,
    pageSize: number,
}

export interface TrackingAssets {
    deviceType: string,
    trackingVendor: string,
    deviceNumber: string,
    integrationName: string,
    username: string,
    password: string,
    accessToken: string,
}