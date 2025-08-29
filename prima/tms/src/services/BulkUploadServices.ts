import { AxiosInstance } from "axios";
import { bulkJobsUrl, getJobDetailsUrl, jobsRegistryUrl, jobsSampleUrl, uploadFileUrl, uploadPlanningFileUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getJobsRegistry() {
        return api.get(jobsRegistryUrl);
    }
    function getJobsSample(queryParams: any) {
        return api.get(jobsSampleUrl, { params: queryParams });
    }
    function bulkJobsList(queryParams: any) {
        return api.get(bulkJobsUrl, { params: queryParams });
    }
    function getJobDetails(requestId: any) {
        return api.get(getJobDetailsUrl + requestId);
    }
    function uploadFile(params: any, fileExtension: string, jonName: string) {
        return api.post(uploadFileUrl, params, {
            headers: {
                'content-type': 'multipart/form-data',
                'file-extention': fileExtension,
                'job-name': jonName,
            }
        });
    }
    function uploadPlanningFile(params: any, fileExtention: any) {
        return api.post(uploadPlanningFileUrl, params, {
            headers: {
                'content-type': 'multipart/form-data',
                'file-extention': fileExtention,
            }
        });
    }
    return {
        getJobsRegistry,
        getJobsSample,
        uploadFile,
        bulkJobsList,
        getJobDetails,
        uploadPlanningFile
    }
}