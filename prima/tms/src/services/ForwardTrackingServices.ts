import { AxiosInstance } from "axios";
import {
  ForwardTrackingCountListUrl,
  ForwardTrackingListUrl,
  getFTCsvLinkUrl
} from "../base/api/ServiceUrl";

export default (api: AxiosInstance) => {
  function getForwardTrackingList(queryParams: any) {
    return api.get(ForwardTrackingListUrl, { params: queryParams });
  }

  function getCountList(queryParams: any) {
    return api.get(ForwardTrackingCountListUrl, { params: queryParams });
  }

  function getCsvLink(queryParams: any) {
    return api.get(getFTCsvLinkUrl, { params: queryParams });
  }

  return {
    getForwardTrackingList,
    getCountList,
    getCsvLink,
  };
};
