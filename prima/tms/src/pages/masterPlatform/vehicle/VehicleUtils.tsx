import { Add, Close } from "@material-ui/icons";
import { DatePicker } from "@material-ui/pickers";
import React from "react";
import { CertificateTypeOptions } from "../../../base/constant/ArrayList";
import { certExpiryDate, certExpiryDatePlaceHolder, certIssueDate, certIssueDatePlaceHolder, certName, certNamePlaceholder, certNumber, certNumberPlaceholder, errorTransporter } from "../../../base/constant/MessageUtils";
import { convertDateServerFormat, displayDateFormatter } from "../../../base/utility/DateUtils";
import { isNullValue } from "../../../base/utility/StringUtils";
import AutoComplete from "../../../component/widgets/AutoComplete";
import Button from "../../../component/widgets/button/Button";
import EditText from "../../../component/widgets/EditText";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";

interface RenderVehicleUtilsProps {
    element?: any,
    addVehicleArr: any,
    onAdd?: any,
    onRemove?: any,
    onChangeCertNameType?: any,
    onChangeCertNumber?: any,
    onSelectCertIssueDate?: any,
    onSelectCertExpiryDate?: any,
    maxLength?: any
    key?: any
    requiredCertificate: any
}

const RenderVehicleUtils = (props: RenderVehicleUtilsProps) => {
    const { element, onChangeCertNumber,
        onChangeCertNameType, onSelectCertIssueDate,
        onSelectCertExpiryDate,
        onAdd, onRemove, addVehicleArr, requiredCertificate
    } = props;

    return (
        <div className="custom-form-row row add-create-row align-items-center vechile-certificate">
            <div className="form-group col-md col-6">
                <AutoComplete
                    label={certName}
                    placeHolder={certNamePlaceholder}
                    onChange={(value: OptionType) => {
                        onChangeCertNameType(value, element.index)
                    }}
                    mandatory={element.certName && requiredCertificate.includes(element.certName.value)}
                    isClearable
                    error={element.certNameError}
                    isDisabled={element.certName && requiredCertificate.includes(element.certName.value)}
                    options={CertificateTypeOptions.filter((item: any) => !requiredCertificate.includes(item.value))}
                    value={element.certName}
                />
            </div>
            <div className="form-group col-md col-6">
                <EditText
                    label={certNumber}
                    placeholder={certNumberPlaceholder}
                    onChange={(text: string) => {
                        onChangeCertNumber(text, element.index)
                    }}
                    mandatory={element.certName && requiredCertificate.includes(element.certName.value)}
                    error={element.certNumberError}
                    maxLength={20}
                    value={element.certNumber}
                />
            </div>
            <div className="form-group col-md col-6">
                <div className="date-time-wrapper">
                    <label className="picker-label">{certIssueDate}{element.certName && requiredCertificate.includes(element.certName.value) && <span className="mandatory-flied">*</span>}</label>
                    <DatePicker
                        clearable
                        className="custom-date-picker"
                        placeholder={certIssueDatePlaceHolder}
                        hiddenLabel
                        helperText={element.certIssueDateError}
                        format={displayDateFormatter}
                        value={element.certIssueDate || null}
                        onChange={(date: any) => {
                            onSelectCertIssueDate(date, element.index)
                        }}
                    />
                </div>
            </div>
            <div className="form-group col-md col-6">
                <div className="date-time-wrapper">
                    <label className="picker-label">{certExpiryDate}{element.certName && requiredCertificate.includes(element.certName.value) && <span className="mandatory-flied">*</span>}</label>
                    <DatePicker
                        clearable
                        className="custom-date-picker"
                        placeholder={certExpiryDatePlaceHolder}
                        hiddenLabel
                        helperText={element.certExpiryDateError}
                        format={displayDateFormatter}
                        value={element.certExpiryDate || null}
                        onChange={(date: any) => {
                            onSelectCertExpiryDate(date, element.index)
                        }}
                    />
                </div>
            </div>
            <div className="col-2 col-md-1">
                {element.index === (addVehicleArr.length - 1) ?
                    <Button
                        buttonStyle={"add-btn"}
                        onClick={() => {
                            onAdd()
                        }}
                        leftIcon={<Add />}
                    /> :
                    !(element.certName && requiredCertificate.includes(element.certName.value)) &&
                    <Button
                        buttonStyle={"minus-btn"}
                        leftIcon={<Close />}
                        onClick={() => {
                            onRemove(element.index);
                        }}
                    />
                }
            </div>
        </div>
    )
}

function validateData(params: any, requiredCertificate: any, vehicleModal: any = false) {
    if (!vehicleModal) {
        if (isNullValue(params.vehicleNumber)) {
            return {
                vehicleNumber: "Enter valid registration-number."
            };
        } else if (isNullValue(params.vehicleTypeId && params.vehicleTypeId.toString())) {
            return {
                vehicleTypeId: "Enter valid Vehicle Type."
            };
        }
    }
    if (isNullValue(params.isDedicated)) {
        return {
            isDedicated: "Select valid source type."
        };
    } else if (params.isDedicated === "true" && !isNullValue(params.partnerName) && isNullValue(params.partnerCode)) {
        return { partnerName: errorTransporter }
    }
    else if (!isNullValue(params.isDedicated) && params.isDedicated === "true" && isNullValue(params.node)) {
        return {
            locationName: "Enter valid hub."
        };
    }

    if (params && params.addVehicleArr) {
        let isError = false;
        let certErrorInfo = params.addVehicleArr.map((certElem: any) => {
            if (certElem.certName && requiredCertificate.includes(certElem.certName.value)) {
                if (!isNullValue(certElem.certName) || !isNullValue(certElem.certNumber) ||
                    !isNullValue(certElem.certIssueDate) || !isNullValue(certElem.certExpiryDate)) {

                    if (isNullValue(certElem.certName)) {
                        isError = true;
                        certElem.certNameError = "Select valid cert name"
                    }
                    if (isNullValue(certElem.certNumber)) {
                        isError = true;
                        certElem.certNumberError = "Enter valid cert number"
                    }
                    if (isNullValue(certElem.certIssueDate)) {
                        isError = true;
                        certElem.certIssueDateError = "Select valid cert issue date"
                    }
                    if (isNullValue(certElem.certExpiryDate)) {
                        isError = true;
                        certElem.certExpiryDateError = "Select valid cert expiry date"
                    }
                }
            }
            return certElem;
        });
        params.addVehicleArr = certErrorInfo;
        if (isError) {
            return {
                error: true,
                addVehicleArr: params.addVehicleArr
            };
        }
    }
    return true;
}
function createVehicleParams(params: any, userParams: any, checked: boolean) {
    let vehicleParams: any = {
        vehicleNumber: params.vehicleNumber,
        vehicleType: userParams.vehicleType,
        vehicleTypeId: params.vehicleTypeId,
        isDedicated: params.isDedicated,
        partnerCode: params.partnerCode,
        trackingAssetId: userParams.trackingAssetId && userParams.trackingAssetId.value
    }
    if (!checked) {
        if (params.rcNumber) {
            vehicleParams.rcNumber = params.rcNumber;
        }
        if (params.pucNumber) {
            vehicleParams.pucNumber = params.pucNumber;
        }
    }
    if (params.id) {
        vehicleParams.id = params.id
    }
    if (params.isDedicated) {
        vehicleParams.node = params.node;
        vehicleParams.locationName = userParams.locationName;
    }
    let certificateArray: any = params && params.addVehicleArr && params.addVehicleArr.filter((element: any) =>
        !isNullValue(element.certName) && !isNullValue(element.certNumber) &&
        (!isNullValue(element.certIssueDate) || !isNullValue(element.certExpiryDate))
    );
    certificateArray = certificateArray && certificateArray.map((item: any) => {

        let innerObj: any = {
            certificateName: item.certName.value,
            certificateNumber: item.certNumber,
            issueDate: convertDateServerFormat(item.certIssueDate),
            expiryDate: convertDateServerFormat(item.certExpiryDate)
        }
        if (params.id) {
            innerObj.vehicleCode = params.vehicleCode;
        }
        if (item.id) {
            innerObj.id = item.id;
        }
        return innerObj;
    });
    if (certificateArray.length > 0 && checked) {
        vehicleParams.certificateDetails = certificateArray
    }
    return vehicleParams;
}

function createVehicleModalParams(params: any, userParams: any, checked: boolean) {
    let vehicleParams: any = {
        vehicleNumber: params.vehicleNumber,
        vehicleType: userParams.vehicleType.label,
        vehicleTypeId: params.vehicleTypeId,
        isDedicated: params.isDedicated,
        partnerCode: params.partnerCode,
        trackingAssetId: userParams.trackingAssetId && userParams.trackingAssetId.value
    }
    if (!checked) {
        if (params.rcNumber) {
            vehicleParams.rcNumber = params.rcNumber;
        }
        if (params.pucNumber) {
            vehicleParams.pucNumber = params.pucNumber;
        }
    }
    if (params.id) {
        vehicleParams.id = params.id
    }
    if (params.isDedicated) {
        vehicleParams.node = params.node;
        vehicleParams.locationName = userParams.locationName;
    }
    let certificateArray: any = params && params.addVehicleArr && params.addVehicleArr.filter((element: any) =>
        !isNullValue(element.certName) && !isNullValue(element.certNumber) &&
        (!isNullValue(element.certIssueDate) || !isNullValue(element.certExpiryDate))
    );
    certificateArray = certificateArray && certificateArray.map((item: any) => {

        let innerObj: any = {
            certificateName: item.certName.value,
            certificateNumber: item.certNumber,
            issueDate: convertDateServerFormat(item.certIssueDate),
            expiryDate: convertDateServerFormat(item.certExpiryDate)
        }
        if (params.id) {
            innerObj.vehicleCode = params.vehicleCode;
        }
        if (item.id) {
            innerObj.id = item.id;
        }
        return innerObj;
    });
    if (certificateArray.length > 0 && checked) {
        vehicleParams.certificateDetails = certificateArray
    }
    return vehicleParams;
}

export {
    RenderVehicleUtils,
    validateData,
    createVehicleParams,
    createVehicleModalParams
};
