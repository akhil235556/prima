import React from "react";
import "./MessageAlertBox.css"
import {
    CheckCircle,
    // Report
} from "@material-ui/icons";
import ModalContainer from "../../modals/ModalContainer";

interface TripAlertModalProps {
    open?: boolean
    onClose?: any
    selectedElement?: any,
    onSuccess?: any
}

function TripMessageAlertBox(props: TripAlertModalProps) {
    // const appDispatch = useDispatch();
    const { open, onClose, selectedElement, onSuccess } = props;
    // const appReducer = useSelector((state: any) => state.appReducer, shallowEqual);

    return (
        <ModalContainer
            title={"Success"}
            secondaryButtonTitle={"OK"}
            onClear={() => {
                onSuccess()
                // appDispatch(hideAlert())
            }}
            open={open || false}
            onClose={() => {
                onClose()
                // appDispatch(hideAlert());
            }}
            styleName={"message-modal success"}
        >
            <div className="text-center">
                {<CheckCircle />}
                <h2 className={"content-heading success"}>
                    Success
                </h2>
                <label>{selectedElement && selectedElement.message}</label>
            </div>
        </ModalContainer>
    );

}

export default TripMessageAlertBox;
