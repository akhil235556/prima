import { createReducer } from "reduxsauce";
import { calculateTotalDistance, calculateTotalTime } from "../../pages/tracking/TrackingFunctions";
// import { TrackingState } from '../storeStates/TrackingModels';
import TrackingTypes from "../types/TrackingTypes";

export const TRACKING_INIT_STATE: any = {
    showCRForm: false,
    showGLForm: false,
    showMobileMapView: false,
    isFilterChange: false,
    showTripDetail: false,
    isVehicleRunning: true,
    showRetryModel: false,
    tripList: undefined,
    locationList: undefined,
    createTripOrigin: null,
    createTripDestination: null,
    createTripVehicleNumber: undefined,
    createTripDriverName: undefined,
    createTripDriverNumber: undefined,
    createTripTAT: null,
    selectedElement: undefined,
    tripWayPoints: undefined,
    tripId: undefined,
    unSuccessWayPoints: undefined,
    selectedTripCurrentLocation: undefined,
    tripEtaDetails: undefined,
    delayStatus: undefined,
    unableToFetchEta: false,
    tripTotalDistance: 1,
    stoppageList: undefined,
    stoppageTime: undefined,
    directions: undefined,
    appliedFilter: {
        filterVehicleNumber: null,
        filterOrigin: null,
        filterDestination: null,
        status: null,
    },
    isFilterApplied: false,
    appliedFilterParams: undefined,
    showFilter: false,
    tatList: undefined,
    createTripManualTat: undefined,
    unSuccessCount: 0,
    refreshList: false,
    filterParams: {},
    filterChips: {},
    loadingETA: false,
    loadingStoppage: false,
    loadingTripList: false,
    refreshDriverDetails: false,
    path: undefined,
    locationArray: undefined,
    grabModalData: undefined,
    pagination: undefined,
}

const showCreateTripFormReducer = (state = TRACKING_INIT_STATE) => {
    if (!state.showCRForm) {
        return {
            ...state,
            showCRForm: !state.showCRForm
        }
    } else {
        return {
            ...state,
            showCRForm: !state.showCRForm,
            createTripOrigin: null,
            createTripDestination: null,
            createTripVehicleNumber: undefined,
            createTripDriverName: undefined,
            createTripDriverNumber: undefined,
            createTripTAT: undefined,
            tripWayPoints: undefined,
            tatList: undefined,
            createTripManualTat: undefined,
        }
    }

}

const openTripDetailReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        showTripDetail: action.value
    }
}

const trackingTripsListReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        // selectedElement: undefined,
        // directions: undefined, //CHECK
        // path: undefined,
        // locationArray: undefined,
        // selectedTripCurrentLocation: undefined, //CHECK
        tripList: (
            state.tripList ? (action.response && action.response.trips ? [...state.tripList, ...action.response && action.response.trips] : [...state.tripList])
                : action.response && action.response.trips),
        pagination: action && action.response && action.response.pagination,
    }
}

const createTripOriginReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        createTripOrigin: action.value
    }
}

const createTripDestinationReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        createTripDestination: action.value
    }
}

const createTripVehicleNumberReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        createTripVehicleNumber: (action.value && action.value.toUpperCase()) || action.value
    }
}

const createTripDriverNumberReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        createTripDriverNumber: action.value
    }
}

const createTripDriverNameReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        createTripDriverName: action.value
    }
}

const createTripTatReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        createTripTAT: action.value
    }
}

const setLocationListResponseReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        locationList: action.value
    }
}

const setSelectedElementReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        selectedElement: action.value,
        stoppageList: undefined,
        stoppageTime: undefined,
        tripEtaDetails: undefined,
        delayStatus: undefined,
        isVehicleRunning: true,
        unableToFetchEta: false,
        selectedTripCurrentLocation: undefined,
        tripTotalDistance: 1
    }
}

const addActiveToCardReducer = (state = TRACKING_INIT_STATE, action: any) => {
    let copyList = state.tripList;
    if (copyList && copyList.length > action.index) {
        copyList.map((element: any, index: number) => element.isActive = (index === action.index))
    }
    return {
        ...state,
        tripList: copyList
    }
}
const setTripWayPointsReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        tripWayPoints: action.value,
    }
}

const setTripIdReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        tripId: action.value
    }
}
const setUnsuccessWayPointsReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        unSuccessWayPoints: action.response,
        showRetryModel: action.showRetryModel,
    }
}

const setSelectedTripCurrentLocationReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        selectedTripCurrentLocation: action.response,
    }
}

const setVehicleRunningStatusReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        isVehicleRunning: !action.response,
    }
}
const setTrackingFilterVehicleNumberReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        appliedFilter: {
            ...state.appliedFilter,
            filterVehicleNumber: action.value
        }
    }
}


const setTrackingFilterOriginReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        appliedFilter: {
            ...state.appliedFilter,
            filterOrigin: action.value
        }
    }
}


const setTrackingFilterDestinationReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        appliedFilter: {
            ...state.appliedFilter,
            filterDestination: action.value
        }
    }
}

const setTrackingFilterAppliedReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        isFilterApplied: action.isApplied,
        appliedFilterParams: action.params,
        currentPage: 0,
    }
}

const resetTrackingFilterReducer = (state = TRACKING_INIT_STATE) => {
    return {
        ...state,
        currentPage: 0,
        appliedFilterParams: undefined,
        filterChips: undefined,
        appliedFilter: {
            filterVehicleNumber: null,
            filterOrigin: null,
            filterDestination: null,
            status: null

        }
    }
}

const openTrackingFilterReducer = (state = TRACKING_INIT_STATE) => {
    return { ...state, showFilter: !state.showFilter }
}
const setTrackingFilterStatusReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        appliedFilter: {
            ...state.appliedFilter,
            status: action.value
        }
    }
}
const setTatListResponseReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        tatList: action.value
    }
}

const createTripManualTatReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        createTripManualTat: action.value
    }
}

const setChipValueReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        filterChips: {
            ...state.filterChips,
            [action.key]: action.value
        }
    }
}

const setUnsuccessCountReducer = (state = TRACKING_INIT_STATE) => {
    return {
        ...state,
        unSuccessCount: state.unSuccessCount++,
    }
}

const setRefreshListReducer = (state = TRACKING_INIT_STATE) => {
    return {
        ...state,
        refreshList: !state.refreshList,
        currentPage: 1,
        tripList: undefined,
        pagination: undefined,
        selectedElement: undefined,
    }
}

const etaLoaderReducer = (state = TRACKING_INIT_STATE) => {
    return {
        ...state,
        loadingETA: true,
    }
}

const hideEtaLoaderReducer = (state = TRACKING_INIT_STATE) => {
    return {
        ...state,
        loadingETA: false,
    }
}

const stoppageLoaderReducer = (state = TRACKING_INIT_STATE) => {
    return {
        ...state,
        loadingStoppage: true,
    }
}

const hideStoppageLoaderReducer = (state = TRACKING_INIT_STATE) => {
    return {
        ...state,
        loadingStoppage: false,
    }
}
const showTripLoaderReducer = (state = TRACKING_INIT_STATE) => {
    return {
        ...state,
        loadingTripList: true,
    }
}
const hideTripLoaderReducer = (state = TRACKING_INIT_STATE) => {
    return {
        ...state,
        loadingTripList: false,
    }
}


const clearFilterValueReducer = (state = TRACKING_INIT_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];
    let isFilterChange = state.appliedFilterParams && action.key in state.appliedFilterParams;
    state.appliedFilterParams && state.appliedFilterParams[action.key] && delete state.appliedFilterParams[action.key];
    let appliedFilter = state.appliedFilter;
    switch (action.key) {
        case "originCode":
            appliedFilter = {
                ...appliedFilter,
                filterOrigin: null,
            };
            break;

        case "destinationCode":
            appliedFilter = {
                ...appliedFilter,
                filterDestination: null,
            };
            break;


        case "trackingTransientStatus":
            appliedFilter = {
                ...appliedFilter,
                status: null,
            };
            break;
        case "vehicleNumber":
            appliedFilter = {
                ...appliedFilter,
                filterVehicleNumber: null,
            };
            break;
    }
    return {
        ...state,
        isFilterChange: isFilterChange,
        appliedFilterParams: state.appliedFilterParams,
        appliedFilter: appliedFilter,
    }
}

const setFilterReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        filterChips: action.chips,
        filterParams: action.params,
        currentPage: 1,
        tripList: undefined,
        pagination: undefined,
    }
};

const removeFilterReducer = (state = TRACKING_INIT_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];
    switch (action.key) {
        case "originCode":
            delete state.filterParams["originCode"]
            delete state.filterParams["originName"]
            delete state.filterParams["origin"]
            break;
        case "destinationCode":
            delete state.filterParams["destinationCode"]
            delete state.filterParams["destinationName"]
            delete state.filterParams["destination"]
            break;
        case "vehicleCode":
            delete state.filterParams["vehicle"]
            delete state.filterParams["vehicleNumber"]
            delete state.filterParams["vehicleCode"]
            break;
        case "vehicleTypeCode":
            delete state.filterParams["vehicleTypeName"]
            delete state.filterParams["vehicleTypeCode"]
            break;
        case "fromDate":
            delete state.filterParams["fromDate"]
            delete state.filterParams["toDate"]
            delete state.filterChips["toDate"]
            break;
        case "toDate":
            delete state.filterParams["fromDate"]
            delete state.filterChips["fromDate"]
            delete state.filterParams["toDate"]
            break;
        case "transientStatus":
            delete state.filterParams["transientStatus"]
            break;
        case "consentStatus":
            delete state.filterParams["consentStatus"]
            break;
        case "freightType":
            delete state.filterParams["freightType"]
            break;
    }
    return {
        ...state,
        filterChips: state.filterChips,
        filterParams: state.filterParams,
        currentPage: 1,
        tripList: undefined,
        pagination: undefined,
        refreshList: !state.refreshList,
    }
};

const setRouteEtaDetailsReducer = (state = TRACKING_INIT_STATE, action: any) => {

    return {
        ...state,
        tripEtaDetails: action.response && action.response.vehicleGpsInfo,
        delayStatus: action.response && action.response.delay,
        selectedTripCurrentLocation: action.response && action.response.vehicleGpsInfo && action.response.vehicleGpsInfo.filter((element: any) => element.currentVehicleLocation),
        unableToFetchEta: false,
        tripTotalDistance: calculateTotalDistance((action.response && action.response.coveredDistance), (action.response && action.response.remainingDistance)),
    }
}

const setFailureRouteEtaDetailsReducer = (state = TRACKING_INIT_STATE) => {
    return {
        ...state,
        tripEtaDetails: undefined,
        delayStatus: undefined,
        isVehicleRunning: true,
        unableToFetchEta: true,
        selectedTripCurrentLocation: undefined,
        tripTotalDistance: 1
    }
}

const openMobileMapViewReducer = (state = TRACKING_INIT_STATE) => {
    return {
        ...state,
        showMobileMapView: !state.showMobileMapView,
    }
}

const setMapRouteDetailsReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        directions: action.response,
        path: undefined
    }
}

const setMapRoutePolylineReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        path: action.path,
        locationArray: action.locations,
        directions: undefined
    }
}


const setStoppageDetailsReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        stoppageList: action.response,
        stoppageTime: calculateTotalTime(action.response, "duration")
    }
}

const driverDetailsReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        refreshDriverDetails: !state.refreshDriverDetails
    }
}

const showGrabLocationFormReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        showGLForm: !state.showGLForm,
        grabModalData: action.value
    }
}

const refreshLocationReducer = (state = TRACKING_INIT_STATE) => {
    return {
        ...state,
        refreshLocation: !state.refreshLocation
    }
}

const trackingTripsListStartStopReducer = (state = TRACKING_INIT_STATE, action: any) => {
    return {
        ...state,
        selectedElement: undefined,
        directions: undefined,
        path: undefined,
        locationArray: undefined,
        selectedTripCurrentLocation: undefined,
        tripList: action.response.trips,
        refreshDriverDetails: !state.refreshDriverDetails
    }
}

const ACTION_HANDLERS = {
    [TrackingTypes.TRACKING_TRIP_LIST]: trackingTripsListReducer,
    [TrackingTypes.SHOW_CREATE_TRIP_FORM]: showCreateTripFormReducer,
    [TrackingTypes.CREATE_TRIP_ORIGIN]: createTripOriginReducer,
    [TrackingTypes.CREATE_TRIP_DESTINATION]: createTripDestinationReducer,
    [TrackingTypes.LOCATION_LIST_RESPONSE]: setLocationListResponseReducer,
    [TrackingTypes.CREATE_TRIP_TRACKING_NUMBER]: createTripVehicleNumberReducer,
    [TrackingTypes.CREATE_TRIP_DRIVER_NAME]: createTripDriverNameReducer,
    [TrackingTypes.CREATE_TRIP_DRIVER_NUMBER]: createTripDriverNumberReducer,
    [TrackingTypes.CREATE_TRIP_TAT]: createTripTatReducer,
    [TrackingTypes.OPEN_TRIP_DETAIL]: openTripDetailReducer,
    [TrackingTypes.ADD_ACTIVE_TO_CARD]: addActiveToCardReducer,
    [TrackingTypes.SET_SELECTED_ELEMENT]: setSelectedElementReducer,
    [TrackingTypes.SET_TRIP_WAY_POINTS]: setTripWayPointsReducer,
    [TrackingTypes.SET_TRIP_ID]: setTripIdReducer,
    [TrackingTypes.SET_UNSUCCESS_WAY_POINTS]: setUnsuccessWayPointsReducer,
    [TrackingTypes.SET_TRIP_CURRENT_LOCATION]: setSelectedTripCurrentLocationReducer,
    [TrackingTypes.VEHICLE_RUNNING_STATUS]: setVehicleRunningStatusReducer,
    [TrackingTypes.SET_ROUTE_DETAILS]: setRouteEtaDetailsReducer,
    [TrackingTypes.SET_ROUTE_DETAILS_FAILURE]: setFailureRouteEtaDetailsReducer,
    [TrackingTypes.OPEN_MOBILE_MAP_VIEW]: openMobileMapViewReducer,
    [TrackingTypes.SET_STOPPAGE_DETAILS]: setStoppageDetailsReducer,
    [TrackingTypes.SET_ROUTE_MAP_DETAILS]: setMapRouteDetailsReducer,
    [TrackingTypes.SET_ROUTE_MAP_POLYLINE]: setMapRoutePolylineReducer,
    [TrackingTypes.TRACKING_FILTER_VEHICLE_NUMBER]: setTrackingFilterVehicleNumberReducer,
    [TrackingTypes.TRACKING_FILTER_ORIGIN]: setTrackingFilterOriginReducer,
    [TrackingTypes.TRACKING_FILTER_DESTINATION]: setTrackingFilterDestinationReducer,
    [TrackingTypes.SET_TRACKING_FILTER]: setTrackingFilterAppliedReducer,
    [TrackingTypes.RESET_TRACKING_FILTER]: resetTrackingFilterReducer,
    [TrackingTypes.OPEN_TRACKING_FILTER]: openTrackingFilterReducer,
    [TrackingTypes.SET_STATUS_FILTER]: setTrackingFilterStatusReducer,
    [TrackingTypes.SET_TAT_LIST]: setTatListResponseReducer,
    [TrackingTypes.SET_MANUAL_TAT]: createTripManualTatReducer,
    [TrackingTypes.SET_CHIP_VALUE]: setChipValueReducer,
    [TrackingTypes.CLEAR_FILTER]: clearFilterValueReducer,
    [TrackingTypes.SET_UNSUCCESS_COUNT]: setUnsuccessCountReducer,
    [TrackingTypes.REFRESH_LIST]: setRefreshListReducer,
    [TrackingTypes.TRACKING_FILTER]: setFilterReducer,
    [TrackingTypes.REMOVE_FILTER]: removeFilterReducer,
    [TrackingTypes.SET_ETA_LOADER]: etaLoaderReducer,
    [TrackingTypes.HIDE_ETA_LOADER]: hideEtaLoaderReducer,
    [TrackingTypes.SET_STOPPAGE_LOADER]: stoppageLoaderReducer,
    [TrackingTypes.HIDE_STOPPAGE_LOADER]: hideStoppageLoaderReducer,
    [TrackingTypes.SHOW_TRIP_LOADER]: showTripLoaderReducer,
    [TrackingTypes.HIDE_TRIP_LOADER]: hideTripLoaderReducer,
    [TrackingTypes.DRIVER_DETAILS_REFRESH]: driverDetailsReducer,
    [TrackingTypes.SHOW_GRAB_LOCATION_FORM]: showGrabLocationFormReducer,
    [TrackingTypes.REFRESH_LOCATION]: refreshLocationReducer,
    [TrackingTypes.TRACKING_TRIP_LIST_START_STOP]: trackingTripsListStartStopReducer,
}

export default createReducer(TRACKING_INIT_STATE, ACTION_HANDLERS);

