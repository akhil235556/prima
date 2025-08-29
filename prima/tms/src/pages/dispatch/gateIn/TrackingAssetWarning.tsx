import { InfoRounded } from "@material-ui/icons";
import React from "react";
import { trackingAsetsWarning, trackingAssetsInfo } from "../../../base/constant/MessageUtils";
import ModalContainer from "../../../modals/ModalContainer";

interface TrackingAssetWarningProps {
    open: boolean,
    onClose: any
    addTrackingAsset: Function,
    proceedAnyWay: Function,
    isTrackable: boolean
    vehicleDetails: any
}

function TrackingAssetWarning(props: TrackingAssetWarningProps) {
    const { open, onClose, addTrackingAsset, proceedAnyWay, isTrackable, vehicleDetails } = props;
    return (
        <ModalContainer
            title={"Vehicle Tracking"}
            primaryButtonTitle={isTrackable ? "Proceed" : "Proceed Anyway"}
            secondaryButtonTitle={isTrackable ? "Change Tracking Asset" : "Add Tracking Asset"}
            open={open}
            onClose={onClose}
            onApply={() => {
                proceedAnyWay && proceedAnyWay()
            }}
            onClear={() => {
                addTrackingAsset && addTrackingAsset();
            }}
            styleName={"message-modal info"}
            actionButtonStyle="center"
        >
            <div className="text-center">
                <InfoRounded />
                <h2 className={"content-heading info"}>{isTrackable ? "Info" : "Warning"}</h2>
                <label>{isTrackable ? trackingAssetsInfo + ((vehicleDetails && vehicleDetails.trackingAsset && vehicleDetails.trackingAsset.trackingVendor) || "NA") : trackingAsetsWarning}</label>
            </div>
        </ModalContainer>
    );
}

export default TrackingAssetWarning;
