import { Visibility } from "@material-ui/icons";
import React from 'react';
import { convertDateFormat, convertMinutesInDays, displayDateTimeFormatter } from '../base/utility/DateUtils';
import { LaneView } from "../component/CommonView";
import { ColumnStateModel } from "../Interfaces/AppInterfaces";

export const simTrackingListingTableColumns = (onClickViewButton: Function, onClickLaneCode: Function) => {
    const columnList: ColumnStateModel[] = [

        { id: 'tripCode', label: 'Trip Code', format: (value: any) => value || "NA" },
        { id: 'partnerName', label: 'Transporter', format: (value: any) => value || "NA" },
        { id: 'vehicleTypeName', label: 'Vehicle Type', format: (value: any) => value || "NA" },
        {
            id: 'laneDisplayName', label: 'Lane', format: (value: any) => value || "NA",
            customView: (element: any) =>
                element && element.laneName === "NA" ? "NA" :
                    <LaneView element={element} onClickLaneCode={(data: any) => { onClickLaneCode(data) }} />
        },
        { id: 'serviceabilityModeName', label: 'Serviceability Mode', format: (value: any) => value || "NA" },
        { id: 'vehicleNumber', label: 'Vehicle Number', format: (value: any) => value || "NA" },
        // { id: 'phoneNumber', label: 'Driver Number', format: (value: any) => value || "NA" },
        { id: 'tripTimeMins', label: 'Trip Duration', format: (value: any) => (value && convertMinutesInDays(value)) || "NA" },
        { id: 'pings', label: 'No of Pings', format: (value: any) => value || "NA" },
        { id: 'tripStatus', label: 'Trip Status', format: (value: any) => value || "NA", class: (status: any) => getClassName(status) },
        {
            id: 'action', label: 'Action', buttonLabel: "View", type: "action", leftIcon: <Visibility />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm table-col-btn'
        },
    ]
    return columnList;
};

export const simTrackingDetailTableColumns = () => {
    const columnList: ColumnStateModel[] = [

        // { id: 'tripCode', label: 'Vehicle Number', format: (value: any) => value || "NA" },
        { id: 'phoneNumber', label: 'Driver Number', format: (value: any) => value || "NA" },
        { id: 'dateTime', label: 'Date and Time', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA" },
        { id: 'trackingType', label: 'Type', format: (value: any) => value || "NA" },
        { id: 'latitude', label: 'Latitude', format: (value: any) => value || "NA" },
        { id: 'longitude', label: 'Longitude', format: (value: any) => value || "NA" },
        { id: 'address', label: 'Address', format: (value: any) => value || "NA" },
    ]
    return columnList;
};

function getClassName(value: any) {
    if (value === "COMPLETED")
        return "green-text"
    else if (value === "INTRANSIT")
        return "orange-text"
    else return ""
}

