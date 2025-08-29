import { Visibility } from '@material-ui/icons';
import React from 'react';
import { ColumnStateModel } from "../../../../Interfaces/AppInterfaces";

export const CustomerTableColumn = (onClickViewButton: Function) => {
    const columnList: ColumnStateModel[] = [
        { id: 'vendorName', label: 'Customer Name', format: (value: any) => value || "NA" },
        { id: 'vendorCode', label: 'Code', format: (value: any) => value || "NA" },
        { id: 'vendorIntegrationCode', label: 'Integration Code', format: (value: any) => value || "NA" },
        { id: 'vendorAddress', label: 'Address', format: (value: any) => value || "NA" },
        { id: 'vendorPhoneNumber', label: 'Phone Number', format: (value: any) => value || "NA" },
        { id: 'vendorEmail', label: 'Email Id', format: (value: any) => value || "NA" },
        {
            id: 'track', label: 'Action', buttonLabel: "View", type: "action", leftIcon: <Visibility />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm table-col-btn'
        }
    ]
    return columnList;
};