import { Card, CardContent } from '@material-ui/core';
import { Info } from '@material-ui/icons';
import React from 'react';
import { appointmentDateTimeLabel, cancellationRemarkLabel, LBHLabel, MaterialLabel, numberOfBoxes, tatLabelWithoutUnit, vehicleNumberLabel, VolumeLabel } from '../../base/constant/MessageUtils';
import { convertDateFormat, convertHoursInDays, displayDateTimeFormatter } from '../../base/utility/DateUtils';
import Information from '../../component/information/Information';
import CardContentSkeleton from '../../component/widgets/cardContentSkeleton/CardContentSkeleton';
import { CustomToolTip } from '../../component/widgets/CustomToolTip';
import { InfoTooltip } from '../../component/widgets/tooltip/InfoTooltip';

interface DiversionShipmentDetailsProps {
    element: any
    index: any
    onClickMaterial: any
    statusCode: any
    eclipseLength: any
    loading: boolean
}

function DiversionShipmentDetails(props: DiversionShipmentDetailsProps) {
    const { element, index, onClickMaterial, eclipseLength, loading } = props

    return (
        <div>
            <Card
                key={index}
                className="creat-contract-wrapp creat-wrapp">
                <div className="billing-info-header detail-header">
                    <h4>{"Shipment Code: " + ((element.freightShipmentCode && element.freightShipmentCode) || "")}</h4>
                </div>
                {loading ?
                    <CardContentSkeleton
                        row={2}
                        column={4}
                    /> : <CardContent className="creat-contract-content detail-wrapp">
                        <div className="custom-form-row row">
                            {element && element.sourceNumber &&
                                <div className="col-md-3 billing-group col-6">
                                    <Information
                                        title={"Source Number"}
                                        text={element.sourceNumber}
                                    />
                                </div>}
                            <div className="col-md-3 billing-group col-6">
                                <Information
                                    title={"Pickup Point"}
                                    customView={
                                        <InfoTooltip
                                            title={element.pickupLocationName || "....."}
                                            placement={"top"}
                                            disableInMobile={"false"}
                                            infoText={element.pickupLocationName || "....."}
                                        />
                                    }
                                />
                            </div>
                            <div className="col-md-3 billing-group col-6">
                                <Information
                                    title={"Drop Point"}
                                    text={element.dropLocationName}
                                    customView={
                                        <InfoTooltip
                                            title={element.dropLocationName || "....."}
                                            placement={"top"}
                                            disableInMobile={"false"}
                                            infoText={element.dropLocationName || "....."}
                                        />
                                    }
                                />
                            </div>
                            <div className="col-md-3 billing-group col-6">
                                <Information
                                    title={tatLabelWithoutUnit}
                                    text={element.tat && convertHoursInDays(element.tat)}
                                />
                            </div>
                            <div className="col-md-3 billing-group col-6">
                                <Information
                                    title={VolumeLabel}
                                    text={element.totalShipmentVolume}
                                />
                            </div>
                            <div className="col-md-3 billing-group col-6">
                                <Information
                                    title={"Weight (kg)"}
                                    text={element.totalShipmentWeight}
                                />
                            </div>
                            <div className="col-md-3 billing-group col-6">
                                <Information
                                    title={"Placement Date and time"}
                                    text={element.placementDatetime && convertDateFormat(element.placementDatetime, displayDateTimeFormatter)}
                                />
                            </div>
                            <div className="col-md-3 billing-group col-6">
                                <Information
                                    title={"Transporter"}
                                    text={element.partnerName}
                                />
                            </div>
                            <div className="col-md-3 billing-group col-6">
                                <Information
                                    title={"Consignee"}
                                    text={element.consigneeName}
                                />
                            </div>
                            <div className="col-md-3 billing-group col-6">
                                <Information
                                    title={LBHLabel}
                                    text={element.length ? element.length + " * " + element.width + " * " + element.height : "NA"}
                                />
                            </div>
                            <div className="col-md-3 billing-group col-6">
                                <Information
                                    title={numberOfBoxes}
                                    text={element.totalShipmentQuantity}
                                />
                            </div>
                            <div className="col-md-3 billing-group col-6">
                                <Information
                                    title={appointmentDateTimeLabel}
                                    text={element.appointmentDatetime && convertDateFormat(element.appointmentDatetime, displayDateTimeFormatter)}
                                />
                            </div>
                            <div className="col-md-3 billing-group col-6">
                                <Information
                                    title={"Waybill Number"}
                                    text={element.airwaybillNumber}
                                />
                            </div>
                            <div className="col-md-3 billing-group col-6">
                                <Information
                                    title={"ELR Number"}
                                    text={element.lrNumber}
                                />
                            </div>
                            <div className="col-md-3 billing-group col-6 vehicle_list">
                                <Information
                                    title={vehicleNumberLabel}
                                    text={element.vehicleRegistrationNumber}
                                />
                            </div>
                            <div className="col-md-3 billing-group col-6">
                                <Information
                                    title={"Driver Name"}
                                    text={element.primaryDriverName}
                                    customView={
                                        element.primaryDriverName &&
                                        <InfoTooltip
                                            title={element.primaryDriverName || ""}
                                            placement="top"
                                            disableInMobile={"false"}
                                            infoText={element.primaryDriverName || "NA"}
                                        />
                                    }
                                />
                            </div>
                            <div className="col-md-3 billing-group col-6">
                                <Information
                                    title={"Driver Number"}
                                    text={element.primaryDriverNumber}
                                />
                            </div>
                            <div className="col-md-3 billing-group CustomTooltipTable col-6">
                                <Information
                                    title={MaterialLabel}
                                    valueClassName="blue-text"
                                    customView={
                                        <span className="blue-text cursor-pointer"
                                            onClick={() => {
                                                onClickMaterial()
                                                // setViewMaterialTableModal(true);
                                                // setMaterialResponse(element.articleDetails)
                                            }}
                                        >
                                            <ul className="view-text blue-text d-flex align-items-center">
                                                <li><Info /></li>
                                                <li>View</li>
                                            </ul>
                                        </span>
                                    }
                                />
                            </div>
                            <div className="col-md-3 billing-group col-6 status-text">
                                <Information
                                    title={"Status"}
                                    valueClassName="orange-text"
                                    text={element.shipmentStatusName}
                                />
                            </div>
                            <div className="labelWidth col-md-3 billing-group col-6">
                                <Information
                                    title={cancellationRemarkLabel}
                                    customView={
                                        <div className="d-flex ">
                                            <p>{element.shipmentRemarks || "NA"}</p>
                                            {
                                                element.shipmentRemarks &&
                                                element.shipmentRemarks.length >= eclipseLength &&
                                                <CustomToolTip
                                                    title={element.shipmentRemarks}
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
        </div>
    )
}

export default DiversionShipmentDetails
