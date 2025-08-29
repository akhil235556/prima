import { AxiosInstance } from "axios";
import { inTransitEfficiencyListUrl, inTransitEfficiencyCountListUrl, getIECsvLinkUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getInTransitEfficiencyList(queryParams: any) {
        return api.get(inTransitEfficiencyListUrl, { params: queryParams });
    }
    function getCountList(queryParams: any) {
        return api.get(inTransitEfficiencyCountListUrl, { params: queryParams });
    }
    function getCsvLink(queryParams: any) {
        return api.get(getIECsvLinkUrl, { params: queryParams });
    }
    return {
        getInTransitEfficiencyList,
        getCountList,
        getCsvLink
    }
}