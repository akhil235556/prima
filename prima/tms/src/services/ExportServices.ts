import { AxiosInstance } from "axios";
import { getExportTemplateUrl, postExportUrl, shipmentCreateExportUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getExportTemplate() {
        return api.get(getExportTemplateUrl);
    }
    function postExport(bodyParams: any) {
        return api.post(postExportUrl, bodyParams);
    }
    function shipmentCreateExport(params: any) {
        return api.post(shipmentCreateExportUrl, params)
    }
    return {
        getExportTemplate,
        postExport,
        shipmentCreateExport
    }
}