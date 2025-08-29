import { AxiosInstance } from "axios";
import { createSobUrl, deleteSobUrl, getSobUrl, searchSobUrl, sobListUrl, updateSobUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {

    function getSobListing(queryParams: any) {
        return api.get(sobListUrl, { params: queryParams })
    }
    function createSob(queryParams: any) {
        return api.post(createSobUrl, queryParams)
    }
    function getSob(queryParams: any) {
        return api.get(getSobUrl, { params: queryParams })
    }
    function updateSob(queryParams: any) {
        return api.put(updateSobUrl, queryParams)

    }
    function deleteSob(queryParams: any) {
        return api.put(deleteSobUrl, queryParams)

    }
    function searchSob(queryParams: any) {
        return api.get(searchSobUrl, { params: queryParams })
    }
    return {
        getSobListing,
        createSob,
        getSob,
        updateSob,
        deleteSob,
        searchSob
    }
}