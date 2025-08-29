import { AxiosInstance } from "axios";
import {
    addArticleInvoiceUrl,
    addShipmentUrl, assignPartnerUrl, cancelInvoiceUrl, confirmPartnerUrl,
    countOrderData, createByDispatchUrl,
    createPeriodicBillUrl,
    dashboardCountUrl, dashboardListUrl,
    diversionApproveUrl,
    diversionConfirmOrderUrl,
    diversionCreateFreightOrderUrl,
    diversionDetailsUrl,
    diversionDispatchOrderUrl,
    diversionListingUrl,
    diversionPlaceOrderUrl,
    diversionRejectUrl,
    diversionTotalMaterialListUrl,
    downloadReconciliationCsvUrl,
    freightInvoicingUrl, freightOrderCancelUrl,
    freightOrderListUrl, freightOrderPeriodicInvoiceUrl, freightReconciliationListingUrl, freightReconciliationOrderDetailsUrl, getClaimsUrl, getELrDataUrl, getEpodDataUrl,
    getFreightBillingContractDetailsUrl, getFreightReconcilationContractDetailsUrl, getOrderLogsUrl, inboundFreightListUrl, inboundListUrl, markDeliveredUrl,
    orderCreationUrl,
    orderOrchestrationUrl,
    orderPickupDropLocationUrl,
    orderPickupDropZoneLocationUrl,
    printInvoiceUrl, raiseIndentUrl,
    saveClaimsUrl, shipmentOutUrl, shipmentPlacedUrl, shipmentReportUrl, shipmentTagsListUrl
} from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getOrderList(queryParams: any) {
        return api.get(inboundListUrl, { params: queryParams });
    }
    function getFreightOrderList(queryParams: any) {
        return api.get(freightOrderListUrl, { params: queryParams });
    }
    function getFreightInvoicing(queryParams: any) {
        return api.get(freightInvoicingUrl, { params: queryParams });
    }
    function getDashboardOrderList(queryParams: any) {
        return api.get(dashboardListUrl, { params: queryParams });
    }
    function confirmPartner(params: any) {
        return api.put(confirmPartnerUrl, params);
    }
    function shipmentPlaced(params: any) {
        return api.put(shipmentPlacedUrl, params);
    }
    function shipmentOut(params: any) {
        return api.put(shipmentOutUrl, params);
    }
    function addArticleInvoice(params: any) {
        return api.put(addArticleInvoiceUrl, params);
    }
    function assignPartner(params: any) {
        return api.put(assignPartnerUrl, params);
    }
    function freightOrderCancel(params: any) {
        return api.put(freightOrderCancelUrl, params);
    }

    function createByDispatch(params: any) {
        return api.post(createByDispatchUrl, params);
    }
    function raiseIndent(params: any) {
        return api.post(raiseIndentUrl, params);
    }
    function orderCreation(params: any) {
        return api.post(orderCreationUrl, params);
    }
    function orderDetail(params: any) {
        return api.get(raiseIndentUrl, { params: params });
    }
    function getOrderDetail(params: any) {
        return api.get(freightOrderListUrl, { params: params });
    }
    function getEpodData(queryParams: any) {
        return api.get(getEpodDataUrl, { params: queryParams });
    }
    function getELrData(queryParams: any) {
        return api.get(getELrDataUrl, { params: queryParams });
    }
    function shipmentDelivered(queryParams: any) {
        return api.put(markDeliveredUrl, queryParams);
    }

    function shipmentReport(queryParams: any) {
        return api.put(shipmentReportUrl, queryParams);
    }
    function getClaims(queryParams: any) {
        return api.get(getClaimsUrl, { params: queryParams });
    }
    function orderCount() {
        return api.get(countOrderData);
    }
    function saveClaims(queryParams: any) {
        return api.post(saveClaimsUrl, queryParams);
    }
    function getDashboardCountList(queryParams?: any) {
        return api.get(dashboardCountUrl, { params: queryParams });
    }
    function addShipment(params: any) {
        return api.post(addShipmentUrl, params);
    }
    function editShipment(params: any) {
        return api.put(addShipmentUrl, params);
    }
    function getInboundOrderList(queryParams: any) {
        return api.get(inboundFreightListUrl, { params: queryParams });
    }
    function getInboundDispatchOrder(params: any) {
        return api.get(`${raiseIndentUrl}/${params}`);
    }
    function getOrderLocations(queryParams: any) {
        return api.get(orderPickupDropLocationUrl, { params: queryParams });
    }
    function getOrderZoneLocations(queryParams: any) {
        return api.get(orderPickupDropZoneLocationUrl, { params: queryParams });
    }
    function getOrderLogList(queryParams: any) {
        return api.get(getOrderLogsUrl, { params: queryParams });
    }
    function getPrintInvoice(params: any) {
        return api.post(printInvoiceUrl, params, {
            timeout: 120000
        });
    }
    function cancelInvoice(params: any) {
        return api.post(cancelInvoiceUrl, params);
    }
    function diversionListing(queryParams: any) {
        return api.get(diversionListingUrl, { params: queryParams })
    }
    function diversionDetails(queryParams: any) {
        return api.get(diversionDetailsUrl, { params: queryParams })
    }
    function diversionRequestCreate(params: any) {
        return api.post(diversionListingUrl, params)
    }
    function diversionApprove(params: any) {
        return api.put(diversionApproveUrl, params)
    }
    function diversionReject(params: any) {
        return api.put(diversionRejectUrl, params)
    }
    function diversionCreateFreightOrder(params: any) {
        return api.post(diversionCreateFreightOrderUrl, params)
    }
    function diversionConfirmOrder(params: any) {
        return api.post(diversionConfirmOrderUrl, params)
    }
    function diversionPlaceOrder(params: any) {
        return api.post(diversionPlaceOrderUrl, params)
    }
    function diversionDispatchOrder(params: any) {
        return api.post(diversionDispatchOrderUrl, params)
    }
    function diversionTotalMaterialList(queryParams: any) {
        return api.get(diversionTotalMaterialListUrl, { params: queryParams })
    }
    function getShipmentTagList(queryParams: any) {
        return api.get(shipmentTagsListUrl, { params: queryParams });
    }
    function getFreightOrderPeriodicInvoiceList(queryParams: any) {
        return api.get(freightOrderPeriodicInvoiceUrl, { params: queryParams })
    }
    function getFreightReconciliationOrderListing(queryParams: any) {
        return api.get(freightReconciliationListingUrl, { params: queryParams })
    }
    function createPeriodicBill(params: any) {
        return api.post(createPeriodicBillUrl, params)
    }
    function getFreightReconcilationOrderDetails(queryParams: any) {
        return api.get(freightReconciliationOrderDetailsUrl, { params: queryParams })
    }
    function getFreightBillingContractDetails(queryParams: any) {
        return api.get(getFreightBillingContractDetailsUrl, { params: queryParams })
    }
    function getFreightReconcilationContractDetails(queryParams: any) {
        return api.get(getFreightReconcilationContractDetailsUrl, { params: queryParams })
    }
    function orderOrchestration(queryParams: any) {
        return api.get(orderOrchestrationUrl, { params: queryParams });
    }
    function downloadReconciliationCsv(params: any) {
        return api.post(downloadReconciliationCsvUrl, params)
    }
    return {
        getOrderList,
        confirmPartner,
        shipmentPlaced,
        assignPartner,
        shipmentOut,
        freightOrderCancel,
        createByDispatch,
        raiseIndent,
        getEpodData,
        getELrData,
        orderDetail,
        getOrderDetail,
        shipmentDelivered,
        getClaims,
        saveClaims,
        orderCount,
        getDashboardCountList,
        getDashboardOrderList,
        getFreightOrderList,
        getFreightInvoicing,
        addShipment,
        editShipment,
        shipmentReport,
        getInboundOrderList,
        getInboundDispatchOrder,
        getOrderLocations,
        getOrderLogList,
        getPrintInvoice,
        cancelInvoice,
        diversionListing,
        diversionDetails,
        diversionRequestCreate,
        diversionApprove,
        diversionReject,
        diversionCreateFreightOrder,
        diversionConfirmOrder,
        diversionPlaceOrder,
        diversionDispatchOrder,
        diversionTotalMaterialList,
        getShipmentTagList,
        getFreightOrderPeriodicInvoiceList,
        getFreightReconciliationOrderListing,
        createPeriodicBill,
        getFreightReconcilationOrderDetails,
        getFreightBillingContractDetails,
        getFreightReconcilationContractDetails,
        addArticleInvoice,
        orderOrchestration,
        orderCreation,
        getOrderZoneLocations,
        downloadReconciliationCsv
    }
}