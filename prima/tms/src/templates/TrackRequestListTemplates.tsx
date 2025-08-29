import React from "react";
import { trackRequestTabEnum } from "../base/constant/ArrayList";
import { convertDateFormat, displayDateTimeFormatter } from "../base/utility/DateUtils";
import { isMobile } from "../base/utility/ViewUtils";
import { ListFreightLaneView } from "../component/CommonView";
import { ColumnStateModel } from "../Interfaces/AppInterfaces";
import TrackRequestActionButton from "../modals/TrackRequestActionButton";

export const trackRequestTabsListingColumn = (onClickLaneCode: Function, tabName: any, onClickApprove: Function, onClickReject: Function) => {
    const columnList: ColumnStateModel[] = [
        { id: 'freightOrderCode', label: 'Order Code', format: (value: any) => value || "NA" },
        { id: 'freightType', label: 'Freight Type', format: (value: any) => value || "NA" },
        {
            id: 'laneName', label: 'Lane', format: (value: any) => value || "NA",
            customView: (element: any) => <ListFreightLaneView element={element} onClickLaneCode={(data: any) => { onClickLaneCode(data) }} />
        },
        { id: 'partnerName', label: 'Transporter', format: (value: any) => value || "NA" },
        { id: 'createdAt', label: 'Requested Date and Time', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA" },
        { id: 'orderPlacementDateTime', label: 'Order Placement Data and Time', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA" },
        { id: 'previousVehicleTypeName', label: "Existing Vehicle Type", format: (value: any) => value || "NA" },
        { id: 'vehicleTypeName', label: "Requested Vehicle Type", format: (value: any) => value || "NA" },
        // eslint-disable-next-line
        { id: 'lanePrice', label: "Existing Lane Price" + " ( ₹ )", format: (value: any) => value || "NA" },
    ]
    if (tabName === 0) {
        columnList.push({
            id: 'action', label: 'Action', format: (value: any) => value || "NA", type: "multiAction",
            customView: (element: any) => {
                if (tabName === 0) {
                    return (
                        <div className={"action-btn-wrap" + (isMobile ? " d-flex" : "")}>
                            <TrackRequestActionButton
                                statusTab={tabName}
                                isDisabled={element.status === trackRequestTabEnum.APRROVED}
                                onClickApprove={() => {
                                    onClickApprove(element);
                                }}
                                onClickReject={() => {
                                    onClickReject(element);
                                }}
                            />
                        </div>
                    )
                }
            }
        },
        )
    } else if (tabName === 1) {
        columnList.push({
            id: "newLanePrice",
            // eslint-disable-next-line
            label: "New Lane Price" + " ( ₹ )",
            format: (value: any) => value || "NA",
        });
    }

    return columnList;
}

export const trackRequestPlacementDateTimeTableColumn = (onClickLaneCode: Function, tabName: any, onClickApprove: Function, onClickReject: Function) => {
    const columnList: ColumnStateModel[] = [
        { id: 'freightOrderCode', label: 'Order Code', format: (value: any) => value || "NA" },
        { id: 'freightType', label: 'Freight Type', format: (value: any) => value || "NA" },
        { id: 'partnerName', label: 'Transporter', format: (value: any) => value || "NA" },
        {
            id: 'laneName', label: 'Lane', format: (value: any) => value || "NA",
            customView: (element: any) => <ListFreightLaneView element={element} onClickLaneCode={(data: any) => { onClickLaneCode(data) }} />
        },
        { id: 'orderDateTime', label: 'Order Date and Time', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA" },
        // eslint-disable-next-line
        // { id: 'orderStatus', label: "Status", format: (value: any) => value || "NA", class: () => 'orange-text' },
    ]
    if (tabName === 0) {
        columnList.push({
            id: 'action', label: 'Action', format: (value: any) => value || "NA", type: "multiAction",
            customView: (element: any) => {
                if (tabName === 0) {
                    return (
                        <div className={"action-btn-wrap" + (isMobile ? " d-flex" : "")}>
                            <TrackRequestActionButton
                                isDisabled={false}
                                statusTab={tabName}
                                onClickApprove={() => {
                                    onClickApprove(element);
                                }}
                                onClickReject={() => {
                                    onClickReject(element);
                                }}
                            />
                        </div>
                    )
                }
            }
        },
        )
    }

    return columnList;
}