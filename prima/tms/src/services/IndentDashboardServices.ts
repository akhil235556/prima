import { AxiosInstance } from "axios";
import { sobLaneContributionList,indentCsvLinkUrl } from "../base/api/ServiceUrl";

export default (api: AxiosInstance) => {

    function getSobLaneContributionList(queryParams: any) {
        return api.get(sobLaneContributionList, { params: queryParams })
    }
    function getCsvLink(queryParams: any) {
        return api.get(indentCsvLinkUrl, { params: queryParams });
      }

    return {
        getSobLaneContributionList,
        getCsvLink
    };
};