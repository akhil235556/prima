import React from 'react';
import Modal from '@material-ui/core/Modal';
import Button from "../component/widgets/button/Button";
import Close from '@material-ui/icons/Close';
import TrackingMapView from '../pages/tracking/trackingView/TrackingMapView';
import { TrackingState } from '../redux/storeStates/TrackingModels';
import { Dispatch } from 'react';
import { openMobileMapView } from '../redux/actions/TrackingActions';
import "./MapViewModal.css";

interface ModalProps {
    state: TrackingState,
    dispatch: Dispatch<any>
}

export function MobileMapView(props: ModalProps) {

    const state = props.state;
    return (
        <Modal className="modal-popup tab-map-view"
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={props.state.showMobileMapView}
            disableEscapeKeyDown
            onClose={() => false}
        >
            <div className="makeStylesPopup">
                <div className="popup-content" style={{ height: "100%" }}>
                    <div className="popup-header"><h6 className="title">Vehicle Tracking
                        <Button
                            buttonStyle={"modal-close"}
                            leftIcon={<Close />}
                            onClick={() => {
                                props.dispatch(openMobileMapView());
                            }}
                        /></h6></div>
                    <div className="popup-body" style={{ height: "100%", padding: 0 }}>
                        <TrackingMapView
                            currentLocation={state.selectedTripCurrentLocation}
                            directions={state.directions}
                            path={state.path}
                            selectedElement={state.locationArray}
                            taggedLocations={(state.selectedElement && state.selectedElement.taggedLocations)}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    )

}