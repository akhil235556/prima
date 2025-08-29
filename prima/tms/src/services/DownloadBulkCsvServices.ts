import { AxiosInstance } from "axios";

export default (api: AxiosInstance) => {
    function downloadCsv(url: any, queryParams: any) {
        return api.get(url, { params: queryParams });
    }
    return {
        downloadCsv,
    }
}