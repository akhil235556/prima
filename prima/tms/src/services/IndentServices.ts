import { AxiosInstance } from "axios";
import {
  cancelIndentOrderUrl, createIndentUrl, getIndentContractsUrl, getIndentSOBUrl, getIndentVehicleTypesUrl, indentDetailsUrl,
  indentListUrl, raiseIndentUrl
} from "../base/api/ServiceUrl";

export default (api: AxiosInstance) => {
  function getIndentList(queryParams: any) {
    return api.get(indentListUrl, { params: queryParams });
  }

  function createIndent(params: any) {
    return api.post(createIndentUrl, params);
  }

  function getIndentDetails(queryParams: any) {
    return api.get(indentDetailsUrl, { params: queryParams });
  }

  function updateReferenceIds(params: any) {
    return api.put(raiseIndentUrl, params);
  }

  function cancelIndentOrder(params: any) {
    return api.put(cancelIndentOrderUrl, params);
  }

  function getIndentContracts(queryParams: any) {
    return api.get(getIndentContractsUrl, { params: queryParams });
  }
  function getIndentSOB(queryParams: any) {
    return api.get(getIndentSOBUrl, { params: queryParams });
  }
  function getIndentVehicleTypes(queryParams: any) {
    return api.get(getIndentVehicleTypesUrl, { params: queryParams });
  }
  return {
    getIndentList,
    createIndent,
    getIndentDetails,
    updateReferenceIds,
    cancelIndentOrder,
    getIndentContracts,
    getIndentVehicleTypes,
    getIndentSOB
  };
};
