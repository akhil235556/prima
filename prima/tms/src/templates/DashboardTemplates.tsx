import { ArrowForward, SwapCalls } from "@material-ui/icons";
import React from 'react';
import { tatLabelWithoutUnit } from "../base/constant/MessageUtils";
import { convertHoursInDays } from "../base/utility/DateUtils";
import { InfoTooltip } from '../component/widgets/tooltip/InfoTooltip';
import { ColumnStateModel } from "../Interfaces/AppInterfaces";

export const dashboardPageTableColumns = (onClickViewButton: Function, showLanePoints: Function) => {
    const columnList: ColumnStateModel[] = [
        { id: 'freightOrderCode', label: 'Order Code', format: (value: any) => value || "NA" },
        // { id: 'freightShipmentCode', label: 'Shipping Code', format: (value: any) => value || "NA" },
        // { id: 'freightTypeCode', label: 'Freight Type', format: (value: any) => value || "NA" },
        { id: 'partnerName', label: 'Transporter', format: (value: any) => value || "NA" },
        {
            id: 'lane', label: 'Lane', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return ((element &&
                    <span className="lane-item blue-text"
                        onClick={() => {
                            showLanePoints(element.laneCode);
                        }}
                    >
                        <InfoTooltip
                            title={element.laneName || "NA"}
                            placement={"top"}
                            disableInMobile={"false"}
                            infoText={element.laneName || "NA"}
                        />
                    </span>
                ) || "NA")
            }
        },
        // {id: 'vehicleType', label: 'Vehicle Type', format: (value: any) => value || "NA" },
        // {id: 'freightTypeCode', label: 'Freight Type', format: (value: any) => value || "NA" },
        // {id: 'vehicleRegistrationNumber', label: 'Vehicle Number', format: (value: any) => value || "NA" },
        {
            id: 'action', label: 'Action', buttonLabel: "Gate In", type: "action", leftIcon: <ArrowForward />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm'
        }
    ]
    return columnList;
};

export const dashboardDispatchTableColumns = (onClickViewButton: Function, showLanePoints: Function) => {
    const columnList: ColumnStateModel[] = [
        { id: 'freightOrderCode', label: 'Order Code', format: (value: any) => value || "NA" },
        //{id: 'freightShipmentCode', label: 'Shipping Code', format: (value: any) => value || "NA" },
        //{id: 'freightTypeCode', label: 'Freight Type', format: (value: any) => value || "NA" },
        { id: 'partnerName', label: 'Transporter', format: (value: any) => value || "NA" },
        {
            id: 'lane', label: 'Lane', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return ((element &&
                    <span className="lane-item blue-text"
                        onClick={() => {
                            showLanePoints(element.laneCode);
                        }}>
                        <InfoTooltip
                            title={element.laneName || "NA"}
                            placement={"top"}
                            disableInMobile={"false"}
                            infoText={element.laneName || "NA"}
                        />
                    </span>
                ) || "NA")
            }
        },
        // {id: 'vehicleType', label: 'Vehicle Type', format: (value: any) => value || "NA" },
        // {id: 'freightTypeCode', label: 'Freight Type', format: (value: any) => value || "NA" },
        // {id: 'vehicleRegistrationNumber', label: 'Vehicle Number', format: (value: any) => value || "NA" },
        {
            id: 'action', label: 'Action', buttonLabel: "Gate Out", type: "action", leftIcon: <ArrowForward />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm'
        }
    ]
    return columnList;
};

export const dashboardOnScheduleTableColumns = (onClickViewButton: Function, showLanePoints: Function) => {
    const columnList: ColumnStateModel[] = [

        {
            id: 'vehicleNumber', label: 'Vehicle', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return ((element &&
                    <span className="vehicle-item on-schedule d-flex align-items-center" >
                        <img src="./images/vehicle-schedule.png" alt="" className="mr-2" /> {element.vehicleNumber}
                    </span>
                ) || "NA")
            }
        },
        {
            id: 'lane', label: 'Lane', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return ((element &&
                    <span className="lane-item blue-text"
                        onClick={() => {
                            showLanePoints(element.laneCode);
                        }}
                    >
                        <InfoTooltip
                            title={element.originName + " -\u003e " + element.destinationName}
                            placement={"top"}
                            disableInMobile={"false"}
                            infoText={element.originName + " -\u003e " + element.destinationName}
                        />
                    </span>
                ) || "NA")
            }
        },
        { id: 'tat', label: tatLabelWithoutUnit, format: (value: any) => (value && convertHoursInDays(value)) || "NA" },
        {
            id: 'transientInfo', label: 'Remaining Km', format: (value: any) =>
                (value && value.remainingDistance && value.remainingDistance.toFixed(2) + " KM") || "NA"
        },
        {
            id: 'action', label: 'Action', buttonLabel: "Track", type: "action", leftIcon: <SwapCalls />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm'
        }

    ]
    return columnList;
};

export const dashboardDelayedTableColumns = (onClickViewButton: Function, showLanePoints: Function) => {
    const columnList: ColumnStateModel[] = [

        {
            id: 'vehicleNumber', label: 'Vehicle', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return ((element &&
                    <span className="vehicle-item d-flex align-items-center">
                        <img src="./images/vehicle-delayed.png" alt="" className="mr-2" />   {element.vehicleNumber}
                    </span>
                ) || "NA")
            }
        },
        {
            id: 'lane', label: 'Lane', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return ((element &&
                    <span className="lane-item blue-text"
                        onClick={() => {
                            showLanePoints(element.laneCode);
                        }}
                    >
                        <InfoTooltip
                            title={element.originName + " -\u003e " + element.destinationName}
                            placement={"top"}
                            disableInMobile={"false"}
                            infoText={element.originName + " -\u003e " + element.destinationName}
                        />
                    </span>
                ) || "NA")
            }
        },
        { id: 'tat', label: tatLabelWithoutUnit, format: (value: any) => (value && convertHoursInDays(value)) || "NA" },
        {
            id: 'transientInfo', label: 'Remaining Km', format: (value: any) =>
                (value && value.remainingDistance && value.remainingDistance.toFixed(2) + " KM") || "NA"
        },
        {
            id: 'action', label: 'Action', buttonLabel: "Track", type: "action", leftIcon: <SwapCalls />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm'
        }

    ]
    return columnList;
};


