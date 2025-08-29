import { Card, CardContent, CardHeader, TextareaAutosize } from "@material-ui/core";
import { Close, Create, FileCopyOutlined, KeyboardBackspace, Remove } from '@material-ui/icons';
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from 'react-router-dom';
import { isNumber } from "util";
import { fuelSurchargeTooltipColumn, InvoiceStatusEnum } from "../../../base/constant/ArrayList";
import { billNumberLabel, billPercentageLabel, contractId, debitPriceLabel, distancePriceLabel, freightTypeLabel, lanePriceLabel, laneZoneTitle, modLabel, orderCodeLabel, referenceIdLabel } from "../../../base/constant/MessageUtils";
import { convertDateFormat, displayDateTimeFormatter } from '../../../base/utility/DateUtils';
import { convertAmountToNumberFormat, floatFormatter } from '../../../base/utility/NumberUtils';
import { isObjectEmpty } from "../../../base/utility/StringUtils";
import { isMobile } from "../../../base/utility/ViewUtils";
import PaymentAlertBox from "../../../component/alert/PaymentAlertBox";
import { ListFreightLaneView } from "../../../component/CommonView";
import DataNotFound from "../../../component/error/DataNotFound";
import Filter from '../../../component/filter/Filter';
import Information from "../../../component/information/Information";
import PageContainer from "../../../component/pageContainer/PageContainer";
import Button from '../../../component/widgets/button/Button';
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import { CustomTooltipTable } from "../../../component/widgets/CustomToolTipTable";
import { OptionType } from "../../../component/widgets/widgetsInterfaces";
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { showAlert } from '../../../redux/actions/AppActions';
import { commentsTransactions, getApprover, getDisputeReasons, getInvoiceTemplateData, getUsersList, invoiceTransactions, payBill, raiseDispute, updateBill } from '../../../serviceActions/BillGenerateServiceActions';
import { getFreightInvoicingList } from "../../../serviceActions/OrderServiceActions";
import ContractDetailModal from "../../indentManagement/indent/ContractDetailModal";
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import DisputedUpdatesModal from "../disputedUpdatesModal/DisputedUpdatesModal";
import EditBillModal from "../EditBillModal";
import FileUploadedWarningModal from "../freightReconciliation/FileUploadedWarningModal";
import InvoiceTable from "../freightReconciliation/invoiceTable/InvoiceTable";
import { getInvoiceUpdateParams, updatevariablefreightcharge } from "../InvoiceUtility";
import UploadBillModal from "../UploadBillModal";
import AddApproveModal from "./AddApproveModal";
import ApproveInvoiceModal from "./ApproveInvoiceModal";
import CancelInvoiceModal from "./CancelInvoiceModal";
import DisputeInvoiceModal from "./DisputeInvoiceModal";
import EditApproveModal from "./EditApproveModal";
import './FreightReconciliationInvoice.css';
import './InvoiceInfo.css';
import InvoiceViewButtons from './InvoiceViewButtons';

function FreightBillingTripInvoice() {
    const appDispatch = useDispatch();
    const history = useHistory();
    const { id } = useParams<any>();
    const userInfo = useSelector((state: any) => state.appReducer.userInfo, shallowEqual);
    const [refresh, setRefresh] = React.useState<boolean>(false);
    const [templateResponse, setTemplateResponse] = React.useState<any>();
    const [orderDetails, setOrderDetails] = React.useState<any>({});
    const [transactionsResponse, setTransactionsResponse] = React.useState<any>({});
    const [serviceResponse, setServiceResponse] = React.useState<any>({});
    const [transactions, setTransactions] = React.useState<any>([]);
    const [loading, setLoading] = React.useState<any>();
    const [totalAmount, setTotalAmount] = React.useState<any>();
    const [deductions, setDeductions] = React.useState<any>();
    const [payable, setPayable] = React.useState<any>();
    const [initialRemarks, setInitialRemarks] = React.useState<any>("");
    const [remarks, setRemarks] = React.useState<any>("");
    const [openPointModal, setOpenPointModal] = React.useState<boolean>(false);
    const [editable, setEditable] = React.useState<boolean>(false);
    const [disputedUpdated, setDisputedUpdated] = React.useState<boolean>(false);
    const [commentModal, setCommentModal] = React.useState<boolean>(false);
    const [reasonsList, setReasonsList] = React.useState<Array<OptionType> | undefined>(undefined);
    const [openContractDetailModal, setOpenContractDetailModal] = React.useState<boolean>(false);
    const [openWarningModal, setOpenWarningModal] = React.useState<any>({ open: false, message: "" })
    const [openAddApproveModal, setOpenAddApproveModal] = React.useState<boolean>(false);
    const [openEditApproveModal, setOpenEditApproveModal] = React.useState<boolean>(false);
    const [openCancelModal, setOpenCancelModal] = React.useState<boolean>(false);
    const [openApproveModal, setOpenApprovelModal] = React.useState<boolean>(false);
    const [gstAmount, setGSTAmount] = React.useState<any>();
    const [usersList, setUsersList] = React.useState<any>([]);
    const [approversList, setApproversList] = React.useState<any>([]);
    const [approveDisable, setApproveDisable] = React.useState<boolean>(false);
    const [userApprovedCount, setUserApprovedCount] = React.useState<any>(0);
    const [podData, setPodData] = React.useState<any>({});
    const [billData, setBillData] = React.useState<any>({});
    const [commentsList, setCommentsList] = React.useState<any>(undefined);
    const [openFileWarning, setOpenFileWarning] = React.useState<boolean>(false);
    const [uploadBill, setUploadBill] = React.useState<boolean>(false);
    const [editBill, setEditBill] = React.useState<boolean>(false);
    const [csvFile] = React.useState<any>();
    const [totalFuelSurcharge, setTotalFuelSurcharge] = React.useState<any>();
    const [totalVariableFuelSurcharge, setTotalVariableFuelSurcharge] = React.useState<any>();
    const [totalFixedFuelSurcharge, setTotalFixedFuelSurcharge] = React.useState<any>();

    useEffect(() => {
        const getAllDetails = async () => {
            setLoading(true);
            let invoiceParams: any = {
                billNo: id
            }
            try {
                const invoiceResp = await appDispatch(invoiceTransactions(invoiceParams));
                const commentsResp = await appDispatch(commentsTransactions(invoiceParams));
                setCommentsList(commentsResp);
                if (invoiceResp && invoiceResp.details && invoiceResp.details.shipmentTransactionData) {
                    setTransactions(invoiceResp.details.shipmentTransactionData);
                    let tempPodList: any = []
                    invoiceResp.details.shipmentTransactionData.forEach((item: any) => {
                        tempPodList.push({
                            shipmentCode: item.shipmentDetails.shipmentCode,
                            uploaded: true
                        })
                    })
                    setPodData(tempPodList);
                }
                var totalVariableFuelCost = 0;
                var fixedFuelSurcharge = invoiceResp.details.fixedFuelSurcharge && Number(invoiceResp.details.fixedFuelSurcharge);
                invoiceResp.details.shipmentTransactionData.forEach((transaction: any) => {
                    if (transaction.variableFuelSurcharge) {
                        totalVariableFuelCost = totalVariableFuelCost + transaction.variableFuelSurcharge;
                    }
                });
                var totalFuelSurchargeAmount;
                if (totalVariableFuelCost && fixedFuelSurcharge) {
                    totalFuelSurchargeAmount = Number(totalVariableFuelCost) + Number(fixedFuelSurcharge);
                } else if (totalVariableFuelCost) {
                    totalFuelSurchargeAmount = Number(totalVariableFuelCost);
                } else if (fixedFuelSurcharge) {
                    totalFuelSurchargeAmount = Number(fixedFuelSurcharge);
                }
                setTotalFixedFuelSurcharge(convertAmountToNumberFormat(fixedFuelSurcharge, floatFormatter))
                setTotalVariableFuelSurcharge(convertAmountToNumberFormat(totalVariableFuelCost, floatFormatter));
                setTotalFuelSurcharge(convertAmountToNumberFormat(totalFuelSurchargeAmount, floatFormatter));

                if (invoiceResp && invoiceResp.details) {
                    setServiceResponse(JSON.parse(JSON.stringify(invoiceResp.details)))
                    setTransactionsResponse(Object.assign({}, invoiceResp.details));
                    invoiceResp.details.remarks && setRemarks(invoiceResp.details.remarks)
                    invoiceResp.details.remarks && setInitialRemarks(invoiceResp.details.remarks)
                } else {
                    setLoading(false)
                }
                if (invoiceResp && invoiceResp.details && invoiceResp.details.freightId) {
                    let orderParams: any = {
                        freightOrderCode: invoiceResp.details.freightId
                    }
                    const userListParams = {
                        node: invoiceResp.details.node,
                        permissionCode: "tms.freight-billing.approve"
                    }
                    const promiseArr = [appDispatch(getFreightInvoicingList(orderParams)), appDispatch(getUsersList(userListParams))]
                    let [orderResponse, usersListResp] = await Promise.all(promiseArr);
                    usersListResp && setUsersList(setAutoCompleteListWithData(usersListResp, "name", "userId"));
                    if (orderResponse && orderResponse.results && orderResponse.results[0]) {
                        setOrderDetails(orderResponse.results[0])
                        let templateParams: any = {
                            billingEntity: 'CLIENT',
                            pageType: 'VIEW',
                            freightType: orderResponse.results[0].freightTypeCode
                        }
                        const templateResp = await appDispatch(getInvoiceTemplateData(templateParams))
                        templateResp && templateResp.details && setTemplateResponse(templateResp.details.fields);
                        templateResp && templateResp.details && invoiceResp && invoiceResp.details && getAmount(invoiceResp.details.shipmentTransactionData, templateResp.details.fields, invoiceResp.details);
                    }
                    setLoading(false);
                }
            } catch (err) {
                setLoading(false);
            }
        }
        getAllDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh, id]);

    useEffect(() => {
        async function fetchApprover() {
            const approverListResp = await appDispatch(getApprover({ billNo: id }));
            if (approverListResp && approverListResp.length) {
                setApproversList(approverListResp)
                let hasApproved = false;
                let approvedCount = 0
                approverListResp.forEach((item: any) => {
                    if (item.approveMarked) {
                        if (item.userId === userInfo.userId) {
                            hasApproved = true
                        }
                        approvedCount++;
                    }
                })
                setUserApprovedCount(approvedCount);
                setApproveDisable(hasApproved);
            }
        }
        userInfo && id && fetchApprover()
    }, [appDispatch, id, userInfo, refresh]);

    useEffect(() => {
        if (transactionsResponse && transactionsResponse.billStatus === InvoiceStatusEnum.PENDING && transactionsResponse.owner === "PARTNER") {
            appDispatch(getDisputeReasons()).then((response: any) => {
                if (response) {
                    let mapReasons: any = []
                    mapReasons = response.reason && response.reason.map((item: any) => {
                        return {
                            value: item,
                            label: item
                        }
                    })
                    setReasonsList(mapReasons)
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactionsResponse, orderDetails])

    return (
        <div className="freignt-recon-info-wrap">
            <PaymentAlertBox
                open={openWarningModal.open}
                onSuccess={() => {
                    if (openWarningModal && openWarningModal.goBack) {
                        history.goBack();
                        return
                    }
                    setOpenWarningModal({ open: false, message: "" });
                    setRefresh((prev) => !prev);
                }}
                onClose={() => {
                    if (openWarningModal && openWarningModal.goBack) {
                        history.goBack();
                        return
                    }
                    setOpenWarningModal({ open: false, message: "" });
                    setRefresh((prev) => !prev);
                }}
                message={openWarningModal.message}
            />
            <CancelInvoiceModal
                open={openCancelModal}
                selectedElement={id}
                onSuccess={() => {
                    setOpenCancelModal(false);
                    history.goBack();
                }}
                onClose={() => {
                    setOpenCancelModal(false);
                }}
            />
            <FileUploadedWarningModal
                open={openFileWarning}
                onClose={() => {
                    setOpenFileWarning(false);
                }}
                proceedAnyWay={() => {
                    setUploadBill(true);
                    setOpenFileWarning(false);
                }}
            />
            <EditBillModal
                orderId={orderDetails && orderDetails.freightOrderCode}
                open={editBill}
                flag={true}
                onEditClickHandler={() => {
                    setEditBill(false);
                    setUploadBill(true);
                }}
                onClose={() => {
                    setEditBill(false);
                }}
            />

            <UploadBillModal
                open={uploadBill}
                orderId={orderDetails && orderDetails.freightOrderCode}
                file={csvFile}
                flag={true}
                onApply={(value: any) => {
                    setUploadBill(false);
                }}
                onClose={() => {
                    setUploadBill(false);
                }}
            />

            <ApproveInvoiceModal
                open={openApproveModal}
                selectedElement={id}
                onSuccess={(response: any) => {
                    if (response) {
                        setOpenApprovelModal(false);
                        if (transactionsResponse.billStatus === InvoiceStatusEnum["AWAITING APPROVAL"]) {
                            let markedCount = 0;
                            approversList.forEach((item: any) => {
                                if (item.approveMarked) {
                                    markedCount++;
                                }
                            })
                            if (markedCount < approversList.length - 1) {
                                setOpenWarningModal({ open: true, message: response.message, goBack: true });
                                return;
                            }
                        }
                        response.message && appDispatch(showAlert(response.message));
                        history.goBack();
                    }
                }}
                onClose={() => {
                    setOpenApprovelModal(false);
                }}
                approveInvoiceWarning={"Are you sure you want to approve this Invoice?"}
            />
            <div className="filter-wrap">
                <Filter
                    pageTitle={editable ? "EDIT BILL" : (((transactionsResponse && transactionsResponse.billStatus) || "") + " BILL")}
                    buttonStyle={isMobile ? "btn-detail-mob" : "btn-detail"}
                    buttonTitle={isMobile ? " " : "Back"}
                    leftIcon={<KeyboardBackspace />}
                    onClick={() => {
                        history.goBack();
                    }}
                >
                    {((transactionsResponse.billStatus === InvoiceStatusEnum.PENDING || transactionsResponse.billStatus === InvoiceStatusEnum.DISPUTED) && transactionsResponse.owner === "CLIENT") &&
                        <Button
                            buttonStyle="btn-orange"
                            title={isMobile ? "" : (!editable ? "Edit" : "Cancel")}
                            loading={loading}
                            leftIcon={!editable ? <Create /> : <Close />}
                            onClick={() => {
                                setTransactionsResponse(JSON.parse(JSON.stringify(serviceResponse)))
                                setRemarks(initialRemarks)
                                setEditable(!editable);
                            }}
                        />
                    }

                    {
                        transactionsResponse.billStatus === InvoiceStatusEnum["AWAITING APPROVAL"] && (
                            <Button
                                buttonStyle="btn-orange"
                                title={isMobile ? "" : "Edit Approvers"}
                                leftIcon={<Create />}
                                onClick={() => {
                                    setOpenEditApproveModal(true)
                                }}
                            />
                        )
                    }

                </Filter>
            </div>
            <LanePointsDisplayModal
                open={openPointModal}
                laneCode={orderDetails && orderDetails.laneCode}
                onClose={() => {
                    setOpenPointModal(false);
                }} />

            <DisputeInvoiceModal
                open={commentModal}
                onClose={() => {
                    setCommentModal(false);
                }}
                freightId={orderDetails?.freightOrderCode}
                onSuccess={() => {
                    const disputeParams = {
                        billNo: id,
                    }
                    setLoading(true)
                    appDispatch(raiseDispute(disputeParams)).then((response: any) => {
                        response && response.message && appDispatch(showAlert(response.message));
                        response && history.goBack();
                        setLoading(false);
                    });
                    setCommentModal(false);
                }}
                reasonsList={reasonsList}
                disputeDetails={orderDetails}
                billNo={id}
            />

            {openContractDetailModal &&
                <ContractDetailModal
                    open={openContractDetailModal}
                    selectedElement={{
                        contractCode: orderDetails.contractCode,
                        partnerCode: orderDetails.partnerCode
                    }}
                    laneCode={orderDetails && orderDetails.laneCode}
                    freightType={orderDetails.freightTypeCode}
                    onSuccess={() => {
                        setOpenContractDetailModal(false)
                    }}
                    onClose={() => {
                        setOpenContractDetailModal(false)
                    }}
                />}

            <DisputedUpdatesModal
                open={disputedUpdated}
                billNo={id}
                orderDetails={orderDetails}
                onSuccess={() => {
                    setDisputedUpdated(false);
                }}
                onClose={() => {
                    setDisputedUpdated(false);
                }}
                status={transactionsResponse && transactionsResponse.billStatus}
            />

            <AddApproveModal
                open={openAddApproveModal}
                usersList={usersList}
                billNo={id}
                billStatus={transactionsResponse.billStatus}
                onSuccess={() => {
                    setOpenAddApproveModal(false);
                }}
                onClose={() => {
                    setOpenAddApproveModal(false)
                }}
                noOFApprovers={transactionsResponse && transactionsResponse.requiredApproverCount}
            />

            <EditApproveModal
                open={openEditApproveModal}
                usersList={usersList}
                onSuccess={(message: any) => {
                    setOpenEditApproveModal(false);
                    message && setOpenWarningModal({ open: true, message: message })
                }}
                billNo={id}
                approversList={approversList}
                onClose={() => {
                    setOpenEditApproveModal(false)
                }}
                noOFApprovers={transactionsResponse && transactionsResponse.requiredApproverCount}
            />

            {
                !loading && isObjectEmpty(transactionsResponse)
                    ? <DataNotFound /> : (
                        <PageContainer>
                            <Card className="creat-contract-wrapp card-detail-wrap">
                                <CardHeader className="creat-contract-header"
                                    title="Bill Information"
                                />
                                {loading ?
                                    <CardContentSkeleton
                                        row={3}
                                        column={3}
                                    />
                                    : <CardContent className="creat-contract-content">
                                        <div className="custom-form-row row">
                                            <div className="col-md-3 billing-group col-6">
                                                <Information
                                                    title={billNumberLabel}
                                                    text={id}
                                                />
                                            </div>
                                            <div className="col-md-3 billing-group col-6">
                                                <Information
                                                    title={"Status"}
                                                    text={transactionsResponse && transactionsResponse.billStatus}
                                                    valueClassName="orange-text"
                                                />
                                            </div>
                                            {transactionsResponse && transactionsResponse.billStatus === "PENDING" &&
                                                <>
                                                    <div className="col-md-3 billing-group col-6">
                                                        <Information
                                                            title={"Created By"}
                                                            text={transactionsResponse && transactionsResponse.billCreatedByName}
                                                        />
                                                    </div>
                                                </>
                                            }
                                            <div className="col-md-3 billing-group col-6">
                                                <Information
                                                    title={"Created Date"}
                                                    text={transactionsResponse
                                                        && transactionsResponse.billCreatedDate
                                                        && convertDateFormat(transactionsResponse.billCreatedDate, displayDateTimeFormatter)}
                                                />
                                            </div>
                                            <div className="col-md-3 billing-group col-6">
                                                <Information
                                                    title={"Bill Raised By"}
                                                    text={transactionsResponse && (transactionsResponse.owner === "CLIENT" ? transactionsResponse.clientName : (transactionsResponse.partner && transactionsResponse.partner.name))}
                                                />
                                            </div>
                                            {transactionsResponse && transactionsResponse.billStatus === "ACCEPTED" &&
                                                <>
                                                    <div className="col-md-3 billing-group col-6">
                                                        <Information
                                                            title={"Accepted By"}
                                                            text={transactionsResponse && transactionsResponse.billAcceptedByName}
                                                        />
                                                    </div>
                                                    <div className="col-md-3 billing-group col-6">
                                                        <Information
                                                            title={"Accepted Date"}
                                                            text={transactionsResponse
                                                                && transactionsResponse.billAcceptedDate
                                                                && convertDateFormat(transactionsResponse.billAcceptedDate, displayDateTimeFormatter)}
                                                        />
                                                    </div>
                                                </>
                                            }
                                            {transactionsResponse && transactionsResponse.billStatus === "DISPUTED" &&
                                                <>
                                                    <div className="col-md-3 billing-group col-6">
                                                        <Information
                                                            title={"Dispute Raised By"}
                                                            text={transactionsResponse && transactionsResponse.billDisputedByName}
                                                        />
                                                    </div>
                                                    <div className="col-md-3 billing-group col-6">
                                                        <Information
                                                            title={"Dispute Raised At"}
                                                            text={transactionsResponse
                                                                && transactionsResponse.billDisputedDate
                                                                && convertDateFormat(transactionsResponse.billDisputedDate, displayDateTimeFormatter)}
                                                        />
                                                    </div>
                                                </>
                                            }
                                            {
                                                (
                                                    transactionsResponse &&
                                                    (
                                                        transactionsResponse.billStatus === InvoiceStatusEnum["AWAITING APPROVAL"] ||
                                                        transactionsResponse.billStatus === InvoiceStatusEnum.APPROVED
                                                    )
                                                )
                                                && (
                                                    <>
                                                        {
                                                            approversList.length ? (
                                                                <div className="col-md-3 billing-group col-6">
                                                                    <Information
                                                                        title="Approvers"
                                                                        image={<img src={userApprovedCount === approversList.length ? "/images/approve-icon.png" : "/images/pending-icon.png"} alt="Status" />}
                                                                        customView={
                                                                            <CustomTooltipTable
                                                                                customIcon={
                                                                                    <span className="blue-text approve-text">
                                                                                        {
                                                                                            userApprovedCount === approversList.length
                                                                                                ? "Approved"
                                                                                                : "Waiting for approval"
                                                                                        }
                                                                                    </span>
                                                                                }
                                                                                wrap={true}
                                                                                arrow={true}
                                                                                tableColumn={[{
                                                                                    description: (
                                                                                        userApprovedCount === approversList.length
                                                                                            ? "Approved"
                                                                                            : `${approversList.length - userApprovedCount} Approvals needed`
                                                                                    ),
                                                                                    name: "taggedLocationName",
                                                                                    customView: (value: any) => (
                                                                                        <ul>
                                                                                            <li className="row align-items-center approve-user">
                                                                                                <div className="col-8">
                                                                                                    <div className="media">
                                                                                                        <img className="mr-2" src="/images/user-icon.svg" alt="user icon" />
                                                                                                        <div className="mddia-body approve-user-content">
                                                                                                            <strong>
                                                                                                                {value.userName}
                                                                                                            </strong>
                                                                                                            <span>
                                                                                                                {value.userEmail}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 user-status-type">
                                                                                                    {
                                                                                                        value.approveMarked ?
                                                                                                            (
                                                                                                                <>
                                                                                                                    <img className="mr-2" src="/images/approve.png" alt="Approved" />
                                                                                                                    <span className="green-text">Approved</span>
                                                                                                                </>
                                                                                                            )
                                                                                                            :
                                                                                                            (
                                                                                                                <>
                                                                                                                    <img className="mr-2" src="/images/pending.png" alt="Pending" />
                                                                                                                    <span className="orange-text" >Pending</span>
                                                                                                                </>
                                                                                                            )
                                                                                                    }
                                                                                                </div>
                                                                                            </li>
                                                                                        </ul>

                                                                                    )
                                                                                }
                                                                                ]}
                                                                                tableData={approversList}
                                                                                showStringValue={true}
                                                                                style={{
                                                                                    tooltip: {
                                                                                        minWidth: isMobile ? 320 : 320,
                                                                                        maxWidth: isMobile ? 320 : 400,
                                                                                        marginTop: 8,
                                                                                        overflow: 'visible',
                                                                                    },
                                                                                }}
                                                                            />

                                                                        }
                                                                    />
                                                                </div>

                                                            ) : null
                                                        }
                                                    </>
                                                )
                                            }

                                            {transactionsResponse && transactionsResponse.billStatus === "CANCELLED" &&
                                                <>
                                                    <div className="col-md-3 billing-group col-6">
                                                        <Information
                                                            title={"Cancelled By"}
                                                            text={transactionsResponse && transactionsResponse.billCancelledByName}
                                                        />
                                                    </div>
                                                    <div className="col-md-3 billing-group col-6">
                                                        <Information
                                                            title={"Cancelled Date"}
                                                            text={transactionsResponse
                                                                && transactionsResponse.billCancelledDate
                                                                && convertDateFormat(transactionsResponse.billCancelledDate, displayDateTimeFormatter)}
                                                        />
                                                    </div>
                                                </>
                                            }
                                            {transactionsResponse && transactionsResponse.billStatus === "PAID" &&
                                                <>
                                                    <div className="col-md-3 billing-group col-6">
                                                        <Information
                                                            title={"Paid By"}
                                                            text={transactionsResponse && transactionsResponse.billPaidByName}
                                                        />
                                                    </div>
                                                    <div className="col-md-3 billing-group col-6">
                                                        <Information
                                                            title={"Paid Date"}
                                                            text={transactionsResponse
                                                                && transactionsResponse.billPaidDate
                                                                && convertDateFormat(transactionsResponse.billPaidDate, displayDateTimeFormatter)}
                                                        />
                                                    </div>
                                                </>
                                            }

                                            {
                                                commentsList && commentsList.length > 0 &&
                                                <div className="col-md-3 billing-group col-6">
                                                    <Information
                                                        title="Comments"
                                                        image={<img src="/images/comments-icon.png" alt="Status" />}
                                                        customView={
                                                            <CustomTooltipTable
                                                                customIcon={
                                                                    <span className="blue-text approve-text">
                                                                        View all Comments
                                                                    </span>
                                                                }
                                                                wrap={true}
                                                                arrow={true}
                                                                tableColumn={[{
                                                                    description: "Comments",
                                                                    customView: (value: any) => (
                                                                        <ul className="custom-list-tool">
                                                                            <li className="row align-items-center approve-user">
                                                                                <div className="col-8">
                                                                                    <div className="media">
                                                                                        <img className="mr-2" src="/images/user-icon.svg" alt="user icon" />
                                                                                        <div className="mddia-body approve-user-content">
                                                                                            <strong>
                                                                                                {value.userName} (<span className="orange-text">{value.action}</span>)
                                                                                            </strong>
                                                                                            <span>
                                                                                                {value.userEmail}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-4 user-status-type">
                                                                                    <span>
                                                                                        {convertDateFormat(value.timestamp, displayDateTimeFormatter)}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="col-12 mt-2">
                                                                                    <p className="pr-text mb-0">{value.remarks || "NA"}</p>
                                                                                </div>
                                                                            </li>
                                                                        </ul>
                                                                    )
                                                                }]}
                                                                tableData={commentsList}
                                                                showStringValue={true}
                                                                style={{
                                                                    tooltip: {
                                                                        minWidth: isMobile ? 320 : 320,
                                                                        maxWidth: isMobile ? 320 : 400,
                                                                        marginTop: 8,
                                                                        overflow: 'visible',
                                                                    },
                                                                }}
                                                            />

                                                        }
                                                    />
                                                </div>
                                            }

                                        </div>
                                    </CardContent>
                                }
                            </Card>

                            <Card className="creat-contract-wrapp card-detail-wrap">
                                <div className="billing-info-header">
                                    <h4>
                                        Freight Information
                                    </h4>
                                </div>
                                {loading ?
                                    <CardContentSkeleton
                                        row={3}
                                        column={3}
                                    />
                                    : <CardContent className="creat-contract-content">
                                        <div className="custom-form-row row">
                                            <div className="col-md-3 billing-group col-6">
                                                <Information
                                                    title={orderCodeLabel}
                                                    text={orderDetails && orderDetails.freightOrderCode}
                                                />
                                            </div>
                                            <div className="col-md-3 billing-group col-6">
                                                <Information
                                                    title={freightTypeLabel}
                                                    text={orderDetails && orderDetails.freightTypeCode}
                                                />
                                            </div>
                                            <div className="col-md-3 billing-group col-6">
                                                <Information
                                                    title={laneZoneTitle}
                                                    text={(orderDetails?.originZoneName && orderDetails?.destinationZoneName) && (orderDetails?.originZoneName + " -> " + orderDetails?.destinationZoneName)}
                                                    customView={orderDetails?.laneName && <ListFreightLaneView element={orderDetails} onClickLaneCode={(data: any) => { setOpenPointModal(true); }} />}
                                                />
                                            </div>
                                            <div className="col-md-3 billing-group col-6">
                                                <Information
                                                    title={referenceIdLabel}
                                                    text={orderDetails && orderDetails.referenceId}
                                                />
                                            </div>
                                            <div className="col-md-3 billing-group col-6">
                                                <Information
                                                    title={lanePriceLabel}
                                                    text={(transactionsResponse && transactionsResponse.baseFreightCharge) || "0"}
                                                />
                                            </div>
                                            <div className="col-md-3 billing-group col-6">
                                                <Information
                                                    title={debitPriceLabel}
                                                    text={(transactionsResponse && transactionsResponse.debitCharge) || "0"}
                                                    tooltip={() => (< CustomTooltipTable
                                                        tableColumn={[{ description: "Freight Order", name: "freightOrder" }, { description: "Lane", name: "lane" }, { description: "Amounts", name: "amount" }, { description: "Remarks", name: "remark" }]}
                                                        tableData={transactionsResponse && transactionsResponse.debitChargeBreakup}
                                                    />)}
                                                />
                                            </div>
                                            <div className="col-md-3 billing-group col-6">
                                                <Information
                                                    title={distancePriceLabel}
                                                    text={transactionsResponse && (transactionsResponse.distanceCharge || "0")}
                                                    tooltip={() => (< CustomTooltipTable
                                                        tableColumn={[{ description: "Type", name: "distanceType" }, { description: "Run(km)", name: "distance" }, { description: "Charges", name: "amount" }]}
                                                        tableData={transactionsResponse && transactionsResponse.distanceChargeBreakup}
                                                    />)}
                                                />
                                            </div>
                                            {orderDetails.contractCode &&
                                                <div className="col-md-3 billing-group col-6">
                                                    <Information
                                                        title={contractId}
                                                        valueClassName="blue-text"
                                                        customView={
                                                            <span className="blue-text cursor-pointer" onClick={() => {
                                                                setOpenContractDetailModal(true);
                                                            }} >{orderDetails.contractCode}</span>
                                                        }
                                                    />
                                                </div>}
                                            {orderDetails.serviceabilityModeCode &&
                                                <>
                                                    <div className="col-md-3 billing-group col-6">
                                                        <Information
                                                            title={modLabel}
                                                            text={orderDetails.serviceabilityModeCode}
                                                        />
                                                    </div>
                                                </>
                                            }
                                            {transactionsResponse && transactionsResponse.billStatus === InvoiceStatusEnum["AWAITING APPROVAL"] &&
                                                <>
                                                    <div className="col-md-3 billing-group col-6">
                                                        <Information
                                                            title={billPercentageLabel}
                                                            text={transactionsResponse && transactionsResponse.billValuePercentage}
                                                        />
                                                    </div>
                                                </>
                                            }
                                        </div>
                                    </CardContent>
                                }
                            </Card>

                            <Card className="creat-contract-wrapp list-info-wrap">
                                <div className="billing-info-header">
                                    <h4>Payment Information</h4>
                                </div>
                                {loading ?
                                    <CardContentSkeleton
                                        row={3}
                                        column={3}
                                    />
                                    : <CardContent className="creat-contract-content">
                                        <InvoiceTable
                                            template={templateResponse}
                                            shipmentTransactionData={(transactionsResponse && transactionsResponse.shipmentTransactionData)}
                                            onChangeAmount={(data: any) => {
                                                getAmount(data, templateResponse, transactionsResponse);
                                                setTransactions(data);
                                                updatevariablefreightcharge(data, setTotalVariableFuelSurcharge, setTotalFuelSurcharge, totalFixedFuelSurcharge);

                                            }}
                                            id={orderDetails && orderDetails.freightOrderCode}
                                            editable={!editable}
                                            viewPdf={transactionsResponse && transactionsResponse.billStatus === InvoiceStatusEnum.DISPUTED && transactionsResponse.owner === "CLIENT"}
                                            podData={podData}
                                            onChangePodData={(data: any) => {
                                                setPodData(data)
                                            }}
                                            onChangeBillData={(data: any) => {
                                                setBillData((prevData: any) => ({ ...prevData, ...data }))
                                            }}
                                            billData={billData}
                                        />
                                        <div className="row">
                                            <div className="col-md-5">
                                                <div className="billing-info-remark remark-row">
                                                    <div className="form-group">
                                                        <label>Remark</label>
                                                        <TextareaAutosize
                                                            rowsMax={3}
                                                            rowsMin={3}
                                                            aria-label="maximum height"
                                                            placeholder="Remarks"
                                                            disabled={!editable}
                                                            value={remarks}
                                                            onChange={(event: any) => {
                                                                setRemarks(event.target.value);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-7 d-flex justify-content-md-end info-total">
                                                <div className="billing-info-footer">
                                                    <div className="form-group input-wrap fuel-surcharge">
                                                        <div className="d-flex">
                                                            <label className="total-amount-content">
                                                                Fuel Surcharge :
                                                            </label>
                                                        </div>
                                                        <div className="total-amount">
                                                            <img src="/images/rupee-black.svg" alt="" /> <strong>{totalFuelSurcharge}</strong>
                                                            <CustomTooltipTable
                                                                tableColumn={fuelSurchargeTooltipColumn}
                                                                tableData={[
                                                                    {
                                                                        variableFuelSurcharge: `₹ ${totalVariableFuelSurcharge}`,
                                                                        fixedFuelSurcharge: (`₹ ${totalFixedFuelSurcharge}`),
                                                                    },
                                                                ]}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group input-wrap">
                                                        <div className="d-flex">
                                                            <label className="total-amount-content">Total :</label>
                                                        </div>
                                                        <div className="total-amount">
                                                            <img src="/images/rupee-black.svg" alt="" /> <strong>{totalAmount}</strong>
                                                        </div>
                                                    </div>
                                                    <div className="form-group input-wrap">
                                                        <div className="d-flex">
                                                            <label className="total-amount-content">Deductions :</label>
                                                        </div>
                                                        <div className="total-amount">
                                                            <Remove />
                                                            <img src="/images/rupee-red.svg" alt="" />
                                                            <strong className="red-text">{deductions}</strong>
                                                        </div>
                                                    </div>
                                                    {transactionsResponse.gstActive &&
                                                        <div className="form-group input-wrap">
                                                            <div className="d-flex">
                                                                <label className="total-amount-content">{"GST @" + transactionsResponse.gst + "%:"}</label>
                                                            </div>
                                                            <div className="total-amount">
                                                                <img src="/images/rupee-black.svg" alt="" />
                                                                <strong >{gstAmount}</strong>
                                                            </div>
                                                        </div>
                                                    }
                                                    <div className="form-group input-wrap total-payable">
                                                        <div className="d-flex">
                                                            <label className="total-amount-content blue-text">Payable :</label>
                                                        </div>
                                                        <div className="total-amount">
                                                            <img src="/images/rupee-blue.svg" alt="" />
                                                            <strong className="blue-text">{payable}</strong>
                                                        </div>
                                                    </div>
                                                    <div className="form-group text-right mt-2">
                                                        {editable ?
                                                            <div className="bill-btn-wrap">
                                                                <Button
                                                                    buttonStyle="btn-blue"
                                                                    title="Update Bill"
                                                                    leftIcon={<FileCopyOutlined />}
                                                                    onClick={() => {
                                                                        setLoading(true);

                                                                        let params: any = getInvoiceUpdateParams(id, payable, transactions, totalAmount, deductions, transactionsResponse, remarks);
                                                                        appDispatch(updateBill(params)).then((response: any) => {
                                                                            response && response.message && appDispatch(showAlert(response.message));
                                                                            response && setEditable(false);
                                                                            response && setRefresh((prev) => !prev);
                                                                            setLoading(false);
                                                                        })
                                                                    }}
                                                                />
                                                            </div> :
                                                            < div className="bill-btn-wrap">
                                                                <InvoiceViewButtons
                                                                    transactionsResponse={transactionsResponse}
                                                                    approverClickHandler={approverClickHandler}
                                                                    onApproveClickHandler={onApproveClickHandler}
                                                                    setCommentModal={setCommentModal}
                                                                    setLoading={setLoading}
                                                                    setOpenCancelModal={setOpenCancelModal}
                                                                    billNo={id}
                                                                    approveDisable={approveDisable}
                                                                />
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                }
                            </Card>
                        </PageContainer>
                    )
            }

        </div >
    );

    function onApproveClickHandler() {
        let invoiceParams: any = {
            billNo: id
        }
        if (transactionsResponse.billStatus === InvoiceStatusEnum.PENDING || transactionsResponse.billStatus === InvoiceStatusEnum.ACCEPTED || transactionsResponse.billStatus === InvoiceStatusEnum["AWAITING APPROVAL"]) {
            setOpenApprovelModal(true);
        } else {
            setLoading(true);
            appDispatch(payBill(invoiceParams)).then((response: any) => {
                response && response.message && appDispatch(showAlert(response.message));
                response && history.goBack()
                setLoading(false);
            });
        }
    }

    function getAmount(transactionsTotal: any, template: any, transactionsResponse: any) {
        var total = (transactionsResponse && transactionsResponse.baseFreightCharge && Number(transactionsResponse.baseFreightCharge)) || 0;
        total = total + ((transactionsResponse && transactionsResponse.distanceCharge && Number(transactionsResponse.distanceCharge)) || 0);
        var deductionsTotal = (transactionsResponse && transactionsResponse.debitCharge && Number(transactionsResponse.debitCharge)) || 0;
        if (transactionsTotal && template) {
            for (let i = 0; i < transactionsTotal.length; i++) {
                for (const property in transactionsTotal[i]) {
                    if (isNumber(transactionsTotal[i][property]) && template.credit.includes(property)) {
                        total = total + transactionsTotal[i][property];
                    } else if (isNumber(transactionsTotal[i][property]) && template.debit.includes(property)) {
                        deductionsTotal = deductionsTotal + transactionsTotal[i][property];
                    }
                }
            }
            total += ((transactionsResponse && transactionsResponse.fixedFuelSurcharge && Number(transactionsResponse.fixedFuelSurcharge)) || 0);
            var payableTotal = total - deductionsTotal;
            setTotalAmount(total.toFixed(2));
            setDeductions(deductionsTotal.toFixed(2));
            setPayable(payableTotal.toFixed(2));
            if (transactionsResponse && transactionsResponse.gstActive && transactionsResponse.gst) {
                getGstAmount(transactionsResponse.gst, payableTotal);
            }
        }

    }

    function getGstAmount(gst: any, total: any) {
        try {
            let gstvalue = convertAmountToNumberFormat((gst / 100) * total, floatFormatter);
            setGSTAmount(convertAmountToNumberFormat(gstvalue, floatFormatter));
            setPayable(convertAmountToNumberFormat(total + Number(gstvalue), floatFormatter));
        } catch (error) {
            return 0.00;
        }
    }

    async function approverClickHandler() {
        setOpenAddApproveModal(true)
    }

}
export default FreightBillingTripInvoice;
