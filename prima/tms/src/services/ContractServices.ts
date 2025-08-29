import { AxiosInstance } from "axios";
import {
    billingCycleUrl,
    bulkApproveContractUrl, contractRenewUrl, createConstraintsUrl, createContractUrl,
    getActiveContractsUrl, getApproveContractUrl, getConstraintsUrl, getContractListUrl, getSobContractsListUrl, getTerminateContractUrl,
    getUnPaginatedContractListUrl, searchContractDetailsUrl, searchContractIdUrl, templateConstraintsUrl
} from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getContractList(queryParams: any) {
        return api.post(getContractListUrl, queryParams);
    }
    function searchContractDetails(queryParams: any) {
        return api.post(searchContractDetailsUrl, queryParams);
    }
    function searchContractIdList(queryParams: any) {
        return api.get(searchContractIdUrl, { params: queryParams });
    }
    function createContract(params: any) {
        return api.post(createContractUrl, params);
    }
    function getBillingCycle() {
        return api.get(billingCycleUrl);
    }
    function approveContract(queryParams: any) {
        return api.post(getApproveContractUrl, queryParams);
    }
    function terminateContract(queryParams: any) {
        return api.post(getTerminateContractUrl, queryParams);
    }
    function getActiveContracts(queryParams: any) {
        return api.get(getActiveContractsUrl, { params: queryParams });
    }
    function contractRenewal(queryParams: any) {
        return api.post(contractRenewUrl, queryParams);
    }
    function getUnPaginatedContractList(queryParams: any) {
        return api.get(getUnPaginatedContractListUrl, { params: queryParams });
    }
    function bulkApproveContract(queryParams: any) {
        return api.post(bulkApproveContractUrl, queryParams);
    }
    function getSobContractsList(queryParams: any) {
        return api.get(getSobContractsListUrl, { params: queryParams });
    }
    function createConstraints(queryParams: any) {
        return api.post(createConstraintsUrl, queryParams);
    }
    function getConstraints(queryParams: any) {
        return api.get(getConstraintsUrl, { params: queryParams });
    }
    function templateConstraints(queryParams: any) {
        return api.get(templateConstraintsUrl, { params: queryParams });
    }
    return {
        getContractList,
        createContract,
        getBillingCycle,
        approveContract,
        terminateContract,
        getActiveContracts,
        searchContractDetails,
        contractRenewal,
        getUnPaginatedContractList,
        searchContractIdList,
        bulkApproveContract,
        getSobContractsList,
        createConstraints,
        getConstraints,
        templateConstraints
    }
}