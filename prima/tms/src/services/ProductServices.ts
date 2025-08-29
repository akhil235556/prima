import { AxiosInstance } from "axios";
import { productListUrl, searchProductUrl, createProductUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getProductList(queryParams: any) {
        return api.get(productListUrl, { params: queryParams });
    }
    function createProduct(params: any) {
        return api.post(createProductUrl, params);
    }
    function searchProduct(queryParams: any) {
        return api.get(searchProductUrl, { params: queryParams });
    }
    return {
        getProductList,
        createProduct,
        searchProduct,
    }
}