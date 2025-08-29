import { AxiosInstance } from "axios";
import { freightPaymentReportListUrl, freightPaymentCountReportListUrl, getFPRCsvLinkUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getFreightPaymentReportList(queryParams: any) {
        return api.get(freightPaymentReportListUrl, { params: queryParams });
    }
    function getCountList(queryParams: any) {
        return api.get(freightPaymentCountReportListUrl, { params: queryParams });
    }
    function getCsvLink(queryParams: any) {
        return api.get(getFPRCsvLinkUrl, { params: queryParams });
    }
    return {
        getFreightPaymentReportList,
        getCountList,
        getCsvLink
    }
}