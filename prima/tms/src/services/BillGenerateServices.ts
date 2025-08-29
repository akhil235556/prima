import { AxiosInstance } from "axios";
import {
    acceptBillUrl, aggregateUrl, approveBillUrl,
    approversUrl, awaitBillUrl, bulkApproveInvoiceUrl, commentsTransactionsUrl, createDisputeUrl,
    disputeCreateV2Url,
    disputeModalOrderDetailsUrl,
    disputeReasonsUrl, FreightBillingListUrl, freightBillingOrderDetailsUrl, FreightBillingPeriodicInvoiceUrl, generateBillUrl,
    getDisputeListUrl, getInvoiceTransactions, getOrderTransactions,
    getUnapproveInvoiceListUrl, invoiceTemplateUrl,
    noDuesUrl, payBillUrl, payBulkBillUrl, raiseDisputeUrl, rejectBillUrl, rejectPeriodicBillUrl, resolveBillV2Url, saveTransactionDetailsUrl, updateBillUrl, updatePeriodicBillUrl, usersListUrl
} from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getInvoiceList(params: any, status: string) {
        return api.get(FreightBillingListUrl + `${status}`, { params: params });
    }
    function getUnapproveInvoiceList(queryParams: any) {
        return api.get(getUnapproveInvoiceListUrl, { params: queryParams });
    }
    function getInvoiceTemplateData(queryParams?: any) {
        return api.get(invoiceTemplateUrl, { params: queryParams });
    }
    function orderTransactions(queryParams: any) {
        return api.get(getOrderTransactions, { params: queryParams });
    }
    function invoiceTransactions(queryParams: any) {
        return api.get(getInvoiceTransactions, { params: queryParams });
    }
    function generateBill(queryParams: any) {
        return api.post(generateBillUrl, queryParams);
    }
    function updateBill(queryParams: any) {
        return api.put(updateBillUrl, queryParams);
    }
    function approveBill(queryParams: any) {
        return api.put(approveBillUrl, queryParams);
    }
    function awaitBill(queryParams: any) {
        return api.put(awaitBillUrl, queryParams);
    }
    function payBill(queryParams: any) {
        return api.put(payBillUrl, queryParams);
    }
    function rejectBill(queryParams: any) {
        return api.put(rejectBillUrl, queryParams);
    }
    function rejectPeriodicBill(queryParams: any) {
        return api.put(rejectPeriodicBillUrl, queryParams);
    }
    function getNoDues(queryParams: any) {
        return api.get(noDuesUrl, { params: queryParams });
    }
    function aggregateData(queryParams?: any) {
        return api.get(aggregateUrl, { params: queryParams });
    }
    function getDisputesList(queryParams: any) {
        return api.post(getDisputeListUrl, queryParams);
    }
    function createDispute(queryParams: any) {
        return api.post(createDisputeUrl, queryParams);
    }
    function createDisputeV2(queryParams: any) {
        return api.post(disputeCreateV2Url, queryParams);
    }

    function raiseDispute(params: any) {
        return api.put(raiseDisputeUrl, params);
    }

    function acceptBill(params: any) {
        return api.put(acceptBillUrl, params);
    }

    function resolveBillV2(params: any) {
        return api.put(resolveBillV2Url, params);
    }

    function getDisputeReasons() {
        return api.get(disputeReasonsUrl);
    }
    function getUsersList(queryParams: any) {
        return api.get(usersListUrl, { params: queryParams });
    }
    function getApprover(queryParams: any) {
        return api.get(approversUrl, { params: queryParams });
    }
    function updateApprover(params: any) {
        return api.put(approversUrl, params);
    }
    function commentsTransactions(queryParams: any) {
        return api.get(commentsTransactionsUrl, { params: queryParams });
    }
    function bulkApproveInvoice(params: any) {
        return api.put(bulkApproveInvoiceUrl, params);
    }
    function payBulkBill(params: any) {
        return api.put(payBulkBillUrl, params);
    }
    function saveTransactionDetail(params: any) {
        return api.put(saveTransactionDetailsUrl, params);
    }
    function getFreightOrderDetails(queryParams: any) {
        return api.get(freightBillingOrderDetailsUrl, { params: queryParams });
    }
    function getFreightBillingPeriodicInvoiceList(queryParams: any) {
        return api.get(FreightBillingPeriodicInvoiceUrl, { params: queryParams })
    }
    function updatePeriodicBill(queryParams: any) {
        return api.put(updatePeriodicBillUrl, queryParams);
    }
    function disputeModalOrderDetails(queryParams: any) {
        return api.get(disputeModalOrderDetailsUrl, { params: queryParams })
    }
    return {
        getInvoiceList,
        getInvoiceTemplateData,
        orderTransactions,
        generateBill,
        invoiceTransactions,
        approveBill,
        rejectBill,
        updateBill,
        payBill,
        getNoDues,
        aggregateData,
        getDisputesList,
        createDispute,
        raiseDispute,
        acceptBill,
        getDisputeReasons,
        getUsersList,
        updateApprover,
        getApprover,
        awaitBill,
        commentsTransactions,
        bulkApproveInvoice,
        getUnapproveInvoiceList,
        payBulkBill,
        saveTransactionDetail,
        getFreightOrderDetails,
        getFreightBillingPeriodicInvoiceList,
        updatePeriodicBill,
        disputeModalOrderDetails,
        createDisputeV2,
        resolveBillV2,
        rejectPeriodicBill,
    }
}