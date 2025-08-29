import { Checkbox } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';
import React from 'react';
import { demandOrderTabsEnum, stockTransferStatusEnum } from '../../../../base/constant/ArrayList';
import { errorQuantityZero } from '../../../../base/constant/MessageUtils';
import { convertDateFormat, displayDateTimeFormatter } from '../../../../base/utility/DateUtils';
import { isMobile } from '../../../../base/utility/ViewUtils';
import { InfoTooltip } from '../../../../component/widgets/tooltip/InfoTooltip';
import { ColumnStateModel } from "../../../../Interfaces/AppInterfaces";
import DemandOrderAction from '../../demandOrders/base/demandOrderAction';

export const stoTableColumn = (onClickViewButton: Function, onClickSourceButton: Function, tabName: string) => {
    const columnList: ColumnStateModel[] = [
        {
            id: 'sourceNumber', label: 'Source No.', format: (value: any) => value || ".....",
            customView: (element: any) => {
                return (
                    <label
                        className="lane-wrap lane-content lane-content-mobile text-truncate slisting-soNum"
                        onClick={() => {
                            onClickSourceButton(element)
                        }}
                    >
                        <InfoTooltip
                            title={element.sourceNumber || "....."}
                            placement={"top"}
                            disableInMobile={"false"}
                            infoText={element.sourceNumber || "....."}
                        />
                    </label>)
            }
        },
        {
            id: 'locationName', label: 'Location', format: (value: any) => value || ".....",
            customView: (element: any) => {
                let key = 'locationName'
                return (<InfoTooltip
                    title={element[key] || "....."}
                    placement={"top"}
                    disableInMobile={"false"}
                    infoText={element[key] || "....."}
                />)
            }
        },
        { id: 'consigneeName', label: 'Consignee', format: (value: any) => value || "....." },
        { id: 'quantity', label: 'Total QTY', format: (value: any) => value || "....." },
        { id: 'unit', label: 'UoM', format: (value: any) => value || "....." },
        {
            id: 'balanceQuantity', label: 'Balance QTY', format: (value: any) => value || ".....",
            customView: (element: any) => {
                return (element && (element.balanceQuantity ? element.balanceQuantity : element.quantity ? errorQuantityZero : ".....")) || "NA";
            }
        },
        {
            id: 'dispatchQuantity', label: 'Dispatch QTY', format: (value: any) => value || ".....",
            customView: (element: any) => {
                return (element && (element.dispatchQuantity ? element.dispatchQuantity : element.quantity ? errorQuantityZero : ".....")) || "NA";
            }
        },
        { id: 'createdAt', label: 'Created At', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "....." },
    ]
    if (tabName !== stockTransferStatusEnum.COMPLETED) {
        columnList.push({ id: 'endDateTime', label: 'Expiry Date', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "....." })
    }
    if (tabName === stockTransferStatusEnum.COMPLETED) {
        columnList.push({ id: 'completedAt', label: 'Completed At', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "....." })
    }
    if (tabName && (tabName === stockTransferStatusEnum.PENDING)) {
        columnList.push(
            {
                id: 'action', label: 'Action', buttonLabel: "Create Demand", type: "action", leftIcon: <img src="/images/Weight.png" alt="weight" />,
                onClickActionButton: onClickViewButton, class: () => 'btn-sm btn-outline-blue weightImg'
            }
        )
    }
    isMobile && columnList.push({
        id: 'sto-product', label: 'See More', buttonLabel: "STO", type: "expand", leftIcon: <ArrowForward />,
    })
    return columnList;
};

export const stoBulkTableColumn = (handleChecks: Function, handleAllChecks: Function, allValue: boolean, onClickSourceButton: Function, tabName: string) => {
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
                </div>,
            customView: (element: any) =>
                <div className="checkbox-warp">
                    <Checkbox
                        onChange={(e) => {
                            handleChecks(element.sourceNumber, e.target.checked);
                        }}
                        checked={element.isCheckboxChecked ? true : false}
                        name="checked"
                    />
                </div>
        },

        {
            id: 'sourceNumber', label: 'Source No.', format: (value: any) => value || ".....",
            customView: (element: any) => {
                return (
                    <label
                        className="lane-wrap lane-content lane-content-mobile text-truncate slisting-soNum"
                        onClick={() => {
                            onClickSourceButton(element)
                        }}
                    >
                        <InfoTooltip
                            title={element.sourceNumber || "....."}
                            placement={"top"}
                            disableInMobile={"false"}
                            infoText={element.sourceNumber || "....."}
                        />
                    </label>)
            }
        },
        { id: 'locationName', label: 'Location', format: (value: any) => value || "....." },
        { id: 'consigneeName', label: 'Consignee', format: (value: any) => value || "....." },
        { id: 'quantity', label: 'Total QTY', format: (value: any) => value || "....." },
        { id: 'unit', label: 'UoM', format: (value: any) => value || "....." },
        {
            id: 'balanceQuantity', label: 'Balance QTY', format: (value: any) => value || ".....",
            customView: (element: any) => {
                return (element && (element.balanceQuantity ? element.balanceQuantity : element.quantity ? errorQuantityZero : ".....")) || "NA";
            }
        },
        {
            id: 'dispatchQuantity', label: 'Dispatch QTY', format: (value: any) => value || ".....",
            customView: (element: any) => {
                return (element && (element.dispatchQuantity ? element.dispatchQuantity : element.quantity ? errorQuantityZero : ".....")) || "NA";
            }
        },
        { id: 'createdAt', label: 'Created At', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "....." },
    ]
    if (tabName !== stockTransferStatusEnum.COMPLETED) {
        columnList.push({ id: 'endDateTime', label: 'Expiry Date', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "....." })
    }

    isMobile && columnList.push({
        id: 'sto-product', label: 'See More', buttonLabel: "STO", type: "expand", leftIcon: <ArrowForward />,
    })

    return columnList;
};

export const stoChildColumn = () => {
    const columnList: ColumnStateModel[] = [
        {
            id: 'productName', label: 'Product Name', format: (value: any) => value || ".....",
        },
        {
            id: 'productType', label: 'Product Type', format: (value: any) => value || ".....",
        },
        {
            id: 'productCode', label: 'SKU', format: (value: any) => value || ".....",
        },
        {
            id: 'productDescription', label: 'Description', format: (value: any) => value || ".....",
        },
        { id: 'productQuantity', label: 'Total QTY', format: (value: any) => value || errorQuantityZero },
        { id: 'unit', label: 'UoM', format: (value: any) => value || "....." },
        { id: 'balanceQuantity', label: 'Balance QTY', format: (value: any) => value || errorQuantityZero },
        { id: 'dispatchQuantity', label: 'Dispatch QTY', format: (value: any) => value || errorQuantityZero },
    ]
    return columnList;
}

export const stoDemandOrderTableColumn = (onClickDemandButton: Function, onClickApprove: Function, onClickModifyAccept: Function, onClickModifyReject: Function, onClickEdit: Function, onClickDelete: Function, status: string) => {
    const columnList: ColumnStateModel[] = [
        {
            id: 'demandOrderCode', label: 'Demand Order', format: (value: any) => value || ".....",
            customView: (element: any) => {
                return (
                    <label
                        className="lane-wrap lane-content lane-content-mobile slisting-soNum text-truncate"
                        onClick={() => {
                            onClickDemandButton(element)
                        }}
                    >
                        <InfoTooltip
                            title={element.demandOrderCode || "....."}
                            placement={"top"}
                            disableInMobile={"false"}
                            infoText={element.demandOrderCode || "....."}
                        />
                    </label>)
            }
        },
        { id: 'transporter', label: 'Transporter', format: (value: any) => (value && value.transporterName) || "....." },
        { id: 'quantity', label: 'QTY', format: (value: any) => value || "....." },
        { id: 'unit', label: 'UoM', format: (value: any) => value || "....." },
        {
            id: 'vendorName', label: 'Customer', format: (value: any) => value || ".....",
        },
        { id: 'createdAt', label: 'Created At', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "....." },
        { id: 'dispatchBy', label: 'Dispatched By', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "....." },
        { id: 'status', label: 'Status', format: (value: any) => value || ".....", class: () => 'orange-text' },
        {
            id: 'sourceNumber', label: 'Source No.', format: (value: any) => value || ".....",
        },
        {
            id: 'action', label: 'Action', format: (value: any) => value || ".....", type: "multiAction",
            customView: (element: any) => {
                return (
                    <DemandOrderAction
                        status={element && element.status}
                        isDisabled={!(element && (element.status === demandOrderTabsEnum.PENDING || element.status === demandOrderTabsEnum.MODIFY_REQUEST))}
                        onClickApprove={() => {
                            if (element && element.status === demandOrderTabsEnum.PENDING) {
                                onClickApprove(element);
                            } else if (element && element.status === demandOrderTabsEnum.MODIFY_REQUEST) {
                                onClickModifyAccept(element);
                            }
                        }}
                        onClickEdit={() => {
                            onClickEdit(element);
                        }}
                        onClickDelete={() => {
                            if (element && element.status === demandOrderTabsEnum.PENDING) {
                                onClickDelete(element);
                            } else if (element && element.status === demandOrderTabsEnum.MODIFY_REQUEST) {
                                onClickModifyReject(element);
                            }
                        }}
                    />
                )
            }
        }
    ]
    return columnList;
};

export const stoDemandOrderChildrenTableColumn = () => {
    const columnList: ColumnStateModel[] = [

        {
            id: 'productName', label: 'Product Name', format: (value: any) => value || ".....",
        },
        {
            id: 'productType', label: 'Product Type', format: (value: any) => value || ".....",
        },
        {
            id: 'productCode', label: 'SKU', format: (value: any) => value || ".....",
        },
        {
            id: 'productDescription', label: 'Description', format: (value: any) => value || ".....",
        },
        { id: 'productQuantity', label: 'Total QTY', format: (value: any) => value || "....." },
        { id: 'unit', label: 'UoM', format: (value: any) => value || "....." },
    ]
    return columnList;
}

