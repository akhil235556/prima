import { TextareaAutosize } from "@material-ui/core";
import { FileCopyOutlined, Remove } from '@material-ui/icons';
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from 'react-router-dom';
import { isNumber } from "util";
import { fuelSurchargeTooltipColumn, InvoiceStatusEnum } from "../../../base/constant/ArrayList";
import { convertAmountToNumberFormat, floatFormatter } from '../../../base/utility/NumberUtils';
import { isObjectEmpty } from "../../../base/utility/StringUtils";
import PaymentAlertBox from "../../../component/alert/PaymentAlertBox";
import DataNotFound from "../../../component/error/DataNotFound";
import Button from "../../../component/widgets/button/Button";
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import { CustomTooltipTable } from "../../../component/widgets/CustomToolTipTable";
import { setAutoCompleteListWithData } from "../../../moduleUtility/DataUtils";
import { showAlert } from '../../../redux/actions/AppActions';
import { refreshList } from "../../../redux/actions/InvoiceActions";
import { getInvoiceTemplateData, getUsersList, updatePeriodicBill } from '../../../serviceActions/BillGenerateServiceActions';
import { getFreightBillingContractDetails, getFreightInvoicingList } from "../../../serviceActions/OrderServiceActions";
import LanePointsDisplayModal from "../../masterPlatform/lane/LanePointsDisplayModal";
import FlashMessage from '../flashMessage/FlashMessage';
import InvoiceTable from "../freightReconciliation/invoiceTable/InvoiceTable";
import { getInvoiceUpdateParams, updatevariablefreightcharge } from "../InvoiceUtility";
import AddApproveModal from "./AddApproveModal";
import EditApproveModal from "./EditApproveModal";
import './FreightReconciliationInvoice.css';
import './InvoiceCardDetails.css';
import './InvoiceInfo.css';
interface BillingCardDetailsProps {
    childFreightOrderBillsDetails: any,
    isOwnerClient: boolean,
    setDisputeReasons: any,
    rowData: any,
    billDetails: any,
    billNo?: any,
    stateDispatcher?: any,

}

function BillingCardDetails(props: BillingCardDetailsProps) {
    const { childFreightOrderBillsDetails, isOwnerClient, stateDispatcher, billNo, billDetails } = props
    const appDispatch = useDispatch();
    const history = useHistory();
    const { id } = useParams<any>();
    const [refresh, setRefresh] = React.useState<boolean>(false);
    const [templateResponse, setTemplateResponse] = React.useState<any>();
    const [orderDetails, setOrderDetails] = React.useState<any>({});
    const [transactionsResponse, setTransactionsResponse] = React.useState<any>({});
    // const [serviceResponse, setServiceResponse] = React.useState<any>({});
    const [transactions, setTransactions] = React.useState<any>([]);
    const [loading, setLoading] = React.useState<any>();
    const [totalAmount, setTotalAmount] = React.useState<any>();
    const [deductions, setDeductions] = React.useState<any>();
    const [payable, setPayable] = React.useState<any>();
    const [remarks, setRemarks] = React.useState<any>();
    const [openPointModal, setOpenPointModal] = React.useState<boolean>(false);
    const [editable, setEditable] = React.useState<boolean>(false);
    const [showFlash, setShowFlash] = React.useState<boolean>(false);
    // const [disputeComment, setDisputeComment] = React.useState<any>(undefined);
    const [openWarningModal, setOpenWarningModal] = React.useState<any>({ open: false, message: "" })
    const [openAddApproveModal, setOpenAddApproveModal] = React.useState<boolean>(false);
    const [openEditApproveModal, setOpenEditApproveModal] = React.useState<boolean>(false);
    // const [openApproveModal, setOpenApprovelModal] = React.useState<boolean>(false);
    const [gstAmount, setGSTAmount] = React.useState<any>();
    const [usersList, setUsersList] = React.useState<any>([]);
    // const [approversList, setApproversList] = React.useState<any>([]);
    const [podData, setPodData] = React.useState<any>({});
    const [billData, setBillData] = React.useState<any>({});
    // const [commentsList, setCommentsList] = React.useState<any>(undefined);
    const [totalFuelSurcharge, setTotalFuelSurcharge] = React.useState<any>();
    const [totalVariableFuelSurcharge, setTotalVariableFuelSurcharge] = React.useState<any>();
    const [totalFixedFuelSurcharge, setTotalFixedFuelSurcharge] = React.useState<any>();
    const [contractDetails, setContractDetails] = React.useState<any>();
    const prevRemarks = childFreightOrderBillsDetails?.remarks?.length > 0 ? true : false;

    useEffect(() => {
        const getAllDetails = async () => {
            setRemarks(childFreightOrderBillsDetails?.remarks?.length > 0 ? childFreightOrderBillsDetails.remarks : "")
            setLoading(true);
            try {
                if (childFreightOrderBillsDetails.shipmentTransactionData && childFreightOrderBillsDetails.shipmentTransactionData.length > 0) {
                    setTransactions(childFreightOrderBillsDetails.shipmentTransactionData);
                    let tempPodList: any = []
                    childFreightOrderBillsDetails.shipmentTransactionData.forEach((item: any) => {
                        tempPodList.push({
                            shipmentCode: item.shipmentDetails.shipmentCode,
                            uploaded: true
                        })
                    })
                    setPodData(tempPodList);
                }
                let contractInfo: any;
                appDispatch(getFreightBillingContractDetails({ billNo: billNo, freightId: childFreightOrderBillsDetails.freightId })).then((response: any) => {
                    if (response) {
                        contractInfo = response;
                        setContractDetails(response)
                        var totalVariableFuelCost = 0;
                        var fixedFuelSurcharge = contractInfo?.fixedFuelSurcharge && Number(contractInfo?.fixedFuelSurcharge);
                        childFreightOrderBillsDetails.shipmentTransactionData.forEach((transaction: any) => {
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
                    }
                })
                if (childFreightOrderBillsDetails) {
                    // setServiceResponse(JSON.parse(JSON.stringify(childFreightOrderBillsDetails)))
                    setTransactionsResponse(Object.assign({}, childFreightOrderBillsDetails));
                    // childFreightOrderBillsDetails.remarks && setRemarks(childFreightOrderBillsDetails.remarks)
                    // childFreightOrderBillsDetails.remarks && setInitialRemarks(childFreightOrderBillsDetails.remarks)
                } else {
                    setLoading(false)
                }
                if (childFreightOrderBillsDetails?.freightId) {
                    let orderParams: any = {
                        freightOrderCode: childFreightOrderBillsDetails.freightId
                    }
                    const userListParams = {
                        node: childFreightOrderBillsDetails?.node,
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
                        templateResp && templateResp.details && childFreightOrderBillsDetails && getAmount(childFreightOrderBillsDetails.shipmentTransactionData, templateResp.details.fields, childFreightOrderBillsDetails, contractInfo);
                        setEditable(isOwnerClient)
                    }
                    setLoading(false);
                }
            } catch (err) {
                setLoading(false);
            }
        }
        getAllDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh, id, childFreightOrderBillsDetails]);

    return (
        <div className="">
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

            <LanePointsDisplayModal
                open={openPointModal}
                laneCode={orderDetails && orderDetails.laneCode}
                onClose={() => {
                    setOpenPointModal(false);
                }}
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
                approversList={[]}
                onClose={() => {
                    setOpenEditApproveModal(false)
                }}
                noOFApprovers={transactionsResponse && transactionsResponse.requiredApproverCount}
            />
            {
                !loading && isObjectEmpty(transactionsResponse)
                    ? <DataNotFound /> : (
                        <>
                            <FlashMessage
                                type="error"
                                heading="Disputed Reason"
                                message={"disputeComment"}
                                onClose={() => { setShowFlash(false) }}
                                open={showFlash}
                            />

                            {/* <Card className="creat-contract-wrapp list-info-wrap"> */}
                            <div className="freightDetail freight-contract-table">
                                {loading ?
                                    <CardContentSkeleton
                                        row={3}
                                        column={3}
                                    />
                                    : <>
                                        <InvoiceTable
                                            template={templateResponse}
                                            shipmentTransactionData={(transactionsResponse && transactionsResponse.shipmentTransactionData)}
                                            onChangeAmount={(data: any) => {
                                                getAmount(data, templateResponse, transactionsResponse, contractDetails);
                                                setTransactions(data);
                                                updatevariablefreightcharge(data, setTotalVariableFuelSurcharge, setTotalFuelSurcharge, totalFixedFuelSurcharge);
                                            }}
                                            id={orderDetails && orderDetails.freightOrderCode}
                                            editable={!editable}
                                            viewPdf={billDetails && billDetails.billStatus === InvoiceStatusEnum.DISPUTED && billDetails.owner === "CLIENT"}
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
                                                        {
                                                            <div className="bill-btn-wrap">
                                                                <Button
                                                                    buttonStyle="btn-blue"
                                                                    title="Update Bill"
                                                                    leftIcon={<FileCopyOutlined />}
                                                                    disable={!isOwnerClient}
                                                                    onClick={() => {
                                                                        setLoading(true);
                                                                        let isPeriodic: any = true;
                                                                        let params: any = getInvoiceUpdateParams(id, payable, transactions, totalAmount, deductions, transactionsResponse, remarks, childFreightOrderBillsDetails, isPeriodic, prevRemarks,);
                                                                        appDispatch(updatePeriodicBill(params)).then((response: any) => {
                                                                            response && response.message && appDispatch(showAlert(response.message));
                                                                            response && setEditable(false);
                                                                            response && setRefresh((prev) => !prev);
                                                                            response && stateDispatcher(refreshList())
                                                                            setLoading(false);
                                                                        })
                                                                    }}
                                                                />
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </>}
                            </div>

                        </>
                    )
            }

        </div >
    );

    // function onApproveClickHandler() {
    //     let invoiceParams: any = {
    //         billNo: id
    //     }
    //     if (transactionsResponse.billStatus === InvoiceStatusEnum.PENDING || transactionsResponse.billStatus === InvoiceStatusEnum.ACCEPTED || transactionsResponse.billStatus === InvoiceStatusEnum["AWAITING APPROVAL"]) {
    //         setOpenApprovelModal(true);
    //     } else {
    //         setLoading(true);
    //         appDispatch(payBill(invoiceParams)).then((response: any) => {
    //             response && response.message && appDispatch(showAlert(response.message));
    //             //response && history.push(FreightBillingListUrl + InvoiceStatusEnum.PAID);
    //             response && history.goBack()
    //             setLoading(false);
    //         });
    //     }
    // }

    function getAmount(transactionsTotal: any, template: any, transactionsResponse: any, contractDetails: any) {
        var total = (contractDetails && contractDetails.baseFreightCharge && Number(contractDetails.baseFreightCharge)) || 0;
        total = total + ((contractDetails && contractDetails.distanceCharge && Number(contractDetails.distanceCharge)) || 0);
        var deductionsTotal = (contractDetails && contractDetails.debitCharge && Number(contractDetails.debitCharge)) || 0;
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
            total += ((contractDetails && contractDetails.fixedFuelSurcharge && Number(contractDetails.fixedFuelSurcharge)) || 0);
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

    // async function approverClickHandler() {
    //     setOpenAddApproveModal(true)
    // }

}
export default BillingCardDetails;
