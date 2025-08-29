import React from "react";
import DataNotFound from "../../../component/error/DataNotFound";
import SubStatusTracker from "../../../component/widgets/SubStatusTracker";
import ModalContainer from "../../../modals/ModalContainer";
import './ShipmentDetail.css';

interface InTransitModalProps {
    open: boolean
    onClose: any
    selectedScan: any
}


function InTransitModal(props: InTransitModalProps) {
    const { open, onClose, selectedScan } = props;

    return (
        <ModalContainer
            title="See all updates - In Transit"
            styleName="stop-reporting-modal shipment-sub-tracking"
            open={open}
            onApply={() => {

            }}
            onClose={() => {
                onClose()
            }}
        >
            <div className="dfsdf">
                {selectedScan && selectedScan.length > 0 ?
                    <SubStatusTracker
                        steps={selectedScan}
                    /> :
                    <div className="shipment-data">
                        <DataNotFound
                            image="/images/location-not-found.png"
                            message="Shipment Data Not Available !"
                        />
                    </div>
                }
            </div>
        </ModalContainer>
    );
}
export default InTransitModal;
