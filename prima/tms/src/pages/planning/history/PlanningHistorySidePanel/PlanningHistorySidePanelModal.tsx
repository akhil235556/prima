
import { Close, Visibility } from "@material-ui/icons";
import React from "react";
import { useHistory } from "react-router-dom";
import { PlanningCreatePlanUrl } from "../../../../base/constant/RoutePath";
import ModalContainer from "../../../../modals/ModalContainer";
import "./PlanningHistoryModal.css";
import PlanningHistorySidePanel from "./PlanningHistorySidePanel";

interface PlanningHistorySidePanelModalProps {
    selectedElement?: any;
    onClose?: any;
    open?: any;
}

function PlanningHistoryModal(props: PlanningHistorySidePanelModalProps) {
    const { open, onClose, selectedElement } = props;
    const history = useHistory();
    const sidePanelDetailsRef = React.useRef<any>();
    return (
        <ModalContainer
            title="Details"
            secondaryButtonTitle="Close"
            primaryButtonTitle="Details"
            primaryButtonStyle="btn-blue"
            primaryButtonLeftIcon={<Visibility />}
            secondaryButtonLeftIcon={<Close />}
            secondaryButtonStyle="btn-detail"
            open={open}
            onClear={onClose}
            onClose={() => {
                onClose();
            }}
            onApply={() => {
                history.push({
                    pathname: PlanningCreatePlanUrl + selectedElement?.request_id,
                    state: { ...sidePanelDetailsRef.current }
                })
            }}
            styleName="common-modal planning-history-modal"
        >
            <PlanningHistorySidePanel selectedTask={selectedElement} setSidePanelDetailsRef={(details: any) => {
                sidePanelDetailsRef.current = { ...details }
            }} />
        </ModalContainer>
    );
}

export default PlanningHistoryModal;
