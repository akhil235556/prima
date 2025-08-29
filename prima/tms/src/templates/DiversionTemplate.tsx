import { Visibility } from "@material-ui/icons";
import CallSplitIcon from '@material-ui/icons/CallSplit';
import Info from "@material-ui/icons/Info";
import React from 'react';
import { diversionTabEnum } from '../base/constant/ArrayList';
import { convertDateFormat, displayDateTimeFormatter } from "../base/utility/DateUtils";
import Button from '../component/widgets/button/Button';
import { InfoTooltip } from '../component/widgets/tooltip/InfoTooltip';
import { ColumnStateModel } from "../Interfaces/AppInterfaces";
import DiversionAction from '../pages/Exception/DiversionAction';


export const diversionTableColumn = (tabName: string, onClickApprove: Function, onClickReject: Function, onClickRequestId: Function, onClickProceedButton: Function, onClickRejectedDetails: Function, onClickCompletedDetails: Function) => {
    const diversionRequestColumnList: ColumnStateModel[] = [
        {
            id: 'requestId', label: 'Request Id', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return (
                    <label
                        className="lane-wrap lane-content lane-content-mobile text-truncate slisting-soNum"
                        onClick={() => {
                            onClickRequestId(element)
                        }}
                    >
                        <InfoTooltip
                            title={element.requestId || "NA"}
                            placement={"top"}
                            disableInMobile={"false"}
                            infoText={element.requestId || "NA"}
                        />
                    </label>)
            }
        },
        { id: 'oldFreightOrderCode', label: 'Diversion FO', format: (value: any) => value || "NA" },
        { id: 'freightType', label: 'Freight Type', format: (value: any) => value || "NA" },
        { id: 'totalQuantity', label: 'Total QTY', format: (value: any) => value || "NA" },
        { id: 'requestDate', label: 'Request Date and Time', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA", },
        { id: 'oldFoStatus', label: 'FO Status', format: (value: any) => value || "NA", class: () => 'orange-text' },
        {
            id: 'action', label: 'Action', format: (value: any) => value || ".....", type: "multiAction",
            customView: (element: any) => {
                return (
                    <DiversionAction
                        isEdit={false}
                        onClickApprove={() => {
                            onClickApprove(element)
                        }}
                        onClickReject={() => {
                            onClickReject(element)
                        }}
                        isDisabled={false}
                    />
                )
            }
        }
    ]
    const inProgressColumnList: ColumnStateModel[] = [
        {
            id: 'requestId', label: 'Request Id', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return (
                    <label
                        className="lane-wrap lane-content lane-content-mobile text-truncate slisting-soNum"
                        onClick={() => {
                            onClickRequestId(element)
                        }}
                    >
                        <InfoTooltip
                            title={element.requestId || "NA"}
                            placement={"top"}
                            disableInMobile={"false"}
                            infoText={element.requestId || "NA"}
                        />
                    </label>)
            }
        },
        { id: 'oldFreightOrderCode', label: 'Old Freight Order', format: (value: any) => value || "NA" },
        { id: 'freightType', label: 'Freight Type', format: (value: any) => value || "NA" },
        { id: 'totalQuantity', label: 'Total QTY', format: (value: any) => value || "NA" },
        { id: 'requestDate', label: 'Request Date and Time', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA", },
        { id: 'oldFoLastStatus', label: 'Old FO Status', format: (value: any) => value || "NA", class: () => 'orange-text' },
        {
            id: 'action', label: 'Action', format: (value: any) => value || ".....", type: "multiAction",
            customView: (element: any) => {
                return (
                    <Button
                        buttonStyle="btn-outline-blue btn-sm"
                        title="Proceed"
                        leftIcon={<CallSplitIcon />}
                        onClick={() => {
                            onClickProceedButton(element)
                        }}
                    />
                )
            }
        }
    ]
    const rejectedColumnList: ColumnStateModel[] = [
        {
            id: 'requestId', label: 'Request Id', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return (
                    <label
                        className="lane-wrap lane-content lane-content-mobile text-truncate slisting-soNum"
                        onClick={() => {
                            onClickRejectedDetails(element)
                        }}
                    >
                        <InfoTooltip
                            title={element.requestId || "NA"}
                            placement={"top"}
                            disableInMobile={"false"}
                            infoText={element.requestId || "NA"}
                        />
                    </label>)
            }
        },
        { id: 'oldFreightOrderCode', label: 'Diversion FO', format: (value: any) => value || "NA" },
        { id: 'freightType', label: 'Freight Type', format: (value: any) => value || "NA" },
        {
            id: 'lane', label: 'Lane', format: (value: any) => value || "NA",
            customView: (element: any) => {
                let key = 'lane'
                return (<InfoTooltip
                    title={element[key] || "....."}
                    placement={"top"}
                    disableInMobile={"false"}
                    infoText={element[key] || "....."}
                />)
            }
        },
        { id: 'orderDate', label: 'Order Date and Time', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA", },
        { id: 'updatedDate', label: 'Rejected Date and Time', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA", },
        {
            id: 'action', label: 'Action', format: (value: any) => value || ".....", type: "multiAction",
            customView: (element: any) => {
                return (
                    <Button
                        buttonStyle="btn-detail btn-sm"
                        title="Details"
                        leftIcon={<Visibility />}
                        onClick={() => {
                            onClickRejectedDetails(element)
                        }}
                    />
                )
            }
        }
    ]
    const completedColumnList: ColumnStateModel[] = [
        {
            id: 'requestId', label: 'Request Id', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return (
                    <label
                        className="lane-wrap lane-content lane-content-mobile text-truncate slisting-soNum"
                        onClick={() => {
                            onClickCompletedDetails(element)
                        }}
                    >
                        <InfoTooltip
                            title={element.requestId || "NA"}
                            placement={"top"}
                            disableInMobile={"false"}
                            infoText={element.requestId || "NA"}
                        />
                    </label>)
            }
        },
        { id: 'newFreightOrderCode', label: 'New Frieght Order', format: (value: any) => value || "NA" },
        { id: 'oldFreightOrderCode', label: 'Old Frieght Order', format: (value: any) => value || "NA" },
        { id: 'transporter', label: 'Transporter', format: (value: any) => value || "NA" },
        {
            id: 'lane', label: 'Lane', format: (value: any) => value || "NA",
            customView: (element: any) => {
                let key = 'lane'
                return (<InfoTooltip
                    title={element[key] || "....."}
                    placement={"top"}
                    disableInMobile={"false"}
                    infoText={element[key] || "....."}
                />)
            }
        },

        { id: 'updatedDate', label: 'Completed Date and Time', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA", },
        {
            id: 'action', label: 'Action', format: (value: any) => value || ".....", type: "multiAction",
            customView: (element: any) => {
                return (
                    <Button
                        buttonStyle="btn-detail btn-sm"
                        title="Details"
                        leftIcon={<Visibility />}
                        onClick={() => {
                            onClickCompletedDetails(element)
                        }}
                    />
                )
            }
        }
    ]
    if (tabName === diversionTabEnum.REJECTED) {
        return rejectedColumnList;
    } else if (tabName === diversionTabEnum.IN_PROGRESS) {
        return inProgressColumnList
    } else if (tabName === diversionTabEnum.COMPLETED) {
        return completedColumnList
    } else {
        return diversionRequestColumnList
    }
};

export const diversionChildColumn = (onClickViewMaterial?: Function, onClickEdit?: Function, onClickDelete?: Function, activeStep?: any, onClickDetails?: Function) => {
    const columnList: ColumnStateModel[] = [
        {
            id: 'freightShipmentCode', label: 'Shipment Code', format: (value: any) => value || "NA",
        },
        {
            id: 'pickupLocationName', label: 'Pickup point', format: (value: any) => value || "NA",
            customView: (element: any) => {
                let key = 'pickupLocationName'
                return (<InfoTooltip
                    title={element[key] || "....."}
                    placement={"top"}
                    disableInMobile={"false"}
                    infoText={element[key] || "....."}
                />)
            }
        },
        {
            id: 'dropLocationName', label: 'Drop point', format: (value: any) => value || "NA",
            customView: (element: any) => {
                let key = 'dropLocationName'
                return (<InfoTooltip
                    title={element[key] || "....."}
                    placement={"top"}
                    disableInMobile={"false"}
                    infoText={element[key] || "....."}
                />)
            }
        },
        {
            id: 'vehicleRegistrationNumber', label: 'Vehicle Number', format: (value: any) => value || "NA",
        },
        { id: 'airwaybillNumber', label: 'Waybill Number', format: (value: any) => value || "NA" },
        { id: 'lrNumber', label: 'LR Number', format: (value: any) => value || "NA" },
        {
            id: 'articleDetails', label: 'Material and Quantity', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return (
                    <div
                        className="lane-wrap lane-content lane-content-mobile text-truncate slisting-soNum"
                        onClick={() => {
                            onClickViewMaterial && onClickViewMaterial(element.articleDetails)
                        }}
                    >
                        <ul className="view-text blue-text d-flex align-items-center">
                            <li><Info /></li>
                            <li>View</li>
                        </ul>
                    </div>)
            },
        },

        { id: 'shipmentRefId', label: 'Shipment Reference Id', format: (value: any) => value || "NA" },
    ]
    onClickEdit && onClickDelete && activeStep && activeStep === 1 && (
        columnList.push({
            id: 'action', label: 'Action', format: (value: any) => value || ".....", type: "multiAction",
            customView: (element: any) => {
                return (
                    <DiversionAction
                        isEdit={true}
                        onClickEdit={() => {
                            onClickEdit(element)
                        }}
                        onClickDelete={() => {
                            onClickDelete(element)
                        }}
                        isDisabled={element.shipmentStatusCode === 999}
                    />
                )
            }
        })
    )
    onClickDetails && activeStep && activeStep === 2 && (
        columnList.push({
            id: 'action', label: 'Action', format: (value: any) => value || ".....", type: "multiAction",
            customView: (element: any) => {
                return (
                    <Button
                        buttonStyle="btn-detail btn-sm"
                        title="Details"
                        leftIcon={<Visibility />}
                        onClick={() => {
                            onClickDetails(element)
                            // onClickCompletedDetails(element)
                        }}
                    />
                )
            }
        })
    )
    return columnList;
}

