import { Card, CardContent, CardHeader, List, ListItem, TextareaAutosize } from '@material-ui/core';
import { ArrowRightAlt, Close, Email, KeyboardBackspace, Person, Phone } from '@material-ui/icons';
import _ from 'lodash';
import Numeral from "numeral";
import React, { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { AuctionStatusEnum, FreightType } from "../../base/constant/ArrayList";
import { modLabel, raiseOrderCTAToolTipMessage, remarkLabel, tatLabelWithoutUnit, terminateAuctionMessage } from '../../base/constant/MessageUtils';
import { OrderListingUrl } from "../../base/constant/RoutePath";
import { useVisibilty } from '../../base/hooks/useVisibilty';
import { convertDateFormat, convertHoursInDays, convertSecondsInHours, displayDateTimeFormatter } from "../../base/utility/DateUtils";
import { convertAmountToNumberFormat, floatFormatter } from '../../base/utility/NumberUtils';
import { raiseAuctionTaskName } from '../../base/utility/RegexUtils';
import { isNullValue } from '../../base/utility/StringUtils';
import { isMobile } from '../../base/utility/ViewUtils';
import DataNotFound from '../../component/error/DataNotFound';
import Filter from '../../component/filter/Filter';
import PageContainer from '../../component/pageContainer/PageContainer';
import { CustomButtonToolTip } from '../../component/widgets/ButtonToolTip';
import CardContentSkeleton from "../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import { CustomToolTip } from '../../component/widgets/CustomToolTip';
import { CustomToolTipAuction } from '../../component/widgets/CustomToolTipAuction';
import { InfoTooltip } from '../../component/widgets/tooltip/InfoTooltip';
import { auctionDb } from '../../push-notification';
import { showAlert } from '../../redux/actions/AppActions';
import {
    getAuctionDetails, getBidList,
    selectBid
} from '../../serviceActions/AuctionServiceActions';
import LanePointsDisplayModal from "../masterPlatform/lane/LanePointsDisplayModal";
import './Auction.css';
import TerminateAuctionModal from './TerminateAuctionModal';

function AuctionDetail() {
    const history = useHistory();
    const { id } = useParams<any>();
    const [isLive, setIsLive] = React.useState<boolean>(false)
    const appDispatch = useDispatch();
    const [loading, setLoading] = React.useState<any>(false);
    const [openLaneModal, setOpenLaneModal] = React.useState<any>(false);
    const [openTernimationModal, setOpenTerminateModal] = React.useState<any>(false);

    const [currentLane, setCurrentLane] = React.useState<any>(null);
    const [laneDetails, setLaneDetails] = React.useState<any>({});
    const [timer, setTimer] = React.useState<any>();
    const [seconds, setSeconds] = React.useState<any>(null);
    const [bidList, setBidList] = React.useState<any>({});
    const [selectedTransporter, setSelectedTransporter] = React.useState<any>(undefined);
    const [scoreArray, setScoreArray] = React.useState<any>([]);
    const [pickupString, setPickupString] = React.useState<any>(undefined);
    const [dropString, setDropString] = React.useState<any>(undefined);
    const [remarks, setRemarks] = React.useState<any>(undefined);
    const [showPerKgRateDetails, setShowPerMtRateDetails] = React.useState<any>({
        state: false,
        loadValue: 0
    });
    const [pageVisiblity] = useVisibilty();


    useEffect(() => {
        let valueChngRef: any;
        const getList = async () => {
            setLoading(true);
            appDispatch(getAuctionDetails({ id })).then((response: any) => {
                if (response) {
                    setLaneDetails(response);
                    setRemarks(response.remarks)
                    if (response.lane && response.lane.freightType === "PTL" && response.biddingRateCriteria === "Per KG" && response.lane.load) {
                        setShowPerMtRateDetails({
                            state: true,
                            loadValue: convertAmountToNumberFormat(response.lane.load, floatFormatter)
                        });
                    } else {
                        setShowPerMtRateDetails(undefined)
                    }
                    let pickup: any = [];
                    let drop: any = [];
                    pickup = response.auctionLocations && response.auctionLocations.filter((item: any) => item.locationType === "PICKUP");
                    drop = response.auctionLocations && response.auctionLocations.filter((item: any) => item.locationType === "DROP");
                    setPickupString(arrayToString(pickup));
                    setDropString(arrayToString(drop));
                }
                if (response && response.status === 'Live') {
                    setIsLive(true);
                    response.remainingSeconds && setSeconds(response.remainingSeconds.toFixed())

                    valueChngRef = auctionDb
                        .ref(`/auction_bids/${id}`)
                        .on('value', (snapshot: any) => {
                            const value = snapshot.val();
                            if (value) {
                                const list = _.sortBy(value, "bid_amount")
                                list[0] && setSelectedTransporter(list[0])
                                const score_array: any = []
                                list && list.forEach((item: any) => {
                                    let score_object: any = []
                                    if (item.in_transit_score) {
                                        score_object.push({
                                            name: "In Transit Efficiency",
                                            value: item.in_transit_score + "/" + item.in_transit_factor
                                        })
                                    }
                                    if (item.contribution_score) {
                                        score_object.push({
                                            name: "Placement Efficiency",
                                            value: item.contribution_score + "/" + item.contribution_factor
                                        })

                                    }

                                    if (item.profit_margin_score) {
                                        score_object.push({
                                            name: "Profit Efficiency",
                                            value: item.profit_margin_score + "/" + item.profit_margin_factor
                                        })

                                    }
                                    score_array.push(score_object)
                                })
                                setScoreArray(score_array)
                                setBidList({ bid: list });
                            }
                            setLoading(false);
                        })

                } else {
                    setIsLive(false);
                    appDispatch(getBidList({ auctionId: id })).then((response: any) => {
                        setBidList(response);
                        const score_array: any = []
                        response && response.bid && response.bid.forEach((item: any) => {
                            let score_object: any = []
                            if (item.partner.partnerInTransitScore) {
                                score_object.push({
                                    name: "In Transit Efficiency",
                                    value: item.partner.partnerInTransitScore + "/" + item.partner.partnerInTransitFactor
                                })

                            }
                            if (item.partner.partnerContributionScore) {
                                score_object.push({
                                    name: "Placement Efficiency",
                                    value: item.partner.partnerContributionScore + "/" + item.partner.partnerContributionFactor
                                })

                            }
                            if (item.partner.partnerProfitMarginScore) {
                                score_object.push({
                                    name: "Profit Efficiency",
                                    value: item.partner.partnerProfitMarginScore + "/" + item.partner.partnerProfitMarginFactor
                                })

                            }
                            score_array.push(score_object)
                        })
                        setScoreArray(score_array)
                        response && response.bid && response.bid[0] && setSelectedTransporter(response.bid[0]);
                        setLoading(false);
                    })
                }
            })
        }
        pageVisiblity && getList();
        return () => {
            if (valueChngRef) {
                auctionDb
                    .ref(`/auction_bids/${id}`)
                    .off('value', valueChngRef);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, pageVisiblity]);

    useEffect(() => {
        if (seconds) {
            let interval: any = undefined;
            if (laneDetails && laneDetails.auctionClosing) {
                setTimeout(() => {
                    window.location.reload();
                }, 3000)
            } else {
                interval = setInterval(() => {
                    if (seconds > 1) {
                        setTimer(convertSecondsInHours(seconds, true))
                        setSeconds(seconds - 1);
                    } else {
                        interval && clearInterval(interval);
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000)
                    }
                }, 1000);
            }
            return () => interval && clearInterval(interval);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seconds]);

    return (
        <div>
            <div className="filter-wrap">
                <Filter
                    pageTitle="Auction Detail"
                    buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                    buttonTitle={isMobile ? " " : "Back"}
                    leftIcon={<KeyboardBackspace />}
                    onClick={() => {
                        history.goBack();
                    }}
                >
                </Filter>
            </div>
            <TerminateAuctionModal
                open={openTernimationModal}
                auctionCode={laneDetails && laneDetails.auctionCode}
                onClose={() => {
                    setOpenTerminateModal(false);
                }}
                onSuccess={() => {
                    setOpenTerminateModal(false);
                    history.goBack();
                }}
                message={terminateAuctionMessage}

            />
            <LanePointsDisplayModal
                open={openLaneModal}
                laneCode={currentLane}
                onClose={() => {
                    setCurrentLane(null)
                    setOpenLaneModal(false);
                }} />
            <PageContainer>
                <div className="row">
                    <div className="col-md-6 col-lg-6">
                        <Card className="creat-contract-wrapp">
                            <CardHeader className="creat-contract-header"
                                title="Transporters Bidding List"
                            />
                            {loading ?
                                <CardContentSkeleton
                                    row={10}
                                    column={1}
                                /> : <CardContent className={(laneDetails && (laneDetails.status === "Live")) ? "creat-contract-content job-detail job-detail-left job-detail-live" : "creat-contract-content job-detail job-detail-left"}>
                                    <List className="bidding-list">
                                        {(bidList && bidList.bid && bidList.bid.map((element: any, index: any) => {
                                            return (
                                                <ListItem
                                                    className={getClassName(element, index)}
                                                    key={index}
                                                    onClick={() => {
                                                        if (laneDetails && (laneDetails.status === "Closed")) {
                                                            setSelectedTransporter(element);
                                                        }
                                                    }}
                                                >
                                                    <div className="col-md-12 col-lg-6 mb-10">
                                                        <span className="bidding-big-title d-block ">
                                                            <Person />{
                                                                (!isLive && element.partner.partnerName)
                                                                || (element.participant_name) || "NA"
                                                            }</span>
                                                        <div className="row">
                                                            <span className="col-12 customer-info customer-email"><Email />
                                                                {
                                                                    (!isLive && element.partner.partnerEmail)
                                                                    || (element.participant_email) || "NA"
                                                                }
                                                            </span>
                                                            <span className="col-12 customer-info"><Phone />{
                                                                (!isLive && element.partner.partnerContact)
                                                                || (element.participant_contact) || "NA"

                                                            }</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-6 col-lg-2  mb-10">
                                                        <span className="bidding-small-title d-block ">Score</span>
                                                        <span className="bidding-score d-block auc-score-tip">{
                                                            (!isLive && element.partner.partnerScore)
                                                            || (element.participant_score) || 'NA'
                                                        }
                                                            <CustomToolTipAuction
                                                                valueClassName="value"
                                                                tableColumn={[{ description: "Efficiency", name: "name" }, { description: "Score", name: "value" }]}
                                                                tableData={scoreArray && scoreArray[index]}
                                                                showStringValue={true}
                                                            />
                                                        </span>

                                                    </div>


                                                    <div className="col-6 col-lg-1 p-lg-0 mb-10">
                                                        {
                                                            laneDetails && laneDetails.status === "Completed" && element.selectedBid === true &&
                                                            <img src="/images/medal.svg" alt="" />
                                                        }
                                                    </div>


                                                    {showBiddingPrice(laneDetails) ?
                                                        (<div className="col-6 col-lg-3">
                                                            <span className="bidding-small-title d-block ">{getBiddingAmount(element, showPerKgRateDetails)}</span>
                                                            <span className="bidding-price">₹ {(
                                                                (!isLive && element.bidAmount && Numeral(element.bidAmount).format('0,0.00')))
                                                                || (element.bid_amount && Numeral(element.bid_amount).format('0,0.00')) || "NA"}</span>
                                                        </div>) :
                                                        (<div className="col-6 col-lg-3">
                                                            <span className="bidding-small-title d-block ">Bid Price</span>
                                                            <span className="bidding-price">₹ {(
                                                                (!isLive && element.bidAmount && Numeral(element.bidAmount).format('0,0.00')))
                                                                || (element.bid_amount && Numeral(element.bid_amount).format('0,0.00')) || "NA"}</span>
                                                        </div>)
                                                    }
                                                </ListItem>
                                            )
                                        })) || <DataNotFound

                                                image="/images/auction-not-found.png"
                                                message="No bids found"
                                            />
                                        }

                                    </List>

                                </CardContent>}
                        </Card>
                    </div>
                    <div className="col-md-6 col-lg-6">
                        <Card className="creat-contract-wrapp">
                            <CardHeader className="creat-contract-header"
                                title="Lane Detail"
                            />
                            {loading ?
                                <CardContentSkeleton
                                    row={9}
                                    column={1}
                                /> :
                                <CardContent className="creat-contract-content job-detail lane-detail">
                                    <div className="row job-detail-row">
                                        <div className="col-6 left-col">Auction Code :</div>
                                        <div className="col-6 right-col">{(laneDetails && laneDetails.auctionCode) || "NA"}</div>
                                    </div>
                                    <div className="row job-detail-row">
                                        <div className="col-6 left-col">Lane Code :</div>
                                        <div className="col-6 right-col">
                                            <CustomToolTip title={(laneDetails && laneDetails.lane && laneDetails.lane.laneCode) || "NA"}>
                                                {(laneDetails && laneDetails.lane && laneDetails.lane.laneCode) || "NA"}
                                            </CustomToolTip>
                                        </div>
                                    </div>
                                    <div className="row job-detail-row">
                                        <div className="col-6 left-col">Lane :</div>
                                        <div className="col-6 right-col">
                                            <span
                                                className="lane-item blue-text lane-sm-arrow"
                                                onClick={() => {
                                                    laneDetails && laneDetails.lane && laneDetails.lane.laneCode && setCurrentLane(laneDetails.lane.laneCode);
                                                    setOpenLaneModal(true);
                                                }}
                                            >{
                                                    <InfoTooltip
                                                        title={((laneDetails && laneDetails.lane && laneDetails.lane.originLocationName) + " -\u003e " + (laneDetails && laneDetails.lane && laneDetails.lane.destinationLocationName)) || "....."}
                                                        placement={"top"}
                                                        disableInMobile={"false"}
                                                        infoText={((laneDetails && laneDetails.lane && laneDetails.lane.originLocationName) + " -\u003e " + (laneDetails && laneDetails.lane && laneDetails.lane.destinationLocationName)) || "....."}
                                                    />
                                                }
                                                {/*(laneDetails && laneDetails.lane && laneDetails.lane.originLocationName) + " -\u003e " + (laneDetails && laneDetails.lane && laneDetails.lane.destinationLocationName)*/}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="row job-detail-row">
                                        <div className="col-6 left-col">Pickup Points :</div>
                                        <div className="col-6 right-col">
                                            <InfoTooltip
                                                title={pickupString || "....."}
                                                placement={"top"}
                                                disableInMobile={"false"}
                                                infoText={pickupString || "....."}
                                            />
                                        </div>
                                    </div>
                                    <div className="row job-detail-row">
                                        <div className="col-6 left-col">Drop Points :</div>
                                        <div className="col-6 right-col">
                                            <InfoTooltip
                                                title={dropString || "....."}
                                                placement={"top"}
                                                disableInMobile={"false"}
                                                infoText={dropString || "....."}
                                            />
                                        </div>
                                    </div>
                                    <div className="row job-detail-row">
                                        <div className="col-6 left-col">Freight Type :</div>
                                        <div className="col-6 right-col">{(laneDetails && laneDetails.lane && laneDetails.lane.freightType) || "NA"}</div>
                                    </div>
                                    <div className="row job-detail-row">
                                        <div className="col-6 left-col">{modLabel + " :"}</div>
                                        <div className="col-6 right-col">{laneDetails && laneDetails.lane && laneDetails.lane.serviceabilityModeName}</div>
                                    </div>
                                    <div className="row job-detail-row">
                                        <div className="col-6 left-col">{tatLabelWithoutUnit + " :"}</div>
                                        <div className="col-6 right-col">{(laneDetails && laneDetails.lane && laneDetails.lane.tat && convertHoursInDays(laneDetails.lane.tat)) || "NA"}</div>
                                    </div>
                                    {laneDetails && laneDetails.lane && laneDetails.lane.freightType === FreightType.FTL ?
                                        <>
                                            <div className="row job-detail-row">
                                                <div className="col-6 left-col">Vehicle Type :</div>
                                                <div className="col-6 right-col">{(laneDetails && laneDetails.lane && laneDetails.lane.vehicleType) || "NA"}</div>
                                            </div>
                                            <div className="row job-detail-row">
                                                <div className="col-6 left-col">Number of vehicles :</div>
                                                <div className="col-6 right-col">{(laneDetails && laneDetails.lane && laneDetails.lane.noOfVehicles) || "NA"}</div>
                                            </div>
                                        </> :
                                        <>
                                            <div className="row job-detail-row">
                                                <div className="col-6 left-col">Weight :</div>
                                                <div className="col-6 right-col">{(laneDetails && laneDetails.lane && laneDetails.lane.load) || "NA"}</div>
                                            </div>
                                            <div className="row job-detail-row">
                                                <div className="col-6 left-col">Volume :</div>
                                                <div className="col-6 right-col">{(laneDetails && laneDetails.lane && laneDetails.lane.volume) || "NA"}</div>
                                            </div>
                                        </>}
                                    <div className="row job-detail-row">
                                        <div className="col-6 left-col">Placement Date and time :</div>
                                        <div className="col-6 right-col">{(laneDetails && laneDetails.lane && laneDetails.lane.vehicleRequiredDatetime && convertDateFormat(laneDetails.lane.vehicleRequiredDatetime, displayDateTimeFormatter)) || "NA"}</div>
                                    </div>
                                    <div className="row job-detail-row">
                                        <div className="col-6 left-col">Appointment Date and time :</div>
                                        <div className="col-6 right-col">{(laneDetails && laneDetails.lane && laneDetails.lane.appointmentDateTime && convertDateFormat(laneDetails.lane.appointmentDateTime, displayDateTimeFormatter)) || "NA"}</div>
                                    </div>
                                    <div className="row job-detail-row">
                                        <div className="col-6 left-col">Ceiling Price ( ₹ ) :</div>
                                        <div className="col-6 right-col">{(laneDetails && laneDetails.basePrice && Numeral(laneDetails.basePrice).format('0,0.00')) || "NA"}</div>
                                    </div>
                                    <div className="row job-detail-row">
                                        <div className="col-6 left-col">Status :</div>
                                        <div className={"col-6 right-col " + getColorClassName(laneDetails.status)}>{(laneDetails && laneDetails.status) || "NA"}</div>
                                    </div>
                                    {laneDetails && laneDetails.status === "Live" &&
                                        <div className="row job-detail-row">
                                            <div className="col-6 left-col">Remaining Time :</div>
                                            <div className="col-6 right-col orange-text">{timer && timer}</div>
                                        </div>}
                                    <div className="row job-detail-row">
                                        <div className="col-6 left-col">{remarkLabel} :</div>
                                        <div className="col-6 right-col">
                                            <CustomToolTip
                                                title={laneDetails && laneDetails.remarks}
                                            >
                                                {(laneDetails && laneDetails.remarks) || "NA"}
                                            </CustomToolTip>
                                        </div>
                                    </div>
                                </CardContent>}

                        </Card>
                        {
                            laneDetails && laneDetails.status === "Closed" &&
                            <div className="remark-input billing-info-remark remark-row">
                                <div className="form-group">
                                    <label>Remark</label>
                                    <TextareaAutosize
                                        rowsMax={3}
                                        rowsMin={3}
                                        aria-label="maximum height"
                                        placeholder={remarkLabel}
                                        value={remarks}
                                        disabled={loading || (selectedTransporter === undefined)}
                                        onChange={(event: any) => {
                                            setRemarks(event.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                        }
                        {laneDetails && (laneDetails.status === AuctionStatusEnum.CLOSED || laneDetails.status === AuctionStatusEnum.COMPLETED) &&
                            <div className="row text-right">
                                <div className="col indent-btn-wrap d-flex justify-content-end">
                                    <div className="px-1">
                                        {laneDetails.status === AuctionStatusEnum.CLOSED && <CustomButtonToolTip
                                            toolTipTitle={(laneDetails.status === AuctionStatusEnum.CLOSED && raiseAuctionTaskName.test(laneDetails?.taskName)) ? raiseOrderCTAToolTipMessage : ""}
                                            title={"Terminate"}
                                            buttonStyle={"btn-orange mr-2"}
                                            leftIcon={<Close />}
                                            onClick={() => {
                                                setOpenTerminateModal(true);
                                            }}
                                            disable={laneDetails.status === AuctionStatusEnum.CLOSED && raiseAuctionTaskName.test(laneDetails?.taskName)}
                                        />}
                                    </div>
                                    <div className="px-1">
                                        <CustomButtonToolTip
                                            toolTipTitle={(Object.keys(bidList).length > 0 && laneDetails.status === AuctionStatusEnum.CLOSED && raiseAuctionTaskName.test(laneDetails?.taskName)) ? raiseOrderCTAToolTipMessage : ""}
                                            title={laneDetails.status === AuctionStatusEnum.CLOSED ? "Raise Order" : "View Orders"}
                                            buttonStyle={"btn-blue"}
                                            leftIcon={<ArrowRightAlt />}
                                            onClick={() => {
                                                if (laneDetails.status === AuctionStatusEnum.CLOSED) {
                                                    setLoading(true);
                                                    let params: any = {
                                                        auctionId: selectedTransporter.auctionId,
                                                        id: selectedTransporter.id,
                                                    }
                                                    if (!isNullValue(remarks)) {
                                                        params.remarks = remarks;
                                                    }
                                                    appDispatch(selectBid(params)).then((response: any) => {
                                                        if (response) {
                                                            response.message && appDispatch(showAlert(response.message));
                                                            history.goBack();
                                                        }
                                                        setLoading(false);
                                                    });
                                                } else {
                                                    history.push(OrderListingUrl + "?auctionCode=" + laneDetails.auctionCode)
                                                }

                                            }}
                                            disable={(raiseAuctionTaskName.test(laneDetails?.taskName) && laneDetails.status === AuctionStatusEnum.CLOSED) || loading || (selectedTransporter === undefined)}
                                        />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </PageContainer>
        </div>
    );

    function getBiddingAmount(element: any, showPerKgRateDetails: any) {
        if (!isLive) {
            return showPerKgRateDetails.state && element.bidAmount && showPerKgRateDetails.loadValue && `Bid Price ( ₹ ${Numeral(element.bidAmount / showPerKgRateDetails.loadValue).format('0,0.00')} Per KG)`
        } else {
            return showPerKgRateDetails.state && element.bid_amount && showPerKgRateDetails.loadValue && `Bid Price ( ₹ ${Numeral(element.bid_amount / showPerKgRateDetails.loadValue).format('0,0.00')} Per KG)`
        }
    }

    function showBiddingPrice(response: any) {
        if (response.lane && response.lane.freightType === "PTL" && response.biddingRateCriteria === "Per KG" && response.lane.load) {
            return true;
        }
        return false;
    }

    function getClassName(element: any, index: any) {
        if (laneDetails && laneDetails.status === "Closed") {
            if (selectedTransporter && selectedTransporter.id === element.id) {
                return "row bidding-list-row active-bid"
            } else {
                return "row bidding-list-row"
            }
        }
        else if (laneDetails && laneDetails.status === "Completed") {
            if (element.selectedBid === true) {
                return "row bidding-list-row active-bid"
            } else {
                return "row bidding-list-row"
            }
        } else {
            return "row bidding-list-row"
        }
    }

    function getColorClassName(value: any) {
        if (value === "Scheduled")
            return "orange-text"
        if (value === "Live")
            return "blue-text"
        if (value === "Completed")
            return "green-text"
        if (value === "Cancelled")
            return "red-text"
        if (value === "Terminated")
            return "red-text"
        if (value === "Closed")
            return "blue-text"
        else
            return "orange-text"
    }

    function arrayToString(list: any) {
        if (list && list.length > 0) {
            let arr: any = list.map((item: any) => item.locationName);
            return arr.join(", ")
        } else {
            return undefined
        }
    }

}
export default AuctionDetail;