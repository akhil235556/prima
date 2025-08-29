import { Visibility } from '@material-ui/icons';
import React from 'react';
import { convertDateFormat, displayDateTimeFormatter } from '../base/utility/DateUtils';
import { LaneView } from '../component/CommonView';
import { ColumnStateModel } from "../Interfaces/AppInterfaces";


export const shipmentLogListingTableColumns = (onClickViewButton: Function, onClickLaneCode: Function) => {
    const columnList: ColumnStateModel[] = [
        { id: 'freightOrderCode', label: 'Order Code', format: (value: any) => value || "NA" },
        { id: 'freightShipmentCode', label: 'Shipment Code', format: (value: any) => value || "NA" },
        { id: 'freightTypeCode', label: 'Freight Type', format: (value: any) => value || "NA" },
        { id: 'partnerName', label: 'Transporter', format: (value: any) => value || "NA" },
        {
            id: 'laneName', label: 'Lane', format: (value: any) => value || "NA",
            customView: (element: any) => <LaneView element={element} onClickLaneCode={(data: any) => { onClickLaneCode(data) }} />
        },
        { id: 'vehicleRegistrationNumber', label: 'Vehicle Number', format: (value: any) => value || "NA" },
        { id: 'airwaybillNumber', label: 'Waybill Number', format: (value: any) => value || "NA" },
        { id: 'consigneeName', label: 'Consignee', format: (value: any) => value || "NA" },
        { id: 'shipmentReferenceId', label: 'Shipment Reference Id', format: (value: any) => value || "NA" },
        { id: 'orderReferenceId', label: 'Order Reference Id', format: (value: any) => value || "NA" },
        { id: 'lrNumber', label: 'LR Number', format: (value: any) => value || "NA" },
        { id: 'orderStatus', label: 'Status', format: (value: any) => value || "NA", class: () => 'orange-text' },
        {
            id: '', label: 'Action', buttonLabel: "View", type: "action", leftIcon: <Visibility />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm table-col-btn view-mob btn-mobile-ml'
        }
    ]
    return columnList;
};

export const shipmentLogDetailTableColumns = () => {
    const columnList: ColumnStateModel[] = [
        { id: 'status', label: 'Status', format: (value: any) => value || "NA", class: () => 'orange-text' },
        { id: 'subStatus', label: 'Sub Status', format: (value: any) => value || "NA" },
        { id: 'scanTime', label: 'Applied Date Time', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA" },
        { id: 'address', label: 'Address', format: (value: any) => value || "NA" },
        {
            id: 'remarks', label: 'Remarks', format: (value: any) => value || "NA",
        },
    ]
    return columnList;
};


