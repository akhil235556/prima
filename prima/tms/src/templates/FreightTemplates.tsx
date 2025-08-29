import { Checkbox } from "@material-ui/core";
import { Visibility } from "@material-ui/icons";
import React from 'react';
import { laneZoneTitle } from "../base/constant/MessageUtils";
import { convertDateFormat, displayDateTimeFormatter } from "../base/utility/DateUtils";
import { isObjectEmpty } from "../base/utility/StringUtils";
import { ListShipmentLaneView } from '../component/CommonView';
import AutoComplete from "../component/widgets/AutoComplete";
import AutoSuggest from "../component/widgets/AutoSuggest";
import NumberEditText from "../component/widgets/NumberEditText";
import { OptionType } from "../component/widgets/widgetsInterfaces";
import { ColumnStateModel } from "../Interfaces/AppInterfaces";
import { autosuggestSearchLength } from "../moduleUtility/ConstantValues";
import { dipatchedByLabel, lanePlaceholder, lanePriceLabel, transporterPlaceholder } from "../pages/freight/demandOrders/base/demandOrderMessageUtils";

export const freightTableColumns = (onClickViewButton: Function, onClickLaneCode: Function) => {
    const columnList: ColumnStateModel[] = [

        { id: 'orderDetails', label: 'Order Code', format: (value: any) => (value && value.freightOrderCode) || "NA" },
        { id: 'shipmentDetails', label: 'Shipment Code', format: (value: any) => (value && value.freightShipmentCode) || "NA" },
        { id: 'orderDetails', label: 'Freight Type', format: (value: any) => (value && value.freightTypeCode) || "NA" },
        {
            id: 'orderDetails', label: laneZoneTitle, format: (value: any) => value || "NA",
            customView: (element: any) => (element?.orderDetails?.originZoneName && element?.orderDetails?.destinationZoneName) ? (element?.orderDetails?.originZoneName + " -> " + element?.orderDetails?.destinationZoneName)
                : element?.orderDetails?.laneCode && element?.orderDetails?.laneName ? <ListShipmentLaneView element={element} onClickLaneCode={(data: any) => { onClickLaneCode(data) }} /> : "NA"
        },
        { id: 'shipmentDetails', label: 'Transporter', format: (value: any) => (value && value.partnerName) || "NA" },
        { id: 'shipmentDetails', label: 'Consignee', format: (value: any) => (value && value.consigneeName) || "NA" },
        { id: 'shipmentDetails', label: 'Vehicle Type', format: (value: any) => (value && value.vehicleTypeName) || "NA" },
        { id: 'shipmentDetails', label: 'Waybill Number', format: (value: any) => (value && value.airwaybillNumber) || "NA" },
        { id: 'shipmentDetails', label: 'LR Number', format: (value: any) => (value && value.lrNumber) || "NA" },
        { id: 'shipmentDetails', label: 'Shipment Reference Id', format: (value: any) => (value && value.shipmentRefId) || "NA" },
        { id: 'orderDetails', label: 'Reference Id', format: (value: any) => (value && value.referenceId) || "NA" },
        { id: 'shipmentDetails', label: 'Shipment Date and Time', format: (value: any) => (value && value.createdAt && convertDateFormat(value.createdAt, displayDateTimeFormatter)) || "NA" },
        { id: 'shipmentDetails', label: 'Status', format: (value: any) => (value && value.statusName) || "NA", class: () => 'orange-text' },
        {
            id: 'action', label: 'Action', buttonLabel: "View", type: "action", leftIcon: <Visibility />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm'
        }
    ]
    return columnList;
};

export const createDemandColumn = (isAllchecked: boolean, handleChecks: Function, handleAllChecks: Function, onHandleQuantityValueChangeDispatch: Function, onHandleUnitValueChangeDispatch: Function, onHandleMaterialValueChangeDispatch: Function) => {
    const columnList: ColumnStateModel[] = [
        {
            id: '', label: '', format: (value: any) => value || "NA",
            customHead: () =>
                <div className="checkbox-warp">
                    <Checkbox
                        onChange={(e) => {
                            handleAllChecks(e.target.checked)
                        }}
                        checked={isAllchecked}
                    />
                </div>,
            customView: (element: any) =>
                <div className="checkbox-warp">
                    <Checkbox
                        onChange={(e) => {
                            handleChecks(element.id, e.target.checked);
                        }}
                        checked={element.isCheckboxChecked ? true : false}
                        name="checked"
                    />
                </div>
        },
        { id: 'productName', label: 'Product Name', format: (value: any) => value || "NA" },
        {
            id: 'materialName', label: 'Material Name', mandatoryHeader: true, format: (value: any) => value || "NA",
            customView: (element: any) => {
                return (
                    (element && <div>
                        <AutoComplete
                            label=""
                            menuPortalTarget={document.body}
                            placeHolder="Material Name"
                            error={element.materialNameError}
                            isClearable
                            value={element.material}
                            options={element.materialOptions}
                            onChange={(value: any) => {
                                onHandleMaterialValueChangeDispatch(element.id, value)
                            }}
                        />
                    </div>)
                )
            }
        },
        {
            id: 'materialUnit', label: 'Material Unit', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return (
                    (element && <div>
                        <NumberEditText
                            placeholder="Material Unit"
                            error={element.doMaterialUnitError}
                            decimalSeparator={false}
                            allowNegative={false}
                            maxLength={10}
                            decimalScale={(!isObjectEmpty(element.material) && !isObjectEmpty(element.material.data) && element.material.data.isBulk) ? 5 : 0}
                            allowZero={(!isObjectEmpty(element.material) && !isObjectEmpty(element.material.data) && element.material.data.isBulk)}
                            value={element.doMaterialUnits}
                            onChange={(value: any) => {
                                onHandleUnitValueChangeDispatch(element.id, value)
                            }}
                        />
                    </div>)
                )
            }
        },
        { id: 'balanceQuantity', label: 'Balance QTY', format: (value: any) => value || "0" },
        {
            id: 'productQuantity', label: 'Product QTY', mandatoryHeader: true, format: (value: any) => value || "NA",
            customView: (element: any) => {
                return (
                    (element && <div>
                        <NumberEditText
                            placeholder="Product Qty"
                            error={element.productQuantityError}
                            decimalScale={5}
                            allowNegative={false}
                            allowZero
                            maxLength={10}
                            disabled={element.doMaterialUnits > 0}
                            value={element.productQuantity}
                            onChange={(value: any) => {
                                onHandleQuantityValueChangeDispatch(element.id, value)
                            }}
                        />
                    </div>)
                )
            }
        },
        { id: 'unit', label: 'UoM', format: (value: any) => value || "NA" },
    ]
    return columnList;
}

export const createBulkDemandColumn = (handleChecks: Function, onHandleQuantityValueChangeDispatch: Function, onHandleUnitValueChangeDispatch: Function, onHandleMaterialValueChangeDispatch: Function, productErrors?: any) => {
    const columnList: ColumnStateModel[] = [
        {
            id: '', label: '', format: (value: any) => value || "NA",
            /*customHead: (element: any) =>
                <div className="checkbox-warp">
                    <Checkbox
                        onChange={(e) => {
                            handleAllChecks(e.target.checked, orderId)
                        }}
                        checked={isAllchecked}
                    />
                </div>,*/
            customView: (element: any) => {
                return (
                    <div className="checkbox-warp">
                        <Checkbox
                            onChange={(e) => {
                                handleChecks(element.id, e.target.checked);
                            }}
                            checked={element.isCheckboxChecked ? true : false}
                            name="checked"
                        />
                    </div>
                )
            }

        },
        { id: 'productName', label: 'Product Name', format: (value: any) => value || "NA" },
        {
            id: 'materialName', label: 'Material Name', mandatoryHeader: true, format: (value: any) => value || "NA", class: () => 'autocomplete-width',
            customView: (element: any) => {
                return (
                    (element && <div>
                        <AutoComplete
                            label=""
                            menuPortalTarget={document.body}
                            placeHolder="Material Name"
                            error={productErrors["P" + element.id]?.materialNameError ? productErrors["P" + element.id]?.materialNameError : ""}
                            isClearable
                            value={element.material}
                            options={element.materialOptions}
                            onChange={(value: any) => {
                                onHandleMaterialValueChangeDispatch(element.id, value)
                            }}
                        />
                    </div>)
                )
            }
        },
        {
            id: 'materialUnit', label: 'Material Unit', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return (
                    (element && <div>
                        <NumberEditText
                            placeholder="Material Unit"
                            error={element.doMaterialUnitError}
                            decimalSeparator={false}
                            allowNegative={false}
                            maxLength={10}
                            decimalScale={(!isObjectEmpty(element.material) && !isObjectEmpty(element.material.data) && element.material.data.isBulk) ? 5 : 0}
                            allowZero={(!isObjectEmpty(element.material) && !isObjectEmpty(element.material.data) && element.material.data.isBulk)}
                            value={element.doMaterialUnits}
                            onChange={(value: any) => {
                                onHandleUnitValueChangeDispatch(element.id, value)
                            }}
                        />
                    </div>)
                )
            }
        },
        { id: 'balanceQuantity', label: 'Balance QTY', format: (value: any) => value || "0" },
        {
            id: 'productQuantity', label: 'Product QTY', mandatoryHeader: true, format: (value: any) => value || "NA",
            customView: (element: any) => {
                return (
                    (element && <div>
                        <NumberEditText
                            placeholder="Product Qty"
                            error={productErrors["P" + element.id]?.productQuantityError ? productErrors["P" + element.id]?.productQuantityError : ""}
                            decimalScale={5}
                            allowNegative={false}
                            allowZero
                            maxLength={10}
                            disabled={element.doMaterialUnits > 0}
                            value={element.productQuantity}
                            onChange={(value: any) => {
                                onHandleQuantityValueChangeDispatch(element.id, value)
                            }}
                        />
                    </div>)
                )
            }
        },
        { id: 'unit', label: 'UoM', format: (value: any) => value || "NA" },
    ]
    return columnList;
}

export const assignBulkTransporterColoumn = (isAllchecked: boolean, handleChecks: Function, handleAllChecks: Function, error: any, setError: Function, partnerList: any, getPartnerList: Function, userParams: any, setUserParams: Function) => {
    const columnList: ColumnStateModel[] = [
        {
            id: '', label: '', format: (value: any) => value || "NA",
            customHead: () =>
                <div className="checkbox-warp">
                    <Checkbox
                        onChange={(e) => {
                            handleAllChecks(e.target.checked)
                        }}
                        checked={isAllchecked}
                    />
                </div>,
            customView: (element: any) =>
                < div className="checkbox-warp" >
                    <Checkbox
                        onChange={(e) => {
                            handleChecks(e.target.checked, element.demandOrderCode);
                        }}
                        checked={element.isCheckboxChecked ? true : false}
                        name="checked"
                    />
                </div >
        },
        {
            id: 'demandOrderCode', label: 'Demand Order', format: (value: any) => value || "NA",
        },
        { id: 'laneDisplayName', label: 'Lane', format: (value: any) => value || ".....", class: () => 'blue-text', },
        {
            id: 'quantity', label: 'Dispatched QTY', format: (value: any) => value || "NA",

        },
        {
            id: 'dispatchBy', label: dipatchedByLabel, format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || ".....",

        },
        {
            id: 'partnerName', label: 'Transporter', mandatoryHeader: true, format: (value: any) => value || "NA",
            customView: (element: any) => {
                return (
                    (element && <div>
                        <AutoSuggest
                            placeHolder={transporterPlaceholder}
                            value={element.partnerName}
                            suggestions={partnerList}
                            error={error && error[element.index] && error[element.index].partnerName}
                            handleSuggestionsFetchRequested={({ value }: any) => {
                                if (value.length > autosuggestSearchLength) {
                                    getPartnerList(value);
                                }
                            }}
                            onSelected={(value: OptionType) => {
                                let doOrderData: any = [];
                                doOrderData = userParams && userParams.map((item: any) => {
                                    let itemObject: any = item;
                                    if (element.demandOrderCode === item.demandOrderCode) {
                                        itemObject.partnerName = value.label
                                        itemObject.partnerCode = value.value
                                        itemObject.partnerData = value.data
                                    }
                                    return itemObject;
                                })
                                setUserParams(doOrderData)
                                setError([])
                            }}
                            onChange={(text: string) => {
                                let doOrderData: any = [];
                                doOrderData = userParams && userParams.map((item: any) => {
                                    let itemObject: any = item;
                                    if (element.demandOrderCode === item.demandOrderCode) {
                                        itemObject.partnerName = text
                                        itemObject.partnerCode = ""
                                        itemObject.partnerData = undefined
                                    }
                                    return itemObject;
                                })
                                setUserParams(doOrderData)
                                setError([])
                            }}
                        />
                    </div>)
                )
            }
        },
        {
            id: 'lanePrice', label: lanePriceLabel, mandatoryHeader: true, format: (value: any) => value || "NA",
            customView: (element: any) => {
                return (
                    (element && <div>
                        <NumberEditText
                            maxLength={8}
                            allowNegative={false}
                            allowZero={false}
                            decimalScale={2}
                            placeholder={lanePlaceholder}
                            error={error && error[element.index] && error[element.index].lanePrice}
                            value={element.lanePrice}
                            onChange={(text: string) => {
                                let doOrderData: any = [];
                                doOrderData = userParams && userParams.map((item: any) => {
                                    let itemObject: any = item;
                                    if (element.demandOrderCode === item.demandOrderCode) {
                                        itemObject.lanePrice = text
                                    }
                                    return itemObject;
                                })
                                setUserParams(doOrderData)
                                setError([])
                            }}
                        />
                    </div>)
                )
            }
        },
    ]
    return columnList;
}

export const modifyApproveDemandColumn = (isAllchecked: boolean, handleChecks: Function, handleAllChecks: Function, onHandleQuantityValueChangeDispatch: Function, onHandleUnitValueChangeDispatch: Function, onHandleMaterialValueChangeDispatch: Function, getMaterialOptionList: Function) => {
    const columnList: ColumnStateModel[] = [
        {
            id: '', label: '', format: (value: any) => value || "NA",
            customHead: () =>
                <div className="checkbox-warp">
                    <Checkbox
                        onChange={(e) => {
                            handleAllChecks(e.target.checked)
                        }}
                        checked={isAllchecked}
                    />
                </div>,
            customView: (element: any) =>
                <div className="checkbox-warp">
                    <Checkbox
                        onChange={(e) => {
                            handleChecks(element.id, e.target.checked);
                        }}
                        checked={element.isCheckboxChecked ? true : false}
                        name="checked"
                    />
                </div>
        },
        { id: 'productName', label: 'Product', format: (value: any) => value || "NA" },
        {
            id: 'materialName', label: 'Material Name', mandatoryHeader: true, format: (value: any) => value || "NA",
            customView: (element: any) => {
                return (
                    (element && <div>
                        <AutoComplete
                            label=""
                            menuPortalTarget={document.body}
                            placeHolder="Material Name"
                            error={element.materialNameError}
                            isClearable
                            value={element.material}
                            options={element.materialOptions}
                            onChange={(value: any) => {
                                onHandleMaterialValueChangeDispatch(element.id, value)
                            }}
                        />
                    </div>)
                )
            }
        },
        {
            id: 'updatedDoMaterialUnits', label: 'Material Units', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return (
                    (element && <div>
                        <NumberEditText
                            placeholder="Material Units"
                            error={element.materialUnitError}
                            decimalSeparator={false}
                            allowNegative={false}
                            maxLength={10}
                            value={element.updatedDoMaterialUnits}
                            onChange={(value: any) => {
                                onHandleUnitValueChangeDispatch(element.id, value)
                            }}
                        />
                    </div>)
                )
            }
        },
        // { id: 'productType', label: 'Product Type', format: (value: any) => value || "NA" },
        { id: 'balanceQuantity', label: 'Balance QTY', format: (value: any) => value || "0" },
        {
            id: 'requestQuantity', label: 'Product QTY', mandatoryHeader: true, format: (value: any) => value || "NA",
            customView: (element: any) => {
                return (
                    (element && <div>
                        <NumberEditText
                            placeholder="Qty"
                            error={element.requestQuantityError}
                            disabled={element.updatedDoMaterialUnits > 0}
                            decimalScale={3}
                            allowNegative={false}
                            maxLength={10}
                            value={element.requestQuantity}
                            onChange={(value: any) => {
                                onHandleQuantityValueChangeDispatch(element.id, value)
                            }}
                        />
                    </div>)
                )
            }
        },
        { id: 'unit', label: 'UoM', format: (value: any) => value || "NA" }
    ]
    return columnList;
}

export const modifyGetProductColumn = () => {
    const columnList: ColumnStateModel[] = [
        { id: 'materialName', label: 'Material Name', format: (value: any) => value || "NA" },
        { id: 'productType', label: 'Product Type', format: (value: any) => value || "NA" },
        { id: 'doMaterialUnits', label: 'Material Units', format: (value: any) => value || "NA" },
        { id: 'updatedDoMaterialUnits', label: 'Requested Material Units', format: (value: any) => value || "NA" },
        { id: 'currentQuantity', label: 'Demand QTY', format: (value: any) => value || "NA" },
        { id: 'updatedQuantity', label: 'Request Demand QTY', format: (value: any) => value || "NA" },
        { id: 'unit', label: 'UoM', format: (value: any) => value || "NA" },
    ]
    return columnList;
}
