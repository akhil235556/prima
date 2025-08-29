import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { contractId, distancePriceLabel, freightLabel, lanePriceLabel, referenceIdLabel } from "../../../base/constant/MessageUtils";
import Information from "../../../component/information/Information";
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import { CustomTooltipTable } from "../../../component/widgets/CustomToolTipTable";
import ModalContainer from "../../../modals/ModalContainer";
import { getFreightBillingContractDetails, getFreightReconcilationContractDetails } from "../../../serviceActions/OrderServiceActions";
import ContractDetailModal from "../../indentManagement/indent/ContractDetailModal";
import "./FreightReconcilationContractModal.css";

interface FreightReconcilationContractModalProps {
    open: boolean,
    onClose: any
    selectedElement?: any,
    billNo?: any,
    isPeriodicBilling?: any,
}

function FreightReconcilationContractModal(props: FreightReconcilationContractModalProps) {
    const { open, onClose, selectedElement, billNo, isPeriodicBilling } = props;
    const [response, setResponse] = React.useState<any>({});
    const [loading, setLoading] = React.useState<any>(false);
    const [openContractDetailModal, setOpenContractDetailModal] = React.useState<boolean>(false)
    const appDispatch = useDispatch();

    useEffect(() => {
        const getDetails = () => {
            setLoading(true);
            appDispatch(!isPeriodicBilling ? getFreightReconcilationContractDetails({ freightOrderCode: selectedElement?.freightOrderCode, id: selectedElement?.billReconId }) : getFreightBillingContractDetails({ billNo: billNo, freightId: selectedElement?.freightId })).then((response: any) => {
                if (response) {
                    setResponse(response);
                }
                setLoading(false)
            })
        }
        open && getDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    return (
        <ModalContainer
            title={"Freight Details"}
            open={open}
            loading={false}
            onClose={onClose}
            styleName={"freight-order-modal"}
        // actionButtonStyle="center"
        >

            {openContractDetailModal &&
            <ContractDetailModal
                open={openContractDetailModal}
                selectedElement={{
                    contractCode: response?.contractCode,
                    partnerCode: response?.partnerCode
                }}
                laneCode={response && response?.laneCode}
                freightType={response && response?.freightTypeCode}
                onSuccess={() => {
                    setOpenContractDetailModal(false);
                }}
                onClose={() => {
                    setOpenContractDetailModal(false);
                }}
            />}

            {loading ?
                <CardContentSkeleton
                    row={2}
                    column={2}
                /> :
                <div className="order-detail-wrapper">
                    <div className="custom-form-row row">
                        <div className="col-md-3 billing-group col-6">
                            <Information
                                title={contractId}
                                text={response?.contractCode}
                                valueClassName={"blue-text"}
                                customView={
                                    <span
                                        className={response?.contractCode ? "blue-text cursor-pointer" : ""}
                                        onClick={() => {
                                            response?.contractCode && setOpenContractDetailModal(true);
                                        }}
                                    >
                                        {response?.contractCode ? response.contractCode : "NA"}
                                    </span>
                                }
                            />
                        </div>
                        <div className="col-md-3 billing-group col-6">
                            <Information
                                title={freightLabel}
                                text={response?.freightType}
                            />
                        </div>
                        <div className="col-md-3 billing-group col-6">
                            <Information
                                title={referenceIdLabel}
                                text={response?.referenceCode}
                            />
                        </div>
                        <div className="col-md-3 billing-group col-6">
                            <Information
                                title={lanePriceLabel}
                                text={response?.baseFreightCharge}
                            />
                        </div>
                    </div>
                    <div className="custom-form-row row">
                        <div className="col-md-3 billing-group col-6">
                            <Information
                                title={distancePriceLabel}
                                text={response?.distanceCharge || "NA"}
                                tooltip={() => (< CustomTooltipTable
                                    tableColumn={[{ description: "Type", name: "distanceType" }, { description: "Run(km)", name: "distance" }, { description: "Charges", name: "amount" }]}
                                    tableData={response && response.distanceChargeBreakup}
                                />)}
                            />
                        </div>
                    </div>
                </div>}
        </ModalContainer>
    )
}

export default FreightReconcilationContractModal;
