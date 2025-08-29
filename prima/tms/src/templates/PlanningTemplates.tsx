import { Checkbox } from "@material-ui/core";
import { ArrowForward, LocalShipping, Visibility } from "@material-ui/icons";
import Info from "@material-ui/icons/Info";
import React from 'react';
import { materialAndQuantityTooltipColumn } from "../base/constant/ArrayList";
import { laneZoneTitle, VolumeLabel } from "../base/constant/MessageUtils";
import { convertDateFormat, displayDateTimeFormatter } from '../base/utility/DateUtils';
import { LaneView } from '../component/CommonView';
import Button from '../component/widgets/button/Button';
import { CustomTooltipTable } from "../component/widgets/CustomToolTipTable";
import { InfoTooltip } from "../component/widgets/tooltip/InfoTooltip";
import { ColumnStateModel } from "../Interfaces/AppInterfaces";


export const orderTableColumns = (onClickView: Function, onClickLaneCode: Function) => {
    const columnList: ColumnStateModel[] = [
        { id: 'freightOrderCode', label: 'Order Code', format: (value: any) => value || "NA" },
        { id: 'freightTypeCode', label: 'Freight Type', format: (value: any) => value || "NA" },
        { id: 'partnerName', label: 'Transporter', format: (value: any) => value || "NA" },
        {
            id: 'lane', label: laneZoneTitle, format: (value: any) => value || "NA",
            customView: (element: any) => (element?.originZoneName && element.destinationZoneName) ? (element?.originZoneName + " -> " + element.destinationZoneName) : element?.laneCode && element?.laneName ? <LaneView element={element} onClickLaneCode={(data: any) => { onClickLaneCode(data) }} /> : "NA"
        },
        { id: 'createdAt', label: 'Order Date and Time', format: (value: any) => convertDateFormat(value, displayDateTimeFormatter) || "NA" },
        { id: 'statusName', label: 'Status', format: (value: any) => value || "NA", class: () => 'orange-text' },
        { id: 'referenceId', label: 'Reference Id', format: (value: any) => value || "NA", class: () => 'orange-text' },
        { id: 'serviceabilityModeCode', label: 'Mode of Transportation', format: (value: any) => value || "NA", class: () => 'orange-text' },
        {
            id: 'action', label: 'Action', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return ((element && <div className="action-btn-wrap">
                    <Button
                        buttonStyle="btn-detail btn-sm ml-2"
                        title="Details"
                        leftIcon={<Visibility />}
                        onClick={() => {
                            onClickView(element)
                        }}
                    />

                </div>) || "NA")
            }
        }
    ]
    return columnList;
};

export const orderMobileTableColumns = (onClickView: Function, onClickLaneCode: Function) => {
    const columnList: ColumnStateModel[] = [
        { id: 'freightOrderCode', label: 'Order Code', format: (value: any) => value || "NA" },
        { id: 'freightTypeCode', label: 'Freight Type', format: (value: any) => value || "NA" },
        { id: 'partnerName', label: 'Transporter', format: (value: any) => value || "NA" },
        {
            id: 'lane', label: 'Lane', format: (value: any) => value || "NA",
            customView: (element: any) => <LaneView element={element} onClickLaneCode={(data: any) => { onClickLaneCode(data) }} />
        },
        { id: 'createdAt', label: 'Order Date and Time', format: (value: any) => convertDateFormat(value, displayDateTimeFormatter) || "NA" },
        { id: 'statusName', label: 'Status', format: (value: any) => value || "NA", class: () => 'orange-text' },
        {
            id: 'action', label: 'Action', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return ((element && <div className="action-btn-wrap">
                    <Button
                        buttonStyle="btn-detail btn-sm ml-2"
                        title="Details"
                        leftIcon={<Visibility />}
                        onClick={() => {
                            onClickView(element)
                        }}
                    />

                </div>) || "NA")
            }
        },
        {
            id: 'gate-in', label: 'See More', buttonLabel: "Gate In", type: "expand", leftIcon: <ArrowForward />,
        }
    ]
    return columnList;
};

export const orderChildrenTableColumns = () => {
    const columnList: ColumnStateModel[] = [
        { id: 'freightShipmentCode', label: 'Shipment Code', format: (value: any) => value || "NA" },
        {
            id: 'pickupLocationName', label: 'Pickup Point', format: (value: any) => value || "NA",
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
            id: 'dropLocationName', label: 'Drop Point', format: (value: any) => value || "NA",
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
        { id: 'vehicleRegistrationNumber', label: 'Vehicle Number', format: (value: any) => value || "NA" },
        { id: 'airwaybillNumber', label: 'Waybill Number', format: (value: any) => value || "NA" },
        { id: 'lrNumber', label: 'LR Number', format: (value: any) => value || "NA" },
        {
            id: 'articleDetails', label: 'Material and Quantity', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return ((
                    <CustomTooltipTable
                        tableColumn={materialAndQuantityTooltipColumn}
                        tableData={element.articleDetails}
                        customIcon={<ul className="view-text blue-text d-flex align-items-center">
                            <li><Info /></li>
                            <li>View</li>
                        </ul>
                        }
                    />
                ) || "NA")
            }
        },
        { id: 'shipmentRefId', label: 'Shipment Reference Id', format: (value: any) => value || "NA" },
        { id: 'statusName', label: 'Status', format: (value: any) => value || "NA", class: () => 'orange-text' },
    ]
    return columnList;
}

export const planningHistoryTableColumns = (onClickDetailButton: Function) => {
    const columnList: ColumnStateModel[] = [
        { id: 'requestId', label: 'Planning Task ID', format: (value: any) => value || "NA" },
        { id: 'planningName', label: 'Type', format: (value: any) => value || "NA" },
        { id: 'planningStartTime', label: 'Planning Start Date Time', format: (value: any) => ((value && convertDateFormat(value, displayDateTimeFormatter)) || "NA") },
        { id: 'planningEndTime', label: 'Planning Completed Date Time', format: (value: any) => ((value && convertDateFormat(value, displayDateTimeFormatter)) || "NA") },
        { id: 'totalKms', label: 'Distance (km)', format: (value: any) => value || "NA" },
        { id: 'stops', label: 'Stops', format: (value: any) => value || "NA" },
        { id: 'createdAt', label: 'Created At', format: (value: any) => ((value && convertDateFormat(value, displayDateTimeFormatter)) || "NA") },
        { id: 'totalCost', label: 'Cost (₹)', format: (value: any) => value || "NA" },
        { id: 'statusName', label: 'Status', format: (value: any) => value || "NA", class: () => 'orange-text' },
        { id: 'remarks', label: 'Remarks', format: (value: any) => value || "NA" },
        {
            id: 'action', label: 'Action', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return ((element && <div className="action-btn-wrap">
                    <Button
                        buttonStyle="btn-detail btn-sm ml-2"
                        title="Details"
                        leftIcon={<Visibility />}
                        onClick={() => {
                            onClickDetailButton(element)
                        }}
                    />

                </div>) || "NA")
            }
        }
    ]
    return columnList;
};
export const planningCreatePlanColumns = (onClickView: Function) => {
    const columnList: ColumnStateModel[] = [

        { id: 'routeId', label: 'Route ID', format: (value: any) => ((value) || 'NA') },
        { id: 'vehicleType', label: 'Vehicle Type', format: (value: any) => ((value) || 'NA') },
        { id: 'totalWeightCarrying', label: 'Load Carrying (KG)', format: (value: any) => ((value) || 'NA') },
        { id: 'totalVolumeCarrying', label: 'Volume Carrying (CBM)', format: (value: any) => ((value) || 'NA') },
        { id: 'weightUtilisation', label: 'Weight Utilisation(%)', format: (value: any) => ((value) || 'NA') },
        { id: 'volumeUtilisation', label: 'Volume Utilisation(%)', format: (value: any) => ((value) || 'NA') },
        { id: 'totalKms', label: 'Total Run(KM)', format: (value: any) => ((value) || 'NA') },
        { id: 'totalTime', label: 'Time Taken(hrs)', format: (value: any) => ((value) || 'NA') },
        { id: 'totalCost', label: 'Cost', format: (value: any) => ((value) || 'NA') },
        { id: 'fromCity', label: 'From City', format: (value: any) => ((value) || 'NA') },
        { id: 'toCity', label: 'To City', format: (value: any) => ((value) || 'NA') },
        // {
        //     id: 'action', label: 'Action', format: (value: any) => value || "NA",
        //     customView: (element: any) => {
        //         return ((element && <div className="action-btn-wrap">
        //             <Button
        //                 buttonStyle="btn-detail btn-sm ml-2"
        //                 title="Details"
        //                 leftIcon={<Visibility />}
        //                 onClick={() => {
        //                     onClickView(element)
        //                 }}
        //             />
        //         </div>) || "NA")
        //     }
        // }
    ]
    return columnList;
};

export const planningCreatePlanChildrenColumns = () => {
    const columnList: ColumnStateModel[] = [
        { id: 'orderId', label: 'Demand Order', format: (value: any) => ((value) || 'NA') },
        { id: 'consignee', label: 'Consignee', format: (value: any) => ((value) || 'NA') },
        { id: 'consigneeLocation', label: 'Consignee Location', format: (value: any) => ((value) || 'NA') },
        { id: 'weightKg', label: 'Weight(Kg)', format: (value: any) => ((value) || 'NA') },
        { id: 'volumeCbm', label: 'Volume(m³)', format: (value: any) => ((value) || 'NA') },
        { id: 'dispatchedBy', label: 'Dispatch by', format: (value: any) => ((convertDateFormat(value, displayDateTimeFormatter)) || 'NA') },
        { id: 'priority', label: 'Priority', format: (value: any) => ((value) || 'NA') }
    ]
    return columnList;
};

export const planningDispatchHistoryTableColumns = (onClickLaneCode: Function) => {
    const columnList: ColumnStateModel[] = [
        { id: 'partnerName', label: 'Transporter', format: (value: any) => value || "NA" },
        {
            id: 'lane', label: 'Lane', format: (value: any) => value || "NA",
            customView: (element: any) => <LaneView element={element} onClickLaneCode={(data: any) => { onClickLaneCode(data) }} />
        },
        { id: 'freightType', label: 'Freight Type', format: (value: any) => value || "NA" },
        { id: 'vehicleTypeName', label: 'Vehicle Type', format: (value: any) => value || "NA" },
        { id: 'volume', label: VolumeLabel, format: (value: any) => (value && value.toFixed(3)) || "NA" },
        { id: 'weight', label: 'Weight (Kg)', format: (value: any) => (value && value.toFixed(3)) || "NA" },
        { id: 'quantity', label: 'Number of Vehicle', format: (value: any) => value || "NA" },
        // { id: 'status', label: 'Status', format: (value: any) => value || "NA", class: () => 'orange-text' },
    ]
    return columnList;
};

export const planningDispatchTableColumns = (onClickViewButton: Function, onClickLaneCode: Function) => {
    const columnList: ColumnStateModel[] = [
        { id: 'partnerName', label: 'Transporter', format: (value: any) => value || "NA" },
        {
            id: 'lane', label: 'Lane', format: (value: any) => value || "NA",
            customView: (element: any) => <LaneView element={element} onClickLaneCode={(data: any) => { onClickLaneCode(data) }} />
        },
        { id: 'freightType', label: 'Freight Type', format: (value: any) => value || "NA" },
        { id: 'vehicleTypeName', label: 'Vehicle Type', format: (value: any) => value || "NA" },
        { id: 'volume', label: VolumeLabel, format: (value: any) => (value && value.toFixed(3)) || "NA" },
        { id: 'weight', label: 'Weight (Kg)', format: (value: any) => (value && value.toFixed(3)) || "NA" },
        { id: 'quantity', label: 'Number of Vehicle', format: (value: any) => value || "NA" },
        {
            id: 'action', label: 'Action', buttonLabel: "Raise Order", type: "action", leftIcon: <LocalShipping />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm'
        }
    ]
    return columnList;
};

export const dashboardTableColumns = () => {
    const columnList: ColumnStateModel[] = [
        { id: 'originLocationName', label: 'Origin', format: (value: any) => value || "NA" },
        { id: 'destinationLocationName', label: 'Destination', format: (value: any) => value || "NA" },
        { id: 'productName', label: 'SKU Name', format: (value: any) => value || "NA" },
        // { id: 'productSku', label: 'SKU Code', format: (value: any) => value || "NA" },
        { id: 'count', label: 'Total Units', format: (value: any) => value || "NA" },
        { id: 'volume', label: VolumeLabel, format: (value: any) => (value && value.toFixed(3)) || "NA" },
        { id: 'weight', label: 'Weight (Kg)', format: (value: any) => (value && value.toFixed(3)) || "NA" },
        // { id: 'vehicleCode', label: 'Dispatch', format: (value: any) => value || "NA" },
    ]
    return columnList;
};

export const historyLogTableColumns = () => {
    const columnList: ColumnStateModel[] = [
        { id: 'createdAt', label: 'Date', format: (value: any) => ((value && convertDateFormat(value, displayDateTimeFormatter)) || "NA") },
        { id: 'message', label: 'Description', format: (value: any) => value || "NA" },
    ]
    return columnList;
};

export const materialListTableColumn = () => {
    const columnList: ColumnStateModel[] = [
        { id: 'articleName', label: 'Material Name', format: (value: any) => value || "NA" },
        { id: 'totalArticleCount', label: 'Material Quantity', format: (value: any) => value || "NA" },
        { id: 'totalArticleQuantity', label: 'Product Quantity', format: (value: any) => (value && value.toFixed(3)) || "NA" },
        { id: 'uom', label: 'UoM', format: (value: any) => value || "NA" },
        { id: 'refDocketNumber', label: 'Ref. Docket No.', format: (value: any) => value || "NA" }

    ]
    return columnList;
};

export const errorPlanningTableColumn = (onClickView: any) => {
    const columnList: ColumnStateModel[] = [
        { id: 'error', label: 'Error', format: (value: any) => value || "NA" },
        { id: 'errorType', label: 'Error Type', format: (value: any) => value || "NA" },
        { id: 'description', label: 'Description', format: (value: any) => value || "NA" },
        {
            id: 'action', label: 'Action', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return ((element && <div className="action-btn-wrap">
                    <Button
                        buttonStyle="btn-detail btn-sm"
                        title="View"
                        leftIcon={<Visibility />}
                        onClick={() => {
                            onClickView(element)
                        }}
                    />

                </div>) || "NA")
            }
        }
    ]
    return columnList;
};

export const placementDateTimeTableColumn = (isAllchecked: boolean, handleChecks: Function, handleAllChecks: Function) => {
    const columnList: ColumnStateModel[] = [
        {
            id: '', label: '', format: (value: any) => value || "NA",
            customHead: () =>
                <div className="checkbox-warp">
                    <Checkbox
                        onChange={(e) => {
                            handleAllChecks(e.target.checked)
                        }}
                        checked={isAllchecked}
                    />
                    All
                </div>,
            customView: (element: any) =>
                <div className="checkbox-warp">
                    <Checkbox
                        onChange={(e) => {
                            handleChecks(element.id, e.target.checked);
                        }}
                        checked={element.isCheckboxChecked ? true : false}
                        name="checked"
                    />
                </div>
        },
        { id: 'freightShipmentCode', label: 'Shipment Code', format: (value: any) => value || "NA" },
        { id: 'pickupLocationName', label: 'Pickup Point', format: (value: any) => value || "NA" },
        { id: 'dropLocationName', label: 'Drop Point', format: (value: any) => value || "NA" },
        { id: 'vehicleRegistrationNumber', label: 'Vehicle Number', format: (value: any) => value || "NA" },
        { id: 'previousPlacementDateTime', label: 'Existing Placement Date and Time', format: (value: any) => ((value && convertDateFormat(value, displayDateTimeFormatter)) || "NA") },
        { id: 'placementDateTime', label: 'Requested Placement Date and Time', format: (value: any) => ((value && convertDateFormat(value, displayDateTimeFormatter)) || "NA") },
    ]
    return columnList;
}

export const placementDateTimeChildrenTableColumn = () => {
    const columnList: ColumnStateModel[] = [
        { id: 'freightShipmentCode', label: 'Shipment Code', format: (value: any) => value || "NA" },
        { id: 'pickupLocationName', label: 'Pickup Point', format: (value: any) => value || "NA" },
        { id: 'dropLocationName', label: 'Drop Point', format: (value: any) => value || "NA" },
        { id: 'vehicleRegistrationNumber', label: 'Vehicle Number', format: (value: any) => value || "NA" },
        { id: 'previousPlacementDateTime', label: 'Existing Placement Date and Time', format: (value: any) => ((value && convertDateFormat(value, displayDateTimeFormatter)) || "NA") },
        { id: 'placementDateTime', label: 'Requested Placement Date and Time', format: (value: any) => ((value && convertDateFormat(value, displayDateTimeFormatter)) || "NA") },
    ]
    return columnList;
}
