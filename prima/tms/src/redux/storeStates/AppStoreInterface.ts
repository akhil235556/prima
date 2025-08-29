export interface AppState {
    drawerSate: boolean,
    successAlert: boolean,
    subDrawerSate: boolean,
    showLoader: boolean,
    showHomeSearch: boolean,
    showHomeFilter: boolean,
    openModal: boolean,
    isHomePage: boolean,
    alertMessage: string | undefined,
    disableActionButton: boolean,
    cityList: Array<City> | undefined,
    stateList: Array<any> | undefined,
    vehicleTypeList: Array<Vehicle> | undefined
    trackingAssetList: Array<any> | undefined
    locationList: Array<any> | undefined
    deviceDataList: Array<any> | undefined
    trackingVendorList: Array<any> | undefined,
    rolesList: Array<any> | undefined,
    permissionList: Array<any> | undefined,
    userInfo: any,
    notificationCount: number | undefined,
    refreshCount: boolean,
    okPressed: boolean,
    checkStartOrStop: boolean,
    sideNavigation: boolean
    menuSelectedIndex: number,
    menuElement: any,
    filterChips: any,
    filterParams: any
}

interface City {
    cityCode: string,
    cityName: string,
    createdAt: string,
    stateCode: string,
    id: number,
}

interface Vehicle {
    type: string,
    code: string,
    createdAt: string,
    createdBy: string,
    updatedAt: string,
    length: number,
    breadth: number,
    height: number,
    id: number,
}