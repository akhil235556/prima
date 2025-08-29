import { Close, Visibility } from "@material-ui/icons";
import React from "react";
import ModalContainer from "../../../modals/ModalContainer";
import CreatePlanMap from "./CreatePlanMap";

function CreatePlanMapModal(props: any) {

    const { open, onClose, mapData } = props;
    return (
        <ModalContainer
            title="Details"
            secondaryButtonTitle=""
            primaryButtonTitle="Close"
            primaryButtonStyle="btn-blue"
            primaryButtonLeftIcon={<Visibility />}
            secondaryButtonLeftIcon={<Close />}
            secondaryButtonStyle="btn-detail"
            open={open}
            onClear={onClose}
            onClose={() => {
                onClose();
            }}
            onApply={() => { }}
            styleName="common-modal planning-history-modal create-plan-modal"
        >
            <CreatePlanMap mapData={mapData} onClose={onClose} />
        </ModalContainer>
    );
}
export default CreatePlanMapModal;