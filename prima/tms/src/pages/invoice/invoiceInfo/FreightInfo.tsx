import React from "react";
import { Collapse } from "@material-ui/core";
import { ListLaneView } from "../../../component/CommonView";
import { convertDateFormat, displayDateTimeFormatter } from "../../../base/utility/DateUtils";

interface FreightInfoProps {
    expanded: boolean,
    orderDetails: any,
    onClickLane: any,
}

export function FreightInfo(props: FreightInfoProps) {
    const { expanded, orderDetails, onClickLane } = props;
    return (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <div className="billing-info-content freight-info-content">
                <ul className="row list-info align-items-center justify-content-center">
                    <li className="col-5 text-right">Order Code :</li>
                    <li className="col-7">{orderDetails && orderDetails.freightOrderCode}</li>
                </ul>
                <ul className="row list-info align-items-center justify-content-center">
                    <li className="col-5 text-right">Shipment Code:</li>
                    <li className="col-7">{orderDetails && orderDetails.freightShipmentCode}</li>
                </ul>
                <ul className="row list-info align-items-center justify-content-center">
                    <li className="col-5 text-right">Freight Type :</li>
                    <li className="col-7">{orderDetails && orderDetails.freightTypeCode}</li>
                </ul>
                <ul className="row list-info align-items-center justify-content-center">
                    <li className="col-5 text-right">Vehicle Type :</li>
                    <li className="col-7">{orderDetails && orderDetails.vehicleTypeName}</li>
                </ul>
                <ul className="row list-info align-items-center justify-content-center">
                    <li className="col-5 text-right">Transporter :</li>
                    <li className="col-7">{orderDetails && orderDetails.partnerName}</li>
                </ul>
                <ul className="row list-info align-items-center justify-content-center">
                    <li className="col-5 text-right">Lane :</li>
                    <li className="col-7">
                        <ListLaneView element={orderDetails} onClickLaneCode={() => {
                            onClickLane()
                        }} />
                    </li>
                </ul>
                <ul className="row list-info align-items-center justify-content-center">
                    <li className="col-5 text-right">LR No. :</li>
                    <li className="col-7">{orderDetails && orderDetails.lrNumber}</li>
                </ul>
                <ul className="row list-info align-items-center justify-content-center">
                    <li className="col-5 text-right">Order Status :</li>
                    <li className="col-7">
                        <span className="orange-text">{orderDetails && orderDetails.statusName}</span>
                    </li>
                </ul>
                <ul className="row list-info align-items-center justify-content-center">
                    <li className="col-5 text-right">Vehicle Number :</li>
                    <li className="col-7">{orderDetails && orderDetails.vehicleRegistrationNumber}</li>
                </ul>
                <ul className="row list-info align-items-center justify-content-center">
                    <li className="col-5 text-right">Driver Name :</li>
                    <li className="col-7">{orderDetails && orderDetails.primaryDriverName}</li>
                </ul>
                <ul className="row list-info align-items-center justify-content-center">
                    <li className="col-5 text-right">Driver Number</li>
                    <li className="col-7">{orderDetails && orderDetails.primaryDriverNumber}</li>
                </ul>
                <ul className="row list-info align-items-center justify-content-center">
                    <li className="col-5 text-right">Unloading Date and Time :</li>
                    <li className="col-7">{orderDetails && orderDetails.destinationGateOutTime
                        && convertDateFormat(orderDetails.destinationGateOutTime, displayDateTimeFormatter)}</li>
                </ul>
                <ul className="row list-info align-items-center justify-content-center">
                    <li className="col-5 text-right">Reporting Date and Time :</li>
                    <li className="col-7">{((orderDetails.destinationGateInTime &&
                        convertDateFormat(orderDetails.destinationGateInTime, displayDateTimeFormatter)) || "NA")}</li>
                </ul>
            </div>
        </Collapse>
    )
}
