import { Card, CardContent, CardHeader } from "@material-ui/core";
import { KeyboardBackspace, LocalShipping } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { FreightType, OrderStatus } from '../../../base/constant/ArrayList';
import { driverNameLabel, driverNumberLabel, freightTypeLabel, lanePriceLabel, laneZoneTitle, orderCodeLabel, orderCreationDateTime, referenceIdLabel, remarkLabel, transporterLabel, vehicleNumberHint, VolumeLabel } from "../../../base/constant/MessageUtils";
import { convertDateFormat, displayDateTimeFormatter } from "../../../base/utility/DateUtils";
import { isNullValue } from "../../../base/utility/StringUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import { LaneView } from "../../../component/CommonView";
import Filter from "../../../component/filter/Filter";
import Information from "../../../component/information/Information";
import PageContainer from "../../../component/pageContainer/PageContainer";
import Button from "../../../component/widgets/button/Button";
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import { CustomToolTip } from "../../../component/widgets/CustomToolTip";
import { InfoTooltip } from "../../../component/widgets/tooltip/InfoTooltip";
import { showAlert } from '../../../redux/actions/AppActions';
import { getYmsNodeConfigStatus } from "../../../serviceActions/InplantServiceActions";
import { getOrderList } from "../../../serviceActions/OrderServiceActions";
import { getVehicleTemplateShipment } from "../../../serviceActions/VehicleServiceActions";
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import InboundShipment from "../inboundShipment/InboundShipment";
import './GateIn.css';
import PlaceShipmentModal from "./PlaceShipmentModal";


function GateIn() {
    const appDispatch = useDispatch();
    const history = useHistory();
    const { id } = useParams<any>();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [openPointModal, setOpenPointModal] = React.useState<boolean>(false);
    const [openPlacementModal, setOpenPlacementModal] = React.useState<boolean>(false);
    const [response, setResponse] = React.useState<any>({});
    const eclipseLength = isMobile ? 6 : 28;
    const [vehicleTemplate, setVehicleTemplate] = React.useState<any>(undefined);
    const [isVehicleUpdated, setIsVehicleUpdated] = React.useState<boolean>(false);

    useEffect(() => {
        const getList = async () => {
            setLoading(true);
            let queryParams: any = {
                freightOrderCode: id,
                shipmentStatusCodes: OrderStatus.PENDING + "," + OrderStatus.CONFIRMED + "," + OrderStatus.ORIGIN_ARRIVED
            }
            appDispatch(getVehicleTemplateShipment({ isRequired: 1 })).then((response: any) => {
                if (response) {
                    let currentVehicleTemplate: any = []
                    response.length > 0 && response.forEach((item: any, index: any) => {
                        currentVehicleTemplate.push({
                            ...item,
                            certName: {
                                label: item.certificateDisplayName,
                                value: item.certificateName
                            },
                            index: index,
                        })
                    })
                    setVehicleTemplate(currentVehicleTemplate)
                }
                // setInitialLoading(false);
            })

            appDispatch(getOrderList(queryParams)).then((response: any) => {
                let orderDetails = ((response && response.results && response.results[0]) || {});
                if (orderDetails && orderDetails.freightTypeCode && orderDetails.freightTypeCode === FreightType.FTL) {
                    let shipmentDetails = orderDetails.shipmentDetails.map((element: any) => ({
                        ...element,
                        checked: false,
                    }
                    ));
                    setResponse((prev: any) => ({
                        ...orderDetails,
                        shipmentDetails: shipmentDetails
                    }))
                } else {
                    setResponse(orderDetails);
                }
                setLoading(false);
            });
        }
        id && getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVehicleUpdated]);

    return (
        <div className="order-detail-wrapper gate-in-wrap">
            <PlaceShipmentModal
                vehicleTemplate={vehicleTemplate}
                open={openPlacementModal}
                selectedElement={response && response}
                orderDetails={response}
                setIsVehicleUpdated={() => {
                    setIsVehicleUpdated(!isVehicleUpdated)
                }}
                onSuccess={() => {
                    setOpenPlacementModal(false);
                    history.goBack();
                }}
                onClose={() => {
                    setOpenPlacementModal(false);
                }}
            />
            <LanePointsDisplayModal
                open={openPointModal}
                laneCode={response && response.laneCode}
                onClose={() => {
                    setOpenPointModal(false);
                }} />
            <div className="filter-wrap">
                <Filter
                    pageTitle={"Inbound"}
                    buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                    buttonTitle={isMobile ? " " : "Back"}
                    leftIcon={<KeyboardBackspace />}
                    onClick={() => {
                        history.goBack();
                    }}
                />
            </div>
            <PageContainer>
                <Card className="creat-contract-wrapp creat-wrapp">
                    <CardHeader className="creat-contract-header"
                        title="Order Detail"
                    />
                    {loading ?
                        <CardContentSkeleton
                            row={3}
                            column={3}
                        />
                        : <CardContent className="creat-contract-content">
                            <div className="custom-form-row row">
                                <div className="col-md-3 billing-group col-6">
                                    <Information
                                        title={orderCodeLabel}
                                        text={response.freightOrderCode}
                                    />
                                </div>
                                <div className="col-md-3 billing-group col-6">
                                    <Information
                                        title={freightTypeLabel}
                                        text={response.freightTypeCode}
                                    />
                                </div>
                                <div className="col-md-3 billing-group col-6">
                                    <Information
                                        title={laneZoneTitle}
                                        text={(response?.originZoneName && response?.destinationZoneName) && (response?.originZoneName + " -> " + response?.destinationZoneName)}
                                        customView={response?.laneName && <LaneView element={response} onClickLaneCode={(data: any) => { setOpenPointModal(true); }} />}
                                    />
                                </div>
                                <div className="col-md-3 billing-group col-6">
                                    <Information
                                        title={transporterLabel}
                                        text={response.partnerName}
                                    />
                                </div>
                                <div className="col-md-3 billing-group col-6">
                                    <Information
                                        title={referenceIdLabel}
                                        text={response.referenceId}
                                    />
                                </div>
                                <div className="col-md-3 billing-group col-6">
                                    <Information
                                        title={lanePriceLabel}
                                        text={response.lanePrice}
                                    />
                                </div>
                                <div className="col-md-3 billing-group col-6">
                                    <Information
                                        title={VolumeLabel}
                                        text={response.totalOrderVolume || response.totalVolumeDemand}
                                        tooltip={() => (response.freightTypeCode === FreightType.FTL &&
                                            <InfoTooltip
                                                utilizationValue={response.volumeUtilisation ? response.volumeUtilisation : (response.totalOrderVolume || response.totalVolumeDemand) && "0"}
                                                utilizationTooltip
                                                title={"Volume Utilized"}
                                                placement="bottom"
                                                disableInMobile={"false"}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="col-md-3 billing-group col-6">
                                    <Information
                                        title={"Weight (kg)"}
                                        text={response.totalOrderWeight || response.totalWeightDemand}
                                        tooltip={() => (response.freightTypeCode === FreightType.FTL &&
                                            <InfoTooltip
                                                utilizationValue={response.weightUtilisation ? response.weightUtilisation : (response.totalOrderWeight || response.totalWeightDemand) && "0"}
                                                utilizationTooltip
                                                title={"Weight Utilized"}
                                                placement="bottom"
                                                disableInMobile={"false"}
                                            />
                                        )}
                                    />
                                </div>
                                {response?.freightTypeCode === FreightType.FTL &&
                                    <>
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={vehicleNumberHint}
                                                text={response?.vehicleRegistrationNumber}
                                            />
                                        </div>
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={driverNameLabel}
                                                text={response?.primaryDriverName}
                                                customView={
                                                    response?.primaryDriverName &&
                                                    <InfoTooltip
                                                        title={response?.primaryDriverName || ""}
                                                        placement="top"
                                                        disableInMobile={"false"}
                                                        infoText={response?.primaryDriverName || "NA"}
                                                    />
                                                }
                                            />
                                        </div>
                                        <div className="col-md-3 billing-group col-6">
                                            <Information
                                                title={driverNumberLabel}
                                                text={response?.primaryDriverNumber}
                                            />
                                        </div>
                                    </>}
                                <div className="col-md-3 billing-group col-6">
                                    <Information
                                        title={orderCreationDateTime}
                                        text={response.createdAt && convertDateFormat(response.createdAt, displayDateTimeFormatter)}
                                    />
                                </div>
                                <div className="col-md-3 billing-group col-6">
                                    <Information
                                        title={"Order Status"}
                                        valueClassName="orange-text"
                                        text={response.statusName}
                                    />
                                </div>
                                <div className="labelWidth col-md-3 billing-group col-6">
                                    <Information
                                        title={remarkLabel}
                                        customView={
                                            <div className="d-flex ">
                                                <p>{response.orderRemarks || "NA"}</p>
                                                {
                                                    response.orderRemarks &&
                                                    response.orderRemarks.length >= eclipseLength &&
                                                    <CustomToolTip
                                                        title={response.orderRemarks}
                                                        placement={"top"}
                                                        disableInMobile={"false"}
                                                    >
                                                        <span className="blue-text">more</span>
                                                    </CustomToolTip>
                                                }
                                            </div>
                                        }
                                    />
                                </div>

                            </div>
                        </CardContent>
                    }
                </Card>

                {response && response.shipmentDetails && (
                    <>
                        {
                            response.shipmentDetails.map((element: any, index: any) => (
                                <InboundShipment
                                    key={index}
                                    element={element}
                                    loading={loading}
                                    onCheckChange={(checked: boolean, shipemntCode: any) => {
                                        // if (response.freightTypeCode === FreightType.PTL) {
                                        let shipmentDetails = response.shipmentDetails.map((element: any) => (
                                            (element.freightShipmentCode === shipemntCode) ? {
                                                ...element,
                                                checked: checked,
                                            } : element
                                        ));
                                        setResponse((prev: any) => ({
                                            ...prev,
                                            shipmentDetails: shipmentDetails
                                        }))
                                        // }
                                    }}
                                />
                            ))
                        }
                        <div className="text-right">
                            <Button
                                buttonStyle="btn-blue"
                                title="Place"
                                loading={loading}
                                leftIcon={<LocalShipping />}
                                onClick={async () => {
                                    let selectedList = response.shipmentDetails && response.shipmentDetails.filter((element: any) => element.checked === true);
                                    if (selectedList && selectedList.length === 0) {
                                        appDispatch(showAlert("Select shipment to gate in", false));
                                        return;
                                    }
                                    setLoading(true);
                                    let nodeCodes: any = []
                                    // eslint-disable-next-line
                                    selectedList && selectedList.forEach((item: any) => {
                                        if (!(nodeCodes.includes(item.originLocationCode))) {
                                            nodeCodes.push(item.originLocationCode)
                                        }
                                    })
                                    let ymsEnabledStatusParams = {
                                        nodeCode: nodeCodes
                                    }
                                    const ymsNodeConfigResponse = await appDispatch(getYmsNodeConfigStatus(ymsEnabledStatusParams))
                                    if (ymsNodeConfigResponse && ymsNodeConfigResponse.code === 200) {
                                        if (!isNullValue(ymsNodeConfigResponse.details)) {
                                            appDispatch(showAlert("Action is not allowed, please proceed through YMS", false));
                                            setLoading(false);
                                            return;
                                        }
                                    } else {
                                        appDispatch(showAlert("Something went wrong. Please try again", false))
                                        setLoading(false);
                                        return;
                                    }
                                    setLoading(false);
                                    if (selectedList && selectedList.length > 0) {
                                        setOpenPlacementModal(true);
                                    }
                                }}
                            />
                        </div>
                    </>
                )}
            </PageContainer>
        </div>
    );

}
export default GateIn;