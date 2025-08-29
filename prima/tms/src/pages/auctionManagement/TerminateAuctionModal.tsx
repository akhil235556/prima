
import { TextareaAutosize } from "@material-ui/core";
import { CancelRounded } from '@material-ui/icons';
import React from "react";
import { useDispatch } from "react-redux";
import { commentLabel, commentPlaceholder } from '../../base/constant/MessageUtils';
import ModalContainer from "../../modals/ModalContainer";
import { showAlert } from '../../redux/actions/AppActions';
import { terminateAuction } from "../../serviceActions/AuctionServiceActions";
import './TerminateAuctionModal.css';

interface TerminateAuctionModalProps {
    open: boolean
    onClose: any
    onSuccess: any
    message: string,
    auctionCode: string,
    customClass?: any
    haedingClass?: any
}

function TerminateAuctionModal(props: TerminateAuctionModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, message, auctionCode, onSuccess, customClass, haedingClass } = props;
    const [loading, setLoading] = React.useState<any>(false);
    const [comment, setComment] = React.useState<any>("");

    return (
        <ModalContainer
            title="Terminate"
            secondaryButtonTitle={"Cancel"}
            primaryButtonTitle="Proceed"
            primaryButtonStyle="btn-orange"
            secondaryButtonStyle="btn-detail"
            loading={loading}
            secondaryButtonDisable={loading}
            open={open}
            onClear={onClose}
            onClose={() => {
                onClose();
            }}
            onApply={() => {
                setLoading(true);
                let params = {
                    auctionCode: auctionCode,
                    notificationMessage: comment,
                }
                appDispatch(terminateAuction(params)).then((response: any) => {
                    setLoading(false);
                    response && response.message && appDispatch(showAlert(response.message));
                    response && onSuccess && onSuccess();
                })
            }}
            styleName={customClass ? customClass : "common-modal terminated-modal"}
        >
            <div className={haedingClass ? "text-center" : "modal-common-wrap-2 text-center"}>
                {<CancelRounded className="cancel-icon" />}
                <h3 className={haedingClass ? (haedingClass + " red-text") : "red-text"}>Terminate</h3>
                <p className="desc-wrap">
                    {message}
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

export default TerminateAuctionModal;

