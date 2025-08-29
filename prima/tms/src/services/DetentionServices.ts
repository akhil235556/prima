import { AxiosInstance } from "axios";
import { detentionReportListUrl, detentionGraphListUrl, getDRCsvLinkUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getDetentionReportList(queryParams: any) {
        return api.get(detentionReportListUrl, { params: queryParams });
    }
    function getDetentionGraphList(queryParams: any) {
        return api.get(detentionGraphListUrl, { params: queryParams });
    }
    function getCsvLink(queryParams: any) {
        return api.get(getDRCsvLinkUrl, { params: queryParams });
    }
    return {
        getDetentionReportList,
        getDetentionGraphList,
        getCsvLink
    }
}