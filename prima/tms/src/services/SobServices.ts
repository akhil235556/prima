import { AxiosInstance } from "axios";
import { getSOBCsvLinkUrl, getsobReportUrl, sobReportCountListUrl, sobReportList } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getSobList(queryParams: any) {
        return api.get(sobReportList, { params: queryParams });
    }
    function getCountList(queryParams: any) {
        return api.get(sobReportCountListUrl, { params: queryParams });
    }
    function getCsvLink(queryParams: any) {
        return api.get(getSOBCsvLinkUrl, { params: queryParams });
    }
    function getSobReport(queryParams: any) {
        return api.get(getsobReportUrl, { params: queryParams });
    }
    return {
        getSobList,
        getCountList,
        getCsvLink,
        getSobReport
    }
}