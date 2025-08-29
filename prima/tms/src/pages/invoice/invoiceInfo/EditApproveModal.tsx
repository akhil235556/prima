
import { CheckCircle } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { approveLabel } from "../../../base/constant/MessageUtils";
import MultiSelect from "../../../component/widgets/MultiSelect";
import ModalContainer from "../../../modals/ModalContainer";
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import {
    updateApprover
} from '../../../serviceActions/BillGenerateServiceActions';
import './AddApproveModal.css';


interface EditApproveModalProps {
    open: boolean
    onClose: any
    onSuccess: any
    billNo: any,
    usersList: any,
    approversList: any,
    noOFApprovers?: any,
}
function EditApproveModal(props: EditApproveModalProps) {
    const { open, onClose, onSuccess, billNo, usersList, approversList, noOFApprovers } = props;
    const appDispatch = useDispatch();
    const [error, setError] = React.useState<any>("");
    const [loading, setLoading] = React.useState<any>(false);
    const [selectedUsers, setSelectedUsers] = React.useState<any>([]);


    useEffect(() => {
        if (approversList && approversList.length && open) {
            setSelectedUsers(setAutoCompleteListWithData(approversList, "userName", "userId"))
        }

    }, [approversList, open])

    const validateParams = (params: any) => {
        if (params && params.length) {
            return true;
        }

        setError("Select Approvers")
        return false
    }

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

    const onSuccessHandler = async () => {
        if (!validateParams(selectedUsers)) {
            return
        }
        setLoading(true)
        const params = generateParamsForApprover(selectedUsers, billNo)
        try {
            const updateResp = await appDispatch(updateApprover(params))
            onSuccess(updateResp && updateResp.message)
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }

    }

    return (
        <ModalContainer
            title="Edit Approvers"
            primaryButtonTitle={"Update"}
            primaryButtonLeftIcon={<CheckCircle />}
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

            {
                approversList.map((item: any) => (
                    <ul className="row edit-user-wrap align-items-center" key={item.id}>
                        <li className="col user-status"><img src={item.approveMarked ? "/images/approve-icon.png" : "/images/pending-icon.png"} alt="Approve Status" /></li>
                        <li className="col user-status">{item.userName}</li>
                        <li className="col user-status orange-text">{item.approveMarked ? "Approved" : "Pending"}</li>
                    </ul>
                ))
            }


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
        setSelectedUsers(null);
        setError("");
    }
}
export default EditApproveModal;