import { Checkbox, Collapse } from "@material-ui/core";
import { Add, ArrowRightAlt, ClearAll, Remove } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { address, codeHint, companyName, consigneeName, consigneeTitle, emailId, gstNumber, integrationCodeLabel, integrationCodePlaceholder, panCard, phoneNumber } from '../../../base/constant/MessageUtils';
import { isNullValue, isNullValueOrZero, isObjectEmpty } from "../../../base/utility/StringUtils";
import Chips from "../../../component/chips/Chips";
import Button from "../../../component/widgets/button/Button";
import EditText from "../../../component/widgets/EditText";
import NumberEditText from '../../../component/widgets/NumberEditText';
import ModalContainer from "../../../modals/ModalContainer";
import { consigneeElementData, validateEmail, validatePhoneNumber } from "../../../moduleUtility/consigneeUtility";
import { showAlert } from '../../../redux/actions/AppActions';
import { createConsignee, updateConsignee } from '../../../serviceActions/ConsigneeServiceActions';
import { getTaggedLocations } from "../../../serviceActions/LaneServiceActions";
import './Consignee.css';
import "./CreateConsigneeModals.css";

interface CreateConsigneeModalsProps {
    open: boolean
    onClose: any
    onSuccess: any,
    selectedElement: any,
}

function CreateConsigneeModals(props: CreateConsigneeModalsProps) {
    const appDispatch = useDispatch();
    const { open, onClose, selectedElement, onSuccess } = props;
    let editMode = !isObjectEmpty(selectedElement)
    const [userParams, setUserParams] = React.useState<any>(consigneeElementData);
    const [error, setError] = React.useState<any>({});
    const [loading, setLoading] = React.useState<boolean>(false);
    const [disableCheckBox, setDisableCheckBox] = React.useState<boolean>(false);
    const [addPhoneOpen, setAddPhoneOpen] = React.useState<boolean>(false)
    const [addEmailOpen, setAddEmailOpen] = React.useState<boolean>(false)
    const [additionalPhone, setAdditionalPhone] = React.useState<any>()
    const [additionalEmail, setAdditionalEmail] = React.useState<any>()
    const [allTaggedLocations, setAllTaggedLocations] = React.useState<boolean>(false)
    const [taggedLocationArray, setTaggedLocationArray] = React.useState<any>([]);

    useEffect(() => {
        if (open && editMode) {
            setUserParams({
                name: selectedElement.customerName,
                code: selectedElement.customerCode,
                address: selectedElement.customerAddress,
                panNumber: selectedElement.customerPanNumber,
                gstinNumber: selectedElement.customerGstinNumber,
                phoneNumber: selectedElement.customerPhoneNumber,
                email: selectedElement.customerEmail,
                companyName: selectedElement.customerCompanyName,
                customerId: selectedElement.customerId,
                createUser: selectedElement.createUser,
                username: selectedElement.customerUsername?.toLowerCase(),
                customerIntegrationCode: selectedElement.customerIntegrationCode,
                secondaryPhoneNumber: selectedElement.secondaryPhoneNumber || [],
                secondaryEmail: selectedElement.secondaryEmail || []

            })
            if (selectedElement.createUser) {
                setDisableCheckBox(true);
            }
            if (selectedElement?.secondaryPhoneNumber?.length > 0) {
                setAddPhoneOpen(true)
            }
            if (selectedElement?.secondaryEmail?.length > 0) {
                setAddEmailOpen(true)
            }
            appDispatch(getTaggedLocations({ consigneeCode: selectedElement?.customerCode })).then((response: any) => {
                let tempArr: any = []
                if (response) {
                    response.forEach((item: any) => {
                        tempArr.push(item?.locationName);
                    })
                }
                setTaggedLocationArray(tempArr)
            })
        }
        setAdditionalEmail(null);
        setAdditionalPhone(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedElement, open]);

    const onApplyHandler = () => {
        if (validateData()) {
            setLoading(true);

            if (editMode) {
                appDispatch(updateConsignee(userParams)).then((response: any) => {
                    if (response && response.message) {
                        clearData();
                        appDispatch(showAlert(response.message));
                        onSuccess();
                        setAllTaggedLocations(false)
                    }
                    setLoading(false);
                });
            } else {
                appDispatch(createConsignee(userParams)).then((response: any) => {
                    if (response && response.message) {
                        clearData();
                        appDispatch(showAlert(response.message));
                        onSuccess();
                        setAllTaggedLocations(false)
                    }
                    setLoading(false);

                });
            }
        }
    }

    return (
        <ModalContainer
            title={editMode ? "Consignee Details" : consigneeTitle}
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
                setAllTaggedLocations(false);
            }}
            onApply={onApplyHandler}
            onClear={() => {
                clearData();
            }}
        >

            <div className="custom-form-row row">
                <div className="form-group col-md-6">
                    <EditText
                        label={consigneeName}
                        mandatory
                        placeholder={consigneeName}
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
                        value={userParams.customerIntegrationCode}
                        onChange={(text: any) => {
                            setError({});
                            setUserParams({
                                ...userParams,
                                customerIntegrationCode: text,
                                consigneeCode: text
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
                        maxLength={10}
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
                <div className="form-group col-md-6 consignee-data">
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
                        toolTip={() =>
                            addPhoneOpen ? (
                                <div onClick={() => { setAddPhoneOpen(false) }} className="addLess-btn"
                                >
                                    <Button
                                        buttonStyle="btn-orange minus-btn consignee-button"
                                        leftIcon={<Remove />}
                                        onClick={ev => { ev.stopPropagation(); }}
                                    />
                                    <span className="ml-2 orange-text cursor-pointer"> Less</span>
                                </div>) :
                                (
                                    <div onClick={() => { setAddPhoneOpen(true) }} className="addLess-btn"
                                    >
                                        <Button
                                            buttonStyle="add-btn consignee-button"
                                            leftIcon={<Add />}
                                            onClick={ev => { ev.stopPropagation(); }}

                                        />
                                        <span className="blue-text ml-2 cursor-pointer">  Add More</span>

                                    </div>
                                )
                        }
                    />
                </div>
                <div className="form-group col-md-6 consignee-data">
                    <EditText
                        label={emailId}
                        placeholder={emailId}
                        maxLength={40}
                        required
                        mandatory={userParams.createUser}
                        error={error.email}
                        // disabled={disableCheckBox}
                        value={userParams.email}
                        onChange={(text: any) => {
                            setError({});
                            setUserParams({
                                ...userParams,
                                email: text
                            });
                        }}
                        toolTip={() => addEmailOpen ? (
                            <div onClick={() => { setAddEmailOpen(false) }} className="addLess-btn"
                            >
                                <Button
                                    buttonStyle="btn-orange minus-btn consignee-button"
                                    leftIcon={<Remove />}
                                    onClick={ev => { ev.stopPropagation() }}
                                />
                                <span className="ml-2 orange-text cursor-pointer"> Less</span>
                            </div>) :
                            (
                                <div onClick={() => { setAddEmailOpen(true) }} className="addLess-btn"
                                >
                                    <Button
                                        buttonStyle="add-btn consignee-button"
                                        leftIcon={<Add />}
                                        onClick={ev => { ev.stopPropagation() }}

                                    />
                                    <span className="blue-text ml-2 cursor-pointer">  Add More</span>

                                </div>
                            )}
                    />
                </div>
                {userParams.createUser &&
                    <div className="form-group col-md-6">
                        <EditText
                            label={'Username'}
                            placeholder={"Enter Username"}
                            maxLength={40}
                            required
                            mandatory={userParams.createUser}
                            error={error.username}
                            disabled={disableCheckBox}
                            value={userParams.username}
                            onChange={(text: any) => {
                                setError({});
                                setUserParams({
                                    ...userParams,
                                    username: text.toLowerCase()
                                });
                            }}
                        />
                    </div>
                }
                {addPhoneOpen && (<div className="form-group col-md-12">
                    <div className="d-flex justify-content-between align-items-center row pb-3">
                        <div className="col-md-8 col-12">
                            Additional : Phone Number
                        </div>
                        <div className="col-md-4 col-12 d-flex justify-content-between consignee-add">
                            <NumberEditText
                                placeholder={phoneNumber}
                                maxLength={10}
                                error={error.additionalPhoneError}
                                type='number'
                                value={additionalPhone}
                                onChange={(text: any) => {
                                    setError({});
                                    setAdditionalPhone(text)
                                }}
                            />
                            <Button
                                buttonStyle={"btn-blue ml-2"}
                                title={"Add"}
                                disable={userParams?.secondaryPhoneNumber?.length >= 10}
                                onClick={() => {
                                    const validate = validateAdditionalPhoneNumber(additionalPhone)
                                    if (validate.status) {
                                        setError({});
                                        setUserParams({
                                            ...userParams,
                                            secondaryPhoneNumber: [...userParams.secondaryPhoneNumber, additionalPhone]
                                        })
                                        setAdditionalPhone(null)
                                    } else {
                                        setError(validate.error)
                                    }

                                }}
                            />
                        </div>
                    </div>
                    <div className="chips-consignee">
                        {userParams?.secondaryPhoneNumber?.map((value: any, index: any) => (
                            <Chips
                                label={value}
                                key={index}
                                onDelete={() => {
                                    removeSecondaryPhoneNumber(value)
                                }}
                            />))}
                    </div>
                </div>)}
                {addEmailOpen && (<div className="form-group col-md-12">
                    <div className="d-flex justify-content-between align-items-center row pb-3">
                        <div className="col-md-8 col-12">
                            Additional : Email ID
                        </div>
                        <div className="col-md-4 col-12 d-flex justify-content-between consignee-add">
                            <EditText
                                placeholder={emailId}
                                maxLength={40}
                                error={error.additionalEmailError}
                                // disabled={disableCheckBox}
                                value={additionalEmail}
                                onChange={(text: any) => {
                                    setError({});
                                    setAdditionalEmail(text)
                                }}
                            />
                            <Button
                                buttonStyle={"btn-blue ml-2"}
                                title={"Add"}
                                disable={userParams?.secondaryEmail?.length >= 10}
                                onClick={() => {
                                    const validate = validateAdditionalEmail(additionalEmail);
                                    if (validate.status) {
                                        setError({});
                                        setUserParams({
                                            ...userParams,
                                            secondaryEmail: [...userParams.secondaryEmail, additionalEmail]
                                        })
                                        setAdditionalEmail(null)
                                    } else {
                                        setError(validate.error)
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className="chips-consignee">
                        {userParams?.secondaryEmail?.map((value: any, index: any) => (
                            <Chips
                                label={value}
                                key={index}
                                onDelete={() => {
                                    removeSecondaryEmail(value)
                                }}
                            />))}
                    </div>
                </div>)}
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

            {!isNullValue(selectedElement) &&
                <div className="tagged-location">
                    <div className="tagged-location-heading">
                        <h3>Tagged Location Name</h3>
                        {taggedLocationArray?.length > 0 &&
                            <>
                                {allTaggedLocations ? (
                                    <div onClick={() => { setAllTaggedLocations(false) }} className="addLess-btn">
                                        <Button
                                            buttonStyle="btn-orange minus-btn consignee-button"
                                            leftIcon={<Remove />}
                                            onClick={ev => { ev.stopPropagation(); }}
                                        />
                                        <span className="ml-2 orange-text cursor-pointer"> Less</span>
                                    </div>) :
                                    (
                                        <div onClick={() => { setAllTaggedLocations(true) }} className="addLess-btn">
                                            <Button
                                                buttonStyle="add-btn consignee-button"
                                                leftIcon={<Add />}
                                                onClick={ev => { ev.stopPropagation(); }}
                                            />
                                            <span className="blue-text ml-2 cursor-pointer"> More</span>
                                        </div>
                                    )
                                }
                            </>}
                    </div>
                    <div>
                        <Collapse in={allTaggedLocations} timeout="auto" unmountOnExit>

                            {taggedLocationArray?.map((value: any, index: any) => (
                                <Chips
                                    label={value}
                                    key={index}
                                />))}
                        </Collapse>
                    </div>
                </div>
            }
        </ModalContainer>
    );

    function clearData() {
        setUserParams(consigneeElementData);
        setDisableCheckBox(false);
        setAddEmailOpen(false);
        setAddPhoneOpen(false);
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
        else if (userParams?.createUser) {
            if (isNullValueOrZero(userParams?.username)) {
                setError({
                    username: "Username should be of min 3 characters with at-least 1 alphabet or number"
                });
                return false;
            } else if ( userParams?.username?.trim().length < 3) {
                setError({
                    username: "Username should be of min 3 characters with at-least 1 alphabet or number"
                });
                return false;
            } else if (!(userParams?.username?.trim().match(".*[a-zA-Z0-9]+.*"))) {
                setError({
                    username: "Username should be of min 3 characters with at-least 1 alphabet or number"
                });
                return false;
            }
        }
        return true;
    }
    function validateAdditionalPhoneNumber(additionalPhone: any) {
        let status: boolean = true;
        let error: any = {}
        if (additionalPhone && String(additionalPhone).length === 10 && validatePhoneNumber(String(additionalPhone))) {
            if (userParams?.secondaryPhoneNumber.filter((data: any) => data === additionalPhone).length <= 0) {
                setUserParams({
                    ...userParams,
                    secondaryPhoneNumber: [...userParams.secondaryPhoneNumber, additionalPhone]
                })
            } else {
                status = false;
                error["additionalPhoneError"] = "Phone number alredy exist!"
            }
        } else {
            status = false;
            error["additionalPhoneError"] = "Enter valid phone number!"
        }
        return {
            status,
            error
        }
    }
    function validateAdditionalEmail(additionalEmail: any) {
        let status: boolean = true;
        let error: any = {}
        if (additionalEmail && validateEmail(additionalEmail)) {
            if (userParams?.secondaryEmail.filter((data: any) => data === additionalEmail).length <= 0) {
                setUserParams({
                    ...userParams,
                    secondaryEmail: [...userParams.secondaryEmail, additionalEmail]
                })
            } else {
                status = false;
                error["additionalEmailError"] = "Email alredy exist!"
            }
        } else {
            status = false;
            error["additionalEmailError"] = "Enter Valid Email!"
        }
        return {
            status,
            error
        }
    }
    function removeSecondaryEmail(value: any) {
        setUserParams({
            ...userParams,
            secondaryEmail: userParams?.secondaryEmail.filter((data: any) => data !== value)
        })
    }
    function removeSecondaryPhoneNumber(value: any) {
        setUserParams({
            ...userParams,
            secondaryPhoneNumber: userParams?.secondaryPhoneNumber.filter((data: any) => data !== value)
        })
    }

}

export default CreateConsigneeModals;
