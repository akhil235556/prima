import Delete from "@material-ui/icons/Delete";
import React from "react";
import ModalContainer from "../../../modals/ModalContainer";
import '../../../modals/warningModal/WarningModal.css';

interface DeleteSobModalProps {
    open: boolean
    onClose: any
    onSuccess: any,
}

function DeleteSobModal(props: DeleteSobModalProps) {
    const { open, onClose, onSuccess } = props;
    return (
        <ModalContainer
            title={"Delete SOB"}
            primaryButtonTitle={"OK"}
            primaryButtonStyle="btn-orange ok-btn"
            open={open}
            onClose={onClose}
            onApply={() => { onSuccess() }}
            styleName={"message-modal"}
            actionButtonStyle="center"
        >
            <div className="text-center">
                <Delete />
                <h2 className={"content-heading error"}>Delete</h2>
                <label>{"Are you sure you want to delete this SOB?"}</label>
            </div>
        </ModalContainer>
    );
}

export default DeleteSobModal;
