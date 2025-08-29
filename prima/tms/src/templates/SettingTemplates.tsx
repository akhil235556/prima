import { Create, Settings, Visibility } from "@material-ui/icons";
import React from "react";
import Button from "../component/widgets/button/Button";
import { ColumnStateModel } from "../Interfaces/AppInterfaces";

export const userTableColumns = (onClickViewButton: Function) => {
    const columnList: ColumnStateModel[] = [

        { id: 'name', label: 'Name', format: (value: any) => value || "NA", },
        { id: 'phoneNumber', label: 'Mobile Number', format: (value: any) => value || "NA" },
        {
            id: 'username', label: 'Username', format: (value: any) => value || "NA",
        },
        { id: 'email', label: 'Email', format: (value: any) => value || "NA" },
        {
            id: 'track', label: 'Action', buttonLabel: "Edit", type: "action", leftIcon: <Create />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm track-btn'
        }
    ]
    return columnList;
};

export const roleTableColumns = (onClickViewButton: Function) => {
    const columnList: ColumnStateModel[] = [

        {
            id: 'name', label: 'Role', format: (value: any) => value || "NA",
            cellIconLeft: (element: any) => element.isSystemRole && <Settings className="orange-text" />
        },
        {
            id: 'track', label: 'Action',
            customView: (element: any) => {
                return ((element &&
                    <Button
                        buttonStyle="btn-detail btn-sm ml-0"
                        title={(!element.isSystemRole) ? "Modify" : "View"}
                        leftIcon={(!element.isSystemRole) ? <Create /> : <Visibility />}
                        onClick={() => {
                            onClickViewButton(element)
                        }}
                    />) || "NA")
            }
        }
    ]
    return columnList;
};