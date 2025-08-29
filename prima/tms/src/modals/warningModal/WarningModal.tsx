import React from "react";
import NumberEditText from "../../component/widgets/NumberEditText";
import ModalContainer from "../ModalContainer";
import './WarningModal.css';

interface WarningModalProps {
    open: boolean
    onClose: any
    onSuccess: any,
    warningMessage: any,
    primaryButtonTitle: any
    secondaryuttonTitle: any,
    successLoader?: boolean
    secondaryButtonLeftIcon?: any,
    primaryButtonStyle?: string,
    primaryButtonLeftIcon?: any,
    value?: any
    onChange?: any
    showTextField?: any
    errorMessage?: any
    label?: any
    placeholder?: any
    pollingLoader?: boolean

}

function WarningModal(props: WarningModalProps) {
    const { open, onClose, warningMessage, primaryButtonTitle, secondaryuttonTitle, onSuccess, successLoader, secondaryButtonLeftIcon, primaryButtonLeftIcon, primaryButtonStyle, pollingLoader, showTextField, onChange, placeholder, value, label, errorMessage } = props;
    return (
        <ModalContainer
            title="Warning"
            secondaryButtonTitle={secondaryuttonTitle}
            primaryButtonTitle={primaryButtonTitle}
            primaryButtonStyle={primaryButtonStyle}
            open={open}
            secondaryButtonLeftIcon={secondaryButtonLeftIcon}
            primaryButtonLeftIcon={primaryButtonLeftIcon}
            loading={successLoader || pollingLoader}
            onApply={onSuccess}
            onClear={() => {
                onClose();
            }}
            onClose={() => {
                onClose();
            }}
            styleName={"warning-modal"}
        >
            <div className="warning-container text-center">
                <img src="/images/warning-icon.png" alt="truck-icon" />
                <h3>Warning!</h3>
                <h4>{warningMessage}</h4>
            </div>
            {showTextField && <div className="form-group col-md-8 col-8">
                <NumberEditText
                    onChange={onChange}
                    value={value}
                    placeholder={placeholder}
                    label={label}
                    error={errorMessage}
                    maxLength={10}
                    mandatory={true}
                />
            </div>
            }
        </ModalContainer>
    );
}

export default WarningModal;