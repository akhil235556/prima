import { AxiosInstance } from "axios";
import { clientAllFreightTypeListUrl, clientFreightTypeListUrl, enableClientFreightTypeListUrl, freightTypeListUrl, ptlStatusUrl, updateClientFreightTypeListUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getFreightTypeList() {
        return api.get(freightTypeListUrl);
    }
    function getClientFreightTypeList(queryParams?: any) {
        return api.get(clientFreightTypeListUrl, { params: queryParams });
    }
    function getAllClientFreightType(queryParams?: any) {
        return api.get(clientAllFreightTypeListUrl, { params: queryParams });
    }
    function enableFreightType(params: any) {
        return api.post(enableClientFreightTypeListUrl, params);
    }
    function updateFreightType(params: any) {
        return api.put(updateClientFreightTypeListUrl, params);
    }
    function getPtlStatus() {
        return api.get(ptlStatusUrl);
    }
    return {
        getFreightTypeList,
        enableFreightType,
        getClientFreightTypeList,
        updateFreightType,
        getAllClientFreightType,
        getPtlStatus
    }
}