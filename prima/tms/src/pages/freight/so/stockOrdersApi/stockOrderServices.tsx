import { AxiosInstance } from "axios";
import Api from "../../../../base/api/ApiMethods";
import { getBulkSOTemplateDetailsUrl, getSOTemplateDetailsUrl, soConsigneeDetailsUrl, soDetailsUrl, soListUrl, soProductDetailsUrl, soVendorDetailsUrl } from './stockOrderServiceUrl';

const stockOrderServices = (api: AxiosInstance) => {
    function getSOList(queryParams: any) {
        return api.get(soListUrl, { params: queryParams });
    }
    function getSODetails(queryParams: any) {
        return api.get(soDetailsUrl, { params: queryParams });
    }
    function getSOConsigneeDetails(queryParams: any) {
        return api.get(soConsigneeDetailsUrl, { params: queryParams });
    }
    function getSOProductDetails(queryParams: any) {
        return api.get(soProductDetailsUrl, { params: queryParams });
    }
    function getSOVendorDetails(queryParams: any) {
        return api.get(soVendorDetailsUrl, { params: queryParams });
    }
    function getSOTemplateDetails(queryParams: any) {
        return api.post(getSOTemplateDetailsUrl, queryParams);
    }
    function getBulkSOTemplateDetails(queryParams: any) {
        return api.post(getBulkSOTemplateDetailsUrl, queryParams);
    }
    return {
        getSOList,
        getSODetails,
        getSOConsigneeDetails,
        getSOProductDetails,
        getSOVendorDetails,
        getSOTemplateDetails,
        getBulkSOTemplateDetails
    }
}

const stockOrder = stockOrderServices(Api);

export { stockOrder };
