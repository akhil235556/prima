import { AxiosInstance } from "axios";
import { bulkMaterialUnitCountUrl, convertUomUrl, createMaterialUrl, materialListUrl, searchMaterialListUrl, updateMaterialUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getMaterialList(queryParams: any) {
        return api.get(materialListUrl, { params: queryParams });
    }

    function searchMaterialList(queryParams: any) {
        return api.get(searchMaterialListUrl, { params: queryParams });
    }

    function createMaterial(params: any, isUpdate: boolean) {
        return api.post(isUpdate ? updateMaterialUrl : createMaterialUrl, params);
    }

    function getBulkMaterialUnitsCount(queryParams: any) {
        return api.post(bulkMaterialUnitCountUrl, queryParams)

    }
    function convertUom(params: any) {
        return api.post(convertUomUrl, params)
    }
    return {
        getMaterialList,
        createMaterial,
        searchMaterialList,
        getBulkMaterialUnitsCount,
        convertUom
    }
}