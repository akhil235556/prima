import { ArrowRightAlt, ClearAll } from "@material-ui/icons";
import React from "react";
import { useDispatch } from "react-redux";
import {
    address,
    companyName, emailId, gstNumber, panCard, phoneNumber,
    transporterLabel, transporterPlaceHolder
} from '../../../base/constant/MessageUtils';
import {
    isNullValue,
    isNullValueOrZero
} from "../../../base/utility/StringUtils";
import EditText from "../../../component/widgets/EditText";
import NumberEditText from '../../../component/widgets/NumberEditText';
import ModalContainer from "../../../modals/ModalContainer";
import { showAlert } from '../../../redux/actions/AppActions';
import { createPartner } from '../../../serviceActions/PartnerServiceAction';


interface CreatePartnerModalsProps {
    open: boolean
    onClose: any
    onSuccess: any,
}

function CreatePartnerModal(props: CreatePartnerModalsProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onSuccess } = props;
    const [userParams, setUserParams] = React.useState<any>({});
    const [error, setError] = React.useState<any>({});
    const [loading, setLoading] = React.useState<boolean>(false);

    const onApplyHandler = () => {
        if (validateData()) {
            setLoading(true);
            let params: any = {
                name: userParams.name,
                companyName: userParams.companyName,
                address: userParams.address,
                panNumber: userParams.panNumber,
                gstinNumber: userParams.gstinNumber,
                phoneNumber: userParams.phoneNumber,
                email: userParams.email,
                // scope: userParams.scope.value,
            }
            appDispatch(createPartner(params)).then((response: any) => {
                if (response && response.message) {
                    clearData();
                    appDispatch(showAlert(response.message));
                    onSuccess();
                }
                setLoading(false);
            });
        }
    }

    return (
        <ModalContainer
            title={"Create Transporter"}
            primaryButtonTitle={"Create"}
            secondaryButtonTitle={"Clear"}
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
                        label={transporterLabel}
                        mandatory
                        placeholder={transporterPlaceHolder}
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
                        label={companyName}
                        placeholder={companyName}
                        mandatory
                        error={error.companyName}
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
                        mandatory
                        required
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
                        mandatory
                        required
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
                        maxLength={10}
                        mandatory
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
                        mandatory
                        error={error.email}
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
                {/* <div className="form-group col-md-6">
                    <AutoComplete
                        label="Scope"
                        placeHolder="Select Scope"
                        error={error.scope}
                        mandatory
                        value={userParams.scope}
                        toolTip={() => (
                            <CustomToolTip
                                title="Transporter will be visible to complete platform if scope is global"
                                placement="top"
                                disableInMobile="false"
                            >
                                <Info className="blue-text info-icon" />
                            </CustomToolTip>
                        )}
                        options={transporterScope}
                        onChange={(element: OptionType) => {
                            setError({});
                            setUserParams({
                                ...userParams,
                                scope: element
                            });
                            setError({})
                        }}
                    />
            </div>*/}
            </div>
        </ModalContainer >
    );

    function clearData() {
        setUserParams({});
        setError({});
    }

    function validateData() {
        if (isNullValue(userParams.name)) {
            setError({
                name: "Enter transporter name"
            });
            return false;
        }
        else if (isNullValue(userParams.companyName)) {
            setError({
                companyName: "Enter company name"
            });
            return false;
        }
        else if (isNullValue(userParams.address)) {
            setError({
                Address: "Enter valid address"
            });
            return false;
        }
        else if (isNullValueOrZero(userParams.panNumber)) {
            setError({
                card: "Enter valid pan number"
            });
            return false;
        }
        else if (isNullValueOrZero(userParams.gstinNumber)) {
            setError({
                gstNumber: "Enter valid GST number"
            });
            return false;
        }
        else if (isNullValueOrZero(userParams.phoneNumber)) {
            setError({
                number: "Enter valid number"
            });
            return false;
        }
        else if (isNullValueOrZero(userParams.email)) {
            setError({
                email: "Enter valid email id"
            });
            return false;
        }
        // else if (isNullValue(userParams.scope)) {
        //     setError({
        //         scope: "Select scope"
        //     });
        //     return false;
        // }
        return true;

    }

}

export default CreatePartnerModal;
