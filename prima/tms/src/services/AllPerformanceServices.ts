import { AxiosInstance } from "axios";
import { allPerformanceReportListUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getAllPerformanceReportList(queryParams: any) {
        return api.get(allPerformanceReportListUrl, { params: queryParams });
    }
    return {
        getAllPerformanceReportList,
    }
}