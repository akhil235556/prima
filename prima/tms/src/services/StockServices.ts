import { AxiosInstance } from "axios";
import { forecastStockUrl, salesOrderUrl, stockListUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function forecastStockList(queryParams: any) {
        return api.get(forecastStockUrl, { params: queryParams });
    }
    function salesOrderList(queryParams: any) {
        return api.get(salesOrderUrl, { params: queryParams });
    }
    function getInventoryViewList(queryParams: any) {
        return api.get(stockListUrl, { params: queryParams });
    }
    return {
        forecastStockList,
        salesOrderList,
        getInventoryViewList
    }
}