import { AddCircle, CancelRounded, CheckCircleRounded, Create, KeyboardBackspace } from '@material-ui/icons';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { InvoiceStatusEnum } from "../../../base/constant/ArrayList";
import { isMobile } from "../../../base/utility/ViewUtils";
import Button from '../../../component/widgets/button/Button';
import { InfoTooltip } from '../../../component/widgets/tooltip/InfoTooltip';
//import { InfoTooltip } from '../../../component/widgets/tooltip/InfoTooltip';
import { showAlert } from '../../../redux/actions/AppActions';
import { acceptBill, raiseDispute, resolveBillV2 } from '../../../serviceActions/BillGenerateServiceActions';
interface InvoiceViewButtonsProps {
    transactionsResponse: any;
    approverClickHandler: any;
    setLoading: any;
    setCommentModal: any;
    onApproveClickHandler: any;
    approveDisable: any;
    setOpenCancelModal: any;
    billNo: any;
    showSubmitButton?: boolean
    setOpenEditApproveModal?: any
    isPeriodic?: any,
    isDisputeButtonEnabled?: boolean;
}

const InvoiceViewButtons = (props: InvoiceViewButtonsProps) => {
    const { transactionsResponse, approverClickHandler, setLoading, setCommentModal, onApproveClickHandler, approveDisable, setOpenCancelModal, billNo, showSubmitButton, setOpenEditApproveModal, isPeriodic } = props;
    const appDispatch = useDispatch();
    const history = useHistory();
    const renderButtons = () => {
        switch (transactionsResponse.billStatus) {
            case InvoiceStatusEnum.PENDING:
                {
                    return getPendingButtons()
                }
            case InvoiceStatusEnum.ACCEPTED:
                {
                    return getAcceptedButtons()
                }
            case InvoiceStatusEnum.APPROVED:
                {
                    return getApprovedButtons();
                }
            case InvoiceStatusEnum["AWAITING APPROVAL"]:
                {
                    return getAwaitingButtons();
                }
            case InvoiceStatusEnum.DISPUTED:
                {
                    return getDisputedButtons();
                }
            default:
                {
                    return null;
                }
        }
    }

    function getPendingButtons() {

        if (transactionsResponse.clientAcceptanceRequired === 'TRUE') {
            return (
                <>
                    {isPeriodic ? (
                        showSubmitButton ?
                            <Button
                                buttonStyle="btn-orange mr-2"
                                title={"Dispute"}
                                leftIcon={<CancelRounded />}
                                onClick={() => {
                                    if (showSubmitButton) {
                                        const disputeParams = {
                                            billNo: billNo,
                                        }
                                        setLoading(true)
                                        appDispatch(raiseDispute(disputeParams)).then((response: any) => {
                                            response && response.message && appDispatch(showAlert(response.message));
                                            response && history.goBack();
                                            setLoading(false);
                                        });
                                    } else {
                                        setCommentModal(true)
                                    }
                                }}
                            /> : <InfoTooltip
                                title={"Please add the reason below against Freight orders"}
                                customIcon={
                                    <Button
                                        buttonStyle="btn-orange disabled mob-btn-orange mr-2"
                                        title={"Dispute"}
                                        leftIcon={<CancelRounded />}
                                    />
                                }
                            />) : <Button
                        buttonStyle="btn-orange mr-2"
                        title={showSubmitButton ? "Submit Dispute" : "Dispute"}
                        leftIcon={showSubmitButton ? <KeyboardBackspace /> : <CancelRounded />}
                        onClick={() => {
                            if (showSubmitButton) {
                                const disputeParams = {
                                    billNo: billNo,
                                }
                                setLoading(true)
                                appDispatch(raiseDispute(disputeParams)).then((response: any) => {
                                    response && response.message && appDispatch(showAlert(response.message));
                                    response && history.goBack();
                                    setLoading(false);
                                });
                            } else {
                                setCommentModal(true)
                            }
                        }}
                    />}
                    <Button
                        buttonStyle="btn-blue"
                        title="Accept"
                        leftIcon={<CheckCircleRounded />}
                        onClick={() => {
                            setLoading(true);
                            let invoiceParams: any = {
                                billNo
                            }
                            appDispatch(acceptBill(invoiceParams)).then((response: any) => {
                                response && response.message && appDispatch(showAlert(response.message));
                                // response && history.push(FreightBillingListUrl + InvoiceStatusEnum.ACCEPTED);
                                response && history.goBack();
                                setLoading(false);
                            })
                        }}
                    />
                </>
            )

        } else if (!!(+transactionsResponse.requiredApproverCount) && transactionsResponse.partnerAcceptanceRequired === 'FALSE') {
            return (
                <Button
                    buttonStyle="btn-orange"
                    title="Add Approvers"
                    leftIcon={<AddCircle />}
                    onClick={approverClickHandler}
                />
            )
        } else {
            return (
                <>
                    {
                        (!(transactionsResponse.partnerAcceptanceRequired === "TRUE")) &&
                        (
                            <Button
                                buttonStyle="btn-blue mr-2"
                                title="Approve"
                                leftIcon={<CheckCircleRounded />}
                                onClick={onApproveClickHandler}
                            />
                        )
                    }
                    {
                        (transactionsResponse.owner === 'CLIENT') && (
                            <Button
                                buttonStyle="btn-orange"
                                title="Cancel"
                                leftIcon={<CancelRounded />}
                                onClick={() => {
                                    setOpenCancelModal(true);
                                }}
                            />
                        )
                    }

                </>
            )

        }
    }

    function getAcceptedButtons() {
        if (!!(+transactionsResponse.requiredApproverCount)) {
            return (
                <Button
                    buttonStyle="btn-orange"
                    title="Add Approvers"
                    leftIcon={<AddCircle />}
                    onClick={approverClickHandler}
                />
            )
        } else {
            return (
                <>
                    <Button
                        buttonStyle="btn-blue mr-2"
                        title="Approve"
                        leftIcon={<CheckCircleRounded />}
                        onClick={onApproveClickHandler}
                    />
                    {
                        transactionsResponse.owner === 'CLIENT' && (
                            <Button
                                buttonStyle="btn-orange"
                                title="Cancel"
                                leftIcon={<CancelRounded />}
                                onClick={() => {
                                    setOpenCancelModal(true);
                                }}
                            />
                        )
                    }
                </>
            )
        }
    }

    function getApprovedButtons() {
        return (
            <Button
                buttonStyle="btn-blue mr-2"
                title="Pay"
                leftIcon={<CheckCircleRounded />}
                onClick={onApproveClickHandler}
            />
        )
    }

    function getAwaitingButtons() {
        if (transactionsResponse.isApprover === 1) {
            return (
                <>
                    <Button
                        buttonStyle="btn-blue mr-2"
                        title="Approve"
                        leftIcon={<CheckCircleRounded />}
                        onClick={onApproveClickHandler}
                        disable={transactionsResponse.billStatus === InvoiceStatusEnum["AWAITING APPROVAL"] && approveDisable}
                    />
                    <Button
                        buttonStyle="btn-orange mr-2"
                        title="Cancel"
                        leftIcon={<CancelRounded />}
                        onClick={() => {
                            setOpenCancelModal(true);
                        }}
                    />
                    {isPeriodic && <Button
                        buttonStyle="btn-orange"
                        title={isMobile ? "" : "Edit Approvers"}
                        leftIcon={<Create />}
                        onClick={() => {
                            setOpenEditApproveModal(true)
                        }}
                    />}
                </>
            )
        }
        return (isPeriodic ? <Button
            buttonStyle="btn-orange"
            title={isMobile ? "" : "Edit Approvers"}
            leftIcon={<Create />}
            onClick={() => {
                setOpenEditApproveModal(true)
            }}
        /> : null);
    }

    function getDisputedButtons() {
        if (transactionsResponse.owner === "CLIENT") {
            return (
                <>
                    <Button
                        buttonStyle="btn-blue mr-2"
                        title={"Resolve"}
                        leftIcon={<CheckCircleRounded />}
                        onClick={() => {
                            setLoading(true);
                            let invoiceParams: any = {
                                billNo,
                            }
                            appDispatch(resolveBillV2(invoiceParams)).then((response: any) => {
                                response && response.message && appDispatch(showAlert(response.message));
                                // response && history.push(FreightBillingListUrl + InvoiceStatusEnum.PENDING);
                                response && history.goBack();
                                setLoading(false);
                            });
                        }}
                    />
                    <Button
                        buttonStyle="btn-orange"
                        title="Cancel"
                        leftIcon={<CancelRounded />}
                        onClick={() => {
                            setOpenCancelModal(true);
                        }}
                    />
                </>
            )
        }
        return null
    }

    return (
        <>
            {renderButtons()}
        </>
    )

}

export default InvoiceViewButtons;






