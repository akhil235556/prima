import { AxiosInstance } from "axios";
import {
    clientListUrl, getStatusLatestUrl, getStatusListUrl, getSubStatusListUrl,
    shipmentLogDetailsResponseUrl, shipmentLogDownloadUrl, shipmentLogListUrl, ShipmentOrderListUrl,
    shipmentStatusCreateUrl, shipmentStatusUrl, shipmentTrackingDownloadUrl, syncStatusUrl
} from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getShipmentStatus(queryParams: any) {
        return api.get(shipmentStatusUrl, { params: queryParams });
    }
    function getStatusList(queryParams: any) {
        return api.get(getStatusListUrl, { params: queryParams });
    }
    function getSubStatusList(queryParams: any) {
        return api.get(getSubStatusListUrl, { params: queryParams });
    }
    function getStatusLatest(queryParams: any) {
        return api.get(getStatusLatestUrl, { params: queryParams });
    }
    function scanStatus(queryParams: any) {
        return api.post(shipmentStatusCreateUrl, queryParams);
    }
    function getOrderList(queryParams: any) {
        return api.get(ShipmentOrderListUrl, { params: queryParams });
    }
    function getClientList(queryParams?: any) {
        return api.get(clientListUrl, { params: queryParams });
    }
    function syncStatus(queryParams: any) {
        return api.get(syncStatusUrl, { params: queryParams });
    }
    function shipmentLogList(queryParams: any) {
        return api.get(shipmentLogListUrl, { params: queryParams });
    }
    function shipmentTrackingDownload(queryParams: any) {
        return api.post(shipmentTrackingDownloadUrl, queryParams);
    }
    function shipmentLogDetails(queryParams: any) {
        return api.get(shipmentLogDetailsResponseUrl, { params: queryParams });
    }
    function shipmentLogDownload(queryParams: any) {
        return api.get(shipmentLogDownloadUrl, { params: queryParams })
    }
    return {
        getShipmentStatus,
        getStatusList,
        getSubStatusList,
        getStatusLatest,
        scanStatus,
        getOrderList,
        getClientList,
        syncStatus,
        shipmentLogList,
        shipmentLogDetails,
        shipmentLogDownload,
        shipmentTrackingDownload
    }
}