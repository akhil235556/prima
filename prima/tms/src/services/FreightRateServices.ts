import { AxiosInstance } from "axios";
import {
    createFreightDefinitionUrl,
    createFreightRatesUrl, createFreightRateUrl, createMonthlyFreightUrl,
    deleteContractFreightUrl, freightChargesUrl, freightListUrl,
    freightRuleUrl, freightVariableUrl,
    getContractFreightRatesUrl, getFreightDefinitionUrl, getLanePriceUrl, getProxyContractFreightRatesUrl,
    getProxyFreightDefinitionUrl,
    getPtlZoneContractUrl,
    monthlyFreightListUrl,
    putContractFreightUrl, updateFreightDefinitionUrl
} from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getFreightList(params: any) {
        return api.post(freightListUrl, params);
    }
    function createFreightRate(params: any) {
        return api.post(createFreightRateUrl, params);
    }
    function createFreightDefinition(params: any) {
        return api.post(createFreightDefinitionUrl, params);
    }
    function updateFreightDefinition(params: any) {
        return api.put(updateFreightDefinitionUrl, params);
    }
    function getFreightDefinition(queryParams: any) {
        return api.get(getFreightDefinitionUrl, { params: queryParams });
    }
    function getProxyFreightDefinition(queryParams: any) {
        return api.get(getProxyFreightDefinitionUrl, { params: queryParams });
    }
    function getFreightChargesList(params: any) {
        return api.get(freightChargesUrl, { params: params });
    }
    function getFreightVariableList() {
        return api.get(freightVariableUrl);
    }
    function getMonthlyFreightList(params: any) {
        return api.post(monthlyFreightListUrl, params);
    }
    function createMonthlyFreight(params: any) {
        return api.post(createMonthlyFreightUrl, params);
    }
    function getPtlZoneContract(queryParams: any) {
        return api.post(getPtlZoneContractUrl, queryParams);
    }
    function getLanePrice(queryParams: any) {
        return api.get(getLanePriceUrl, { params: queryParams });
    }
    function getFreightRules() {
        return api.get(freightRuleUrl);
    }
    function createContractFreightRates(params: any) {
        return api.post(createFreightRatesUrl, params);
    }
    function getContractFreightRates(queryParams: any) {
        return api.get(getContractFreightRatesUrl, { params: queryParams });
    }
    function getProxyContractFreightRates(queryParams: any) {
        return api.get(getProxyContractFreightRatesUrl, { params: queryParams });
    }
    function putContractFreightRates(params: any) {
        return api.put(putContractFreightUrl, params)
    }
    function deleteContractFreightRates(params: any) {
        return api.put(deleteContractFreightUrl, params)
    }
    return {
        getFreightList,
        getMonthlyFreightList,
        getFreightChargesList,
        getFreightVariableList,
        createFreightRate,
        createFreightDefinition,
        createMonthlyFreight,
        getFreightDefinition,
        updateFreightDefinition,
        getLanePrice,
        getFreightRules,
        createContractFreightRates,
        getContractFreightRates,
        putContractFreightRates,
        deleteContractFreightRates,
        getProxyContractFreightRates,
        getProxyFreightDefinition,
        getPtlZoneContract,
    }
}