import { Info } from '@material-ui/icons'
import React from 'react'
import { appointmentDateTimeLabel, dropPointLabels, LBHLabel, MaterialLabel, numberOfBoxes, orderStatusLabel, pickUpPointLabel, placementDateTimeLabel, remarkLabel, shipmentReferenceIdLabel, tatLabelWithoutUnit, transporterLabel, vehicleTypeLabel, VolumeLabel, waybillNoLabel, WeightLabel } from '../../base/constant/MessageUtils'
import { convertDateFormat, displayDateTimeFormatter } from '../../base/utility/DateUtils'
import { isMobile } from '../../base/utility/ViewUtils'
import Information from '../../component/information/Information'
import { CustomToolTip } from '../../component/widgets/CustomToolTip'
import { InfoTooltip } from '../../component/widgets/tooltip/InfoTooltip'
import ModalContainer from '../../modals/ModalContainer'
import { consigneeLabel } from '../freight/demandOrders/base/demandOrderMessageUtils'
import MaterialTableModal from '../freight/order/MaterialTableModal'

interface ShipmentDetailsModalProps {
    selectedElement: any
    onClose: any
    open: boolean
    orderDetails: any
}

export default function ShipmentDetailsModal(props: ShipmentDetailsModalProps) {
    const { selectedElement, open, onClose } = props
    const [viewMaterialTableModal, setViewMaterialTableModal] = React.useState<boolean>(false);
    const [materialResponse, setMaterialResponse] = React.useState<any>([]);

    const eclipseLength = isMobile ? 6 : 28;

    function onClickViewMaterial(element: any) {
        setViewMaterialTableModal(true)
        setMaterialResponse(element)
    }

    return (
        <>
            <MaterialTableModal
                open={viewMaterialTableModal}
                onClose={() => {
                    setViewMaterialTableModal(false)
                }}
                selectedElement={materialResponse}
            />
            <ModalContainer
                title={"Shipment:"}
                onClose={() => {
                    onClose()
                }}
                open={open}
            >
                <div className="row diversionShipment order-detail-wrapper">
                    {selectedElement &&
                        <>
                            <div className="col-md-4 col-6 billing-group">
                                <Information
                                    title={pickUpPointLabel}
                                    customView={
                                        <InfoTooltip
                                            title={selectedElement.pickupLocationName || "....."}
                                            placement={"top"}
                                            disableInMobile={"false"}
                                            infoText={selectedElement.pickupLocationName || "....."}
                                        />
                                    }
                                />
                            </div>
                            <div className="col-md-4 col-6 billing-group">
                                <Information
                                    title={dropPointLabels}
                                    text={selectedElement.dropLocationName}
                                    customView={
                                        <InfoTooltip
                                            title={selectedElement.pickupLocationName || "....."}
                                            placement={"top"}
                                            disableInMobile={"false"}
                                            infoText={selectedElement.pickupLocationName || "....."}
                                        />
                                    }
                                />
                            </div>
                            <div className="col-md-4 col-6 billing-group">
                                <Information
                                    title={tatLabelWithoutUnit}
                                    text={selectedElement.tat}
                                />
                            </div>
                            <div className="col-md-4 col-6 billing-group">
                                <Information
                                    title={vehicleTypeLabel}
                                    text={selectedElement.vehicleTypeName}
                                />
                            </div>
                            <div className="col-md-4 col-6 billing-group">
                                <Information
                                    title={VolumeLabel}
                                    text={selectedElement.totalShipmentVolume}
                                />
                            </div>
                            <div className="col-md-4 col-6 billing-group">
                                <Information
                                    title={WeightLabel}
                                    text={selectedElement.totalShipmentWeight}
                                />
                            </div>
                            <div className="col-md-4 col-6 billing-group">
                                <Information
                                    title={placementDateTimeLabel}
                                    text={convertDateFormat(selectedElement.placementDatetime, displayDateTimeFormatter)}
                                />
                            </div>
                            <div className="col-md-4 col-6 billing-group">
                                <Information
                                    title={transporterLabel}
                                    text={selectedElement.partnerName}
                                />
                            </div>
                            <div className="col-md-4 col-6 billing-group">
                                <Information
                                    title={consigneeLabel}
                                    text={selectedElement.consigneeName}
                                />
                            </div>
                            <div className="col-md-4 col-6 billing-group">
                                <Information
                                    title={LBHLabel}
                                    text={selectedElement.length ? selectedElement.length + " * " + selectedElement.width + " * " + selectedElement.height : "NA"}
                                />
                            </div>
                            <div className="col-md-4 col-6 billing-group">
                                <Information
                                    title={numberOfBoxes}
                                    text={selectedElement.totalShipmentQuantity}
                                />
                            </div>
                            <div className="col-md-4 col-6 billing-group">
                                <Information
                                    title={MaterialLabel}
                                    text={"View"}
                                    customView={<div
                                        className="lane-wrap lane-content lane-content-mobile text-truncate slisting-soNum"
                                        onClick={() => {
                                            onClickViewMaterial(selectedElement.articleDetails)
                                        }}
                                    >
                                        <ul className="view-text blue-text d-flex align-items-center">
                                            <li><Info /></li>
                                            <li>View</li>
                                        </ul>
                                    </div>}

                                />
                            </div>
                            <div className="col-md-4 col-6 billing-group">
                                <Information
                                    title={appointmentDateTimeLabel}
                                    text={selectedElement.appointmentDatetime}
                                />
                            </div>
                            <div className="col-md-4 col-6 billing-group">
                                <Information
                                    title={waybillNoLabel}
                                    text={selectedElement.airwaybillNumber}
                                />
                            </div>
                            <div className="col-md-4 col-6 billing-group">
                                <Information
                                    title={"ELR Number"}
                                    text={selectedElement.lrNumber}
                                />
                            </div>
                            <div className="col-md-4 col-6 billing-group">
                                <Information
                                    title={shipmentReferenceIdLabel}
                                    text={selectedElement.shipmentRefId}
                                />
                            </div>
                            <div className="col-md-4 col-6 billing-group">
                                <Information
                                    title={orderStatusLabel}
                                    text={selectedElement.shipmentStatusName}
                                />
                            </div>
                            <div className="labelWidth col-md-4 col-6 billing-group">
                                <Information
                                    title={remarkLabel}
                                    customView={
                                        <div className="d-flex ">
                                            <p>{selectedElement.shipmentRemarks || "NA"}</p>
                                            {
                                                selectedElement.shipmentRemarks &&
                                                selectedElement.shipmentRemarks.length >= eclipseLength &&
                                                <CustomToolTip
                                                    title={selectedElement.shipmentRemarks}
                                                    placement={"top"}
                                                    disableInMobile={"false"}
                                                >
                                                    <span className="blue-text">more</span>
                                                </CustomToolTip>
                                            }
                                        </div>
                                    }
                                />
                            </div>
                        </>
                    }
                </div>
            </ModalContainer>
        </>
    )
}