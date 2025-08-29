import { TextareaAutosize } from "@material-ui/core";
import { CancelRounded } from "@material-ui/icons";
import React from "react";
import { useDispatch } from "react-redux";
import { cancelInvoiceWarning, commentLabel, commentPlaceholder } from "../../../base/constant/MessageUtils";
import ModalContainer from "../../../modals/ModalContainer";
import { showAlert } from "../../../redux/actions/AppActions";
import { rejectBill, rejectPeriodicBill } from "../../../serviceActions/BillGenerateServiceActions";

interface CancelInvoiceModalProps {
    open: boolean,
    onClose: any
    onSuccess: any,
    selectedElement: any,
    isPeriodicBilling?: any,
}

function CancelInvoiceModal(props: CancelInvoiceModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onSuccess, selectedElement, isPeriodicBilling } = props;
    const [loading, setLoading] = React.useState<boolean>(false);
    const [comment, setComment] = React.useState<any>("");
    return (
        <ModalContainer
            title={"Cancel Invoice"}
            open={open}
            primaryButtonTitle="Proceed"
            primaryButtonStyle="btn-orange"
            secondaryButtonTitle="Cancel"
            secondaryButtonStyle="btn-detail"
            loading={loading}
            secondaryButtonDisable={loading}
            onClear={onClose}
            onClose={onClose}
            onApply={() => {
                setLoading(true);
                let invoiceParams: any = {
                    billNo: selectedElement,
                    remarks: comment
                }
                appDispatch(isPeriodicBilling ? rejectPeriodicBill(invoiceParams) : rejectBill(invoiceParams)).then((response: any) => {
                    if (response) {
                        response.message && appDispatch(showAlert(response.message));
                        onSuccess();
                    }
                    setLoading(false);
                })
            }}
            styleName={"common-modal terminated-modal"}
            actionButtonStyle="center"
        >
            <div className="modal-common-wrap-2 text-center">
                {<CancelRounded className="cancel-icon" />}
                <h3 className=" red-text">Cancel</h3>
                <p className="desc-wrap">
                    {cancelInvoiceWarning}
                </p>
                <div className="term-comment-box">
                    <label>{commentLabel}</label>
                    <TextareaAutosize
                        rowsMax={3}
                        rowsMin={3}
                        aria-label="maximum height"
                        placeholder={commentPlaceholder}
                        onChange={(event: any) => {
                            setComment(event.target.value);
                        }}
                    />
                </div>
            </div>
        </ModalContainer>
    );
}

export default CancelInvoiceModal;
