import { AxiosInstance } from "axios";
import {
    dispatchDashboardCountUrl, dispatchChartDataUrl,
} from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function dispatchDashboardCount(queryParams: any) {
        return api.get(dispatchDashboardCountUrl, { params: queryParams });
    }
    function dispatchChartData(queryParams: any) {
        return api.get(dispatchChartDataUrl, { params: queryParams });
    }
    return {
        dispatchDashboardCount,
        dispatchChartData,
    }
}