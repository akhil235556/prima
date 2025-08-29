import { Dispatch } from 'redux';
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { jira } from "../services";

export const getJiraList = (queryParams: any): any => async (appDispatch: Dispatch) => {
    return jira.getJiraList(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, appDispatch);
    });
};

export const uploadJiraImage = (queryParams: any): any => async (appDispatch: Dispatch) => {
    return jira.uploadJiraImage(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, appDispatch);
    });
};

export const postJiraStory = (queryParams: any): any => async (appDispatch: Dispatch) => {
    return jira.postJiraStory(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, appDispatch);
    });
};