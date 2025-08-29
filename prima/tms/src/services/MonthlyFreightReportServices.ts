import { AxiosInstance } from "axios";
import { monthlyFreightReportListUrl, getMFRCsvLinkUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getMonthlyFreightReportList(queryParams: any) {
        return api.get(monthlyFreightReportListUrl, { params: queryParams });
    }
    function getCsvLink(queryParams: any) {
        return api.get(getMFRCsvLinkUrl, { params: queryParams });
    }
    return {
        getMonthlyFreightReportList,
        getCsvLink
    }
}