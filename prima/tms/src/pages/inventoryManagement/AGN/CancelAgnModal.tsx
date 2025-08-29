import React from "react";
import ModalContainer from "../../../modals/ModalContainer";
import { Cancel } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { showAlert } from "../../../redux/actions/AppActions";
import { cancelAgnWarning } from "../../../base/constant/MessageUtils";
import { cancelAgn } from '../../../serviceActions/AgnServiceActions';

interface CancelAgnModalProps {
    open: boolean,
    onClose: any
    onSuccess: any,
    selectedElement: any,
    refresh: any
}

function CancelAgnModal(props: CancelAgnModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onSuccess, selectedElement, refresh } = props;
    const [loading, setLoading] = React.useState<boolean>(false);
    return (
        <ModalContainer
            title={"Cancel Agn"}
            primaryButtonTitle={"OK"}
            primaryButtonStyle="btn-orange ok-btn"
            open={open}
            loading={loading}
            onClose={onClose}
            onApply={() => {
                setLoading(true);
                appDispatch(cancelAgn({ agnCode: selectedElement.agnCode })).then((response: any) => {
                    if (response) {
                        response.message && appDispatch(showAlert(response.message));
                        refresh();
                    }
                    onSuccess();
                    setLoading(false);
                });
            }}
            styleName={"message-modal error"}
            actionButtonStyle="center"
        >
            <div className="text-center">
                <Cancel />
                <h2 className={"content-heading error"}>Cancel</h2>
                <label>{cancelAgnWarning}</label>
            </div>
        </ModalContainer>
    );
}

export default CancelAgnModal;
