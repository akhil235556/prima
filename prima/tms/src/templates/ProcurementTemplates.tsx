import { Checkbox } from "@material-ui/core";
import { Visibility } from "@material-ui/icons";
import React from 'react';
import { getMonthName } from '../base/utility/DateUtils';
import { convertAmountToNumberFormat, floatFormatter } from '../base/utility/NumberUtils';
import { isNullValueOrZero } from '../base/utility/StringUtils';
import { LaneView } from '../component/CommonView';
import { ColumnStateModel } from "../Interfaces/AppInterfaces";

export const contractTableColumn = (onClickViewButton: Function, onClickLaneCode: Function) => {
    const columnList: ColumnStateModel[] = [
        { id: 'contractCode', label: 'Contract ID', format: (value: any) => value || "NA" },
        {
            id: 'lane', label: 'Lane/Zone', format: (value: any) => value || "NA",
            customView: (element: any) => (element && element.lane && element.lane.name === "NA" ? "NA" :
                <LaneView element={element} onClickLaneCode={(data: any) => { onClickLaneCode(data) }} />)

        },
        { id: 'partner', label: 'Transporter', format: (value: any) => (value && value.name) || "NA" },
        { id: 'contractType', label: 'Freight Type', format: (value: any) => value || "NA" },
        { id: 'vehicleType', label: 'Vehicle Type', format: (value: any) => (value && value.name) || "NA" },
        { id: 'serviceabilityModeName', label: 'Transportation Mode', format: (value: any) => value || "NA" },
        { id: 'contractStatus', label: 'Status', format: (value: any) => value || "NA", class: () => 'orange-text' },
        {
            id: 'action', label: 'Action', buttonLabel: "View", type: "action", leftIcon: <Visibility />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm table-col-btn'
        }
    ]
    return columnList;
};


export const sobTableColumn = (onClickViewButton?: Function, onClickLaneCode?: Function) => {
    const columnList: ColumnStateModel[] = [
        { id: 'sobCode', label: 'SOB ID', format: (value: any) => value || "NA" },
        {
            id: 'laneName', label: 'Lane', format: (value: any) => value || "NA",
            customView: (element: any) =>
                element && element.laneCode && element.laneName === "NA" ? "NA" :
                    <LaneView element={element} onClickLaneCode={(data: any) => { onClickLaneCode && onClickLaneCode(data) }} />
        },
        { id: 'vehicleTypeName', label: 'Vehicle Type', format: (value: any) => value || "NA" },
        { id: 'freightTypeCode', label: 'Freight Type', format: (value: any) => value || "NA" },
        {
            id: 'action', label: 'Action', buttonLabel: "View", type: "action", leftIcon: <Visibility />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm table-col-btn'
        }
    ]
    return columnList;
};

export const sobEditColumn = (onClickLaneCode: Function, onClickViewButton: Function) => {
    const columnList: ColumnStateModel[] = [
        { id: "partnerName", label: "Transporter", format: (value: any) => value || "NA", },
        {
            id: "contractId", label: "Contract", onClickActionButton: onClickViewButton, format: (value: any) => value || "NA",
            customView: (element: any) => {
                return <ContractItem onClickViewButton={() => onClickViewButton(element)} item={element} /> || "NA";
            },
        },
        { id: "level", label: "Level", format: (value: any) => value || "NA" },
        { id: "allocationPercentage", label: "Contribution %", format: (value: any) => (value && `${value}`) || "0%", },
    ];
    return columnList;
};

const ContractItem = ({ item, onClickViewButton }: any) => (
    <div className="contract-number" onClick={onClickViewButton}>
        {// eslint-disable-next-line
            <a href="#">{item.contractId}</a>}
        {(item.contractStatus === "TERMINATED") && (<span className="contract-expired">Contract Expired</span>)}
    </div>
);

export const monthlyFreightTableColumn = (onClickLaneCode: Function) => {
    const columnList: ColumnStateModel[] = [
        { id: 'contractCode', label: 'Contract Id', format: (value: any) => ((value && value) || "NA") },
        { id: 'partner', label: 'Transporter', format: (value: any) => ((value && value.name) || "NA") },
        {
            id: 'lane', label: 'Lane', format: (value: any) => value || "NA",
            customView: (element: any) => <LaneView element={element} onClickLaneCode={(data: any) => { onClickLaneCode(data) }} />
        },
        { id: 'vehicleType', label: 'Vehicle Type', format: (value: any) => ((value && value.name) || "NA") },
        { id: 'freightType', label: 'Freight Type', format: (value: any) => value || "NA" },
        { id: 'baseDieselRate', label: 'Base Diesel Rate ( \u20B9 )', format: (value: any) => value || "NA" },
        { id: 'dieselRate', label: 'Diesel Rate ( \u20B9 )', format: (value: any) => value || "NA" },
        { id: 'month', label: 'Month', format: (value: any) => ((value && !isNullValueOrZero(value) && (value < 13) && getMonthName(value - 1)) || "NA") },
        { id: 'year', label: 'Year', format: (value: any) => value || "NA" },
    ]
    return columnList;
};
export const contractFreightChargeSlabsTable = () => {
    const columnList: ColumnStateModel[] = [
        { id: 'variableName', label: 'Variables', format: (value: any) => ((value) || "NA") },
        { id: 'slabStart', label: 'Min', format: (value: any) => ((value) || "NA") },
        { id: 'slabEnd', label: 'Max', format: (value: any) => ((value) || "NA") },
        { id: 'slabRate', label: 'Amount (₹)', format: (value: any) => (value && convertAmountToNumberFormat(value, floatFormatter)) || "NA" },
    ]
    return columnList;
};

export const contractFreightChargeRulesTable = () => {
    const columnList: ColumnStateModel[] = [
        { id: 'object', label: 'Constraint', format: (value: any) => ((value) || "NA") },
        { id: 'operator', label: 'Operators', format: (value: any) => ((value || "NA")) },
        { id: 'value', label: 'Value', format: (value: any) => ((value) || "NA") },
        { id: 'preOperator', label: 'Logical Operator', format: (value: any) => value || "-" },
    ]
    return columnList;
};

export const contractFreightFTLTable = () => {
    const columnList: ColumnStateModel[] = [
        { id: 'chargeName', label: 'Charges', format: (value: any) => ((value) || "NA") },
        { id: 'operation', label: 'Operation', format: (value: any) => ((value || "NA")) },
        { id: 'variableName', label: 'Variable', format: (value: any) => ((value) || "NA") },
        // { id: 'amount', label: 'Amount (₹)', format: (value: any) => (value && convertAmountToNumberFormat(value, floatFormatter)) || "NA" },
    ]
    return columnList;
};

export const pendingContractModalTable = (handleChecks: Function, handleAllChecks: Function, allValue: boolean, onClickViewButton: Function, onClickLaneCode: Function) => {
    const columnList: ColumnStateModel[] = [
        {
            id: '#', label: '#', format: (value: any) => value || "NA",
            customHead: () =>
                <div className="checkbox-warp">
                    <Checkbox
                        onChange={(e) => {
                            handleAllChecks(e.target.checked)
                        }}
                        checked={allValue}
                    />
                    All
                </div>,
            customView: (element: any) =>
                <div className="checkbox-warp">
                    <Checkbox
                        onChange={(e) => {
                            handleChecks(element.contractCode, e.target.checked);
                        }}
                        checked={element.isCheckboxChecked ? true : false}
                        name="checked"
                    />
                </div>
        },
        { id: 'contractCode', label: 'Contract ID', format: (value: any) => ((value || "NA")) },
        {
            id: 'lane', label: 'Lane', format: (value: any) => value || "NA",
            customView: (element: any) =>
                element && element.lane && element.lane.name === "NA" ? "NA" :
                    <LaneView element={element} onClickLaneCode={(data: any) => { onClickLaneCode(data) }} />
        },
        { id: 'partner', label: 'Transporter', format: (value: any) => ((value && value.name) || "NA") },
        { id: 'contractType', label: 'Freight Type', format: (value: any) => ((value) || "NA") },
        { id: 'vehicleType', label: 'Vehicle Type', format: (value: any) => (value && value.name) || "NA" },
        { id: 'serviceabilityModeName', label: 'Transportation Mode', format: (value: any) => value || "NA" },
        { id: 'contractStatus', label: 'Status', format: (value: any) => value || "NA", class: () => 'orange-text' },
        {
            id: 'action', label: 'Action', buttonLabel: "View", type: "action", leftIcon: <Visibility />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm table-col-btn'
        }
    ]
    return columnList;
};

