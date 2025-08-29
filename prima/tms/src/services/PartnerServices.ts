import { AxiosInstance } from "axios";
import {
    clientPartnerPartnerListUrl,consigneeAddressUrl,contractTerminateUrl, 
    disableClientPartnerRltnUrl, enablePartnerUrl,getPartnerUrl,notenabledPartnerRltnUrl, 
    partnerListUrl, searchClientPartnerPartnerUrl, searchPartnerUrl, createPartnerUrl
} from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getPartnersList(queryParams: any) {
        return api.get(partnerListUrl, { params: queryParams });
    }
    function clientPartnersList(queryParams: any) {
        return api.get(clientPartnerPartnerListUrl, { params: queryParams });
    }
    function searchAllPartner(queryParams: any) {
        return api.get(searchPartnerUrl, { params: queryParams });
    }
    function searchClientPartner(queryParams: any) {
        return api.get(searchClientPartnerPartnerUrl, { params: queryParams });
    }
    function enablePartners(params: any) {
        return api.post(enablePartnerUrl, params);
    }
    function consigneeAddress(queryParams: any) {
        return api.get(consigneeAddressUrl, { params: queryParams });
    }
    function getPartnerCheck(queryParams: any) {
        return api.get(getPartnerUrl, { params: queryParams });
    }
    function contractTerminate(params: any) {
        return api.put(contractTerminateUrl, params)
    }
    function disableClientPartnerRltn(params: any) {
        return api.put(disableClientPartnerRltnUrl, params)
    }
    function getNotEnabledPartnerList(queryParams: any) {
        return api.get(notenabledPartnerRltnUrl, { params: queryParams })
    }
    function createPartner(params: any) {
        return api.post(createPartnerUrl, params);
    }
    return {
        getPartnersList,
        enablePartners,
        searchAllPartner,
        clientPartnersList,
        searchClientPartner,
        consigneeAddress,
        getPartnerCheck,
        contractTerminate,
        disableClientPartnerRltn,
        getNotEnabledPartnerList,
        createPartner
    }
}