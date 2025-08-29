import React from "react";
import './SobReport.css'
import ModalContainer from "../../../modals/ModalContainer";

import { ArrowRightAlt, ClearAll } from "@material-ui/icons";

interface SobModalProps {
    open: boolean
    onClose?: any
    selectedElement?: any
}

function SobViewModal(props: SobModalProps) {
    const { open, onClose, selectedElement } = props;
    // const appDispatch = useDispatch();

    return (
        <ModalContainer
            title={"Transporters List"}
            primaryButtonLeftIcon={<ArrowRightAlt />}
            secondaryButtonLeftIcon={<ClearAll />}
            open={open}
            onClose={() => {
                onClose();
            }}
            onApply={() => {
            }}
            onClear={() => {
            }}
            styleName="sob-modal"
        >
            <div className="sob-list">
                <ul>
                    {selectedElement && selectedElement.map((element: any, index: any) => {
                        return (
                            <li>
                                <span style={{ background: element.color }}></span> {element.partnerName}
                                <strong className="float-right">{(element.value || 0) + " %"}</strong>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </ModalContainer>

    )

}

export default SobViewModal;
