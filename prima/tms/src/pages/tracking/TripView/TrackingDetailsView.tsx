import { WatchLaterOutlined, RoomSharp } from '@material-ui/icons';
import React, { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { tripsStatusEnum } from '../../../base/constant/ArrayList';
import VerticalLinearStepper from '../../../component/widgets/VerticalStepper';
import { hideLoader } from '../../../redux/actions/AppActions';
import { hideETAloader, setETAloader, setRouteEtaDetails, showGrabLocationForm } from '../../../redux/actions/TrackingActions';
import { getTripEtaDetails, getRoutePolyline } from '../../../serviceActions/TrackingServiceActions';
import {
    convertSecondsInHours, CreateEtaRequestOriginAndDestination, CreateEtaRequestWayPoints,
    createTrackingWayPointsList,
    drawRoute
} from '../TrackingFunctions';
import DetailSkeleton from '../trackingSkeleton/DetailSkeleton';
import { Context } from '../VehicleTracking';
import Button from '../../../component/widgets/button/Button';


function TrackingDetailsView() {
    const [state, dispatch] = useContext(Context);
    const { selectedElement } = state
    const appDispatch = useDispatch();

    useEffect(() => {
        const getTripData = async () => {
            dispatch(setETAloader());
            if (selectedElement && selectedElement.status === tripsStatusEnum.INTRANSIT) {
                var params: any = {
                    origin: CreateEtaRequestOriginAndDestination(selectedElement.locations[0]),
                    destination: CreateEtaRequestOriginAndDestination(selectedElement.locations[selectedElement.locations.length - 1]),
                    tat: selectedElement.tat,
                    startTripDateTime: selectedElement.tripStartTime,
                    vehicleCode: selectedElement.vehicleCode,
                }
                if (selectedElement.locations && selectedElement.locations.length > 0) {
                    params.wayPoints = CreateEtaRequestWayPoints(selectedElement.locations);
                }
                if (selectedElement.laneCode) {
                    let routeParams: any = {
                        tripCode: selectedElement.tripCode,
                        entityCode: selectedElement.laneCode
                    }
                    appDispatch(getRoutePolyline(routeParams)).then((responseAxios: any) => {
                        if (responseAxios && responseAxios.polyline) {
                            appDispatch(getTripEtaDetails(dispatch, params, selectedElement.vehicleCode, selectedElement, true, responseAxios.polyline))
                        } else {
                            appDispatch(getTripEtaDetails(dispatch, params, selectedElement.vehicleCode, selectedElement, false))
                        }
                    })
                } else {
                    appDispatch(getTripEtaDetails(dispatch, params, selectedElement.vehicleCode, selectedElement, false))
                }
            } else if (selectedElement.locations && selectedElement.locations.length > 0) {
                dispatch(setRouteEtaDetails(createTrackingWayPointsList(selectedElement.locations[0], selectedElement.locations[selectedElement.locations.length - 1], selectedElement.locations)));
                drawRoute(selectedElement.locations[0], selectedElement.locations[selectedElement.locations.length - 1], selectedElement.locations, dispatch);
                appDispatch(hideLoader());
                dispatch(hideETAloader());
            }
        };
        selectedElement && getTripData();
        const interval = setInterval(() => {
            selectedElement && getTripData();
        }, 180000);
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [selectedElement, state.refreshLocation]);

    return (
        <>
            {
                ((state.loadingETA) && <DetailSkeleton />) || (
                    (state.unableToFetchEta && (
                        <div className="stop-wrap location-not-found">
                            <div className="no-stoppages">
                                <img src="/images/location-not-found.png" alt="" />
                                <p>Tracking data not available</p>
                            </div>
                        </div>
                    )) || (
                        <>
                            < div className="tracking-container tracking-check">
                                {selectedElement && selectedElement.status === tripsStatusEnum.INTRANSIT &&
                                    <div className="status-btn-wrap">
                                        <button className={"status-btn btn " + (state.delayStatus && state.delayStatus.delay && " delay-status")}>
                                            {(state.delayStatus && state.delayStatus.delay) ? "Delayed" : " On Schedule"}</button>
                                        {state.delayStatus && state.delayStatus.delay && <span className="total-stat-time"><WatchLaterOutlined />
                                            {convertSecondsInHours(state.delayStatus.delayDuration)}</span>}
                                    </div>
                                }
                                {state.tripEtaDetails && <VerticalLinearStepper
                                    steps={state.tripEtaDetails}
                                    isDelayed={state.delayStatus}
                                    isRunning={state.isVehicleRunning}
                                    tripTotalDistance={state.tripTotalDistance}
                                />}
                            </div>
                        </>
                    )
                )
            }
            {
                selectedElement && selectedElement.status === 'INTRANSIT' && (
                    <>
                        <div className="grab-location-wrapp">
                            <p className="or-text">Or</p>
                            <div className="location-btn-wrapp">
                                <Button
                                    buttonStyle="btn-orange"
                                    leftIcon={<RoomSharp />}
                                    title="Grab Location"
                                    loading={state.loadingTripList}
                                    disable={state.loadingTripList}
                                    onClick={() => {
                                        dispatch(showGrabLocationForm(selectedElement));
                                    }}
                                />
                            </div>
                        </div>
                    </>
                )
            }

        </>


    );
}


export default TrackingDetailsView;