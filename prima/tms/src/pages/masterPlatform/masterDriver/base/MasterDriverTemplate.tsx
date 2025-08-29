import { Switch } from '@material-ui/core';
import { Visibility } from '@material-ui/icons';
import React from 'react';
import { convertDateFormat, displayDateFormatter } from '../../../../base/utility/DateUtils';
import { ColumnStateModel } from '../../../../Interfaces/AppInterfaces';

export const masterDriverColumn = (onClickViewButton: Function, onChange: Function) => {
    const columnList: ColumnStateModel[] = [

        { id: 'driverName', label: 'Driver Name', format: (value: any) => value || "NA" },
        { id: 'contactNumber', label: 'Driver Mobile Number', format: (value: any) => value || "NA" },
        { id: 'createdAt', label: 'Created At', format: (value: any) => (value && convertDateFormat(value, displayDateFormatter)) || "NA" },
        {
            id: 'isDedicated', label: 'Source Type', format: (value: any) => value ? "Dedicated" : "Market" || "NA",
            customView: (element: any) => (
                <div className='d-flex align-items-center'>
                    <img
                        className='mr-2'
                        src={(element.isDedicated && element.isDedicated === true) ? "/images/Dedicated.svg" : "/images/Market.svg"}
                        alt="vehicle"
                    /><span>{(element.isDedicated && element.isDedicated === true ? "Dedicated" : "Market")}</span>
                </div>
            )
        },
        {
            id: 'isActive', label: 'Status', format: (value: any) => value,
            customView: (element: any) => {
                return ((
                    <div className="driver-switch">
                        <Switch
                            checked={element.isActive ? true : false}
                            onChange={(event: any, checked: boolean) => onChange(element, checked)}
                        />
                        <span className='orange-text disable-txt switchs'>{element.isActive ? 'Enabled' : 'Disabled'}</span>
                    </div>
                ) || "NA")
            }
        },
        {
            id: 'track', label: 'Action', buttonLabel: "View", type: "action", leftIcon: <Visibility />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm table-col-btn'
        }
    ]
    return columnList;
};
