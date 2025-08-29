import React, { useEffect, useContext } from 'react';
import { WatchLaterOutlined } from '@material-ui/icons';
import { tripsStatusEnum } from '../../../base/constant/ArrayList';
import { useDispatch } from 'react-redux';
import { getVehicleStoppageList } from '../../../serviceActions/TrackingServiceActions';
import MomentUtils from '@date-io/moment';
import { convertSecondsInHours } from '../TrackingFunctions';
import { trackingDisplayDateFormatter } from '../../../base/utility/DateUtils';
import { setStoppageDetails } from '../../../redux/actions/TrackingActions';
import { Context } from '../VehicleTracking';
import StoppageSkeleton from '../trackingSkeleton/StoppageSkeleton';

const StoppageDetails = () => {
    const appDispatch = useDispatch();
    const [state, dispatch] = useContext(Context);
    const { selectedElement, stoppageList, stoppageTime, isVehicleRunning } = state;

    useEffect(() => {
        const getTripData = async () => {
            if (selectedElement && selectedElement.status === tripsStatusEnum.INTRANSIT) {
                let params: any = {
                    fromDateTime: selectedElement.tripStartTime,
                    toDateTime: new MomentUtils().date().toISOString(),
                    vehicleCode: selectedElement.vehicleCode
                }
                appDispatch(getVehicleStoppageList(dispatch, params));
            } else {
                dispatch(setStoppageDetails(undefined));
            }
        }
        selectedElement && getTripData();
        //eslint-disable-next-line
    }, [selectedElement]);
    return (
        <div className="tracking-container trip-stop-container">
            {state.loadingStoppage ? <StoppageSkeleton /> :
                (stoppageList &&
                    <>
                        <div className="status-btn-wrap">
                            <button className="status-btn btn delay-status"
                                style={{
                                    background: "red"
                                }}
                            >Stoppage List</button>
                            <span className="total-stat-time"><WatchLaterOutlined /> {convertSecondsInHours(stoppageTime)}</span>
                        </div>
                        {stoppageList && stoppageList.map((element: any, index: number) => (
                            <ul
                                key={index}
                                className="tracking-list-stopped">
                                <li>
                                    <div className="item-title red-text">{"Stopped " + ((!isVehicleRunning && index === 0) ? " Since " : " For ")
                                        + convertSecondsInHours(element.duration)}</div>
                                    <div className="item-detail">{"Time :" + new MomentUtils().date(element.fromDateTime).format(trackingDisplayDateFormatter)
                                        + " - " + new MomentUtils().date(element.toDateTime).format(trackingDisplayDateFormatter)}</div>
                                    <div className="item-detail">{element.address}</div>
                                </li>
                            </ul>
                        ))}
                    </>) || (
                    <div className="stop-wrap">
                        <div className="no-stoppages">
                            <img src="/images/stoppages.png" alt="" />
                            {/* <p>No stoppage yet</p> */}
                        </div>
                    </div>
                )
            }

        </div>
    )
}

export default StoppageDetails;