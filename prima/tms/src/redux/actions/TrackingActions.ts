import { OptionType } from "../../component/widgets/widgetsInterfaces";
import TrackingTypes from "../types/TrackingTypes";

export const setTrackingTripsList = (response: any) => ({
    type: TrackingTypes.TRACKING_TRIP_LIST,
    response
})

export const showCreateTripForm = () => ({
    type: TrackingTypes.SHOW_CREATE_TRIP_FORM,
})

export const showTripLoader = () => ({
    type: TrackingTypes.SHOW_TRIP_LOADER,
})

export const hideTripLoader = () => ({
    type: TrackingTypes.HIDE_TRIP_LOADER,
})

export const createTripOrigin = (value: any) => ({
    type: TrackingTypes.CREATE_TRIP_ORIGIN,
    value,
})

export const createTripDestination = (value: any) => ({
    type: TrackingTypes.CREATE_TRIP_DESTINATION,
    value,
})

export const createTripVehicleNumber = (value: any) => ({
    type: TrackingTypes.CREATE_TRIP_TRACKING_NUMBER,
    value,
})

export const createTripDriverName = (value: any) => ({
    type: TrackingTypes.CREATE_TRIP_DRIVER_NAME,
    value,
})

export const createTripDriverNumber = (value: any) => ({
    type: TrackingTypes.CREATE_TRIP_DRIVER_NUMBER,
    value,
})

export const createTripTat = (value: any) => ({
    type: TrackingTypes.CREATE_TRIP_TAT,
    value,
})

export const setLocationListResponse = (value: any) => ({
    type: TrackingTypes.LOCATION_LIST_RESPONSE,
    value,
})

export const openTripDetail = (value: boolean) => ({
    type: TrackingTypes.OPEN_TRIP_DETAIL,
    value,
})

export const addActiveToCard = (index: number) => ({
    type: TrackingTypes.ADD_ACTIVE_TO_CARD,
    index,
})

export const setSelectedTrip = (value: any) => ({
    type: TrackingTypes.SET_SELECTED_ELEMENT,
    value,
})
export const setETAloader = () => ({
    type: TrackingTypes.SET_ETA_LOADER,
})

export const hideETAloader = () => ({
    type: TrackingTypes.HIDE_ETA_LOADER,
})

export const setStoppageLoader = () => ({
    type: TrackingTypes.SET_STOPPAGE_LOADER,
})

export const hideStoppageLoader = () => ({
    type: TrackingTypes.HIDE_STOPPAGE_LOADER,
})

export const setTripWayPoints = (value: any) => ({
    type: TrackingTypes.SET_TRIP_WAY_POINTS,
    value,
});

export const setTripId = (value: any) => ({
    type: TrackingTypes.SET_TRIP_ID,
    value,
});
export const setTripUnsuccessWayPoints = (response: any, showRetryModel: boolean) => ({
    type: TrackingTypes.SET_UNSUCCESS_WAY_POINTS,
    response,
    showRetryModel,
});


export const setSelectedTripCurrentLocation = (response: any) => ({
    type: TrackingTypes.SET_TRIP_CURRENT_LOCATION,
    response,
});

export const setVehicleRunningStatus = (response: boolean) => ({
    type: TrackingTypes.VEHICLE_RUNNING_STATUS,
    response,
});


export const setRouteEtaDetails = (response: any) => ({
    type: TrackingTypes.SET_ROUTE_DETAILS,
    response,
});

export const setMapRouteDetails = (response: any) => ({
    type: TrackingTypes.SET_ROUTE_MAP_DETAILS,
    response,
});

export const setMapRoutePolyline = (path: any, locations: any) => ({
    type: TrackingTypes.SET_ROUTE_MAP_POLYLINE,
    path,
    locations
});

export const setRouteEtaDetailsFailure = () => ({
    type: TrackingTypes.SET_ROUTE_DETAILS_FAILURE,
});

export const openMobileMapView = () => ({
    type: TrackingTypes.OPEN_MOBILE_MAP_VIEW,
});

export const setStoppageDetails = (response: any) => ({
    type: TrackingTypes.SET_STOPPAGE_DETAILS,
    response,
});
export const resetTrackingFilter = () => ({
    type: TrackingTypes.RESET_TRACKING_FILTER,
});

export const setTrackingFilterApplied = (isApplied: boolean, params: any) => ({
    type: TrackingTypes.SET_TRACKING_FILTER,
    isApplied,
    params,
});
export const setTrackingFilterVehicleNumber = (value: string) => ({
    type: TrackingTypes.TRACKING_FILTER_VEHICLE_NUMBER,
    value,
});

export const setTrackingFilterOrigin = (value: OptionType) => ({
    type: TrackingTypes.TRACKING_FILTER_ORIGIN,
    value,
});
export const setTrackingFilterDestination = (value: OptionType) => ({
    type: TrackingTypes.TRACKING_FILTER_DESTINATION,
    value,
});
export const openTrackingFilter = () => ({
    type: TrackingTypes.OPEN_TRACKING_FILTER,
});
export const setTrackingFilterStatus = (value: OptionType) => ({
    type: TrackingTypes.SET_STATUS_FILTER,
    value,
});

export const setTatListResponse = (value: any) => ({
    type: TrackingTypes.SET_TAT_LIST,
    value,
})
export const createTripManualTat = (value: any) => ({
    type: TrackingTypes.SET_MANUAL_TAT,
    value,
});

export const setChipValue = (key: string, value: any) => ({
    type: TrackingTypes.SET_CHIP_VALUE,
    key,
    value,
});

export const clearFilterValue = (key: string) => ({
    type: TrackingTypes.CLEAR_FILTER,
    key,
});

export const setUnsuccessCount = () => ({
    type: TrackingTypes.SET_UNSUCCESS_COUNT,
});

export const refreshList = () => ({
    type: TrackingTypes.REFRESH_LIST,
});

export const setFilter = (chips: any, params: any) => ({
    type: TrackingTypes.TRACKING_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: TrackingTypes.REMOVE_FILTER,
    key
});

export const driverDetailsRefresh = () => ({
    type: TrackingTypes.DRIVER_DETAILS_REFRESH,
})

export const showGrabLocationForm = (value?: any) => ({
    type: TrackingTypes.SHOW_GRAB_LOCATION_FORM,
    value
})

export const refreshLocation = () => ({
    type: TrackingTypes.REFRESH_LOCATION,
});

export const setTrackingTripsListStartStop = (response: any) => ({
    type: TrackingTypes.TRACKING_TRIP_LIST_START_STOP,
    response
})