import { AxiosInstance } from "axios";
import { freightReconciliationListUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getFreightReconciliationList(queryParams: any) {
        return api.get(freightReconciliationListUrl, { params: queryParams });
    }
    return {
        getFreightReconciliationList
    }
}