import { AxiosInstance } from "axios";
import Api from "../../../../base/api/ApiMethods";
import { createCustomerUrl, getCustomerListUrl, searchCustomerUrl, updateCustomerUrl } from './customerServiceUrl';

const customerServices = (api: AxiosInstance) => {
    function getCustomersList(queryParams: any) {
        return api.get(getCustomerListUrl, { params: queryParams });
    }
    function createCustomer(params: any) {
        return api.post(createCustomerUrl, params);
    }

    function updateCustomer(params: any) {
        return api.put(updateCustomerUrl, params);
    }
    function searchCustomer(queryParams: any) {
        return api.get(searchCustomerUrl, { params: queryParams });
    }
    return {
        getCustomersList,
        createCustomer,
        updateCustomer,
        searchCustomer
    }
}

const customer = customerServices(Api);

export { customer };
