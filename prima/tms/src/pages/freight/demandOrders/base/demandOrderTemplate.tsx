import { Checkbox } from '@material-ui/core';
import { ArrowForward, LocalShipping, Visibility } from '@material-ui/icons';
import React from 'react';
import { demandOrderTabsEnum } from '../../../../base/constant/ArrayList';
import { errorQuantityZero } from '../../../../base/constant/MessageUtils';
import { convertDateFormat, displayDateTimeFormatter } from '../../../../base/utility/DateUtils';
import { isMobile } from '../../../../base/utility/ViewUtils';
import { LaneView } from '../../../../component/CommonView';
import Button from '../../../../component/widgets/button/Button';
import { InfoTooltip } from '../../../../component/widgets/tooltip/InfoTooltip';
import { ColumnStateModel } from "../../../../Interfaces/AppInterfaces";
import DemandOrderAction from './demandOrderAction';

export const demandOrderTableColumn = (onClickDemandButton: Function, onClickProceedButton: Function, onClickApprove: Function, onClickEdit: Function, onClickDelete: Function, onClickModifyAccept: Function, onClickModifyReject: Function, status: string) => {
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
        { id: 'quantity', label: 'QTY', format: (value: any) => value || "....." },
        { id: 'unit', label: 'UoM', format: (value: any) => value || "....." },
        {
            id: 'vendorName', label: 'Customer', format: (value: any) => value || ".....",
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
        { id: 'createdAt', label: 'Created At', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "....." },
        { id: 'dispatchBy', label: 'Dispatched By', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "....." },
        {
            id: 'sourceNumber', label: 'Source No.', format: (value: any) => value || ".....",
        },
    ]
    if (status &&
        (status !== demandOrderTabsEnum.PENDING)) {
        columnList.push({ id: 'transporter', label: 'Transporter', format: (value: any) => (value && value.transporterName) || "....." },)
    }
    if (status &&
        (status === demandOrderTabsEnum.APPROVED)) {
        columnList.push({ id: 'approvedBy', label: 'Approved By', format: (value: any) => value || ".....", class: () => 'orange-text', })
    }
    if (status &&
        (
            status === demandOrderTabsEnum.PENDING ||
            status === demandOrderTabsEnum.IN_PROGRESS ||
            status === demandOrderTabsEnum.APPROVED
        )) {
        columnList.push(
            {
                id: 'action', label: 'Action', format: (value: any) => value || ".....", type: "multiAction",
                customView: (element: any) => {
                    if (status === demandOrderTabsEnum.PENDING) {
                        return (
                            <DemandOrderAction
                                status={status}
                                isDisabled={false}
                                onClickApprove={() => {
                                    onClickApprove(element);
                                }}
                                onClickEdit={() => {
                                    onClickEdit(element);
                                }}
                                onClickDelete={() => {
                                    onClickDelete(element);
                                }}
                            />
                        )
                    } else if (status === demandOrderTabsEnum.IN_PROGRESS || status === demandOrderTabsEnum.APPROVED) {
                        return (
                            <Button
                                buttonStyle="btn-outline-blue proced"
                                title="Proceed"
                                leftIcon={<LocalShipping />}
                                onClick={() => {
                                    onClickProceedButton(element)
                                }}
                            />
                        )
                    }
                }
            },
        )
    }
    isMobile && columnList.push({
        id: 'do-product', label: 'See More', buttonLabel: "DO", type: "expand", leftIcon: <ArrowForward />,
    })
    return columnList;
};

export const demandOrderBulkTableColumn = (onClickDemandButton: Function, status: string, handleChecks?: Function, handleAllChecks?: Function, allValue?: boolean) => {
    const columnList: ColumnStateModel[] = [
        {
            id: '#', label: '#', format: (value: any) => value || "NA",
            customHead: () =>
                <div className="checkbox-warp">
                    <Checkbox
                        onChange={(e) => {
                            handleAllChecks && handleAllChecks(e.target.checked)
                        }}
                        checked={allValue}
                    />
                </div>,
            customView: (element: any) =>
                <div className="checkbox-warp">
                    <Checkbox
                        onChange={(e) => {
                            handleChecks && handleChecks(element.demandOrderCode, e.target.checked);
                        }}
                        checked={element.isCheckboxChecked ? true : false}
                        name="checked"
                    />
                </div>
        },
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
        { id: 'quantity', label: 'QTY', format: (value: any) => value || "....." },
        { id: 'unit', label: 'UoM', format: (value: any) => value || "....." },
        {
            id: 'vendorName', label: 'Customer', format: (value: any) => value || ".....",
        },
        { id: 'locationName', label: 'Location', format: (value: any) => value || "....." },
        { id: 'consigneeName', label: 'Consignee', format: (value: any) => value || "....." },
        { id: 'createdAt', label: 'Created At', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "....." },
        { id: 'dispatchBy', label: 'Dispatched By', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "....." },
        {
            id: 'sourceNumber', label: 'Source No.', format: (value: any) => value || ".....",
        },
    ]
    if (status &&
        (status !== demandOrderTabsEnum.PENDING)) {
        columnList.push({ id: 'transporter', label: 'Transporter', format: (value: any) => (value && value.transporterName) || "....." },)
    }
    if (status &&
        (status === demandOrderTabsEnum.APPROVED)) {
        columnList.push({ id: 'approvedBy', label: 'Approved By', format: (value: any) => value || ".....", class: () => 'orange-text', })
    }

    isMobile && columnList.push({
        id: 'do-product', label: 'See More', buttonLabel: "DO", type: "expand", leftIcon: <ArrowForward />,
    })
    return columnList;
};

export const modifyDemandColumn = (onClickDemandButton: Function, onClickModifyAccept: Function, onClickModifyReject: Function, status: string) => {
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
        {
            id: 'sourceNumber', label: 'Source No.', format: (value: any) => value || ".....",
        },
        { id: 'sourceBalanceQuantity', label: 'Source Balance QTY', format: (value: any) => value || "....." },
        { id: 'unit', label: 'UoM', format: (value: any) => value || "....." },
        { id: 'currentQuantity', label: 'Old Demand QTY', format: (value: any) => value || "....." },
        { id: 'updatedQuantity', label: 'Request QTY', format: (value: any) => value || "....." },
        { id: 'locationName', label: 'Location', format: (value: any) => value || "....." },
        { id: 'consigneeName', label: 'Consignee', format: (value: any) => value || "....." },
        { id: 'transporter', label: 'Transporter', format: (value: any) => (value && value.transporterName) || "....." },
        {
            id: 'action', label: 'Action', format: (value: any) => value || ".....", type: "multiAction",
            customView: (element: any) => {
                return (
                    <DemandOrderAction
                        status={status}
                        isDisabled={false}
                        onClickApprove={() => {
                            onClickModifyAccept(element);
                        }}
                        onClickDelete={() => {
                            onClickModifyReject(element);
                        }}
                    />
                )
            }
        },
    ];
    isMobile && columnList.push({
        id: 'do-product', label: 'See More', buttonLabel: "DO", type: "expand", leftIcon: <ArrowForward />,
    })
    return columnList;
}

export const doChildColumn = () => {
    const columnList: ColumnStateModel[] = [
        {
            id: 'productName', label: 'Product Name', format: (value: any) => value || ".....",
        },
        {
            id: 'productType', label: 'Product Type', format: (value: any) => value || ".....",
        },
        {
            id: 'materialName', label: 'Material Name', format: (value: any) => value || ".....",
        },
        {
            id: 'doMaterialUnits', label: 'Material Unit', format: (value: any) => value || ".....",
        },
        {
            id: 'productCode', label: 'SKU', format: (value: any) => value || ".....",
        },
        {
            id: 'productDescription', label: 'Description', format: (value: any) => value || ".....",
        },
        {
            id: 'balanceQuantity', label: 'Balance QTY', format: (value: any) => value || ".....",
        },
        { id: 'productQuantity', label: 'Total QTY', format: (value: any) => value || errorQuantityZero },
        { id: 'unit', label: 'UoM', format: (value: any) => value || "....." },
    ]
    return columnList;
};

export const modifyDemandChildColumn = () => {
    const columnList: ColumnStateModel[] = [
        {
            id: 'materialName', label: 'Material Name', format: (value: any) => value || ".....",
        },
        {
            id: 'doMaterialUnits', label: 'Material Units', format: (value: any) => value || ".....",
        },
        {
            id: 'updatedDoMaterialUnits', label: 'Request Material Units', format: (value: any) => value || ".....",
        },
        {
            id: 'productType', label: 'Product Type', format: (value: any) => value || ".....",
        },
        { id: 'currentQuantity', label: 'Demand QTY', format: (value: any) => value || "....." },
        { id: 'updatedQuantity', label: 'Requested Demand QTY', format: (value: any) => value || "....." },
        { id: 'unit', label: 'UoM', format: (value: any) => value || "....." },
    ]
    return columnList;
}

export const productDetailColumn = () => {
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
        { id: 'balanceQuantity', label: 'Balance QTY', format: (value: any) => value || "....." },
        { id: 'dispatchQuantity', label: 'Dispatch QTY', format: (value: any) => value || "....." },
    ]
    return columnList;
};

export const demandOrderFOColumn = (onClickLaneCode: Function, onClickViewButton: Function) => {
    const columnList: ColumnStateModel[] = [
        { id: 'freightOrderCode', label: 'Freight Order', format: (value: any) => value || "NA" },
        { id: 'freightTypeCode', label: 'Freight Type', format: (value: any) => value || "NA" },
        { id: 'vehicleTypeName', label: 'Vehicle Type', format: (value: any) => value || "NA" },
        { id: 'partnerName', label: 'Transporter', format: (value: any) => value || "NA" },
        {
            id: 'lane', label: 'Lane', format: (value: any) => (value && value.displayName) || "NA", class: () => 'lane-wrap lane-content lane-content-mobile slisting-soNum text-truncate',
            customView: (element: any) => {
                return (
                    <InfoTooltip disableInMobile={"false"} placement="top" title={element.laneName || '......'}
                        infoText={<LaneView className="lane-wrap lane-content lane-content-mobile slisting-soNum text-truncate" element={element} onClickLaneCode={(data: any) => { onClickLaneCode(data) }} /> || '......'} />
                )
            }
        },
        { id: 'statusName', label: 'Status', format: (value: any) => value || "NA", class: () => 'orange-text' },
        { id: 'createdAt', label: 'Created At', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA" },
        { id: 'weightUtilisation', label: 'Weight Utilization', format: (value: any) => (value && `${value}%`) || "0%" },
        { id: 'volumeUtilisation', label: 'Volume Utilization', format: (value: any) => (value && `${value}%`) || "0%" },
        {
            id: 'action', label: 'Action', buttonLabel: "Details", type: "action", leftIcon: <Visibility />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail mt-2 mb-2'
        }
    ]
    return columnList;
}