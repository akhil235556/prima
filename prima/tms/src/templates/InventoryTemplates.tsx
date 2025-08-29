import React from 'react';
import { ColumnStateModel } from "../Interfaces/AppInterfaces";
import { SwapVert, Close, Visibility } from "@material-ui/icons";
import Button from '../component/widgets/button/Button';
import EditText from '../component/widgets/EditText';
import { convertDateFormat, displayDateFormatter } from '../base/utility/DateUtils';
import { isMobile } from '../base/utility/ViewUtils';


export const agnTableColumns = (onClickViewButton: Function, onClickViewReceive: Function, onClickViewCancel: Function) => {
    const columnList: ColumnStateModel[] = [

        { id: 'agnCode', label: 'AGN Code', format: (value: any) => value || "NA" },
        { id: 'freightOrderCode', label: 'Freight Order Code', format: (value: any) => value || "NA" },
        { id: 'freightShipmentCode', label: 'Shipment Code', format: (value: any) => value || "NA" },
        { id: 'originLocationName', label: 'Origin', format: (value: any) => value || "NA" },
        { id: 'destinationLocationName', label: 'Destination', format: (value: any) => value || "NA" },
        { id: 'expectedDatetime', label: 'Expected Date', format: (value: any) => ((value && convertDateFormat(value, displayDateFormatter))) || "NA" },
        {
            id: 'action', label: 'Action', format: (value: any) => value || "NA", type: "multiAction",
            class: () => isMobile ? "col-12" : " ",
            customView: (element: any) => {
                return ((element && <div className={"receive-btn action-btn-wrap" + (isMobile ? " d-flex" : "")}>
                    <div className="mobile-btn">
                        <Button
                            buttonStyle="btn-detail mobile-btn btn-sm mr-2"
                            title="Receive"
                            leftIcon={<SwapVert />}
                            onClick={() => {
                                onClickViewReceive(element)
                            }}
                        />
                    </div>
                    <div className="mobile-btn ml-15">
                        <Button
                            buttonStyle="btn-detail btn-sm"
                            title="Cancel"
                            leftIcon={<Close />}
                            onClick={() => {
                                onClickViewCancel(element)
                            }}
                        />
                    </div>
                </div>) || "NA")
            }
        },
    ]
    return columnList;
};
export const agnReceiveTableColumns = (onHandleValueChangeReceived: Function, onHandleValueChangeShortage: Function, onHandleValueChangeDamaged: Function) => {
    const columnList: ColumnStateModel[] = [
        { id: 'productSku', label: 'Product Sku', format: (value: any) => value || "NA" },
        { id: 'productName', label: 'Product Name', format: (value: any) => value || "NA" },
        { id: 'expectedCount', label: 'Expected Units', format: (value: any) => value || "NA" },
        {
            id: 'receivedCount', label: 'Received Units', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return ((element && <div className="receive-form-wrap">
                    <EditText
                        placeholder="0"
                        value={element.receivedCount}
                        name="receivedCount"
                        maxLength={200}
                        onChange={(text: any) => {
                            onHandleValueChangeReceived(text, element)
                        }}
                    />
                </div>) || "NA")
            }
        },
        {
            id: 'damagedCount', label: 'Damaged Units', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return ((element && <div className="receive-form-wrap">
                    <EditText
                        placeholder="0"
                        value={element.damagedCount}
                        name="damagedCount"
                        maxLength={200}
                        onChange={(text: any) => {
                            onHandleValueChangeDamaged(text, element)
                        }}
                    />
                </div>) || "NA")
            }
        },
        {
            id: 'shortageCount', label: 'Shortage Units', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return ((element && <div className="receive-form-wrap">
                    <EditText
                        placeholder="0"
                        value={element.shortageCount}
                        maxLength={200}
                        name="shortageCount"
                        onChange={(text: any) => {
                            onHandleValueChangeShortage(text, element)
                        }}
                    />
                </div>) || "NA")
            }
        },
    ]
    return columnList;
};

export const agnHistoryTableColumns = (onClickViewButton: Function) => {
    const columnList: ColumnStateModel[] = [
        { id: 'agnCode', label: 'AGN Code', format: (value: any) => value || "NA" },
        { id: 'freightOrderCode', label: 'Freight Order Code', format: (value: any) => value || "NA" },
        { id: 'freightShipmentCode', label: 'Shipment Code', format: (value: any) => value || "NA" },
        { id: 'originLocationName', label: 'Origin', format: (value: any) => value || "NA" },
        { id: 'destinationLocationName', label: 'Destination', format: (value: any) => value || "NA" },
        { id: 'statusName', label: 'Status', format: (value: any) => value || "NA", class: (value: any) => "orange-text" },
        { id: 'expectedDatetime', label: 'Expected Date', format: (value: any) => ((value && convertDateFormat(value, displayDateFormatter)) || "NA") },
        {
            id: 'view', label: 'Action', buttonLabel: "View", type: "action", leftIcon: <Visibility />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm'

        }
    ]
    return columnList;
};

// function getStatusClass(status: string) {
//     switch (status) {
//         case "PENDING":
//             return "orange-text";
//         case "CANCELLED":
//             return "red-text";
//         default:
//             return "blue-text";
//     }
// }

export const agnHistoryViewTableColumns = () => {
    const columnList: ColumnStateModel[] = [
        { id: 'productSku', label: 'Product Sku', format: (value: any) => value || "NA" },
        { id: 'productName', label: 'Product Name', format: (value: any) => value || "NA" },
        { id: 'expectedCount', label: 'Expected Units', format: (value: any) => value || "NA" },
        {
            id: 'receivedCount', label: 'Received Units', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return ((element && <div className="receive-form-wrap">
                    <EditText
                        placeholder="0"
                        value={element && element.receivedCount}
                        disabled={true}
                        maxLength={200}
                        onChange={() => {

                        }}
                    />
                </div>) || "NA")
            }
        },
        {
            id: 'damagedCount', label: 'Damaged Units', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return ((element && <div className="receive-form-wrap">
                    <EditText
                        placeholder="0"
                        value={element && element.damagedCount}
                        disabled={true}
                        maxLength={200}
                        onChange={() => {

                        }}
                    />
                </div>) || "NA")
            }
        },
        {
            id: 'shortageCount', label: 'Shortage Units', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return ((element && <div className="receive-form-wrap">
                    <EditText
                        placeholder="0"
                        value={element && element.shortageCount}
                        disabled={true}
                        maxLength={200}
                        onChange={() => {

                        }}
                    />
                </div>) || "NA")
            }
        },
    ]
    return columnList;
};
export const forecastTableColumns = () => {
    const columnList: ColumnStateModel[] = [
        { id: 'locationName', label: 'Location', format: (value: any) => value || "NA" },
        { id: 'skuCode', label: 'Product Sku', format: (value: any) => value || "NA" },
        { id: 'skuName', label: 'Product Name', format: (value: any) => value || "NA" },
        { id: 'forecastDays', label: 'Forecast Days', format: (value: any) => value || "0" },
        { id: 'forecastUnits', label: 'Forecast Units', format: (value: any) => value || "0" },
        { id: 'invCoverDays', label: 'Inventory Days', format: (value: any) => value || "0" },
    ]
    return columnList;
};

export const inventoryViewTableColumns = (onClickViewButton: Function) => {
    const columnList: ColumnStateModel[] = [
        { id: 'locationName', label: 'Location', format: (value: any) => value || "NA" },
        { id: 'skuCode', label: 'Product Sku', format: (value: any) => value || "NA" },
        { id: 'skuName', label: 'Product Name', format: (value: any) => value || "NA" },
        { id: 'inhandUnits', label: 'In Hand Units', format: (value: any) => value || "0" },
        { id: 'inventoryCoverUnits', label: 'Re-Order Units', format: (value: any) => value || "0" },
        { id: 'invCoverDays', label: 'Inventory Days', format: (value: any) => value || "0" },
        { id: 'intransitUnits', label: 'In Transit Units', format: (value: any) => value || "0" },
        {
            id: 'inventoryCoverStatus', label: 'Excess/Short Units', format: (value: any) => value || "0",
            class: (value: any) => (value && (value > 0)) ? 'green-text' : "red-text"
        },
    ]
    return columnList;
};

export const salesOrderTableColumns = (onClickViewButton: Function) => {
    const columnList: ColumnStateModel[] = [
        { id: 'orderId', label: 'Order Code', format: (value: any) => value || "NA" },
        { id: 'locationName', label: 'Location', format: (value: any) => value || "NA" },
        { id: 'orderDate', label: 'Order date', format: (value: any) => ((value && convertDateFormat(value, displayDateFormatter)) || "NA") },
        { id: 'status', label: 'Status', format: (value: any) => value || "NA", class: () => 'green-text' },
        {
            id: 'view', label: 'Action', buttonLabel: "View", type: "action", leftIcon: <Visibility />,
            onClickActionButton: onClickViewButton, class: () => 'btn-detail btn-sm table-col-btn'
        }
    ]
    return columnList;
};

export const articleTableColumns = () => {
    const columnList: ColumnStateModel[] = [
        { id: 'skuCode', label: 'Product Code', format: (value: any) => value || "NA" },
        { id: 'skuName', label: 'Product Name', format: (value: any) => value || "NA" },
        { id: 'units', label: 'Inventory Units', format: (value: any) => value || "0" },
    ]
    return columnList;
};
