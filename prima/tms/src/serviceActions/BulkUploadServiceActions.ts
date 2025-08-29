import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { hideLoader } from '../redux/actions/AppActions';
import { hideLoading, setResponse } from '../redux/actions/BulkUploadTrackAction';
import { bulk } from "../services";

export const bulkJobsList = (queryParams: any, reactDispatch: any): any => async (dispatch: Dispatch) => {
    bulk.bulkJobsList(queryParams).then((responseAxios: any) => {
        responseAxios && reactDispatch(setResponse(responseAxios.details))
        dispatch(hideLoader());
        reactDispatch(hideLoading())
    }).catch((error: any) => {
        handleApiError(error.message, dispatch);
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    });
};

export const getJobsRegistry = (): any => async (dispatch: Dispatch) => {
    return bulk.getJobsRegistry().then((responseAxios: any) =>
        responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
        dispatch(hideLoader());
    });
};

export const getJobDetails = (requestId: any): any => async (dispatch: Dispatch) => {
    return bulk.getJobDetails(requestId).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
        dispatch(hideLoader());
    });
};

export const getJobsSample = (queryParams: any): any => async (dispatch: Dispatch) => {
    return bulk.getJobsSample(queryParams).then((responseAxios: any) => responseAxios && responseAxios.details).catch((error: any) => {
        handleApiError(error.message, dispatch);
        dispatch(hideLoader());
    });
};

export const uploadFile = (params: any, fileExtension: string, jonName: string): any => async (dispatch: Dispatch) => {
    return bulk.uploadFile(params, fileExtension, jonName).then((responseAxios: any) => responseAxios).catch((error: any) => {
        handleApiError(error.message, dispatch);
        dispatch(hideLoader());
    });
};

export const uploadPlanningFile = (params: any, fileExtention: any, setErrorDetails: any, setOpenErrorModal: any): any => async (dispatch: Dispatch) => {
    return bulk.uploadPlanningFile(params, fileExtention).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, dispatch);
            dispatch(hideLoader());
        });
};