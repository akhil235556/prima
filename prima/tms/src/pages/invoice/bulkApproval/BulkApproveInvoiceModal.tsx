import React from "react";
import ModalContainer from "../../../modals/ModalContainer";
import { CheckCircle } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { approveInvoiceWarning, commentLabel, commentPlaceholder } from "../../../base/constant/MessageUtils";
import { bulkApproveInvoice } from '../../../serviceActions/BillGenerateServiceActions';
import { TextareaAutosize } from "@material-ui/core";
import { showAlert } from "../../../redux/actions/AppActions";

interface BulkApproveInvoiceModalProps {
    open: boolean,
    onClose: any
    onSuccess: any,
    selectedElement: any,
}

function BulkApproveInvoiceModal(props: BulkApproveInvoiceModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onSuccess, selectedElement } = props;
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
                let contractList: any = [];
                selectedElement && selectedElement.forEach((item: any) => {
                    if (item.isCheckboxChecked) {
                        contractList.push(item.billNo)
                    }
                })
                appDispatch(bulkApproveInvoice({ billNo: contractList, remarks: comment })).then((response: any) => {
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

export default BulkApproveInvoiceModal;
