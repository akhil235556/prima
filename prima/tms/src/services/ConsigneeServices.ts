import { AxiosInstance } from "axios";
import { ConsigneeListUrl, createConsigneeUrl, searchCustomerUrl, updateConsigneeUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getConsigneeList(queryParams: any) {
        return api.get(ConsigneeListUrl, { params: queryParams });
    }
    function createConsignee(params: any) {
        return api.post(createConsigneeUrl, params);
    }

    function updateConsignee(params: any) {
        return api.put(updateConsigneeUrl, params);
    }

    function searchCustomer(queryParams: any) {
        return api.get(searchCustomerUrl, { params: queryParams });
    }

    return {
        getConsigneeList,
        createConsignee,
        searchCustomer,
        updateConsignee,

    }
}