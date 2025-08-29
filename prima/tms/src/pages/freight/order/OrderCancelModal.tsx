import { TextareaAutosize } from "@material-ui/core";
import { CancelRounded } from "@material-ui/icons";
import React from "react";
import { useDispatch } from "react-redux";
import { cancelOrderWarning, commentLabel, commentPlaceholder } from "../../../base/constant/MessageUtils";
import ModalContainer from "../../../modals/ModalContainer";
import { showAlert } from "../../../redux/actions/AppActions";
import { freightOrderCancel } from "../../../serviceActions/OrderServiceActions";

interface OrderCancelModalProps {
    open: boolean,
    onClose: any
    onSuccess: any,
    selectedElement: any,
    isDiverting?: any
}

function OrderCancelModal(props: OrderCancelModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onSuccess, selectedElement, isDiverting } = props;
    const [loading, setLoading] = React.useState<boolean>(false);
    const [comment, setComment] = React.useState<any>("");

    return (
        <ModalContainer
            title="Cancel Order"
            secondaryButtonTitle="Cancel"
            primaryButtonTitle="Proceed"
            primaryButtonStyle="btn-orange"
            secondaryButtonStyle="btn-detail"
            open={open}
            loading={loading}
            secondaryButtonDisable={loading}
            onClear={onClose}
            onClose={() => {
                onClose();
            }}
            onApply={() => {
                setLoading(true);
                let params: any = {
                    freightOrderCode: selectedElement.freightOrderCode,
                    remarks: comment
                }
                if (isDiverting) {
                    params.isDiverting = isDiverting
                }
                appDispatch(freightOrderCancel(params)).then((response: any) => {
                    if (response) {
                        response.message && appDispatch(showAlert(response.message));
                        onSuccess();
                    }
                    setLoading(false);
                });
            }}
            styleName="common-modal terminated-modal"
        >
            <div className="modal-common-wrap-2 text-center">
                {<CancelRounded className="cancel-icon" />}
                <h3 className=" red-text">Cancel</h3>
                <p className="desc-wrap">
                    {cancelOrderWarning}
                </p>
                <div className="term-comment-box">
                    <label>{commentLabel}</label>
                    <TextareaAutosize
                        rowsMax={3}
                        rowsMin={3}
                        aria-label="maximum height"
                        placeholder={commentPlaceholder}
                        onChange={(event: any) => {
                            setComment(event.target.value);
                        }}
                    />
                </div>
            </div>

        </ModalContainer>
    );
}

export default OrderCancelModal;
