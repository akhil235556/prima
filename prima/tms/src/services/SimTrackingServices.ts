import { AxiosInstance } from "axios";
import { getSimTrackingCsvLinkUrl, simTrackingDetailListUrl, simTrackingDownloadUrl, simTrackingListUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function simTrackingList(queryParams: any) {
        return api.get(simTrackingListUrl, { params: queryParams });
    }
    function simTrackingDetailList(queryParams: any) {
        return api.get(simTrackingDetailListUrl, { params: queryParams });
    }
    function getCsvLink(queryParams: any) {
        return api.get(getSimTrackingCsvLinkUrl, { params: queryParams });
    }
    function simTrackingDownload(params: any) {
        return api.post(simTrackingDownloadUrl, params)
    }
    return {
        simTrackingList,
        simTrackingDetailList,
        getCsvLink,
        simTrackingDownload
    }
}