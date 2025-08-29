import { AxiosInstance } from "axios";
import { LoadabilityListListUrl, LoadabilityCountListListUrl, getLoadabilityCsvLinkUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getLoadabilityList(queryParams: any) {
        return api.get(LoadabilityListListUrl, { params: queryParams });
    }
    function getCountList(queryParams: any) {
        return api.get(LoadabilityCountListListUrl, { params: queryParams });
    }
    function getCsvLink(queryParams: any) {
        return api.get(getLoadabilityCsvLinkUrl, { params: queryParams });
    }
    return {
        getLoadabilityList,
        getCountList,
        getCsvLink
    }
}