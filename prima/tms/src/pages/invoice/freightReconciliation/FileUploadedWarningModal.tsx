import { InfoRounded } from "@material-ui/icons";
import React from "react";
import ModalContainer from "../../../modals/ModalContainer";

interface FileUploadedWarningModalProps {
    open: boolean,
    onClose: any
    proceedAnyWay: Function,
    file?: any
}

function FileUploadedWarningModal(props: FileUploadedWarningModalProps) {
    const { open, onClose, proceedAnyWay, file } = props;
    return (
        <ModalContainer
            title={"Warning"}
            primaryButtonTitle={"Proceed"}
            secondaryButtonTitle={"Cancel"}
            open={open}
            onClose={onClose}
            onApply={() => {
                proceedAnyWay && proceedAnyWay()
            }}
            onClear={() => {
                onClose && onClose()
            }}
            styleName={"message-modal info"}
            actionButtonStyle="center"
        >
            <div className="text-center">
                <InfoRounded />
                <h2 className={"content-heading info"}>{"Info"}</h2>
                <label>Your {file} will be overridden</label>
            </div>
        </ModalContainer>
    );
}

export default FileUploadedWarningModal;
