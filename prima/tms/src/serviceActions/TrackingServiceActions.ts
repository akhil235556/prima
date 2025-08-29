import { Dispatch } from 'redux';
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { drawRoute, getPolyLinePath } from '../pages/tracking/TrackingFunctions';
import { hideETAloader, hideStoppageLoader, setRouteEtaDetails, setRouteEtaDetailsFailure, setStoppageDetails, setStoppageLoader, setVehicleRunningStatus } from '../redux/actions/TrackingActions';
import { tracking } from '../services';


export const getTripList = (params?: any): any => async (appDispatch: Dispatch) => {
    return tracking.getTrips(params).then((responseAxios: any) => {
        return responseAxios.details;
    }).catch((error) => {
        handleApiError(error.message, appDispatch)
    });
};

export const getTripListCount = (params?: any): any => async (appDispatch: Dispatch) => {
    return tracking.getTripListCount(params).then((responseAxios: any) => {
        return responseAxios.details;
    }).catch((error) => {
        handleApiError(error.message, appDispatch)
    });
};

export const getUnknownCount = (params?: any): any => async (appDispatch: Dispatch) => {
    return tracking.getUnknownCount(params).then((responseAxios: any) => {
        return responseAxios.details;
    }).catch((error: any) => {
        handleApiError(error.message, appDispatch)
    });
};

export const getCsvLink = (params?: any): any => async (appDispatch: Dispatch) => {
    return tracking.getCsvLink(params).then((responseAxios: any) => {
        return responseAxios.details;
    }).catch((error) => {
        handleApiError(error.message, appDispatch)
    });
};

export const getTripDetail = (params?: any): any => async (appDispatch: Dispatch) => {
    return tracking.getTripDetail(params).then((responseAxios: any) => {
        return responseAxios.details;
    }).catch((error) => {
        handleApiError(error.message, appDispatch)
    });
};

export const createCustomerTrip = (params?: any): any => async (appDispatch: Dispatch) => {
    return tracking.createTrip(params).then((responseAxios: any) => {
        return responseAxios.details;
    }).catch((error) => {
        handleApiError(error.message, appDispatch);
    });
};

export const startCustomerTrip = (params: any): any => async (appDispatch: Dispatch) => {
    return tracking.startTrip(params).then((responseAxios: any) => {
        return responseAxios.details;
    }).catch((error) => {
        handleApiError(error.message, appDispatch);
    });
};


export const stopCustomerTrip = (params: any, queryParams: any): any => async (appDispatch: Dispatch) => {
    return tracking.stopTrip(params, queryParams).then((responseAxios: any) => {
        return responseAxios.details;
    }).catch((error: any) => {
        handleApiError(error.message, appDispatch);
    });
};
export const addTripWayPoint = (tripId: any, bodyParams: any) => async (appDispatch: Dispatch) => {
    return tracking.addTripWayPoints(tripId, bodyParams).then((responseAxios: any) => responseAxios.details)
        .catch((error) => {
            handleApiError(error.message, appDispatch);
        });
};

export const getVehicleStoppageList = (reduxDisPatch: any, bodyParams: any): any => async (appDispatch: Dispatch) => {
    reduxDisPatch(setStoppageLoader());
    tracking.getStoppageList(bodyParams).then((responseAxios: any) => {
        reduxDisPatch(setStoppageDetails(responseAxios && responseAxios.details && responseAxios.details.vehicleStop));
        reduxDisPatch(hideStoppageLoader());
    }).catch((error) => {
        handleApiError(error.message, appDispatch);
        reduxDisPatch(setStoppageDetails(undefined));
        reduxDisPatch(hideStoppageLoader());
    });
};

export const getVehicleCurrentLocation = (vehicleNumber: any,): any => async (appDispatch: Dispatch) => {
    return tracking.getCurrentLocation(vehicleNumber).then((responseAxios) => responseAxios)
        .catch((error) => {
            handleApiError(error.message, appDispatch);
        });
};

export const getRoutePolyline = (params: any): any => async (appDispatch: Dispatch) => {
    return tracking.getRoutePolyline(params).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            // handleApiError(error.message, appDispatch);
        });
};

export const getTripEtaDetails = (reduxDisPatch: any, params: any, vehicleCode: any, selectedElement: any, polyline: boolean, path? : any): any => async (appDispatch: Dispatch) => {
    tracking.getTripEta(params).then((responseAxios: any) => {
        reduxDisPatch(setRouteEtaDetails(responseAxios.details));
        polyline ? getPolyLinePath(path, reduxDisPatch, selectedElement) :
        drawRoute(selectedElement.locations[0], selectedElement.locations[selectedElement.locations.length - 1], selectedElement.locations, reduxDisPatch,
            responseAxios && responseAxios.details && responseAxios.details.vehicleGpsInfo.filter((element: any) => element.currentVehicleLocation));
        return tracking.getVehicleStatus(vehicleCode);
    }).then((responseAxios: any) => {
        reduxDisPatch(hideETAloader());
        reduxDisPatch(setVehicleRunningStatus(responseAxios && responseAxios.details && responseAxios.details.stop));
    }).catch((error) => {
        reduxDisPatch(hideETAloader());
        handleApiError(error.message, appDispatch);
        reduxDisPatch(setRouteEtaDetailsFailure());
        drawRoute(selectedElement.locations[0], selectedElement.locations[selectedElement.locations.length - 1], selectedElement.locations, reduxDisPatch);
    });
};

export const getVehicleRunningStatus = (reduxDisPatch: any, vehicleNumber: any): any => async (appDispatch: Dispatch) => {
    tracking.getVehicleStatus(vehicleNumber).then((responseAxios: any) => {
        reduxDisPatch(setVehicleRunningStatus(responseAxios && responseAxios.details && responseAxios.details.stop));
        reduxDisPatch(hideETAloader());
    }).catch((error) => {
        reduxDisPatch(hideETAloader());
        handleApiError(error.message, appDispatch);
        reduxDisPatch(setVehicleRunningStatus(false));
        reduxDisPatch(setRouteEtaDetailsFailure());
    });
};
export const getDriverConsent = (params: any): any => async (appDispatch: Dispatch) => {
    return tracking.DriverConsent(params).then((responseAxios: any) => {
        return responseAxios
    }).catch((error) => {
        handleApiError(error.message, appDispatch);
    });
};

export const getTat = (params: any): any => async (dispatch: Dispatch) => {
    return tracking.getSpecificTat(params).then((responseAxios: any) => {
        return responseAxios.details;
    }).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const createTrip = (params: any): any => async (dispatch: Dispatch) => {
    return tracking.createTrip(params).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const transientCount = (params?: any): any => async (dispatch: Dispatch) => {
    return tracking.transientCount(params).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const editDriverDetails = (params: any): any => async (dispatch: Dispatch) => {
    return tracking.editDriverDetails(params).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const pushLocation = (params?: any): any => async (appDispatch: Dispatch) => {
    return tracking.pushLocation(params).then((responseAxios: any) => {
        return responseAxios;
    }).catch((error: any) => {
        handleApiError(error.message, appDispatch)
    });
};
