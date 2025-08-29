import { TextareaAutosize } from "@material-ui/core";
import { Remove } from "@material-ui/icons";
import { isNumber } from "lodash";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { contractModeType, fuelSurchargeTooltipColumn } from "../../../base/constant/ArrayList";
import { convertAmountToNumberFormat, floatFormatter } from "../../../base/utility/NumberUtils";
import Button from "../../../component/widgets/button/Button";
import CardContentSkeleton from "../../../component/widgets/cardContentSkeleton/CardContentSkeleton";
import { CustomTooltipTable } from "../../../component/widgets/CustomToolTipTable";
import { showAlert } from "../../../redux/actions/AppActions";
import { refreshPeriodicList } from "../../../redux/actions/FreightReconciliationAction";
import { getInvoiceTemplateData, orderTransactions, saveTransactionDetail } from "../../../serviceActions/BillGenerateServiceActions";
import { searchContractDetails } from "../../../serviceActions/ContractServiceActions";
import { getOrderDetail, getOrderLogList } from "../../../serviceActions/OrderServiceActions";
import InvoiceTable from "../freightReconciliation/invoiceTable/InvoiceTable";
import { updatevariablefreightcharge } from "../InvoiceUtility";
import "./InvoiceCardDetails.css";

interface InvoiceCardDetailsProps {
    defaultExpandRowIndex: any,
    rowData: any,
    state?: any,
    stateDispatcher: any
}

function InvoiceCardDetails(props: InvoiceCardDetailsProps) {
    const { defaultExpandRowIndex, rowData, stateDispatcher } = props;
    const appDispatch = useDispatch();
    const [templateResponse, setTemplateResponse] = React.useState<any>();
    const [orderDetails, setOrderDetails] = React.useState<any>({});
    const [contractDetails, setContractDetails] = React.useState<any>({});
    const [transactionsResponse, setTransactionsResponse] = React.useState<any>({});
    const [transactions, setTransactions] = React.useState<any>([]);
    const [loading, setLoading] = React.useState<any>();
    const [totalAmount, setTotalAmount] = React.useState<any>();
    const [deductions, setDeductions] = React.useState<any>();
    const [payable, setPayable] = React.useState<any>();
    const [gstAmount, setGSTAmount] = React.useState<any>();
    const [remarks, setRemarks] = React.useState<any>("");
    const [podData, setPodData] = React.useState<any>({});
    const [billData, setBillData] = React.useState<any>({});
    const [orderLogResponse, setOrderLogResponse] = React.useState<any>({});
    const [totalFuelSurcharge, setTotalFuelSurcharge] = React.useState<any>();
    const [totalVariableFuelSurcharge, setTotalVariableFuelSurcharge] = React.useState<any>();
    const [totalFixedFuelSurcharge, setTotalFixedFuelSurcharge] = React.useState<any>();
    const [isSaveButtonDisabled, setIsSaveButtonDisabled] = React.useState<boolean>(true)
    const [charges, setCharges] = React.useState<any>(undefined);
    const prevRemarks = rowData?.remarks?.length > 0 ? true : false;

    useEffect(() => {
        setRemarks(rowData?.remarks?.length > 0 ? rowData.remarks : "")
        const getAllDetails = async () => {
            setLoading(true);
            let orderParams: any = {
                freightOrderCode: rowData.freightOrderCode,
            };
            try {
                const orderDetailsResp = await appDispatch(getOrderDetail(orderParams));
                const freightTypeCode = orderDetailsResp && orderDetailsResp.details && orderDetailsResp.details.results && orderDetailsResp.details.results[0] && orderDetailsResp.details.results[0].freightTypeCode;
                const invoiceTemplateResp = await appDispatch(getInvoiceTemplateData({
                    billingEntity: "CLIENT",
                    pageType: "CREATE",
                    freightType: freightTypeCode,
                }));

                invoiceTemplateResp && invoiceTemplateResp.details && setTemplateResponse(invoiceTemplateResp.details.fields);
                var fields = invoiceTemplateResp && invoiceTemplateResp.details && invoiceTemplateResp.details.fields;
                if (orderDetailsResp && orderDetailsResp.details && orderDetailsResp.details.results && orderDetailsResp.details.results[0]) {
                    let orderInfo = orderDetailsResp.details.results[0];
                    setOrderDetails(orderInfo);
                    let invoiceParams: any = {
                        freightId: rowData.freightOrderCode,
                        freightTypeCode: orderInfo.freightTypeCode,
                        partnerCode: orderInfo.partnerCode,
                    };
                    appDispatch(orderTransactions(invoiceParams))
                        .then(async (response: any) => {
                            if (response && response.details) {
                                let tempPodList: any = [];
                                response.details.shipmentTransactionData && response.details.shipmentTransactionData.forEach((item: any) => {
                                    if (item.shipmentDetails && item.shipmentDetails.podUploaded) {
                                        tempPodList.push({
                                            shipmentCode: item.shipmentDetails.shipmentCode, uploaded: true,
                                        });
                                    } else {
                                        tempPodList.push({
                                            shipmentCode: item.shipmentDetails.shipmentCode,
                                            uploaded: false,
                                        });
                                    }
                                }
                                );

                                var totalVariableFuelCost = 0;
                                var fixedFuelSurcharge = response.details.fixedFuelSurcharge && Number(response.details.fixedFuelSurcharge);
                                response.details.shipmentTransactionData.forEach((transaction: any) => {
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

                                setPodData(tempPodList);
                                setTransactionsResponse(response.details);
                                setTransactions(response.details.shipmentTransactionData);
                                let contractInfo: any;
                                if (orderInfo.contractCode) {
                                    contractInfo = await appDispatch(searchContractDetails({ contractCode: orderInfo.contractCode, }));
                                    if (contractInfo) {
                                        setContractDetails(contractInfo);
                                    }
                                }
                                response.details.shipmentTransactionData && getAmount(response.details.shipmentTransactionData, fields, response.details, contractInfo);
                            }
                            return appDispatch(getOrderLogList({ freightOrderCode: rowData.freightOrderCode, actionName: "DELIVERED", })
                            );
                        })
                        .then((innerResponse: any) => {
                            if (innerResponse) {
                                setOrderLogResponse(innerResponse);
                            } else {
                                setOrderLogResponse({});
                            }
                            setLoading(false);
                        });
                } else {
                    setLoading(false);
                }
            } catch (err) {
                setLoading(false);
            }
        };
        getAllDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowData]);

    useEffect(() => {
        const checkEmptyFields = () => {
            let inputKeysArray: any = [];
            if (charges) {
                Object.keys(charges[0]).forEach((key, index) => {
                    if (charges[0][key] === 0) {
                        inputKeysArray.splice(index, 1)
                    } else if (charges[0][key] > 0) {
                        inputKeysArray.push(key);
                    }
                })
            }

            if (inputKeysArray.length > 0 || remarks.length > 0) {
                setIsSaveButtonDisabled(false);
            } else {
                setIsSaveButtonDisabled(true);
            }
        }
        checkEmptyFields();
    }, [charges, remarks])

    return (
        <div className="freightDetail freight-contract-table">
            {loading ?
                <CardContentSkeleton
                    row={4}
                    column={4}
                /> :
                <>
                    <InvoiceTable
                        template={templateResponse}
                        shipmentTransactionData={transactionsResponse && transactionsResponse.shipmentTransactionData}
                        onChangeAmount={(data: any) => {
                            getAmount(data, templateResponse, transactionsResponse, contractDetails); setTransactions(data); updatevariablefreightcharge(data, setTotalVariableFuelSurcharge, setTotalFuelSurcharge, totalFixedFuelSurcharge);
                        }}
                        id={rowData.freightOrderCode}
                        onChangePodData={(data: any) => { setPodData(data); }}
                        podData={podData}
                        viewPdf={true}
                        onChangeBillData={(data: any) => { setBillData((prevData: any) => ({ ...prevData, ...data, })); }}
                        billData={billData}
                        orderLogs={orderLogResponse}
                        setCharges={setCharges}
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
                                        <label className="total-amount-content"> Total : </label>
                                    </div>
                                    <div className="total-amount">
                                        <img src="/images/rupee-black.svg" alt="" />{" "}
                                        <strong>{totalAmount}</strong>
                                    </div>
                                </div>
                                <div className="form-group input-wrap">
                                    <div className="d-flex">
                                        <label className="total-amount-content"> Deductions : </label>
                                    </div>
                                    <div className="total-amount">
                                        <Remove />
                                        <img src="/images/rupee-red.svg" alt="" />
                                        <strong className="red-text">{deductions}</strong>
                                    </div>
                                </div>
                                {contractDetails.gstActive && (
                                    <div className="form-group input-wrap">
                                        <div className="d-flex">
                                            <label className="total-amount-content"> {"GST @" + contractDetails.gst + "%:"} </label>
                                        </div>
                                        <div className="total-amount">
                                            <img src="/images/rupee-black.svg" alt="" />
                                            <strong>{gstAmount}</strong>
                                        </div>
                                    </div>
                                )}
                                <div className="form-group input-wrap total-payable">
                                    <div className="d-flex">
                                        <label className="total-amount-content blue-text"> Payable : </label>
                                    </div>
                                    <div className="total-amount">
                                        <img src="/images/rupee-blue.svg" alt="" />
                                        <strong className="blue-text">{payable}</strong>
                                    </div>
                                </div>
                                <div className="form-group text-right mt-2">
                                    <Button
                                        buttonStyle="btn-blue"
                                        title="Save"
                                        loading={loading}
                                        disable={isSaveButtonDisabled}
                                        onClick={async () => {
                                            setLoading(true);
                                            const billParams: any = getShipmentTransactionSaveParams();
                                            let responseObj = await appDispatch(saveTransactionDetail(billParams))
                                            if (responseObj) {
                                                if (responseObj.code === 200) {
                                                    appDispatch(showAlert(responseObj.message))
                                                }
                                            }
                                            stateDispatcher(refreshPeriodicList({
                                                defaultExpandRowIndex: defaultExpandRowIndex
                                            }))
                                            setLoading(false)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>}
        </div>

    )

    function getAmount(transactionsTotal: any, template: any, transactionsResponse: any, contractInfo: any) {
        var total = (transactionsResponse && transactionsResponse.baseFreightCharge && Number(transactionsResponse.baseFreightCharge)) || 0;
        total = total + ((transactionsResponse && transactionsResponse.distanceCharge && Number(transactionsResponse.distanceCharge)) || 0);
        var deductionsTotal = (transactionsResponse && transactionsResponse.debitCharge && Number(transactionsResponse.debitCharge)) || 0;
        if (transactionsTotal && template) {
            for (let i = 0; i < transactionsTotal.length; i++) {
                for (const property in transactionsTotal[i]) {
                    if (
                        isNumber(transactionsTotal[i][property]) &&
                        template.credit.includes(property)
                    ) {
                        total = total + transactionsTotal[i][property];
                    } else if (
                        isNumber(transactionsTotal[i][property]) &&
                        template.debit.includes(property)
                    ) {
                        deductionsTotal = deductionsTotal + transactionsTotal[i][property];
                    }
                }
            }
            total += ((transactionsResponse && transactionsResponse.fixedFuelSurcharge && Number(transactionsResponse.fixedFuelSurcharge)) || 0);
            var payableTotal = total - deductionsTotal;
            setTotalAmount(convertAmountToNumberFormat(total, floatFormatter));
            setDeductions(convertAmountToNumberFormat(deductionsTotal, floatFormatter));
            setPayable(convertAmountToNumberFormat(payableTotal, floatFormatter));
            if (contractInfo && contractInfo.gstActive && contractInfo.gst) {
                getGstAmount(contractInfo.gst, payableTotal);
            }
        }
    }

    function getGstAmount(gst: any, total: any) {
        try {
            let gstvalue = convertAmountToNumberFormat((gst / 100) * total, floatFormatter);
            setGSTAmount(convertAmountToNumberFormat(gstvalue, floatFormatter));
            setPayable(convertAmountToNumberFormat(total + Number(gstvalue), floatFormatter));
        } catch (error) {
            return 0.0;
        }
    }

    function getShipmentTransactionSaveParams() {
        if (orderDetails && transactions && templateResponse) {
            const saveParams: any = {
                freightId: orderDetails.freightOrderCode,
                freightType: orderDetails.freightTypeCode,
                partner: {
                    code: orderDetails.partnerCode,
                    name: orderDetails.partnerName
                },
                vehicleType: {
                    code: orderDetails.vehicleTypeCode,
                    name: orderDetails.vehicleTypeName
                },
                serviceabilityMode: orderDetails.laneCode ? contractModeType.LANE : contractModeType.ZONE,
            }
            const transactionShipments = transactions?.map((item: any, index: any) => {
                let shipmentDetails: any = {
                    freightShipmentCode: item.shipmentDetails.shipmentCode,
                    lane: {
                        name: orderDetails.laneName,
                        code: orderDetails.laneCode
                    },
                }
                let transactionAttributes = []
                for (const property in transactions[index]) {
                    if (isNumber(transactions[index][property]) && templateResponse.credit.includes(property)) {
                        transactionAttributes.push({
                            amount: transactions[index][property],
                            chargeName: property,
                            operation: "credit"
                        })
                    } else if (isNumber(transactions[index][property]) && templateResponse.debit.includes(property)) {
                        transactionAttributes.push({
                            amount: transactions[index][property],
                            chargeName: property,
                            operation: "debit"
                        })
                    }
                }
                shipmentDetails.transactionAttributes = transactionAttributes;
                return shipmentDetails;
            })
            saveParams.transactionShipments = transactionShipments
            remarks.length > 0 ? (saveParams.remarks = remarks) :
                (prevRemarks && (saveParams.clearRemarks = true));

            return saveParams
        }

    }
}

export default InvoiceCardDetails