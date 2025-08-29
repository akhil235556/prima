import { Checkbox } from "@material-ui/core";
import { ArrowRightAlt, ClearAll } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    address,
    codeHint, companyName, emailId,
    gstNumber, integrationCodeLabel, integrationCodePlaceholder, panCard,
    phoneNumber
} from '../../../base/constant/MessageUtils';
import { isNullValue, isNullValueOrZero, isObjectEmpty } from "../../../base/utility/StringUtils";
import EditText from "../../../component/widgets/EditText";
import NumberEditText from '../../../component/widgets/NumberEditText';
import ModalContainer from "../../../modals/ModalContainer";
import { customerElementData } from "../../../moduleUtility/customerUtility";
import { showAlert } from '../../../redux/actions/AppActions';
import { customerName, customerTitle } from "./base/customerMessageUtils";
import './Customer.css';
import { createCustomer, updateCustomer } from "./CustomersApi/customersServiceActions";


interface CreateCustomerModalProps {
    open: boolean
    onClose: any
    onSuccess: any,
    selectedElement: any,
}

function CreateCustomerModal(props: CreateCustomerModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, selectedElement, onSuccess } = props;
    let editMode = !isObjectEmpty(selectedElement)
    const [userParams, setUserParams] = React.useState<any>(customerElementData);
    const [error, setError] = React.useState<any>({});
    const [loading, setLoading] = React.useState<boolean>(false);
    const [disableCheckBox, setDisableCheckBox] = React.useState<boolean>(false);

    useEffect(() => {
        if (open && editMode) {
            setUserParams({
                name: selectedElement.vendorName,
                code: selectedElement.vendorCode,
                address: selectedElement.vendorAddress,
                panNumber: selectedElement.vendorPanNumber,
                gstinNumber: selectedElement.vendorGstinNumber,
                phoneNumber: selectedElement.vendorPhoneNumber,
                email: selectedElement.vendorEmail,
                companyName: selectedElement.vendorCompanyName,
                id: selectedElement.id,
                createUser: selectedElement.createUser,
                vendorIntegrationCode: selectedElement.vendorIntegrationCode
            })
            if (selectedElement.createUser) {
                setDisableCheckBox(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedElement, open]);

    const onApplyHandler = () => {
        if (validateData()) {
            setLoading(true);

            if (editMode) {
                appDispatch(updateCustomer(userParams)).then((response: any) => {
                    if (response && response.message) {
                        clearData();
                        appDispatch(showAlert(response.message));
                        onSuccess();
                    }
                    setLoading(false);
                });
            } else {
                appDispatch(createCustomer(userParams)).then((response: any) => {
                    if (response && response.message) {
                        clearData();
                        appDispatch(showAlert(response.message));
                        onSuccess();
                    }
                    setLoading(false);

                });
            }

        }
    }

    return (
        <ModalContainer
            title={editMode ? "Customer Details" : customerTitle}
            primaryButtonTitle={editMode ? "Update" : "Create"}
            secondaryButtonTitle={editMode ? "" : "Clear"}
            open={open}
            loading={loading}
            primaryButtonType="submit"
            primaryButtonLeftIcon={<ArrowRightAlt />}
            secondaryButtonLeftIcon={<ClearAll />}
            onClose={() => {
                clearData();
                onClose();
            }}
            onApply={onApplyHandler}
            onClear={() => {
                clearData();
            }}
        >

            <div className="custom-form-row row">
                <div className="form-group col-md-6">
                    <EditText
                        label={customerName}
                        mandatory
                        placeholder={customerName}
                        required
                        name="name"
                        error={error.name}
                        maxLength={100}
                        value={userParams.name}
                        onChange={(text: any) => {
                            setError({});
                            setUserParams({
                                ...userParams,
                                name: text
                            });
                        }}
                    />
                </div>

                <div className="form-group col-md-6">
                    <EditText
                        label={integrationCodeLabel}
                        placeholder={integrationCodePlaceholder}
                        maxLength={100}
                        value={userParams.vendorIntegrationCode}
                        onChange={(text: any) => {
                            setError({});
                            setUserParams({
                                ...userParams,
                                vendorIntegrationCode: text,
                                clientToVendorIntegrationId: text
                            });
                        }}
                    />
                </div>
                {
                    editMode && (
                        <div className="form-group col-md-6">
                            <EditText
                                label={codeHint}
                                mandatory
                                placeholder={codeHint}
                                disabled={editMode}
                                // required={true}
                                error={error.code}
                                maxLength={25}
                                value={userParams.code}
                                onChange={(text: any) => {
                                    setError({});
                                    setUserParams({
                                        ...userParams,
                                        code: text
                                    });
                                }}
                            />
                        </div>
                    )
                }
                <div className="form-group col-md-6">
                    <EditText
                        label={companyName}
                        placeholder={companyName}
                        // required={true}
                        error={error.companyName}
                        mandatory
                        maxLength={200}
                        value={userParams.companyName}
                        onChange={(text: any) => {
                            setError({});
                            setUserParams({
                                ...userParams,
                                companyName: text
                            });
                        }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <EditText
                        label={address}
                        mandatory
                        placeholder={address}
                        maxLength={200}
                        required
                        type='text'
                        error={error.Address}
                        value={userParams.address}
                        onChange={(text: any) => {
                            setError({});
                            setUserParams({
                                ...userParams,
                                address: text
                            });
                        }}
                    />
                </div>

                <div className="form-group col-md-6">
                    <EditText
                        label={panCard}
                        placeholder={panCard}
                        mandatory={userParams.createUser}
                        maxLength={10}
                        required
                        disabled={disableCheckBox}
                        error={error.card}
                        value={userParams.panNumber}
                        onChange={(text: any) => {
                            setError({});
                            setUserParams({
                                ...userParams,
                                panNumber: text
                            });
                        }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <EditText
                        label={gstNumber}
                        placeholder={gstNumber}
                        maxLength={20}
                        mandatory={userParams.createUser}
                        required
                        disabled={disableCheckBox}
                        error={error.gstNumber}
                        value={userParams.gstinNumber}
                        onChange={(text: any) => {
                            setError({});
                            setUserParams({
                                ...userParams,
                                gstinNumber: text
                            });
                        }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <NumberEditText
                        label={phoneNumber}
                        placeholder={phoneNumber}
                        mandatory={userParams.createUser}
                        maxLength={10}
                        required
                        error={error.number}
                        type='number'
                        value={userParams.phoneNumber}
                        onChange={(text: any) => {
                            setError({});
                            setUserParams({
                                ...userParams,
                                phoneNumber: text
                            });
                        }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <EditText
                        label={emailId}
                        placeholder={emailId}
                        maxLength={40}
                        required
                        mandatory={userParams.createUser}
                        error={error.email}
                        disabled={disableCheckBox}
                        value={userParams.email}
                        onChange={(text: any) => {
                            setError({});
                            setUserParams({
                                ...userParams,
                                email: text
                            });
                        }}
                    />
                </div>
                <div className="form-group col-md-6 create-user-checkbox">
                    <Checkbox
                        className="custom-checkbox"
                        checked={userParams.createUser}
                        disabled={disableCheckBox}
                        onChange={(e) => {
                            setError({});
                            setUserParams({
                                ...userParams,
                                createUser: e.target.checked
                            });
                        }}
                        name="checked"
                    />
                    <span>Create User</span>
                </div>
            </div>
        </ModalContainer>
    );

    function clearData() {
        setUserParams(customerElementData);
        setDisableCheckBox(false);
        setError({});
    }

    function validateData() {
        if (isNullValue(userParams.name)) {
            setError({
                name: "Enter valid name"
            });
            return false;
        }
        else if (isNullValue(userParams.companyName)) {
            setError({
                companyName: "Enter Company Name"
            });
            return false;
        }
        else if (isNullValue(userParams.address)) {
            setError({
                Address: "Enter valid address"
            });
            return false;
        }
        else if (userParams?.createUser && isNullValueOrZero(userParams.panNumber)) {
            setError({
                card: "Enter valid pan number"
            });
            return false;
        }
        else if (userParams?.createUser && isNullValueOrZero(userParams.gstinNumber)) {
            setError({
                gstNumber: "Enter valid GST number"
            });
            return false;
        }
        else if (userParams?.createUser && isNullValueOrZero(userParams.phoneNumber)) {
            setError({
                number: "Enter valid number"
            });
            return false;
        }
        else if (userParams?.createUser && isNullValueOrZero(userParams.email)) {
            setError({
                email: "Enter valid email id"
            });
            return false;
        }
        return true;
    }

}

export default CreateCustomerModal;