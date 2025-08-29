import React from "react";
import { FreightType, materialListTooltipColumn } from "../../../base/constant/ArrayList";
import {
    ConsigneeLabel, driverNameLabel, driverNumberLabel, DropPointLabel,
    gateInDateTimeLabel,

    LBHLabel, MaterialLabel,
    numberOfBoxes, orderStatusLabel, pickUpPointLabel, placementDateTimeLabel,


    remarkLabel, tatLabelWithoutUnit,

    TranspoterLabel,
    vehicleNumberLabel,
    vehicleTypeHint, VolumeLabel
} from "../../../base/constant/MessageUtils";
import { convertDateFormat, convertHoursInDays, displayDateTimeFormatter } from "../../../base/utility/DateUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import Information from "../../../component/information/Information";
import { CustomToolTip } from "../../../component/widgets/CustomToolTip";
import { CustomTooltipTable } from "../../../component/widgets/CustomToolTipTable";
import { InfoTooltip } from "../../../component/widgets/tooltip/InfoTooltip";
import './DispatchShipment.css';

interface DispatchShipmentProps {
    element: any
    response: any
}

function DispatchShipment(props: DispatchShipmentProps) {
    const { element, response } = props;
    const eclipseLength = isMobile ? 6 : 28;
    return (

        <div className="dispatch-shipment">
            <h4><span>Shipment Code: </span> {element.freightShipmentCode}</h4>
            <div className="dispatch-shipment-detail">
                <div className="custom-form-row row">
                    <div className="col-md-3 billing-group col-6">
                        <Information
                            title={pickUpPointLabel}
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
                            title={DropPointLabel}
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
                            title={placementDateTimeLabel}
                            text={element.placementDatetime && convertDateFormat(element.placementDatetime, displayDateTimeFormatter)}
                        />
                    </div>
                    <div className="col-md-3 billing-group col-6">
                        <Information
                            title={TranspoterLabel}
                            text={element.partnerName}
                        />
                    </div>
                    <div className="col-md-3 billing-group col-6">
                        <Information
                            title={ConsigneeLabel}
                            text={element.consigneeName}
                        />
                    </div>
                    <div className="col-md-3 billing-group col-6">
                        <Information
                            title={VolumeLabel}
                            text={element && element.totalShipmentVolume}
                        />
                    </div>
                    <div className="col-md-3 billing-group col-6">
                        <Information
                            title={"Weight (kg)"}
                            text={element && element.totalShipmentWeight}
                        />
                    </div>
                    {response.freightTypeCode === FreightType.PTL &&
                        <>
                            <div className="col-md-3 billing-group col-6 vehicle_list">
                                <Information
                                    title={vehicleNumberLabel}
                                    text={element?.vehicleRegistrationNumber}
                                />
                            </div>
                            <div className="col-md-3 billing-group col-6">
                                <Information
                                    title={driverNameLabel}
                                    text={element?.primaryDriverName}
                                    customView={
                                        element?.primaryDriverName &&
                                        <InfoTooltip
                                            title={element?.primaryDriverName || ""}
                                            placement="top"
                                            disableInMobile={"false"}
                                            infoText={element?.primaryDriverName || "NA"}
                                        />
                                    }
                                />
                            </div>
                            <div className="col-md-3 billing-group col-6">
                                <Information
                                    title={driverNumberLabel}
                                    text={element?.primaryDriverNumber}
                                />
                            </div>
                        </>}
                    {response && response.freightTypeCode === FreightType.FTL &&
                        <div className="col-md-3 billing-group col-6">
                            <Information
                                title={vehicleTypeHint}
                                text={element.vehicleTypeName}
                            />
                        </div>
                    }
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
                    <div className="col-md-3 billing-group col-6">
                        <Information
                            title={"Shipment Reference Id"}
                            text={element.shipmentRefId}
                        />
                    </div>
                    <div className="col-md-3 billing-group col-6">
                        <Information
                            title={gateInDateTimeLabel}
                            text={element.originGateInTime && convertDateFormat(element.originGateInTime, displayDateTimeFormatter)}
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
                            title={orderStatusLabel}
                            valueClassName="orange-text"
                            text={element.statusName}
                        />
                    </div>
                    <div className="col-md-3 billing-group col-6">
                        <Information
                            title={MaterialLabel}
                            text={"View"}
                            valueClassName="blue-text"
                            valueTooltip={() => <CustomTooltipTable
                                tableColumn={materialListTooltipColumn}
                                tableData={element.articleDetails}
                                infoText="View"
                            />}
                        />
                    </div>
                    <div className="labelWidth col-md-3 billing-group col-6">
                        <Information
                            title={remarkLabel}
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

            </div>
        </div>
    );

}
export default DispatchShipment;