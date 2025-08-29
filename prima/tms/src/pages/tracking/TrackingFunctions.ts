import MomentUtils from '@date-io/moment';
import { Dispatch } from 'react';
import { convertDateFormat, trackingDisplayDateFormatter } from '../../base/utility/DateUtils';
import { OptionType } from "../../component/widgets/widgetsInterfaces";
import { createLocationObject } from '../../moduleUtility/DataUtils';
import { setMapRouteDetails, setUnsuccessCount, setMapRoutePolyline } from '../../redux/actions/TrackingActions';
import { addTripWayPoint } from '../../serviceActions/TrackingServiceActions';
// import { waypointsDataUrl } from '../../base/api/ServiceUrl';

async function addTripWayPoints(entityList: any, dispatcher: Dispatch<any>, appDispatch: any, tripId: any) {
    dispatcher(setUnsuccessCount());
    let unSuccessList: Array<OptionType> = [...entityList];
    if (entityList && entityList.length > 0) {
        for (let index = 0; index < entityList.length; index++) {
            const element = entityList[index];
            let body = {
                "waypoint": createLocationObject(element.data)
            }
            const response = await appDispatch(addTripWayPoint(tripId, body))
            // check Is not success
            if (!response) {
                let newUnSuccessList = unSuccessList.filter((element: any, innerIndex: number) => innerIndex >= index);
                unSuccessList = newUnSuccessList;
                return unSuccessList;
            }
        }
    }
    return Promise.resolve(undefined);
}


function CreateEtaRequestOriginAndDestination(params: any) {
    return {
        latitude: params && params.latitude,
        longitude: params && params.longitude,
        address: params && params.address,
    }
}

function CreateEtaRequestCurrentLocation(params: any) {
    return {
        latitude: params && params.latitude,
        longitude: params && params.longitude,
        address: params && params.address,
    }

}

function CreateEtaRequestWayPoints(params: any) {
    let response = params && params.map((element: any) => ({
        latitude: element.latitude,
        longitude: element.longitude,
        address: element.address,
    }))
    response.shift();
    response.pop();
    return JSON.stringify(response);
}

// TODO (see this)

function createTrackingDetailsEtaData(origin: any, startDate: any, destination: any, waypoints: any, wayPointsDetails: any, currentLocationInfo: any, currentPointEtaDetails: any) {
    let formattedData: any = []
    formattedData.push({
        name: origin && origin.name,
        date: convertDateFormat(startDate, trackingDisplayDateFormatter),
        distanceFromOrigin: 0,
        isCurrent: false,
    });

    let timeGap = 0;
    let distanceFromOrigin = 0;
    let isCurrentAdded = false;

    waypoints && waypoints.map((element: any, index: number) => {
        timeGap = timeGap + ((wayPointsDetails && wayPointsDetails.eta && wayPointsDetails.eta[index].value) || 0);
        distanceFromOrigin = timeGap + ((wayPointsDetails && wayPointsDetails.distance && wayPointsDetails.distance[index].value) || 0);
        // isCurrentAdded = checkIsCurrent(element, currentPointEtaDetails);
        formattedData.push({
            name: element.name,
            date: convertDateFormat(new MomentUtils().date(startDate).add(timeGap, 'seconds'), trackingDisplayDateFormatter),
            distanceFromOrigin: distanceFromOrigin,
            isCurrent: false,
        });

        return true;
    });





    formattedData.push({
        name: destination.name,
        date: convertDateFormat(new MomentUtils().date(startDate)
            .add(timeGap + (wayPointsDetails && wayPointsDetails.eta && wayPointsDetails.eta.length > 0 && wayPointsDetails.eta[wayPointsDetails.eta.length - 1].value), "seconds"), trackingDisplayDateFormatter),
        distanceFromOrigin: distanceFromOrigin + wayPointsDetails && wayPointsDetails.distance && wayPointsDetails.distance.length > 0 && wayPointsDetails.distance[wayPointsDetails.distance.length - 1].value,
        isCurrent: false,
    });

    if (!isCurrentAdded && currentLocationInfo) {
        let isCurrentAdded = false;

        formattedData = formattedData.filter((element: any) => {
            let distance = element.distanceFromOrigin - currentPointEtaDetails.distance[0].value;
            if (Math.abs(distance) <= 500) {
                console.log("Match Found" + JSON.stringify(element));

                element.isCurrent = true;
                isCurrentAdded = true;
            }
            return element;
        });
        console.log("is current added" + isCurrentAdded);

        !isCurrentAdded && formattedData.push({
            name: currentLocationInfo.address,
            date: convertDateFormat(currentLocationInfo.timeStamp, trackingDisplayDateFormatter),
            distanceFromOrigin: currentPointEtaDetails.distance[0].value,
            isCurrent: true,
        });
    }

    return formattedData.sort((firstElement: any, secondElement: any) => { return firstElement.distanceFromOrigin - secondElement.distanceFromOrigin });
}


function createTrackingWayPointsList(origin: any, destination: any, waypoints: any) {

    let formattedData: any = []
    formattedData.push({
        address: origin && origin.address,
        notStarted: "Trip Not started yet",
        isCurrent: false,
    });
    // eslint-disable-next-line
    let localWayPoint = waypoints && waypoints.filter((item: any, index: any) => {
        if (index !== 0) {
            return item
        }
    });
    localWayPoint && localWayPoint.map((element: any, index: number) => {
        formattedData.push({
            address: element.address,
        });
        return true;
    });
    return { vehicleGpsInfo: formattedData };
}



function convertMinutesInHours(mins: any) {
    let totalMin = Number(mins);
    var h = Math.floor(totalMin / 60);
    var m = Math.floor(totalMin % 60);
    // var s = Math.floor(totalSec % 3600 % 60);

    var hDisplay = h > 0 ? h + (h === 1 ? " hr, " : " hrs, ") : "";
    var mDisplay = m > 0 ? m + (m === 1 ? " min " : " mins") : "";
    // var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";
    return hDisplay + mDisplay;
}

function convertSecondsInHours(secs: any) {
    let totalSec = Number(secs);
    var h = Math.floor(totalSec / 3600);
    var m = Math.floor(totalSec % 3600 / 60);
    // var s = Math.floor(totalSec % 3600 % 60);
    var hDisplay = h > 0 ? h + (h === 1 ? (m < 1 ? " hr " : " hr, ") : (m < 1 ? " hrs " : " hrs, ")) : "";
    var mDisplay = m > 0 ? m + (m === 1 ? " min " : " mins") : "";
    // var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";
    return hDisplay + mDisplay;
}

function convertMillisecondsInSecond(secs: any) {
    let totalSec = Number(secs);
    var sec = Math.floor(totalSec / 1000);

    return sec;
}

function calculateTotalTime(params: any, valueKey: string) {
    let totalTime = 0;
    params && params.map((element: any) => {
        totalTime += element[valueKey];
        return true;
    })
    return totalTime;
}
function calculateBarHeight(element: any, totalDistance: any) {
    try {
        let percentageValue = (element.distance.value * 100) / totalDistance;
        return !isNaN(percentageValue) ? (Number(percentageValue.toFixed(0)) + 50) : 50;
    } catch (error) {
        return 50;
    }
}

function drawRoute(origin: any, destination: any, wayPoint: any, dispatch: Dispatch<any>, currentLocation?: any,) {
    let currentLocationData = currentLocation && currentLocation.length > 0 && currentLocation[0];
    // eslint-disable-next-line
    let localWayPoint = wayPoint && wayPoint.filter((item: any, index: any) => {
        if (index !== 0 && index !== (wayPoint.length - 1)) {
            return item
        }
    })
    const DirectionsService = new google.maps.DirectionsService();
    const setWayPoints = () => {
        let waypoints: Array<any> = [];
        if (localWayPoint) {
            waypoints = localWayPoint && localWayPoint.map((element: any) => ({
                location: new google.maps.LatLng(element.latitude, element.longitude),
                stopover: true
            }))
        }
        currentLocationData && currentLocationData.latitude && currentLocationData.longitude &&
            waypoints.push({
                location: new google.maps.LatLng(currentLocationData.latitude, currentLocationData.longitude),
                stopover: false
            })
        return waypoints;
    };

    DirectionsService.route({
        origin: origin ? new google.maps.LatLng(origin.latitude, origin.longitude) : "",
        destination: origin ? new google.maps.LatLng(destination.latitude, destination.longitude) : "",
        waypoints: setWayPoints(),
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
    }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            dispatch(setMapRouteDetails(result));
        } else {
            dispatch(setMapRouteDetails(undefined));
        }
    });
}

function calculateTotalDistance(coveredDistance: any, remainingDistance: any) {
    let covered = ((coveredDistance && coveredDistance) || 0);
    let remaining = ((remainingDistance && remainingDistance) || 0);
    let total = covered + remaining;
    return total > 0 ? total : 1;

}

function getPolyLinePath(encode: any, dispatch: any, selectedElement: any) {
    var decode = google.maps.geometry.encoding.decodePath(encode);
    var temp_array: any = []
    decode.forEach((item: any) => {
        temp_array.push(item.toUrlValue(8))
    })
    var path_array = temp_array && temp_array.map((item: any) => {
        let valueArr = item.split(',')
        return {
            lat: Number(valueArr[0]),
            lng: Number(valueArr[1])
        }
    })
    dispatch(setMapRoutePolyline(path_array, selectedElement && selectedElement.locations))
}

export {
    addTripWayPoints,
    CreateEtaRequestOriginAndDestination,
    CreateEtaRequestWayPoints,
    createTrackingDetailsEtaData,
    convertSecondsInHours,
    createTrackingWayPointsList,
    CreateEtaRequestCurrentLocation,
    convertMillisecondsInSecond,
    calculateBarHeight,
    calculateTotalTime,
    drawRoute,
    calculateTotalDistance,
    convertMinutesInHours,
    getPolyLinePath
};
