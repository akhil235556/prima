import React from "react";
import "./MessageAlertBox.css"
import {
    CheckCircle,
} from "@material-ui/icons";
import ModalContainer from "../../modals/ModalContainer";

interface ContractAlertModalProps {
    open?: boolean
    onClose?: any
    selectedElement?: any,
    onSuccess?: any
}

function ContractMessageAlertBox(props: ContractAlertModalProps) {
    const { open, onClose, selectedElement, onSuccess } = props;

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
                <label>{selectedElement}</label>
                <p>Note: add your contract charges</p>
            </div>
        </ModalContainer>
    );

}

export default ContractMessageAlertBox;
