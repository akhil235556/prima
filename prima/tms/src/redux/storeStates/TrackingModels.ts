import { OptionType } from "../../component/widgets/widgetsInterfaces";

export interface TrackingState {
    showCRForm: boolean,
    showMobileMapView: boolean,
    isFilterChange: boolean,
    unableToFetchEta: boolean,
    showRetryModel: boolean,
    isVehicleRunning: boolean,
    unSuccessWayPoints: any,
    selectedTripCurrentLocation: any,
    tripList: Array<any> | undefined,
    tripEtaDetails: Array<any> | undefined,
    locationList: Array<any> | undefined,
    createTripOrigin: OptionType | null,
    createTripDestination: OptionType | null,
    createTripVehicleNumber: string | undefined,
    createTripDriverName: string | undefined,
    createTripDriverNumber: string | undefined,
    createTripTAT: OptionType | null,
    showTripDetail: boolean,
    tripWayPoints: any,
    tripId: any,
    selectedElement: TripDetails | undefined
    delayStatus: undefined | any
    tripTotalDistance: any,
    stoppageList: any | undefined
    stoppageTime: any
    directions: any
    path: any
    locationArray: any
    appliedFilter: {
        filterVehicleNumber: string | null
        filterOrigin: OptionType | null
        filterDestination: OptionType | null
        status: OptionType | null
    },
    appliedFilterParams: any,
    isFilterApplied: boolean,
    showFilter: boolean,
    tatList: Array<any> | undefined,
    createTripManualTat: number | undefined,
    unSuccessCount: number,
    refreshList: boolean,
    filterParams: any,
    filterChips: any,
}


export interface TripDetails {
    tripId: string,
    status: string,
    origin: {
        name: string,
        lat: any,
        long: any,
        code: string
    },
    destination: {
        name: string,
        lat: any,
        long: any,
        code: string
    },
    driver: {
        number: string,
        name: string
    },
    vehicleNumber: string,
    tripCode?: string,
    tat: string,
    startTime: string,
    endTime: string,
    created: string,
    customerManaged: string,
    transporter?: any,
    waypoints?: any,
    taggedLocations?: any,
}
