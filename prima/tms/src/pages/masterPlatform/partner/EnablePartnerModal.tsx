import { ArrowRightAlt, ClearAll } from "@material-ui/icons";
import React from "react";
import { useDispatch } from "react-redux";
import { errorSelectTransporter } from "../../../base/constant/MessageUtils";
import { isNullValue } from "../../../base/utility/StringUtils";
import AutoSuggest from '../../../component/widgets/AutoSuggest';
import EditText from "../../../component/widgets/EditText";
import NumberEditText from "../../../component/widgets/NumberEditText";
import { OptionType } from '../../../component/widgets/widgetsInterfaces';
import ModalContainer from "../../../modals/ModalContainer";
import { autosuggestSearchLength } from "../../../moduleUtility/ConstantValues";
import { setAutoCompleteListWithData } from '../../../moduleUtility/DataUtils';
import { showAlert } from "../../../redux/actions/AppActions";
import { PartnerDetails } from "../../../redux/storeStates/PartnerStoreInterface";
import { enablePartners, getNotEnabledPartnerList } from '../../../serviceActions/PartnerServiceAction';
import "./EnablePartnerModal.css";

interface EnablePartnerModalProps {
    open: boolean
    onClose: any
    onSuccess: any
}

function EnablePartnerModal(props: EnablePartnerModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onSuccess } = props;
    const [partnerDetails, setPartnerDetails] = React.useState<PartnerDetails | any>({});
    const [partnerList, setPartnerList] = React.useState<Array<OptionType> | undefined>(undefined)
    const [error, setError] = React.useState<any>({});
    const [loading, setLoading] = React.useState<any>(false);

    return (
        <ModalContainer
            title="Enable Transporter"
            primaryButtonTitle={"Enable"}
            secondaryButtonTitle={"Clear"}
            primaryButtonLeftIcon={<ArrowRightAlt />}
            secondaryButtonLeftIcon={<ClearAll />}
            loading={loading}
            open={open}
            onClose={() => {
                clearData();
                onClose();
            }}
            onApply={() => {
                if (validate()) {
                    setLoading(true);
                    let params = {
                        partnerId: partnerDetails.partnerId,
                        ...partnerDetails
                    }
                    appDispatch(enablePartners(params)).then((response: any) => {
                        setLoading(false);
                        if (response && response.details) {
                            response.message && appDispatch(showAlert(response.message));
                            clearData();
                            onSuccess();
                        }
                    })
                }
            }}
            onClear={() => {
                clearData();
            }}
        >
            <div className="custom-form-row row">
                <div className="form-group col-md-6">
                    <AutoSuggest
                        label="Search Transporter"
                        mandatory
                        placeHolder="Search Transporter"
                        value={partnerDetails.partnerName}
                        suggestions={partnerList}
                        error={error.partner}
                        onSelected={(value: OptionType) => {
                            setPartnerDetails(value.data)
                            setError({});
                        }}
                        handleSuggestionsFetchRequested={({ value }: any) => {
                            if (value.length > autosuggestSearchLength) {
                                getPartnerList(value);
                            }
                        }}
                        onChange={(text: string) => {
                            setPartnerDetails({
                                partnerName: text
                            })
                        }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <EditText
                        label="Code"
                        mandatory
                        placeholder="Code"
                        maxLength={40}
                        disabled={true}
                        value={partnerDetails.partnerCode}
                        onChange={() => { }}
                    />
                </div>
                <div className="form-group tat-form col-md-12">
                    <EditText
                        label="Company"
                        mandatory
                        placeholder="Company"
                        maxLength={100}
                        disabled={true}
                        value={partnerDetails.partnerCompanyName}
                        onChange={() => { }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <EditText
                        label="Email"
                        mandatory
                        placeholder="Email"
                        maxLength={50}
                        disabled={true}
                        value={partnerDetails.partnerEmail}
                        onChange={() => { }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <EditText
                        label="Mobile"
                        mandatory
                        placeholder="Mobile"
                        maxLength={100}
                        disabled={true}
                        value={partnerDetails.partnerPhoneNumber}
                        onChange={() => { }}
                    />
                </div>
                <div className="form-group tat-form col-md-6">
                    <EditText
                        label="PAN Number"
                        mandatory
                        placeholder="Pan Number"
                        maxLength={100}
                        disabled={true}
                        value={partnerDetails.partnerPanNumber}
                        onChange={() => { }}
                    />
                </div>
                <div className="form-group tat-form col-md-6">
                    <EditText
                        label="GST Number"
                        mandatory
                        placeholder="Gst Number"
                        maxLength={100}
                        disabled={true}
                        value={partnerDetails.partnerGstinNumber}
                        onChange={() => { }}
                    />
                </div>
                <div className="form-group col-md-12">
                    <EditText
                        label="Address"
                        mandatory
                        placeholder="Address"
                        maxLength={100}
                        value={partnerDetails.partnerAddress}
                        disabled={true}
                        onChange={() => { }}
                    />
                </div>
                <div className="bg-darkgrey add-contact-details">
                    <p className="add-contact-details--heading">Contact Details</p>
                </div>
                <div className="form-group col-md-6">
                    <EditText
                        label="Email"
                        mandatory
                        placeholder="Email"
                        maxLength={50}
                        error={error.userEmail}
                        // disabled={true}
                        value={partnerDetails.userEmail}
                        onChange={(text: any) => {
                            setPartnerDetails({
                                ...partnerDetails,
                                userEmail: text
                            })
                            setError({});
                        }}
                    />
                </div>
                <div className="form-group col-md-6">
                    <NumberEditText
                        label="Mobile"
                        mandatory
                        placeholder="Mobile"
                        maxLength={10}
                        error={error.userPhoneNumber}
                        // disabled={true}
                        value={partnerDetails.userPhoneNumber}
                        onChange={(text: any) => {
                            setPartnerDetails({
                                ...partnerDetails,
                                userPhoneNumber: text
                            })
                            setError({});
                        }}
                    />
                </div>
            </div>


        </ModalContainer>
    );
    function getPartnerList(text: string) {
        appDispatch(getNotEnabledPartnerList({ query: text, isActive: -1 })).then((response: any) => {
            if (response) {
                setPartnerList(setAutoCompleteListWithData(response, "partnerName", "partnerCode"))
            } else {
                setPartnerList([])
            }
        });
    }

    function validate() {
        if (isNullValue(partnerDetails.partnerName)) {
            setError({ partner: errorSelectTransporter })
            return false;
        }
        else if (isNullValue(partnerDetails.userEmail)) {
            setError({ userEmail: 'Please enter email' })
            return false;
        }
        else if (isNullValue(partnerDetails.userPhoneNumber)) {
            setError({ userPhoneNumber: 'Please enter Mobile' })
            return false;
        }
        return true;
    }

    function clearData() {
        setPartnerDetails({});
        setPartnerList([])
        setError({});
    }
}

export default EnablePartnerModal;
