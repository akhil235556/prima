import { AxiosInstance } from "axios";
import { getYmsNodeConfigUrl } from "../base/api/ServiceUrl";

export default (api: AxiosInstance) => {
    function getYmsNodeConfigStatus(queryParams: any) {
        return api.post(getYmsNodeConfigUrl, queryParams);
    }
    return {
        getYmsNodeConfigStatus,
    }
}