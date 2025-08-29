import React from "react";
import "./BulkUpload.css";
import ModalContainer from "../../modals/ModalContainer";
import ReactJson from 'react-json-view'

interface BulkUploadModalProps {
    open: boolean
    onClose: any
    selectedElement: any,
}

function BulkUploadModal(props: BulkUploadModalProps) {
    const { open, onClose, selectedElement } = props;

    return (
        <ModalContainer
            title="Payload"
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
export default BulkUploadModal;
