import { TextareaAutosize } from "@material-ui/core";
import { CheckCircle } from "@material-ui/icons";
import React from "react";
import { useDispatch } from "react-redux";
import { commentLabel, commentPlaceholder } from "../../../base/constant/MessageUtils";
import ModalContainer from "../../../modals/ModalContainer";
import { approveBill } from '../../../serviceActions/BillGenerateServiceActions';

interface ApproveInvoiceModalProps {
    open: boolean,
    onClose: any
    onSuccess: any,
    selectedElement: any,
    approveInvoiceWarning: string
}

function ApproveInvoiceModal(props: ApproveInvoiceModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onSuccess, selectedElement, approveInvoiceWarning } = props;
    const [loading, setLoading] = React.useState<boolean>(false);
    const [comment, setComment] = React.useState<any>("");
    return (
        <ModalContainer
            title={"Approve Invoice"}
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
                appDispatch(approveBill(invoiceParams)).then((response: any) => {
                    if (response) {
                        onSuccess(response);
                    }
                    setLoading(false);
                })
            }}
            styleName={"common-modal terminated-modal"}
            actionButtonStyle="center"
        >
            <div className="modal-common-wrap-2 text-center">
                {<CheckCircle className="cancel-icon blue-text" />}
                <h3 className=" blue-text">Approve</h3>
                <p className="desc-wrap">
                    {approveInvoiceWarning}
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

export default ApproveInvoiceModal;
