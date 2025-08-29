// function isUploadedPod(shipmentCode: any, podData: any) {
//     let currData = podData.find((item: any) => item.shipmentCode === shipmentCode);
//     return currData.uploaded ? true : false
// }
import { convertAmountToNumberFormat, floatFormatter } from "../../base/utility/NumberUtils";
import { isObjectEmpty } from "../../base/utility/StringUtils";

export function getInvoiceParams(orderDetails: any, id: any, remarks: any, payable: any, transactions: any, amount: any, deductions: any, transactionsResponse: any, contractDetails: any, billArray: any, podData: any) {
    const transactionsData = transactions.map((item: any) => (
        {
            ...item,
            shipmentDetails: {
                ...item.shipmentDetails,
                eBillSubNo: getEBillSubNo(item, billArray),
                billDate: getEBillDate(item, billArray),
                // podUploaded: isUploadedPod(item.shipmentDetails && item.shipmentDetails.shipmentCode, podData)
            },
        }
    ))

    function getEBillSubNo(item: any, billArray: any) {
        let data = billArray && billArray.find((element: any) => element.entitySubId === item.shipmentDetails.shipmentCode);
        return data && data.contextData;
    }

    function getEBillDate(item: any, billArray: any) {
        let data = billArray && billArray.find((element: any) => element.entitySubId === item.shipmentDetails.shipmentCode);
        return data && data.entityDatetime;
    }

    let params: any = {
        billData: {
            clientName: orderDetails && orderDetails.clientName,
            baseFreightCharge: transactionsResponse && transactionsResponse.baseFreightCharge,
            debitCharge: transactionsResponse && transactionsResponse.debitCharge,
            debitChargeBreakup: transactionsResponse && transactionsResponse.debitChargeBreakup,
            freightId: id,
            freightType: orderDetails && orderDetails.freightTypeCode,
            freightOrderCreatedAt: orderDetails && orderDetails.createdAt,
            vehicleTypeName: orderDetails && orderDetails.vehicleTypeName,
            vehicleTypeCode: orderDetails && orderDetails.vehicleTypeCode,
            lane: {
                code: orderDetails && orderDetails.laneCode,
                name: orderDetails && orderDetails.laneName
            },
            partner: {
                code: orderDetails && orderDetails.partnerCode,
                name: orderDetails && orderDetails.partnerName
            },
            shipmentTransactionData: transactionsData,
            remarks: remarks,
            totalPayable: Number(payable),
            totalAmount: Number(amount),
            totalDeduction: Number(deductions),
            node: orderDetails.node
        }
    }
    if (contractDetails && contractDetails.gstActive && contractDetails.gst) {
        params.billData.gstActive = contractDetails.gstActive;
        params.billData.gst = contractDetails.gst;
    }

    return params;
}

export function getInvoiceUpdateParams(id: any, payable: any, transactions: any, amount: any, deductions: any, contractDetails?: any, remarks?: any, childFreightOrderBillsDetails?: any, isPeriodic?: any, prevRemarks?: boolean,) {
    let params: any = {
        billNo: id,
        shipmentTransactionData: transactions,
        totalAmount: Number(amount),
        totalDeduction: Number(deductions),
        totalPayable: Number(payable),
    }
    if (!isObjectEmpty(childFreightOrderBillsDetails)) {
        params.freightId = childFreightOrderBillsDetails.freightId
    }
    if (contractDetails && contractDetails.gstActive && contractDetails.gst) {
        params.gstActive = contractDetails.gstActive;
        params.gst = contractDetails.gst;
    }
    isPeriodic ? (remarks.length > 0 ? (params.remarks = remarks) :
        (prevRemarks && (params.clearRemarks = true))) : params.remarks = remarks;
    return params;
}


export function updatevariablefreightcharge(data: any, setTotalVariableFuelSurcharge: any, setTotalFuelSurcharge: any, totalFixedFuelSurcharge: any) {
    let totalVariableFuelCost = 0;
    data.forEach((transaction: any) => {
        if (transaction.variableFuelSurcharge) {
            totalVariableFuelCost += transaction.variableFuelSurcharge
        }
    })
    setTotalVariableFuelSurcharge(convertAmountToNumberFormat(totalVariableFuelCost, floatFormatter));
    setTotalFuelSurcharge(convertAmountToNumberFormat((Number(totalVariableFuelCost) + Number(totalFixedFuelSurcharge)), floatFormatter));
}