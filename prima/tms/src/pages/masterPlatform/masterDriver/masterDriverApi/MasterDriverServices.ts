import { AxiosInstance } from "axios";
import { createDriverUrl, driverListUrl, getDriverDetailUrl, getDriverTemplateUrl, getSOBCsvLinkUrl, searchDriverUrl, updateDriverStatusUrl, updateDriverUrl } from "./MasterDriverServiceUrl";

export default (api: AxiosInstance) => {
  function getDriversList(queryParams: any) {
    return api.get(driverListUrl, { params: queryParams });
  }
  function getDriversDetail(queryParams: any) {
    return api.get(getDriverDetailUrl, { params: queryParams });
  }
  function createDriver(params: any) {
    return api.post(createDriverUrl, params)
  }
  function updateDriver(params: any) {
    return api.put(updateDriverUrl, params)
  }
  function searchDriverList(params?: any) {
    return api.get(searchDriverUrl, { params: params });
  }
  function updateDriverStatus(params: any) {
    return api.put(updateDriverStatusUrl, params)
  }
  function getDriversTemplate() {
    return api.get(getDriverTemplateUrl);
  }
  function getCsvLink(queryParams: any) {
    return api.get(getSOBCsvLinkUrl, { params: queryParams });
  }

  return {
    getDriversList,
    getDriversDetail,
    createDriver,
    updateDriver,
    searchDriverList,
    getDriversTemplate,
    updateDriverStatus,
    getCsvLink
  }
}
