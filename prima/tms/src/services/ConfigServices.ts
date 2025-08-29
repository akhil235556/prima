import { AxiosInstance } from "axios";
import { getConfigListUrl, getEditShipmentConfigUrl, saveConfigUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getConfigList(queryParams: any) {
        return api.get(getConfigListUrl, { params: queryParams });
    }
    function saveConfig(params: any) {
        return api.post(saveConfigUrl, params);
    }
    function getEditShipmentConfig(params: any) {
        return api.post(getEditShipmentConfigUrl, params);
    }
    return {
        getConfigList,
        saveConfig,
        getEditShipmentConfig
    }
}