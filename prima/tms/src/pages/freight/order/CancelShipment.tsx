import { TextareaAutosize } from "@material-ui/core";
import { CancelRounded } from "@material-ui/icons";
import React from "react";
import { useDispatch } from "react-redux";
import { cancelShipmentWarning, commentLabel, commentPlaceholder } from "../../../base/constant/MessageUtils";
import ModalContainer from "../../../modals/ModalContainer";
import { showAlert } from "../../../redux/actions/AppActions";
import { freightOrderCancel } from "../../../serviceActions/OrderServiceActions";

interface CancelShipmentModalProps {
    open: boolean,
    onClose: any
    onSuccess: any,
    selectedElement: any
}

function CancelShipment(props: CancelShipmentModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onSuccess, selectedElement } = props;
    const [loading, setLoading] = React.useState<boolean>(false);
    const [comment, setComment] = React.useState<any>("");

    return (
        <ModalContainer
            title="Cancel Shipment"
            secondaryButtonTitle="Cancel"
            primaryButtonTitle="Proceed"
            primaryButtonStyle="btn-orange"
            secondaryButtonStyle="btn-detail"
            open={open}
            loading={loading}
            onClear={onClose}
            onClose={() => {
                onClose();
            }}
            onApply={() => {
                setLoading(true);
                appDispatch(freightOrderCancel({
                    freightOrderCode: selectedElement.freightOrderCode,
                    freightShipmentCode: selectedElement.freightShipmentCode,
                    remarks: comment,
                    isDiverting: true
                })).then((response: any) => {
                    if (response) {
                        response.message && appDispatch(showAlert(response.message));
                        setLoading(false);
                        onSuccess();
                    }
                });
            }}
            styleName="common-modal terminated-modal"
            actionButtonStyle="center"
        >
            <div className="modal-common-wrap-2 text-center">
                {<CancelRounded className="cancel-icon" />}
                <h3 className=" red-text">Cancel</h3>
                <p className="desc-wrap">
                    {cancelShipmentWarning}
                </p>
                <div className="term-comment-box">
                    <label>{commentLabel}</label>
                    <TextareaAutosize
                        rowsMax={3}
                        rowsMin={3}
                        aria-label="maximum height"
                        placeholder={commentPlaceholder}
                        //value={comment}
                        onChange={(event: any) => {
                            setComment(event.target.value);
                        }}
                    />
                </div>
            </div>
        </ModalContainer>
    );
}

export default CancelShipment;
