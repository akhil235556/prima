import React from "react";
import ModalContainer from "../../../modals/ModalContainer";
import { Report } from "@material-ui/icons";
import { editContractWarning, sureWarning } from "../../../base/constant/MessageUtils";

interface CancelAgnModalProps {
    open: boolean,
    onClose: any
    onSuccess: any,
    selectedElement: any
    loading?: any
}

function EditConfirmationModal(props: CancelAgnModalProps) {
    const { open, onClose, onSuccess, loading } = props;
    return (
        <ModalContainer
            title={"Edit Contract"}
            primaryButtonTitle={"OK"}
            primaryButtonStyle="btn-orange ok-btn"
            open={open}
            loading={loading}
            onClose={onClose}
            onApply={() => {
                onSuccess();
            }}
            styleName={"message-modal info"}
            actionButtonStyle="center"
        >
            <div className="text-center">
                <Report />
                <h2 className={"content-heading info"}>Warning</h2>
                <label>{sureWarning}</label> <br/>
                <label>{editContractWarning}</label>
            </div>
        </ModalContainer>
    );
}

export default EditConfirmationModal;
