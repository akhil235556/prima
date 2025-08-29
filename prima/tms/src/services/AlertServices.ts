import { AxiosInstance } from "axios";
import { getSnoozeReasonsUrl, postSnoozeReasonUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getSnoozeReasons(queryParams: any) {
        return api.get(getSnoozeReasonsUrl, { params: queryParams });
    }
    function postSnoozeReason(queryParams: any) {
        return api.post(postSnoozeReasonUrl, queryParams);
    }
    return {
        getSnoozeReasons,
        postSnoozeReason
    }
}