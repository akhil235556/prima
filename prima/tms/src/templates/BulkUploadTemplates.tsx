import React from 'react';
import { ColumnStateModel } from "../Interfaces/AppInterfaces";
import { convertDateFormat, displayDateFormatter } from '../base/utility/DateUtils';
import { Visibility } from "@material-ui/icons";
export const bulkUploadListingTableColumns = (onClickViewButton: Function) => {
    const columnList: ColumnStateModel[] = [

        { id: 'requestId', label: 'Request Id', format: (value: any) => value || "NA" },
        { id: 'jobName', label: 'Job Entity', format: (value: any) => value || "NA" },
        { id: 'status', label: 'Status', format: (value: any) => value || "NA", class: () => 'orange-text' },
        { id: 'createdAt', label: 'Job Created Date', format: (value: any) => (value && convertDateFormat(value, displayDateFormatter)) || "NA" },
        {
            id: 'requestId', label: 'Action', buttonLabel: "View", type: "action", leftIcon: <Visibility />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm table-col-btn'
        },
    ]
    return columnList;
};

export const errorCodeTableColumns = (onClickViewButton: Function) => {
    const columnList: ColumnStateModel[] = [
        { id: 'errorName', label: 'Error Code', format: (value: any) => value || "NA" },
        { id: 'errorDescription', label: 'Description ', format: (value: any) => value || "NA" },
        {
            id: 'payload', label: 'Raw Data', buttonLabel: "View", type: "action", leftIcon: <Visibility />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm table-col-btn'
        },
    ]
    return columnList;
};
