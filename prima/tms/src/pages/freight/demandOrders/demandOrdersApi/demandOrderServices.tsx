import { AxiosInstance } from "axios";
import Api from "../../../../base/api/ApiMethods";
import { approveBulkDemandOrderUrl, approveDemandOrderUrl, assignBulkDemandOrderUrl, assignDemandOrderUrl, deleteBulkDemandOrderUrl, deleteDemandOrderUrl, demandBulkOrderCreateUrl, demandOrderCreateUrl, demandOrderListUrl, doMaterialListUrl, getMaterialsUrl, modifiedDemandOrderListUrl, modifyAcceptOrderUrl, modifyRejectOrderUrl } from './demandOrderServiceUrl';

const demandOrderServices = (api: AxiosInstance) => {
    function getDOList(queryParams: any) {
        return api.get(demandOrderListUrl, { params: queryParams });
    }
    function getModifyDOList(queryParams: any) {
        return api.get(modifiedDemandOrderListUrl, { params: queryParams });
    }
    function createDO(params: any) {
        return api.post(demandOrderCreateUrl, params);
    }
    function createBulkDO(params: any) {
        return api.post(demandBulkOrderCreateUrl, params);
    }
    function updateDO(params: any) {
        return api.patch(demandOrderCreateUrl, params);
    }
    function deleteDemandOrder(params: any) {
        return api.delete(deleteDemandOrderUrl, { params: params });
    }
    function deleteBulkDemandOrder(params: any) {
        return api.post(deleteBulkDemandOrderUrl, params);
    }
    function approveDemandOrder(params: any) {
        return api.post(approveDemandOrderUrl, params);
    }
    function approveBulkDemandOrder(params: any) {
        return api.post(approveBulkDemandOrderUrl, params);
    }
    function assignDemandOrder(params: any) {
        return api.post(assignDemandOrderUrl, params);
    }
    function assignBulkDemandOrder(params: any) {
        return api.post(assignBulkDemandOrderUrl, params);
    }
    function modifyAcceptDO(params: any) {
        return api.patch(modifyAcceptOrderUrl, params);
    }
    function modifyRejectDO(params: any) {
        return api.patch(modifyRejectOrderUrl, params);
    }
    function doMaterialList(params: any) {
        return api.post(doMaterialListUrl, params);
    }
    function getMaterialsList(params: any) {
        return api.post(getMaterialsUrl, params)
    }
    return {
        getDOList,
        getModifyDOList,
        createDO,
        createBulkDO,
        updateDO,
        deleteDemandOrder,
        approveDemandOrder,
        approveBulkDemandOrder,
        assignDemandOrder,
        modifyAcceptDO,
        modifyRejectDO,
        doMaterialList,
        getMaterialsList,
        assignBulkDemandOrder,
        deleteBulkDemandOrder
    }
}

const demandOrder = demandOrderServices(Api);

export { demandOrder };
