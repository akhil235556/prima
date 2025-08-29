import React from "react";
import { useDispatch } from "react-redux";
import ModalContainer from "../../../modals/ModalContainer";
import { setRefreshCount, showAlert } from '../../../redux/actions/AppActions';
import { markRead } from '../../../serviceActions/NotificationServiceAction';

interface MarkNotificationModalProps {
    open: boolean
    onClose: any
    onSuccess: any
    selectedElement: any
}

function MarkNotificationModal(props: MarkNotificationModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, onSuccess, selectedElement } = props;
    const [loading, setLoading] = React.useState<any>(false);

    return (
        <ModalContainer
            title="Mark all as read"
            secondaryButtonTitle={"Yes"}
            loading={loading}
            secondaryButtonLoading={loading}
            open={open}
            onClear={() => {
                setLoading(true);
                appDispatch(markRead({ channel: selectedElement })).then((response: any) => {
                    if (response) {
                        response.message && appDispatch(showAlert(response.message))
                        appDispatch(setRefreshCount());
                        onSuccess();
                    }
                    setLoading(false);
                })
            }}
            onClose={() => {
                onClose();
            }}
            styleName={"common-modal"}
        >
            <div className="modal-common-wrap text-center">
                <img src="/images/mark-notification.png" alt="mark-notification" />
                <h4>
                    Mark all notifications as read
                </h4>
                <h3>Are you sure ?</h3>
            </div>

        </ModalContainer>
    );
}

export default MarkNotificationModal;

