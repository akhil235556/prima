import {
    CheckCircle
} from "@material-ui/icons";
import React from "react";
import ModalContainer from "../../modals/ModalContainer";
import "./MessageAlertBox.css";

interface TripAlertModalProps {
    open?: boolean
    onClose?: any
    onSuccess?: any
    message: any
}

function PaymentAlertBox(props: TripAlertModalProps) {
    const { open, onClose, onSuccess, message } = props;

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
                <label>{message}</label>
            </div>
        </ModalContainer>
    );

}

export default PaymentAlertBox;
