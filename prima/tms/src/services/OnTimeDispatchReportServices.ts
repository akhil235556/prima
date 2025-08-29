import { AxiosInstance } from "axios";
import { onTimeDispatchReportListUrl, onTimeDispatchReportCountListUrl, getOTDRCsvLinkUrl, dispatchGraphListUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getOnTimeDispatchReportList(queryParams: any) {
        return api.get(onTimeDispatchReportListUrl, { params: queryParams });
    }
    function getCountList(queryParams: any) {
        return api.get(onTimeDispatchReportCountListUrl, { params: queryParams });
    }
    function getCsvLink(queryParams: any) {
        return api.get(getOTDRCsvLinkUrl, { params: queryParams });
    }
    function getDispatchGraphList(queryParams: any) {
        return api.get(dispatchGraphListUrl, { params: queryParams });
    }
    return {
        getOnTimeDispatchReportList,
        getCountList,
        getCsvLink,
        getDispatchGraphList
    }
}