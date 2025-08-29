import { AxiosInstance } from "axios";
import Api from "../../../../base/api/ApiMethods";
import { getBulkSTOTemplateDetailsUrl, getSTOTemplateDetailsUrl, stoConsigneeDetailsUrl, stoListUrl, stoProductDetailsUrl, stoVendorDetailsUrl } from './stoServiceUrl';

const stockTransferOrderServices = (api: AxiosInstance) => {
    function getSTOList(queryParams: any) {
        return api.get(stoListUrl, { params: queryParams });
    }
    function getSTOConsigneeDetails(queryParams: any) {
        return api.get(stoConsigneeDetailsUrl, { params: queryParams });
    }
    function getSTOProductDetails(queryParams: any) {
        return api.get(stoProductDetailsUrl, { params: queryParams });
    }
    function getSTOVendorDetails(queryParams: any) {
        return api.get(stoVendorDetailsUrl, { params: queryParams });
    }
    function getSTOTemplateDetails(queryParams: any) {
        return api.post(getSTOTemplateDetailsUrl, queryParams);
    }
    function getBulkSTOTemplateDetails(queryParams: any) {
        return api.post(getBulkSTOTemplateDetailsUrl, queryParams);
    }
    return {
        getSTOList,
        getSTOConsigneeDetails,
        getSTOProductDetails,
        getSTOVendorDetails,
        getSTOTemplateDetails,
        getBulkSTOTemplateDetails,
    }
}

const stockTransferOrder = stockTransferOrderServices(Api);

export { stockTransferOrder };
