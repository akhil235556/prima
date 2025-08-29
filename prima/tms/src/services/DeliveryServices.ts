import { AxiosInstance } from "axios";
import { deliveryCountUrl, deliveryReportListUrl, shipmentReportListUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getDeliveryReportList(queryParams: any) {
        return api.get(deliveryReportListUrl, { params: queryParams });
    }
    function getDeliveryCount(queryParams: any) {
        return api.get(deliveryCountUrl, { params: queryParams });
    }
    function getCsvLink(queryParams: any, url: any) {
        return api.get(url, { params: queryParams });
    }
    function getShipmentReportList(queryParams: any) {
        return api.get(shipmentReportListUrl, { params: queryParams });
    }
    return {
        getDeliveryReportList,
        getDeliveryCount,
        getCsvLink,
        getShipmentReportList,
    }
}