import { Cancel } from "@material-ui/icons";
import React from "react";
import { useDispatch } from "react-redux";
import { cancelIndentWarning } from "../../../base/constant/MessageUtils";
import ModalContainer from "../../../modals/ModalContainer";
import { showAlert } from "../../../redux/actions/AppActions";
import { cancelIndentOrder } from "../../../serviceActions/IndentServiceAction";

interface IndentCancelModalProps {
    open: boolean,
    onClose: any
    onSuccess: any,
    indentCode: any
}

function IndentCancelModal(props: IndentCancelModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onSuccess, indentCode } = props;
    const [loading, setLoading] = React.useState<boolean>(false);
    return (
        <ModalContainer
            title={"Cancel Order"}
            primaryButtonTitle={"OK"}
            primaryButtonStyle="btn-orange ok-btn"
            open={open}
            loading={loading}
            onClose={onClose}
            onApply={() => {
                setLoading(true);
                const params = {
                    indentCode: indentCode,
                }
                appDispatch(cancelIndentOrder(params)).then((response: any) => {
                    if (response) {
                        response.message && appDispatch(showAlert(response.message));
                        onSuccess();
                    }
                    setLoading(false);
                }).finally(() => onClose());
            }}
            styleName={"message-modal error"}
            actionButtonStyle="center"
        >
            <div className="text-center">
                <Cancel />
                <h2 className={"content-heading error"}>Cancel</h2>
                <label>{cancelIndentWarning}</label>
            </div>
        </ModalContainer>
    );
}

export default IndentCancelModal;
