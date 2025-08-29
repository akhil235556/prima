import { Visibility } from '@material-ui/icons';
import Numeral from "numeral";
import React from 'react';
import { tatLabelWithoutUnit } from '../base/constant/MessageUtils';
import { ListAuctionLaneView } from '../component/CommonView';
import { ColumnStateModel } from "../Interfaces/AppInterfaces";
import { convertHoursInDays } from '../base/utility/DateUtils';

export const auctionTableColumns = (onClickViewButton: Function, onClickLaneCode: any) => {
    const columnList: ColumnStateModel[] = [
        { id: 'auctionCode', label: 'Auction Code', format: (value: any) => value || "NA" },
        {
            id: 'lane', label: 'Lane', format: (value: any) => (value && value.displayName) || "NA",
            customView: (element: any) => <ListAuctionLaneView element={element} onClickLaneCode={(data: any) => { onClickLaneCode(data) }} />
        },
        { id: 'lane', label: 'Freight Type', format: (value: any) => (value && value.freightType) || "NA" },
        { id: 'lane', label: 'Vehicle Type', format: (value: any) => (value && value.vehicleType) || "NA" },
        { id: 'lane', label: tatLabelWithoutUnit, format: (value: any) => (value && value.tat && convertHoursInDays(value.tat)) || "NA" },
        { id: 'basePrice', label: 'Ceiling Price ( ₹ )', format: (value: any) => (value && Numeral(value).format('0,0.00')) || "NA" },
        // { id: 'dateTime', label: 'Placement Date and Time', format: (value: any) => value || "NA" },
        { id: 'status', label: 'Status', format: (value: any) => value || "NA", class: (status: any) => getClassName(status) },
        {
            id: 'action', label: 'Action', buttonLabel: "View", type: "action", leftIcon: <Visibility />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail'
        }

    ]
    return columnList;
};

function getClassName(value: any) {
    if (value === "Scheduled")
        return "orange-text"
    if (value === "Live")
        return "blue-text"
    if (value === "Completed")
        return "green-text"
    if (value === "Cancelled")
        return "red-text"
    if (value === "Closed")
        return "blue-text"
    if (value === "Terminated")
        return "red-text"
}

