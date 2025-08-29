import { AxiosInstance } from "axios";
import { agnListUrl, receiveAgnUrl, cancelAgnUrl, createAgnUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getAgnList(queryParams: any) {
        return api.get(agnListUrl, { params: queryParams });
    }
    function receiveAgn(queryParams: any) {
        return api.put(receiveAgnUrl, queryParams);
    }
    function cancelAgn(params: any) {
        return api.put(cancelAgnUrl, params);
    }
    function createAgn(params: any) {
        return api.post(createAgnUrl, params);
    }
    return {
        getAgnList,
        receiveAgn,
        cancelAgn,
        createAgn
    }
}