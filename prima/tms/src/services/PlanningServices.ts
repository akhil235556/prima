import { AxiosInstance } from "axios";
import { createTaskUrl, dispatchListingUrl, downloadPlanningIndentOutputCsvUrl, downloadPlanningOutputCsvUrl, downloadPlanningUploadSampleUrl, getPlanningEnginesUrl, getPlanningHistoryListingUrl, getPlanningResultsUrl, getPlanningRoutesUrl, getPlanningTasksUrl, jobListUrl, planningErrorUrl, planningHistoryUrl, statusListUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function createTasks(params: any) {
        return api.post(createTaskUrl, params);
    }
    function getDispatchListing(queryParams: any) {
        return api.get(dispatchListingUrl, { params: queryParams });
    }
    function getPlanningHistoryListing(queryParams: any) {
        return api.get(getPlanningHistoryListingUrl, { params: queryParams });
    }
    function getPlanningResults(queryParams: any) {
        return api.get(getPlanningResultsUrl, { params: queryParams });
    }
    function getPlanningRoutes(queryParams: any) {
        return api.get(getPlanningRoutesUrl, { params: queryParams });
    }
    function getPlanningTasks(queryParams: any) {
        return api.get(getPlanningTasksUrl, { params: queryParams });
    }
    function getPlanningEngines(queryParams: any) {
        return api.get(getPlanningEnginesUrl, { params: queryParams });
    }
    function planningHistory(queryParams: any) {
        return api.get(planningHistoryUrl, { params: queryParams });
    }
    function downloadPlanningOutputCsv(queryParams: any) {
        return api.get(downloadPlanningOutputCsvUrl, { params: queryParams });
    }
    function downloadPlanningIndentOutputCsv(queryParams: any) {
        return api.get(downloadPlanningIndentOutputCsvUrl, { params: queryParams });
    }
    function downloadPlanningUploadSample(queryParams: any) {
        return api.get(downloadPlanningUploadSampleUrl, { params: queryParams });
    }
    function getJobList(queryParams: any) {
        return api.get(jobListUrl, { params: queryParams });
    }
    function getPlanningErrors(queryParams: any) {
        return api.get(planningErrorUrl, { params: queryParams });
    }
    function getStatus() {
        return api.get(statusListUrl);
    }
    return {
        createTasks,
        getDispatchListing,
        planningHistory,
        getJobList,
        getStatus,
        getPlanningHistoryListing,
        getPlanningResults,
        getPlanningRoutes,
        getPlanningTasks,
        downloadPlanningOutputCsv,
        downloadPlanningIndentOutputCsv,
        getPlanningErrors,
        downloadPlanningUploadSample,
        getPlanningEngines
    }
}