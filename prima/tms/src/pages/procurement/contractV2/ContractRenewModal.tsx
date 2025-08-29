import React, { useEffect } from "react";
import "../../tracking/VehicleTracking.css"
import ModalContainer from "../../../modals/ModalContainer";
import { DatePicker } from "@material-ui/pickers";
import { displayDateFormatter } from "../../../base/utility/DateUtils";
import { isNullValue } from "../../../base/utility/StringUtils";
import { useDispatch } from "react-redux";
import { contractRenewal } from "../../../serviceActions/ContractServiceActions";
import { showAlert } from "../../../redux/actions/AppActions";

interface ContractRenewModalProps {
    open: boolean
    onClose: any
    selectedElement: any,
    startDate: any,
    onSuccess: any
}

function RenewContractModal(props: ContractRenewModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, selectedElement, onSuccess,startDate } = props;
    const [userParams, setUserParams] = React.useState<any>({});
    const [error, setError] = React.useState<any>({});
    const [loading, setLoading] = React.useState<boolean>(false);

    useEffect(() => {
        open && setUserParams({
            contractStartDate: startDate
        })
    }, [open, startDate])

    return (
        <ModalContainer
            title="Renew Contract"
            styleName="stop-reporting-modal"
            primaryButtonTitle={"SUBMIT"}
            primaryButtonStyle="btn-orange ok-btn"
            loading={loading}
            open={open}
            onApply={() => {
                if (isNullValue(userParams.contractEndDate)) {
                    setError({ contractEndDate: "Enter contract validity to date" });
                    return;
                }
                setLoading(true);
                let queryParams: any = {
                    contractCode: selectedElement,
                    contractStartDate: userParams.contractStartDate,
                    contractEndDate: userParams.contractEndDate,
                }
                appDispatch(contractRenewal(queryParams)).then((response: any)=>{
                    if(response){
                        response.message && appDispatch(showAlert(response.message))
                        onSuccess();
                        setUserParams({});
                        setError({});
                    }
                    setLoading(false);
                })
            }}
            onClose={() => {
                onClose()
                setUserParams({})
                setError({});
            }}
        >
            <div className="row">
                <div className="form-group col-12">
                    <label className="picker-label">{"Validity From"}<span className="mandatory-flied">*</span></label>
                    <DatePicker
                        className="custom-date-picker disable-date"
                        hiddenLabel
                        placeholder="From Date"
                        helperText={error.contractStartDate}
                        disablePast
                        format={displayDateFormatter}
                        disabled
                        value={userParams.contractStartDate || null}
                        maxDate={userParams.contractEndDate}
                        onChange={(date: any) => {
                            setUserParams({
                                ...userParams,
                                contractStartDate: date
                            });
                            setError({});
                        }}
                    />
                </div>
                <div className="form-group col-12">
                    <label className="picker-label">{"Validity To"}<span className="mandatory-flied">*</span></label>
                    <DatePicker
                        className="custom-date-picker"
                        placeholder="To Date"
                        hiddenLabel
                        format={displayDateFormatter}
                        helperText={error.contractEndDate}
                        disablePast
                        minDate={userParams.contractStartDate}
                        value={userParams.contractEndDate || null}
                        onChange={(date: any) => {
                            setUserParams({
                                ...userParams,
                                contractEndDate: date
                            });
                            setError({});
                        }}
                    />
                </div>
            </div>
        </ModalContainer>
    );
}
export default RenewContractModal;
