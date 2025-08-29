import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { FreightType, materialListTooltipColumn } from "../../../base/constant/ArrayList";
import {
    ConsigneeLabel,





    deliveredDateLabel, driverNameLabel, driverNumberLabel, DropPointLabel,
    freightTypeLabel, invoiceValueLabel, lrNoLabel, MaterialLabel, numberofCartonsValueLabel, orderDateLabel, orderStatusLabel, pickUpPointLabel,
    placementDateLabel,


    reportedDateLabel, shipmentCodeLabel, shipmentReferenceIdLabel, TranspoterLabel, vehicleNumberHint,
    vehicleTypeHint,
    waybillNoLabel
} from "../../../base/constant/MessageUtils";
import { convertDateFormat, displayDateTimeFormatter } from "../../../base/utility/DateUtils";
import Information from "../../../component/information/Information";
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import { CustomTooltipTable } from "../../../component/widgets/CustomToolTipTable";
import { InfoTooltip } from "../../../component/widgets/tooltip/InfoTooltip";
import ModalContainer from '../../../modals/ModalContainer';
import { getFreightOrderList } from '../../../serviceActions/OrderServiceActions';
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";

interface InvoiceShipmentModalProps {
    open: boolean,
    onClose: any
    onSuccess: any,
    selectedElement: any
}

function InvoiceShipmentModal(props: InvoiceShipmentModalProps) {
    const appDispatch = useDispatch();
    const { open, onClose, selectedElement = {} } = props;
    const [userParams, setUserParams] = React.useState<any>({});
    const [loading, setLoading] = React.useState<boolean>(false);
    const [openPointModal, setOpenPointModal] = React.useState<boolean>(false);

    useEffect(() => {
        const getList = async () => {
            let queryParams: any = {
                freightOrderCode: selectedElement.freightOrderCode,
                freightShipmentCode: selectedElement.freightShipmentCode,
            }
            setLoading(true);
            appDispatch(getFreightOrderList(queryParams)).then((response: any) => {
                response && response.results && response.results[0] && setUserParams(response.results[0])
                setLoading(false);
            });
        }
        open && getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    return (
        <ModalContainer
            title={"Shipment Details"}
            primaryButtonTitle={""}
            loading={loading}
            open={open}
            onClose={() => {
                clearData()
                onClose();
            }}
            styleName="shipment-modal"
        >
            <LanePointsDisplayModal
                open={openPointModal}
                laneCode={selectedElement.laneCode}
                onClose={() => {
                    setOpenPointModal(false)
                }} />
            <div className="order-detail-wrapper shipment-detail-wrap">
                {loading ? <CardContentSkeleton
                    row={5}
                    column={2}
                />
                    : <div className="custom-form-row row">
                        <div className="col-md-6 billing-group col-6">
                            <Information
                                title={shipmentCodeLabel}
                                text={userParams.shipmentDetails && userParams.shipmentDetails[0] && userParams.shipmentDetails[0].freightShipmentCode}
                            />
                        </div>
                        <div className="col-md-6 billing-group col-6">
                            <Information
                                title={freightTypeLabel}
                                text={userParams.shipmentDetails && userParams.freightTypeCode}
                            />
                        </div>
                        <div className="col-md-6 billing-group col-6">
                            <Information
                                title={orderDateLabel}
                                text={userParams.shipmentDetails && userParams.shipmentDetails[0].createdAt && convertDateFormat(userParams.shipmentDetails[0].createdAt, displayDateTimeFormatter)}
                            />
                        </div>
                        <div className="col-md-6 billing-group col-6">
                            <Information
                                title={placementDateLabel}
                                text={userParams.shipmentDetails && userParams.shipmentDetails[0].placementDatetime && convertDateFormat(userParams.shipmentDetails[0].placementDatetime, displayDateTimeFormatter)}
                            />
                        </div>

                        {userParams.shipmentDetails && userParams.freightTypeCode === FreightType.FTL && <div className="col-md-6 billing-group col-6">
                            <Information
                                title={vehicleTypeHint}
                                text={userParams.shipmentDetails && userParams.shipmentDetails[0] && userParams.shipmentDetails[0].vehicleTypeName}
                            />
                        </div>}
                        <div className="col-md-6 billing-group col-6">
                            <Information
                                title={TranspoterLabel}
                                text={userParams.shipmentDetails && userParams.partnerName}
                            />
                        </div>
                        <div className="col-md-6 billing-group col-6">
                            <Information
                                title={numberofCartonsValueLabel}
                                text={(userParams.shipmentDetails && userParams.shipmentDetails[0] && userParams.shipmentDetails[0].totalShipmentQuantity) || "NA"}
                            />
                        </div>
                        <div className="col-md-6 billing-group col-6">
                            <Information
                                title={invoiceValueLabel}
                                text={(userParams.shipmentDetails && userParams.shipmentDetails[0] && userParams.shipmentDetails[0].shipmentInvoiceValue) || "NA"}
                            />
                        </div>
                        <div className="col-md-6 billing-group col-6">
                            <Information
                                title={TranspoterLabel}
                                text={userParams.shipmentDetails && userParams.partnerName}
                            />
                        </div>
                        <div className="col-md-6 billing-group col-6">
                            <Information
                                title={pickUpPointLabel}
                                customView={
                                    <InfoTooltip
                                        title={(userParams.shipmentDetails && userParams.shipmentDetails[0] && userParams.shipmentDetails[0].pickupLocationName) || "....."}
                                        placement={"top"}
                                        disableInMobile={"false"}
                                        infoText={(userParams.shipmentDetails && userParams.shipmentDetails[0] && userParams.shipmentDetails[0].pickupLocationName) || "....."}
                                    />
                                }
                            />
                        </div>
                        <div className="col-md-6 billing-group col-6">
                            <Information
                                title={DropPointLabel}
                                customView={
                                    <InfoTooltip
                                        title={(userParams.shipmentDetails && userParams.shipmentDetails[0] && userParams.shipmentDetails[0].dropLocationName) || "....."}
                                        placement={"top"}
                                        disableInMobile={"false"}
                                        infoText={(userParams.shipmentDetails && userParams.shipmentDetails[0] && userParams.shipmentDetails[0].dropLocationName) || "....."}
                                    />
                                }
                            />
                        </div>

                        <div className="col-md-6 billing-group col-6">
                            <Information
                                title={lrNoLabel}
                                text={userParams.shipmentDetails && userParams.shipmentDetails[0] && userParams.shipmentDetails[0].lrNumber}
                            />
                        </div>
                        <div className="col-md-6 billing-group col-6">
                            <Information
                                title={shipmentReferenceIdLabel}
                                text={userParams.shipmentDetails && userParams.shipmentDetails[0] && userParams.shipmentDetails[0].shipmentRefId}
                            />
                        </div>
                        <div className="col-md-6 billing-group col-6">
                            <Information
                                title={waybillNoLabel}
                                text={userParams.shipmentDetails && userParams.shipmentDetails[0] && userParams.shipmentDetails[0].airwaybillNumber}
                            />
                        </div>
                        <div className="col-md-6 billing-group col-6">
                            <Information
                                title={ConsigneeLabel}
                                text={userParams.shipmentDetails && userParams.shipmentDetails[0] && userParams.shipmentDetails[0].consigneeName}
                            />
                        </div>
                        <div className="col-md-6 billing-group col-6">
                            <Information
                                title={vehicleNumberHint}
                                text={userParams.shipmentDetails && userParams.shipmentDetails[0] && userParams.shipmentDetails[0].vehicleRegistrationNumber}
                            />
                        </div>
                        <div className="col-md-6 billing-group col-6">
                            <Information
                                title={driverNameLabel}
                                text={userParams.shipmentDetails && userParams.shipmentDetails[0] && userParams.shipmentDetails[0].primaryDriverName}
                            />
                        </div>
                        <div className="col-md-6 billing-group col-6">
                            <Information
                                title={driverNumberLabel}
                                text={userParams.shipmentDetails && userParams.shipmentDetails[0] && userParams.shipmentDetails[0].primaryDriverNumber}
                            />
                        </div>
                        <div className="col-md-6 material-tool-tip billing-group col-6">
                            <Information
                                title={MaterialLabel}
                                text={"View"}
                                valueClassName="blue-text"
                                valueTooltip={() => <CustomTooltipTable
                                    tableColumn={materialListTooltipColumn}
                                    tableData={userParams && userParams.shipmentDetails && userParams.shipmentDetails[0] && userParams.shipmentDetails[0].articleDetails}
                                    infoText="View"
                                />}
                            />
                        </div>
                        <div className="col-md-6 billing-group orange-text col-6">
                            <Information
                                title={orderStatusLabel}
                                text={userParams.shipmentDetails && userParams.shipmentDetails[0] && userParams.shipmentDetails[0].statusName}
                                valueClassName="orange-text"
                            />
                        </div>
                        <div className="col-md-6 billing-group col-6">
                            <Information
                                title={reportedDateLabel}
                                text={userParams.shipmentDetails && userParams.shipmentDetails[0].destinationGateInTime && convertDateFormat(userParams.shipmentDetails[0].destinationGateInTime, displayDateTimeFormatter)}
                            />
                        </div>
                        <div className="col-md-6 billing-group col-6">
                            <Information
                                title={deliveredDateLabel}
                                text={userParams.shipmentDetails && userParams.shipmentDetails[0].destinationGateOutTime && convertDateFormat(userParams.shipmentDetails[0].destinationGateOutTime, displayDateTimeFormatter)}
                            />
                        </div>
                    </div>
                }
            </div>

        </ModalContainer >
    );

    function clearData() {
        setUserParams({});
    }
}

export default InvoiceShipmentModal;
