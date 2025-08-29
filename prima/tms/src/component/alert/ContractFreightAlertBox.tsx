import { CheckCircle } from "@material-ui/icons";
import React from "react";
import ModalContainer from "../../modals/ModalContainer";
import "./MessageAlertBox.css";

interface ContractAlertModalProps {
    open?: boolean
    onClose?: any
    selectedElement?: any,
    onSuccess?: any
    successMessage?: string
}

function ContractFreightAlertBox(props: ContractAlertModalProps) {
    const { open, onClose, onSuccess, successMessage } = props;

    return (
        <ModalContainer
            title={"Success"}
            secondaryButtonTitle={"OK"}
            onClear={() => {
                onSuccess()
            }}
            open={open || false}
            onClose={() => {
                onClose()
            }}
            styleName={"message-modal success"}
        >
            <div className="text-center">
                {<CheckCircle />}
                <h2 className={"content-heading success"}>
                    Success
                </h2>
                <p>{successMessage}</p>
            </div>
        </ModalContainer>
    );

}

export default ContractFreightAlertBox;
