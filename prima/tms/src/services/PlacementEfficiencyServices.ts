import { AxiosInstance } from "axios";
import { PlacementEfficiencyListUrl, PlacementEfficiencyCountListUrl, getPECsvLinkUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getPlacementEfficiencyList(queryParams: any) {
        return api.get(PlacementEfficiencyListUrl, { params: queryParams });
    }
    function getCountList(queryParams: any) {
        return api.get(PlacementEfficiencyCountListUrl, { params: queryParams });
    }
    function getCsvLink(queryParams: any) {
        return api.get(getPECsvLinkUrl, { params: queryParams });
    }
    return {
        getPlacementEfficiencyList,
        getCountList,
        getCsvLink
    }
}