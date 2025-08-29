import { Add, Close } from "@material-ui/icons";
import { DatePicker } from "@material-ui/pickers";
import React from "react";
import { displayDateFormatter } from "../../../base/utility/DateUtils";
import { isNullValue } from "../../../base/utility/StringUtils";
import AutoComplete from "../../../component/widgets/AutoComplete";
import Button from "../../../component/widgets/button/Button";
import EditText from "../../../component/widgets/EditText";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import { driverMobileError, driverNameError, idExpiryDate, idExpiryDatePlaceHolder, idIssueDate, idIssueDatePlaceHolder, idName, idNamePlaceholder, idNumber, idNumberPlaceholder } from "./base/MasterDriverMessageUtils";

interface RenderAddDocsProps {
    element: any,
    certificateOptions: any
    onAdd: any,
    onRemove: any,
    onChangeCertNameType: any,
    onChangeCertNumber: any,
    onSelectCertIssueDate: any,
    onSelectCertExpiryDate: any,
    maxLength?: any
    key?: any
    isAddButton?: boolean,
    requiredCertificate: any,
    totalLength?: any
}
const RenderAddDocs = (props: RenderAddDocsProps) => {
    const { element, onChangeCertNumber,
        onChangeCertNameType, onSelectCertIssueDate,
        onSelectCertExpiryDate, certificateOptions,
        onAdd, onRemove, requiredCertificate, totalLength
    } = props;

    return (
        <div className="custom-form-row row add-create-row align-items-center vechile-certificate">
            <div className="form-group col-6 col-md">
                <AutoComplete
                    label={idName}
                    placeHolder={idNamePlaceholder}
                    value={element.certName}
                    isClearable
                    mandatory={element.certName && requiredCertificate.includes(element.certName.value)}
                    isDisabled={element.certName && requiredCertificate.includes(element.certName?.value)}
                    options={certificateOptions?.filter((certificate: any) => !certificate.data?.isRequired)}
                    error={element.idNameError}
                    onChange={(value: OptionType) => {
                        onChangeCertNameType(value, element.index)
                    }}
                />
            </div>
            <div className="form-group col-6 col-md">
                <EditText
                    label={idNumber}
                    placeholder={idNumberPlaceholder}
                    maxLength={40}
                    mandatory={element.certName && requiredCertificate.includes(element.certName.value)}
                    value={element.idNumber}
                    error={element.idNumberError}
                    onChange={(text: string) => {
                        onChangeCertNumber(text, element.index)
                    }}
                />
            </div>
            <div className="form-group col-6 col-md">
                <div className="date-time-wrapper">
                    <label className="picker-label">{idIssueDate}{element.certName && element.certName.data?.issueRequired && <span className="mandatory-flied">*</span>}</label>
                    <DatePicker
                        clearable
                        className="custom-date-picker"
                        placeholder={idIssueDatePlaceHolder}
                        hiddenLabel
                        helperText={element.idIssueError}
                        format={displayDateFormatter}
                        value={element.idIssue || null}
                        onChange={(date: any) => {
                            onSelectCertIssueDate(date, element.index)
                        }}
                    />
                </div>

            </div>
            <div className="form-group col-6 col-md">
                <div className="date-time-wrapper">
                    <label className="picker-label">{idExpiryDate}{element.certName && element.certName.data?.expiryRequired && <span className="mandatory-flied">*</span>}</label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder={idExpiryDatePlaceHolder}
                        hiddenLabel
                        helperText={element.idExpiryError}
                        format={displayDateFormatter}
                        value={element.idExpiry || null}
                        onChange={(date: any) => {
                            onSelectCertExpiryDate(date, element.index)
                        }}
                    />
                </div>
            </div>
            <div className="col-2 col-md-1 mb-md-0 mb-4">
                {element.index === totalLength - 1 ?
                    <Button
                        buttonStyle={"add-btn"}
                        onClick={() => {
                            onAdd()
                        }}
                        leftIcon={<Add />}
                    /> :
                    ((element.certName && requiredCertificate.includes(element.certName?.value)) ? null :
                        <Button
                            buttonStyle={"minus-btn"}
                            leftIcon={<Close />}
                            onClick={() => {
                                onRemove(element);
                            }}
                        />)
                }

            </div>
        </div >
    );
}

function validateData(params: any, requiredCertificate: any) {
    if (isNullValue(params.driverName)) {
        return {
            driverName: driverNameError
        };
    } else if (isNullValue(params.contactNumber)) {
        return {
            contactNumber: driverMobileError
        };
    } else if (isNullValue(params.isDedicated)) {
        return { isDedicated: "Select valid source type." }
    } else if (params?.locationName?.label && isNullValue(params.locationName?.value)) {
        return { dedicatedHubError: "Select Valid Dedicated Hub" }
    }

    if (params && params.certificateList) {
        let isError = false;
        let certErrorInfo = params.certificateList.map((certElem: any) => {
            if (!isNullValue(certElem.certName) || !isNullValue(certElem.idNumber) ||
                !isNullValue(certElem.idIssue) || !isNullValue(certElem.idExpiry)) {
                if (isNullValue(certElem.certName)) {
                    isError = true;
                    certElem.idNameError = "Select valid ID name"
                }
                if (isNullValue(certElem.idNumber)) {
                    isError = true;
                    certElem.idNumberError = "Enter valid ID number"
                }
                if (certElem.certName?.data?.issueRequired) {
                    if (isNullValue(certElem.idIssue)) {
                        isError = true;
                        certElem.idIssueError = "Select valid ID issue date"
                    }
                }
                if (certElem.certName?.data?.expiryRequired) {
                    if (isNullValue(certElem.idExpiry)) {
                        isError = true;
                        certElem.idExpiryError = "Select valid ID expiry date"
                    }
                }
            }
            return certElem;
        });
        params.certificateList = certErrorInfo;
        if (isError) {
            return {
                error: true,
                certificateList: params.certificateList
            };
        }
    }
    return true;
}

export {
    RenderAddDocs,
    validateData,
};

