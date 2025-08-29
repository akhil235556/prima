import { Box, CircularProgress, Collapse, createStyles, List, makeStyles, Modal } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { ArrowForward, PlayArrow, Stop } from '@material-ui/icons';
import React, { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from "react-router-dom";
import { tripsStatusEnum } from '../../../base/constant/ArrayList';
import { laneZoneTitle, tatLabelWithoutUnit } from '../../../base/constant/MessageUtils';
import { TrackingUrl } from '../../../base/constant/RoutePath';
import { convertDateFormat, convertHoursInDays, displayDateTimeFormatter } from '../../../base/utility/DateUtils';
import { useQuery } from '../../../base/utility/Routerutils';
import { isNullValue } from '../../../base/utility/StringUtils';
import { isMobile } from '../../../base/utility/ViewUtils';
import TripMessageAlertBox from '../../../component/alert/TripAlertBox';
import { CustomToolTip } from "../../../component/widgets/CustomToolTip";
import { CustomTooltipTable } from '../../../component/widgets/CustomToolTipTable';
import InfiniteScrollList from '../../../component/widgets/InfiniteScrollList';
import { showAlert } from '../../../redux/actions/AppActions';
import { addActiveToCard, hideTripLoader, openTripDetail, refreshList, setSelectedTrip, setTrackingTripsListStartStop, showTripLoader } from '../../../redux/actions/TrackingActions';
import { getYmsNodeConfigStatus } from '../../../serviceActions/InplantServiceActions';
import { getTripDetail, startCustomerTrip, stopCustomerTrip } from '../../../serviceActions/TrackingServiceActions';
import ReportingTimeModal from '../ReportingTimeModal';
import TripCardSkeleton from '../trackingSkeleton/TripCardSkeleton';
import TripDetailsView from '../TripView/TripDetailsView';
import { Context } from '../VehicleTracking';
import './TrackingList.css';

const useStyles = makeStyles(() =>
    createStyles({
        buttonProgress: {
            color: "#006cc9",
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -12,
            marginLeft: -12,
        },
        buttonProgress2: {
            color: "white",
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -12,
            marginLeft: -12,
        },
    })
);

interface TrackingListProps {
    isNextPage: any,
    onReachEnd: any,
    listLoading: boolean,
}

function TrackingList(props: TrackingListProps) {
    const params = useQuery();
    const { isNextPage, onReachEnd, listLoading } = props;
    const history = useHistory();
    const classes = useStyles();
    const appDispatch = useDispatch();
    const [state, dispatch] = useContext(Context);
    const { id } = useParams<any>();
    const [loading, setLoading] = React.useState(false);
    const [scrollRequired, setScrollrequired] = React.useState(true);
    const [toggleModal, setToggleModal] = React.useState<any>(false)
    const [toggleSuccessModal, setToggleSuccessModal] = React.useState<any>(false)
    const [modalData, setModalData] = React.useState<any>({})
    const [messageModalData, setMessageModalData] = React.useState<any>({})
    const lastIndex = state.tripList && state.tripList.length > 0 && state.tripList[state.tripList.length - 1].id;
    const refs = state.tripList && state.tripList.length > 0 && state.tripList.reduce((acc: any, value: any) => {
        acc[value.id] = React.createRef();
        return acc;
    }, {});
    const handleClick = (id: any) => {
        scrollRequired && refs[id] && refs[id].current && refs[id].current.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: "nearest"
        })
    };
    useEffect(() => {
        const getTripData = async () => {
            let params: any = {
                id: state.tripList[0].id
            }
            var indexList: any;
            // eslint-disable-next-line
            id && state && state.tripList && state.tripList.filter((item: any, index: any) => {
                if (item.id.toString() === id) {
                    indexList = index;
                    params.id = id;
                }
            });
            setLoading(true);
            appDispatch(getTripDetail(params)).then((response: any) => {
                dispatch(openTripDetail(true));
                if (indexList) {
                    dispatch(addActiveToCard(indexList));
                } else {
                    dispatch(addActiveToCard(0));
                }
                dispatch(setSelectedTrip(response));
                setLoading(false);
            });
            !loading && handleClick(id)
        }
        !isMobile && getTripData();
        // eslint-disable-next-line
    }, [id, state.refreshDriverDetails])

    return (
        <>
            <ReportingTimeModal
                open={toggleModal}
                selectedElement={modalData}
                loading={state.loadingTripList}
                onSuccess={(data: any, listIndex: any, listElement: any) => {
                    onTripStop(data, listIndex, listElement)
                }}
                onClose={() => {
                    setToggleModal(false)
                }}
            />

            <TripMessageAlertBox
                open={toggleSuccessModal}
                selectedElement={messageModalData}
                onSuccess={() => {
                    if (messageModalData.status === "Start") {
                        let listData = state.tripList.map((element: any) => {
                            if (element.id === messageModalData.element.id) {
                                return messageModalData.response;
                            } else
                                return element;
                        })
                        dispatch(setTrackingTripsListStartStop({ trips: listData }));
                        !isMobile && history.replace({
                            pathname: TrackingUrl + messageModalData.element.id,
                            search: params.toString()
                        });
                    } else {
                        let listData = state.tripList.filter((element: any) => element.id !== messageModalData.element.id);
                        if (listData && listData.length) {
                            dispatch(setTrackingTripsListStartStop({ trips: listData }));
                            if (messageModalData.index === 0) {
                                !isMobile && history.replace({
                                    pathname: TrackingUrl,
                                    search: params.toString()
                                })
                            } else {
                                !isMobile && history.replace({
                                    pathname: TrackingUrl + state.tripList[messageModalData.index - 1].id,
                                    search: params.toString()
                                });
                            }
                        } else {
                            dispatch(refreshList())
                        }
                    }
                    setToggleSuccessModal(false)
                }}
                onClose={() => {
                    setToggleSuccessModal(false)
                }}
            />
            <div className="trip-wrapper">
                <div className="trip-card">
                    <InfiniteScrollList
                        boxRef={(refs && refs[lastIndex]) || {}}
                        onReachEnd={() => {
                            onReachEnd && onReachEnd()
                        }}
                        nextPage={isNextPage || false}
                        className=""
                    >
                        <List
                            className="list-tracking"
                        >
                            {state && state.tripList && state.tripList.map((element: any, index: number) => {
                                return (
                                    <ListItem
                                        key={element.id}
                                        ref={refs[element.id]}
                                        className={"listCard" + (element.isActive ? " active " : "")}
                                        alignItems="flex-start">
                                        <div
                                            className="clickList"
                                            onClick={() => {
                                                dispatch(openTripDetail(true));
                                                if ((state && state.selectedElement && state.selectedElement.id) !== element.id) {
                                                    if (isMobile) {
                                                        setLoading(true);
                                                        let params: any = {
                                                            id: element.id
                                                        }
                                                        dispatch(setSelectedTrip(state.selectedElement));
                                                        appDispatch(getTripDetail(params)).then((response: any) => {
                                                            dispatch(addActiveToCard(index));
                                                            dispatch(setSelectedTrip(response));
                                                            setLoading(false);
                                                        })
                                                    }
                                                    setScrollrequired(false);

                                                    !isMobile &&
                                                        history.replace({
                                                            pathname: TrackingUrl + element.id,
                                                            search: params.toString()
                                                        });
                                                }
                                            }}
                                        >
                                            <Typography variant="h6" className="row tripTitle align-items-center">
                                                <div className="col vehNum d-flex">
                                                    {element &&
                                                        <span className="status-btn-wrap li-status ">
                                                            <CustomToolTip
                                                                title={getTitle(element)}
                                                            >
                                                                <img alt="Status"
                                                                    className="img-status" src={getImageUrl(element)} />
                                                            </CustomToolTip>

                                                        </span>}
                                                    <span className="vehicle_text">{element.vehicleNumber}</span>
                                                </div>
                                            </Typography>

                                            <Box component="div" className="row align-items-center">
                                                <Box component="ul" className="col-12">
                                                    <ListItem className="trip-li trip-lane">

                                                        <div className="row no-gutters align-items-center">

                                                            <div className="col-5 p-0 trip_point trip-info icon-span d-flex align-items-center" >
                                                                <div onClick={(event) => {
                                                                    event.stopPropagation();
                                                                }}>
                                                                    <CustomTooltipTable
                                                                        tableColumn={[{ description: "Location", name: "taggedLocationName" }, { description: "Location Type", name: "taggedLocationType" }]}
                                                                        tableData={element.taggedLocations}
                                                                        displayZone={element?.destinationZoneName && element?.originZoneName}
                                                                        zoneDetails={{ destinationZoneName: element?.destinationZoneName, originZoneName: element?.originZoneName }}
                                                                        showStringValue={true}
                                                                        style={{
                                                                            tooltip: {
                                                                                minWidth: isMobile ? 320 : 320,
                                                                                maxWidth: isMobile ? 320 : 400,
                                                                                marginLeft: isMobile ? 0 : 120,

                                                                            },
                                                                            popper: {
                                                                                marginTop: '6px',
                                                                            }
                                                                            // tooltipPlacementBottom: {
                                                                            //     marginTop: '20px',
                                                                            // }
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="trip-lane-wrap">
                                                                    <span className="trip-label">{laneZoneTitle}</span>
                                                                    <CustomToolTip title={element.originName} placement="top" disableInMobile={"false"}>
                                                                        <span className="text-truncate d-block">{element.originName} </span>
                                                                    </CustomToolTip>
                                                                </div>
                                                            </div>

                                                            <div className="col-1 icon-span">
                                                                {<ArrowForward className="arrow-icon" />}
                                                            </div>
                                                            <span className="col-6 p-0 trip_point icon-span">
                                                                <CustomToolTip title={element.destinationName} placement="top" disableInMobile={"false"}>
                                                                    <span
                                                                        className="text-truncate d-block">{element.destinationName}</span>
                                                                </CustomToolTip>
                                                            </span>

                                                        </div>
                                                    </ListItem>
                                                    <ListItem className="trip-li">
                                                        <div className="row no-gutters align-items-center">
                                                            <span className="col-6 p-0 trip_point icon-span">
                                                                <div>
                                                                    <span className="trip-label">{tatLabelWithoutUnit}</span>
                                                                    <span>
                                                                        {((element.tat && convertHoursInDays(element.tat)) || "NA")}
                                                                    </span>
                                                                </div>
                                                            </span>

                                                            <span className="col-6 p-0 trip_point icon-span">
                                                                <div>
                                                                    <span className="trip-label">Total Distance</span>
                                                                    <span>
                                                                        {((element.totalDistance && element.totalDistance.toFixed(2) + " KM") || "NA")}
                                                                    </span>
                                                                </div>
                                                            </span>
                                                        </div>
                                                    </ListItem>
                                                    <ListItem className="trip-li">
                                                        <div className="row no-gutters align-items-center">
                                                            <span className="col-6 p-0 trip_point icon-span">
                                                                <div>
                                                                    <span className="trip-label">{(element && element.status === "INIT") ? "Created At" : (element && element.status === "INTRANSIT") ? "Started At" : ""}</span>
                                                                    <span className="trip_time">
                                                                        {(element && element.status === "INIT") ? convertDateFormat((element.createdAt), displayDateTimeFormatter) : (element && element.status === "INTRANSIT") ? convertDateFormat((element.tripStartTime), displayDateTimeFormatter) : ""}
                                                                    </span>
                                                                </div>
                                                            </span>
                                                            <span className="col-6 p-0 trip_point icon-span">
                                                                <div>
                                                                    <span className="trip-label">Remaining Distance</span>
                                                                    <span>
                                                                        {((element.transientInfo && element.transientInfo.remainingDistance && element.transientInfo.remainingDistance.toFixed(2) + " KM") || "NA")}
                                                                    </span>
                                                                </div>
                                                            </span>
                                                        </div>
                                                    </ListItem>
                                                </Box>

                                            </Box>

                                        </div>
                                        <Box className="righT trip-start-wrap">
                                            {(element.status === tripsStatusEnum.INIT &&
                                                <div>
                                                    <Fab color="primary" size="small"
                                                        className="tripBtn btn-orange"
                                                        disabled={state.loadingTripList}
                                                        onClick={() => {
                                                            dispatch(showTripLoader())
                                                            state.tripList[index].isActive2 = true;
                                                            appDispatch(startCustomerTrip(element.tripCode)).then((response: any) => {
                                                                if (response && response.tripCode) {
                                                                    setMessageModalData({
                                                                        ...messageModalData,
                                                                        message: "Trip started successfully",
                                                                        element: element,
                                                                        response: response,
                                                                        status: "Start"
                                                                    })
                                                                    setToggleSuccessModal(true);
                                                                    state.tripList[index].isActive2 = false;
                                                                }
                                                                dispatch(hideTripLoader());
                                                            })

                                                        }}
                                                    >
                                                        {state.loadingTripList && element.isActive2 && <CircularProgress size={24} className={classes.buttonProgress} />}
                                                        <PlayArrow />
                                                    </Fab>
                                                </div>
                                            ) || (
                                                    element.status === tripsStatusEnum.INTRANSIT &&
                                                    <div>
                                                        <Fab color="primary" size="small"
                                                            className="tripBtn btn-blue"
                                                            disabled={state.loadingTripList}
                                                            onClick={async () => {
                                                                dispatch(showTripLoader())
                                                                let nodeCodes: any = []
                                                                nodeCodes.push(element.destinationCode)
                                                                let ymsEnabledStatusParams = {
                                                                    nodeCode: nodeCodes
                                                                }
                                                                const ymsNodeConfigResponse = await appDispatch(getYmsNodeConfigStatus(ymsEnabledStatusParams))
                                                                if (ymsNodeConfigResponse && ymsNodeConfigResponse.code === 200) {
                                                                    if (!isNullValue(ymsNodeConfigResponse.details)) {
                                                                        appDispatch(showAlert("Action is not allowed, please proceed through YMS", false));
                                                                        dispatch(hideTripLoader());
                                                                        return;
                                                                    }
                                                                } else {
                                                                    appDispatch(showAlert("Something went wrong. Please try again", false))
                                                                    dispatch(hideTripLoader());
                                                                    return;
                                                                }
                                                                dispatch(hideTripLoader());
                                                                setModalData({
                                                                    index: index,
                                                                    element: element
                                                                })
                                                                setToggleModal(true);
                                                            }}
                                                        >
                                                            {state.loadingTripList && element.isActive2 && <CircularProgress size={24} className={classes.buttonProgress2} />}
                                                            <Stop />
                                                        </Fab>
                                                    </div>
                                                )
                                            }
                                        </Box>
                                    </ListItem>
                                )
                            })}
                        </List>
                    </InfiniteScrollList>

                    {listLoading && <div className="track-skeleton-wrap"><TripCardSkeleton /></div>}
                </div>

                {
                    isMobile ?
                        <Modal
                            open={state.showTripDetail}
                            className="modal_trip_route_detail"
                        >
                            <TripDetailsView loading={loading} />
                        </Modal>
                        :
                        <Collapse
                            className="desktop_trip_detail tablet_map_view"
                            in={state.showTripDetail} timeout="auto" unmountOnExit>

                            <TripDetailsView loading={loading} />
                        </Collapse>
                }
            </div>
        </>
    );

    function onTripStop(params: any, index: any, element: any) {
        dispatch(showTripLoader());
        state.tripList[index].isActive2 = true;
        appDispatch(stopCustomerTrip(element.tripCode, params)).then((response: any) => {
            if (response && response.tripCode) {
                setToggleModal(false)
                setMessageModalData({
                    ...messageModalData,
                    message: "Trip completed successfully",
                    element: element,
                    status: "Stop",
                    index: index
                })
                setToggleSuccessModal(true);
                // appDispatch(showAlert("Trip completed successfully"));
                state.tripList[index].isActive2 = false;
                // onTripStatusChange();
            }
            dispatch(hideTripLoader());
        })
    }

    function getImageUrl(element: any) {
        if (element.transientInfo && element.transientInfo.transientStatus === "On Schedule") {
            return "/images/onSchedule.png"
        }
        else if (element.transientInfo && element.transientInfo.transientStatus === "Delayed") {
            return "/images/delayed.png"
        } else {
            return "/images/unknown-icon-grey.png"
        }
    }

    function getTitle(element: any) {
        if (element.transientInfo && element.transientInfo.transientStatus === "On Schedule") {
            return "On Schedule"
        }
        else if (element.transientInfo && element.transientInfo.transientStatus === "Delayed") {
            return "Delayed"
        } else {
            return "Unknown"
        }
    }
}
export default React.memo(TrackingList);