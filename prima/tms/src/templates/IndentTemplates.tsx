import { Chip } from "@material-ui/core";
import { ArrowForward, Visibility } from "@material-ui/icons";
import { DateTimePicker } from "@material-ui/pickers";
import React from 'react';
import { OrderStatusLabel } from "../base/constant/ArrayList";
import { appointmentDatePlaceholder, indentCutoffLabel, placementCutoffLabel, placementDateTimePlaceholder } from "../base/constant/MessageUtils";
import { convertDateFormat, displayDateFormatter, displayDateTimeFormatter } from '../base/utility/DateUtils';
import { convertAmountToNumberFormat, floatFormatter } from "../base/utility/NumberUtils";
import { LaneView } from '../component/CommonView';
import Button from '../component/widgets/button/Button';
import { CustomToolTipIndent } from "../component/widgets/CustomToolTipIndent";
import EditText from '../component/widgets/EditText';
import NumberEditText from "../component/widgets/NumberEditText";
import { ColumnStateModel } from "../Interfaces/AppInterfaces";

export const indentDashboardTableColumns = (onClickLaneCode: Function) => {
    const columnList: ColumnStateModel[] = [
        {
            id: 'laneName', label: 'Lane', format: (value: any) => value || "NA",
            customView: (element: any) => <LaneView element={element} onClickLaneCode={(data: any) => { onClickLaneCode(data) }} />
        },
        { id: 'vehicleTypeName', label: 'Vehicle Type', format: (value: any) => value || "NA", class: (value: any) => value ? 'orange-text' : "" },
        { id: 'freightTypeCode', label: 'Freight Type', format: (value: any) => value || "NA" },
        { id: 'placementCutoffTime', label: placementCutoffLabel, format: (value: any) => value || "NA" },
        { id: 'indentCutoffTime', label: indentCutoffLabel, format: (value: any) => value || "NA" },
    ]
    return columnList;
};

export const indentDashboardChildrenTableColumns = () => {
    const columnList: ColumnStateModel[] = [
        { id: 'partnerName', label: 'Transporter', format: (value: any) => value || "NA" },
        { id: 'allocationPercentage', label: 'SOB %', format: (value: any) => ((value && convertAmountToNumberFormat(value, floatFormatter)) || "0.00") },
        { id: 'level', label: 'Level', format: (value: any) => value || "NA" },
        { id: 'totalSobOrders', label: 'Lane Orders', format: (value: any) => value || "NA" },
        {
            id: 'o/t', label: 'Fullfilled/Assigned Orders', format: (value: any) => value || "NA",
            customView: (element: any) => {
                if (element.totalOrderCount) {
                    return (
                        <div>
                            {element.acceptedOrderCount || "0"} / {element.totalOrderCount}
                        </div>
                    )
                } else {
                    return "NA"
                }
            }
        },
        {
            id: 'sobContributionPercentage', label: 'Contribution %', format: (value: any) => value,
            customView: (element: any) => {
                return (element &&
                    element.sobBreachPercentage ?
                    <CustomToolTipIndent
                        title={
                            <div className="sob-tool-tip">
                                SOB Breach: <span>{(element.sobBreachPercentage && (convertAmountToNumberFormat(element.sobBreachPercentage, floatFormatter) + " %"))}</span>
                            </div>
                        }
                        arrow={true}
                    >
                        <span className="contribution-count">
                            {((element.sobContributionPercentage && convertAmountToNumberFormat(element.sobContributionPercentage, floatFormatter)) || "0.00")}
                        </span>
                    </CustomToolTipIndent>
                    :
                    <span className="contribution-count">
                        {((element.sobContributionPercentage && convertAmountToNumberFormat(element.sobContributionPercentage, floatFormatter)) || "0.00")}
                    </span>
                )
            }
        },
        { id: 'cancelledOrderCount', label: 'Cancelled Orders', format: (value: any) => value || "0", }
    ]
    return columnList;
}

export const indentDashboardMobileTableColumns = (onClickLaneCode: Function) => {
    const columnList: ColumnStateModel[] = [
        {
            id: 'laneName', label: 'Lane', format: (value: any) => value || "NA",
            customView: (element: any) => <LaneView element={element} onClickLaneCode={(data: any) => { onClickLaneCode(data) }} />
        },
        { id: 'vehicleTypeName', label: 'Vehicle Type', format: (value: any) => value || "NA", class: (value: any) => value ? 'orange-text' : "" },
        { id: 'freightTypeCode', label: 'Freight Type', format: (value: any) => value || "NA" },
        { id: 'validityStartDatetime', label: 'Start Date', format: (value: any) => (value && convertDateFormat(value, displayDateFormatter)) || "NA" },
        { id: 'validityEndDatetime', label: 'End Date', format: (value: any) => (value && convertDateFormat(value, displayDateFormatter)) || "NA" },
        { id: 'placementCutoffTime', label: placementCutoffLabel, format: (value: any) => value || "NA" },
        { id: 'indentCutoffTime', label: indentCutoffLabel, format: (value: any) => value || "NA" },
        {
            id: 'seeMore', label: 'See More', buttonLabel: "Gate In", type: "expand", leftIcon: <ArrowForward />,
        }
    ]
    return columnList;
};

export const indentTableColumns = (onClickView: Function, onClickLaneCode: Function) => {
    const columnList: ColumnStateModel[] = [

        { id: 'code', label: 'Indent Code', format: (value: any) => value || "NA" },
        { id: 'freightTypeCode', label: 'Freight Type', format: (value: any) => value || "NA" },
        {
            id: 'laneDisplayName', label: 'Lane', format: (value: any) => value || "NA",
            customView: (element: any) => <LaneView element={element} onClickLaneCode={(data: any) => { onClickLaneCode(data) }} />
        },

        { id: 'placementDatetime', label: 'Placement Date and Time', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA" },
        { id: 'status', label: 'Status', format: (value: any) => value || "NA", class: () => 'orange-text' },
        {
            id: 'action', label: 'Action', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return ((element && <div className="action-btn-wrap">
                    <Button
                        buttonStyle="btn-detail btn-sm ml-2"
                        title="Details"
                        leftIcon={<Visibility />}
                        onClick={() => {
                            onClickView(element)
                        }}
                    />

                </div>) || "NA")
            }
        }
    ]
    return columnList;
};

export const contractDetailsTableColumns = (onClickView: any) => {
    const columnList: ColumnStateModel[] = [

        { id: 'partnerName', label: 'Transporter', format: (value: any) => value || "NA" },
        { id: 'allocationPercentage', label: 'SOB %', format: (value: any) => value || "NA", class: () => 'orange-text' },
        { id: 'level', label: 'Level', format: (value: any) => value || "NA" },
        {
            id: 'contractId', label: 'Contract ID', format: (value: any) => value,
            customView: (element: any) =>
                <div className="contact-id-wrap">
                    {(element.contractId && <span className="blue-text contract-id" onClick={() => { onClickView(element) }}> {element.contractId}</span>)}
                    {element.contractStatus === "Not available" && <Chip label="Contract Not Exist" className="orange-chip basic-chip ml-2" />}
                    {element.contractStatus === "TERMINATED" && <Chip label="Contract Expired" className="red-chip basic-chip ml-2" />}
                </div>
        },
    ]
    return columnList;
};
export const contractDetailsModalTableColumns = () => {
    const columnList: ColumnStateModel[] = [

        {
            id: 'chargeDescription', label: 'Charges', format: (value: any) => value || "NA",
            // customView: (element: any) => {
            //     const value = freightCharges.filter((item: any) => element.chargeName === item.value)
            //     if (value && value[0]) {
            //         return value[0].label
            //     }
            // }
        },
        {
            id: 'variable', label: 'Variable', format: (value: any) => value || "NA", class: () => 'orange-text',
            // customView: (element: any) => {
            //     const value = freightVariables.filter((item: any) => element.variable === item.value)
            //     if (value && value[0]) {
            //         return value[0].label
            //     }
            // }
        },
        { id: 'operation', label: 'Charges Type', format: (value: any) => value || "NA" },
        { id: 'amount', label: 'Amount (₹)', format: (value: any) => value || "NA" }
    ]
    return columnList;
};

export const contractFreightChargeSlabsTableColumns = () => {
    const columnList: ColumnStateModel[] = [
        {
            id: 'variableName', label: 'Variable', format: (value: any) => value || "NA",
            // customView: (element: any) => {
            //     const value = freightVariables.filter((item: any) => element.variable === item.value)
            //     if (value && value[0]) {
            //         return value[0].label
            //     }
            // }
        },
        { id: 'slabStart', label: 'Min', format: (value: any) => value || "NA" },
        { id: 'slabEnd', label: 'Max', format: (value: any) => value || "NA" },
        { id: 'slabRate', label: 'Amount (₹)', format: (value: any) => value || "NA" }
    ]
    return columnList;
};

export const contractFreightChargeRulesTableColumns = () => {
    const columnList: ColumnStateModel[] = [

        { id: 'object', label: 'Constraint', format: (value: any) => value || "NA", },
        { id: 'operator', label: 'Operators', format: (value: any) => value || "NA" },
        { id: 'value', label: 'Value', format: (value: any) => value || "NA" },
        { id: 'preOperator', label: 'Logical Operator', format: (value: any) => value || "-" }
    ]
    return columnList;
};

export const indentDetailTableColumns = (onClickView: Function) => {
    const columnList: ColumnStateModel[] = [

        { id: 'freightOrderCode', label: 'Order Code', format: (value: any) => value || "NA" },
        { id: 'partnerName', label: 'Transporter', format: (value: any) => value || "NA" },
        { id: 'referenceId', label: 'Reference Id', format: (value: any) => value || "NA" },
        { id: 'orderAppointmentDatetime', label: 'Appointment Date and Time', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA" },
        { id: 'orderPlacementDatetime', label: 'Placement Date and Time', format: (value: any) => (value && convertDateFormat(value, displayDateTimeFormatter)) || "NA" },
        { id: 'statusName', label: 'Status', format: (value: any) => value || "NA", class: () => 'orange-text' },
        {
            id: 'action', label: 'Action', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return ((element && <div className="action-btn-wrap">
                    <Button
                        buttonStyle="btn-detail btn-sm ml-2"
                        title="View"
                        leftIcon={<Visibility />}
                        onClick={() => {
                            onClickView(element)
                        }}
                    />

                </div>) || "NA")
            }
        }
    ]
    return columnList;
};

export const indentDetailTableEditableColumns = (onHandleValueChangeReceived: Function, onHandleDateChanged: Function, onHandlePlacementDateChanged: Function) => {
    const columnList: ColumnStateModel[] = [

        { id: 'freightOrderCode', label: 'Order Code', format: (value: any) => value || "NA" },
        { id: 'partnerName', label: 'Transporter', format: (value: any) => value || "NA" },
        {
            id: 'referenceId', label: 'Reference Id', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return ((element && <div className="table-field">
                    <EditText
                        placeholder="Enter Reference Id"
                        value={element.referenceId}
                        name="referenceId"
                        disabled={(element.statusName !== OrderStatusLabel.CONFIRMED) && (element.statusName !== OrderStatusLabel.PENDING)}
                        maxLength={200}
                        onChange={(text: any) => {
                            onHandleValueChangeReceived(text, element)
                        }}
                    />
                </div>) || "NA")
            }
        },
        {
            id: 'appointmentDate', label: 'Appointment Date and Time', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return ((element && <div className="table-field">
                    <DateTimePicker
                        className="custom-date-picker"
                        placeholder={appointmentDatePlaceholder}
                        hiddenLabel
                        disabled={(element.statusName !== OrderStatusLabel.CONFIRMED) && (element.statusName !== OrderStatusLabel.PENDING)}
                        value={element.orderAppointmentDatetime || null}
                        format={displayDateTimeFormatter}
                        onChange={(date: any) => {
                            onHandleDateChanged(date, element)
                        }}
                    />
                </div>) || "NA")
            }
        },
        {
            id: 'placementDate', label: 'Placement Date and Time', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return ((element && <div className="table-field">
                    <DateTimePicker
                        className="custom-date-picker"
                        placeholder={placementDateTimePlaceholder}
                        hiddenLabel
                        // disablePast
                        disabled={(element.statusName !== OrderStatusLabel.CONFIRMED) && (element.statusName !== OrderStatusLabel.PENDING)}
                        value={element.orderPlacementDatetime || null}
                        format={displayDateTimeFormatter}
                        onChange={(date: any) => {
                            onHandlePlacementDateChanged(date, element)
                        }}
                    />
                </div>) || "NA")
            }
        },
        { id: 'statusName', label: 'Status', format: (value: any) => value || "NA", class: () => 'orange-text' },
    ]
    return columnList;
};


export const contractDetailsBusinessTableColumns = (onClickView: Function, onChangeSOB: Function) => {
    const columnList: ColumnStateModel[] = [

        { id: 'partnerName', label: 'Transporter', format: (value: any) => value || "NA" },
        { id: 'level', label: 'Level', format: (value: any) => value || "NA" },
        {
            id: 'contractId', label: 'Contract ID', format: (value: any) => value,
            customView: (element: any) =>
                <div className="contact-id-wrap">
                    {(element.contractId && <span className="blue-text contract-id" onClick={() => { onClickView(element) }}> {element.contractId}</span>)}
                </div>
        },
        {
            id: 'changedSOBAllocation', label: 'SOB %', format: (value: any) => value || "NA",
            customView: (element: any) => {
                return ((element && <div className="table-field">
                    <NumberEditText
                        placeholder="SOB %"
                        value={element.allocationPercentage}
                        name="sobId orange-text"
                        error={element.allocationPercentageError}
                        //disabled={(element.statusName !== OrderStatusLabel.CONFIRMED) && (element.statusName !== OrderStatusLabel.PENDING)}
                        maxLength={3}
                        onChange={(text: any) => { onChangeSOB(text, element) }}
                    />
                </div>) || "NA")
            }
        },
    ]
    return columnList;
};