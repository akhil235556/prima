import { AxiosInstance } from "axios";
import Api from "../../../../base/api/ApiMethods";
import { getBulkPOTemplateDetailsUrl, getPOTemplateDetailsUrl, poConsigneeDetailsUrl, poListUrl, poProductDetailsUrl, poVendorDetailsUrl } from './purchaseOrderServiceUrl';

const purchaseOrderServices = (api: AxiosInstance) => {
    function getPOList(queryParams: any) {
        return api.get(poListUrl, { params: queryParams });
    }
    function getPOConsigneeDetails(queryParams: any) {
        return api.get(poConsigneeDetailsUrl, { params: queryParams });
    }
    function getPOProductDetails(queryParams: any) {
        return api.get(poProductDetailsUrl, { params: queryParams });
    }
    function getPOVendorDetails(queryParams: any) {
        return api.get(poVendorDetailsUrl, { params: queryParams });
    }
    function getPOTemplateDetails(queryParams: any) {
        return api.post(getPOTemplateDetailsUrl, queryParams);
    }
    function getBulkPOTemplateDetails(queryParams: any) {
        return api.post(getBulkPOTemplateDetailsUrl, queryParams);
    }
    return {
        getPOList,
        getPOConsigneeDetails,
        getPOProductDetails,
        getPOVendorDetails,
        getPOTemplateDetails,
        getBulkPOTemplateDetails,
    }
}

const purchaseOrder = purchaseOrderServices(Api);

export { purchaseOrder };
