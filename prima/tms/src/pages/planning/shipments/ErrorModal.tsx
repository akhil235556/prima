import React from "react";
import ReactJson from 'react-json-view';
import ModalContainer from "../../../modals/ModalContainer";
import "./ErrorModal.css";
//import ModalContainer from "./ModalContainer";

interface ErrorModalProps {
    open: boolean
    onClose: any
    selectedElement: any,
}

function ErrorModal(props: ErrorModalProps) {
    const { open, onClose, selectedElement } = props;

    return (
        <ModalContainer
            title="Details"
            styleName="payload-modal"
            open={open}
            onClose={() => {
                onClose()
            }}
        >
            {open && <div className="payload-wrapp">
                <div className="payload-content">
                    <ReactJson
                        src={selectedElement}
                        theme="bright:inverted"
                        displayObjectSize={false}
                        enableClipboard={false}
                        displayDataTypes={false}
                    />
                </div>
            </div>
            }
        </ModalContainer>
    );
}
export default ErrorModal;
