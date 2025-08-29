import React from "react";
import ModalContainer from "../../../modals/ModalContainer";
import './LocationErrorModal.css';

interface LocationErrorModalProps {
    open: boolean
    onClose: any
    onSuccess: any,
    warningMessage: any,
}

function LocationErrorModal(props: LocationErrorModalProps) {
    const { open, onClose, warningMessage, onSuccess } = props;
    let meaageArr = warningMessage && warningMessage.split(',');

    return (
        <ModalContainer
            title="Warning"
            primaryButtonTitle="Cancel"
            secondaryButtonTitle={"Confirm"}
            open={open}
            onApply={() => {
                onClose();
            }}
            onClear={() => {
                onSuccess();
            }}
            onClose={() => {
                onClose();
            }}
            styleName={"warning-modal location-error-modal"}
        >
            <div className="warning-container text-center">
                <img src="/images/warning-icon.png" alt="truck-icon" />
                <h3>Warning!</h3>
                <ul>
                    {meaageArr && meaageArr.map((element: any) => (
                        <>
                            <li>{element}</li>
                        </>

                    ))}
                </ul>

                <h5>Are you sure, you want to move tagging of current location</h5>
            </div>

        </ModalContainer>
    );
}

export default LocationErrorModal;
