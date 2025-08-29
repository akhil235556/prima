import { Add, Close } from "@material-ui/icons";
import React from "react";
import AutoComplete from "../../../component/widgets/AutoComplete";
import Button from "../../../component/widgets/button/Button";
import NumberEditText from "../../../component/widgets/NumberEditText";
// import { chargesTypes } from "../../../base/constant/ArrayList";
import { FreightType } from "../../../base/constant/ArrayList";
import { billingCycleError, chargeAmountError, chargeError, chargeTypeError, contractFromDateError, contractModeError, contractToDateError, detentionThresholdError, errorFreightType, errorLane, errorSelectTransporter, promiseVehicleError, variableError, vehicleTypeError, volumeError, weightError } from '../../../base/constant/MessageUtils';
import { convertDateTimeServerFormat } from "../../../base/utility/DateUtils";
import { isNullValue, isNullValueOrZero } from '../../../base/utility/StringUtils';
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import { getStringAutoCompleteData } from "../../../moduleUtility/DataUtils";

export function validateData(userParams: any, appDispatch: any) {
    if (isNullValue(userParams.freightType)) {
        return { freightType: errorFreightType }
    } else if (userParams.freightType.value === FreightType.FTL && userParams.vehicleType === undefined) {
        return { vehicleType: vehicleTypeError }
    } else if (userParams.freightType.value === FreightType.FTL && isNullValueOrZero(userParams.promisedVehicles)) {
        return { promisedVehicles: promiseVehicleError }
    } else if (userParams.freightType.value === "PTL" && isNullValueOrZero(userParams.volume)) {
        return { volume: volumeError }
    } else if (userParams.freightType.value === "PTL" && isNullValueOrZero(userParams.weight)) {
        return { weight: weightError }
    } else if (userParams.lane === undefined) {
        return { lane: errorLane }
    } else if (userParams.partner === undefined) {
        return { partner: errorSelectTransporter }
    } else if (isNullValue(userParams.billingCycle)) {
        return { billingCycle: billingCycleError }
    } else if (isNullValue(userParams.contractStartDate)) {
        return { contractStartDate: contractFromDateError }
    } else if (isNullValue(userParams.contractEndDate)) {
        return { contractEndDate: contractToDateError }
    } else if (userParams.freightType.value === FreightType.FTL && isNullValueOrZero(userParams.detentionThreshold)) {
        return { detentionThreshold: detentionThresholdError }
    }
    // else if (isNullValue(userParams.contractReferenceNo)) {
    //     return { contractReferenceNo: contractReferenceError }
    // }

    if (!isNullValue(userParams.charges)) {
        const chargesList = userParams.charges.map((element: any) => {
            if (isNullValue(element.charge)) {
                element.chargeError = chargeError;
            }
            if (isNullValue(element.variable)) {
                element.variableError = variableError;
            }
            if (isNullValue(element.chargeType)) {
                element.chargeTypeError = chargeTypeError;
            }
            if (isNullValueOrZero(element.chargeAmount)) {
                element.chargeAmountError = chargeAmountError;
            }
            return element;
        });

        const error = chargesList.some(function (element: any) {
            return (!isNullValue(element.chargeError) || !isNullValue(element.variableError)
                || !isNullValue(element.chargeTypeError) || !isNullValue(element.chargeAmountError));
        });
        if (error) {
            return {
                ...userParams,
                error: true,
                charges: chargesList
            };
        }

        return true;
    }
}

export function validateCreateContractData(userParams: any, appDispatch: any, checked: boolean) {
    if (isNullValue(userParams.freightType)) {
        return { freightType: errorFreightType }
    } else if (userParams.freightType.value === FreightType.FTL && userParams.lane === undefined) {
        return { lane: errorLane }
    } else if (userParams.partner === undefined) {
        return { partner: errorSelectTransporter }
    } else if (userParams.modeType === undefined) {
        return { modeType: "Select valid mode type" }
    } else if (userParams.freightType.value === FreightType.FTL && userParams.vehicleType === undefined) {
        return { vehicleType: vehicleTypeError }
    } else if (isNullValue(userParams.contractStartDate)) {
        return { contractStartDate: contractFromDateError }
    } else if (isNullValue(userParams.contractEndDate)) {
        return { contractEndDate: contractToDateError }
    }
    // else if (userParams.freightType.value === FreightType.FTL && isNullValueOrZero(userParams.detentionThreshold)) {
    //     return { detentionThreshold: detentionThresholdError }
    // }
    else if (userParams.freightType.value === FreightType.PTL && isNullValueOrZero(userParams.contractMode)) {
        return { contractMode: contractModeError }
    }
    else if (userParams.freightType.value === FreightType.PTL && isNullValueOrZero(userParams.volumetricDivisionFactor)) {
        return { volumetricDivisionFactor: "Enter valid volumetric weight factor" }
    } else if (checked && isNullValueOrZero(userParams.gst)) {
        return { gst: "Enter valid GST (%)" }
    }
    return true;
}

export function createContractParams(userParams: any, checked: boolean) {
    if (userParams.freightType.value === FreightType.FTL) {
        let queryParams: any = {
            detentionThreshold: userParams.detentionThreshold,
            contractStartDate: convertDateTimeServerFormat(userParams.contractStartDate),
            contractEndDate: convertDateTimeServerFormat(userParams.contractEndDate),
            lane: {
                code: userParams.lane.value,
                name: userParams.lane.data.laneName,
            },
            // tat: userParams.lane.data.tat,
            contractType: userParams.freightType.label,
            partner: {
                name: userParams.partner.label,
                code: userParams.partner.value,
            },
            vehicleType: {
                name: userParams.vehicleType.label,
                code: userParams.vehicleType.value,
            },
            contractReferenceNo: userParams.contractReferenceNo,
            serviceabilityModeCode: userParams.modeType.value,
            serviceabilityModeName: userParams.modeType.label
        }
        if (checked) {
            queryParams.gst = userParams.gst
            queryParams.gstActive = true
        }
        return queryParams;
    } else {
        let queryParams: any = {
            detentionThreshold: userParams.detentionThreshold,
            contractStartDate: convertDateTimeServerFormat(userParams.contractStartDate),
            contractEndDate: convertDateTimeServerFormat(userParams.contractEndDate),
            contractType: userParams.freightType.label,
            partner: {
                name: userParams.partner.label,
                code: userParams.partner.value,
            },
            contractReferenceNo: userParams.contractReferenceNo,
            volumetricDivisionFactor: userParams.volumetricDivisionFactor,
            serviceabilityModeCode: userParams.modeType.value,
            serviceabilityModeName: userParams.modeType.label,
            contractMode: userParams.contractMode.value
        }

        if (checked) {
            queryParams.gst = userParams.gst;
            queryParams.gstActive = true;
        }
        return queryParams;
    }

}

interface RenderChargesProps {
    element: any,
    onAdd: any,
    onRemove: any,
    freightChargesList: any,
    freightVariableList: any,
    freightChargesType: any,
    onSelectCharges: any,
    onSelectTypeCharges: any,
    onSelectVariable: any,
    onCharge: any,
    isAddButton: boolean,
    editMode: boolean,
    maxLength: any
    index: any
    disableAmount?: any
}


export function RenderCharges(props: RenderChargesProps) {
    const { isAddButton, onAdd, onRemove, element, freightChargesList, freightChargesType,
        freightVariableList, onSelectTypeCharges, onSelectCharges, onSelectVariable, onCharge, editMode, index, maxLength, disableAmount } = props;



    return (
        <div className="custom-form-row modal-create-row row">
            <div className="col-10 col-md-11">
                <div className="row align-items-end charges-select">
                    <div className="form-group pr-m-0 col-6 col-md-3 col-lg-3">
                        <AutoComplete
                            label="Charges"
                            mandatory
                            placeHolder="Select Charge"
                            isDisabled={editMode}
                            value={(element.charge && element.charge) || null}
                            error={element.chargeError}
                            options={freightChargesList}
                            onChange={(value: OptionType) => {
                                onSelectCharges(value, element.index);
                            }}
                        />
                    </div>
                    <div className="form-group pr-m-0 col-6 col-md-3 col-lg-3">
                        <AutoComplete
                            label="Variable"
                            placeHolder="Select variable"
                            mandatory
                            options={editMode ? freightVariableList : element.charge && getStringAutoCompleteData(element.charge.data.variable)}
                            isDisabled={editMode}
                            value={(element.variable && element.variable) || null}
                            error={element.variableError}
                            onChange={(value: OptionType) => {
                                onSelectVariable(value, element.index);
                            }}
                        />
                    </div>
                    <div className="form-group pr-m-0 col-6 col-md-3 col-lg-3">
                        <AutoComplete
                            label="Charges Type"
                            mandatory
                            placeHolder="Select charge type"
                            options={editMode ? freightChargesType : element.charge && getStringAutoCompleteData(element.charge.data.operation)}
                            isDisabled={editMode}
                            value={(element.chargeType && element.chargeType) || null}
                            error={element.chargeTypeError}
                            onChange={(value: OptionType) => {
                                onSelectTypeCharges(value, element.index);
                            }}
                        />
                    </div>
                    <div className="form-group pr-m-0 pr-0 col-6 col-md-3 col-lg-3">
                        <NumberEditText
                            label="Amount "
                            mandatory
                            placeholder="Enter Amount"
                            maxLength={9}
                            decimalScale={2}
                            disabled={disableAmount}
                            value={element.chargeAmount}
                            error={element.chargeAmountError}
                            onChange={(value: any) => {
                                onCharge(value, element.index);
                            }}
                        />
                    </div>
                </div>
            </div>
            {!editMode && maxLength && maxLength > 1 &&
                <div className="form-group col-2 col-md-1 col-lg-1 creat-add-btn add-button-wrapp">
                    <Button
                        buttonStyle={(isAddButton && (maxLength > index)) ? "add-btn" : "minus-btn"}
                        leftIcon={(isAddButton && (maxLength > index)) ? <Add /> : <Close />}
                        onClick={() => {
                            (isAddButton && (maxLength > index)) ? onAdd(element) : onRemove(element);
                        }}
                    />
                </div>}
        </div>

    );
}

export function removeCharges(charges: any, selected: any) {
    return charges && charges.filter((element: any) => element.index !== selected.index)
        .map((element: any, index: number) => ({
            ...element,
            index: index
        }));
}

export function createFreightRateDefinitionParams(userParams: any, contractCode: any) {
    return {
        contractCode: contractCode,
        partnerCode: userParams.partner.value,
        rateDefinition: userParams.charges.map((element: any) => ({
            amount: Number(element.chargeAmount),
            chargeName: element.charge.value,
            operation: element.chargeType.value,
            variable: element.variable.value,
        }))
    }
}