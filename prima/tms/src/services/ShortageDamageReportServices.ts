import { AxiosInstance } from "axios";
import { shortageDamageReportListUrl, shortageDamageReportCountListUrl, getSDRCsvLinkUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getShortageDamageReportList(queryParams: any) {
        return api.get(shortageDamageReportListUrl, { params: queryParams });
    }
    function getCountList(queryParams: any) {
        return api.get(shortageDamageReportCountListUrl, { params: queryParams });
    }
    function getCsvLink(queryParams: any) {
        return api.get(getSDRCsvLinkUrl, { params: queryParams });
    }
    return {
        getShortageDamageReportList,
        getCountList,
        getCsvLink
    }
}