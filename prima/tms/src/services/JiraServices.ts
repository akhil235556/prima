import { AxiosInstance } from "axios";
import { getJiraListUrl, uploadJiraImageUrl, postJiraStoryUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getJiraList(queryParams: any) {
        return api.get(getJiraListUrl, { params: queryParams });
    }
    function uploadJiraImage(queryParams: any) {
        return api.post(uploadJiraImageUrl, queryParams, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        });
    }
    function postJiraStory(queryParams: any) {
        return api.post(postJiraStoryUrl, queryParams)
    }
    return {
        getJiraList,
        uploadJiraImage,
        postJiraStory
    }
}