import React from "react";
import ModalContainer from "../../modals/ModalContainer";

interface WarningModalProps {
    open: boolean
    onClose: any
    onSuccess: any
    info: string,
    customClass?: any
    haedingClass?: any
}

function WarningModal(props: WarningModalProps) {
    // const appDispatch = useDispatch();
    const { open, onClose, info, onSuccess, customClass, haedingClass } = props;
    const [loading] = React.useState<any>(false);

    return (
        <ModalContainer
            title="Warning"
            secondaryButtonTitle={"OK"}
            loading={loading}
            open={open}
            onClear={onSuccess}
            onClose={() => {
                onClose();
            }}
            styleName={customClass ? customClass : "common-modal"}
        >
            <div className={haedingClass ? "text-center" : "modal-common-wrap-2 text-center"}>
                <img src="/images/warning.png" alt="warning" />
                <h3 className={haedingClass ? (haedingClass + " yellow-text") : "yellow-text"}>Warning!</h3>
                <p className="desc-wrap">
                    {info}
                </p>
            </div>

        </ModalContainer>
    );
}

export default WarningModal;

