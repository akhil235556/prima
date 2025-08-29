
import { CheckCircle, ClearAll } from "@material-ui/icons";
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { InvoiceStatusEnum } from "../../../base/constant/ArrayList";
import { approveLabel } from "../../../base/constant/MessageUtils";
import MultiSelect from "../../../component/widgets/MultiSelect";
import ModalContainer from "../../../modals/ModalContainer";
import { showAlert } from '../../../redux/actions/AppActions';
import { awaitBill } from '../../../serviceActions/BillGenerateServiceActions';
import './AddApproveModal.css';



interface AddApproveModalProps {
    open: boolean
    onClose: any
    onSuccess: any
    usersList: any,
    billNo: any,
    billStatus: any
    // loading: boolean,
    // approversList?: any
    noOFApprovers?: any
}
function AddApproveModal(props: AddApproveModalProps) {
    const { open, onClose, onSuccess, usersList, billNo, billStatus, noOFApprovers } = props;
    const appDispatch = useDispatch();
    const history = useHistory();
    const [error, setError] = React.useState<any>("");
    const [loading, setLoading] = React.useState<any>(false);
    const [selectedUsers, setSelectedUsers] = React.useState<any>([]);
    // const [approversList, setApproversList] = React.useState<any>([]);


    // useEffect(() => {
    //     const getApprovers = async () => {
    //         setLoading(true);
    //         try {
    //             const approverListResp = await appDispatch(getApprover({billNo}));
    //             if (approverListResp && approverListResp.length) {
    //                 setApproversList(approverListResp)
    //                 setSelectedUsers(setAutoCompleteListWithData(approverListResp, "userName", "userId"))
    //             }
    //             setLoading(false);
    //         } catch (err) {
    //             setLoading(false);
    //         }
    //     }
    //     billNo && open && getApprovers()
    // }, [billNo, open])

    const generateParamsForApprover = (approvers: any, billNo: any) => {

        const approver = approvers.map((item: any) => ({
            userName: item.label,
            userId: item.value,
            userEmail: item.data.email || item.data.userEmail,
        }))

        return {
            approver,
            billNo
        }
    }

    const moveBillToAwait = async () => {
        const invoiceParams = generateParamsForApprover(selectedUsers, billNo)
        const response = await appDispatch(awaitBill(invoiceParams));
        response && response.message && appDispatch(showAlert(response.message));
        //response && history.push(FreightBillingListUrl + InvoiceStatusEnum["AWAITING APPROVAL"]);
        response && history.goBack();
        setLoading(false);
    }

    const validateParams = (params: any) => {
        if (params && params.length) {
            return true;
        }
        setError("Select Approvers")
        return false
    }

    const onSuccessHandler = async () => {
        if (!validateParams(selectedUsers)) {
            return
        }
        setLoading(true)
        try {
            if (billStatus !== InvoiceStatusEnum["AWAITING APPROVAL"]) {
                await moveBillToAwait()
            }
            onSuccess()
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    }

    return (
        <ModalContainer
            title="Add Approvers"
            primaryButtonTitle={"Add"}
            secondaryButtonTitle={"Clear"}
            primaryButtonLeftIcon={<CheckCircle />}
            secondaryButtonLeftIcon={<ClearAll />}
            styleName="approve-modal"
            loading={loading}
            open={open}
            onClose={() => {
                clearData();
                onClose();
            }}
            onApply={onSuccessHandler}
            onClear={clearData}
        >
            <div className="custom-form-row row">
                <div className="form-group col-md-12">
                    <MultiSelect
                        label={approveLabel}
                        placeHolder="Approvers"
                        //isDisabled={editMode}
                        mandatory
                        error={error}
                        value={selectedUsers}
                        options={usersList}
                        onChange={(value: any) => {
                            setSelectedUsers(value)
                            setError("");

                        }}
                    />
                    <span className="contains-users">{noOFApprovers} approval required</span>
                </div>
            </div>
        </ModalContainer >
    );
    function clearData() {
        setSelectedUsers([]);
        setError("");
    }
}
export default AddApproveModal;