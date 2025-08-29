import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { hideLoader } from "../redux/actions/AppActions";
import { hideLoading, setResponse } from "../redux/actions/PlanningDispatchHistoryActions";
import { planning } from "../services";

export const createTasks = (params: any): any => async (dispatch: Dispatch) => {
    return planning.createTasks(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getDispatchListing = (reactDispatch: any, queryParams: any): any => async (dispatch: Dispatch) => {
    planning.getDispatchListing(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    }).catch((error: any) => {
        handleApiError(error.message, dispatch);
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    });
};

export const getPlanningHistoryListing = (queryParams: any): any => async (dispatch: Dispatch) => {
    return planning.getPlanningHistoryListing(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
}

export const getPlanningResults = (queryParams: any): any => async (dispatch: Dispatch) => {
    return planning.getPlanningResults(queryParams).then((responseAxios: any) => responseAxios?.details?.results
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
}

export const downloadPlanningOutputCsv = (queryParams: any): any => async (dispatch: Dispatch) => {
    return planning.downloadPlanningOutputCsv(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
}

export const getPlanningEngines = (queryParams?: any): any => async (dispatch: Dispatch) => {
    return planning.getPlanningEngines(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
}

export const downloadPlanningIndentOutputCsv = (queryParams: any): any => async (dispatch: Dispatch) => {
    return planning.downloadPlanningIndentOutputCsv(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
}

export const downloadPlanningUploadSample = (queryParams: any): any => async (dispatch: Dispatch) => {
    return planning.downloadPlanningUploadSample(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
}

export const getPlanningErrors = (queryParams: any): any => async (dispatch: Dispatch) => {
    return planning.getPlanningErrors(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
}

export const getPlanningRoutes = (queryParams: any): any => async (dispatch: Dispatch) => {
    return planning.getPlanningRoutes(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
}

export const getPlanningTasks = (queryParams: any): any => async (dispatch: Dispatch) => {
    return planning.getPlanningTasks(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
}

export const planningHistory = (reactDispatch: any, queryParams: any): any => async (dispatch: Dispatch) => {
    planning.planningHistory(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    }).catch((error: any) => {
        handleApiError(error.message, dispatch);
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    });
};


export const getJobList = (reactDispatch: any, queryParams: any): any => async (dispatch: Dispatch) => {
    planning.getJobList(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));
        dispatch(hideLoader());
        reactDispatch(hideLoading());
    }).catch((error: any) => {
        handleApiError(error.message, dispatch);
        reactDispatch(hideLoading());
    });
};

export const getStatus = (): any => async (dispatch: Dispatch) => {
    return planning.getStatus().then((responseAxios: any) => {
        return responseAxios.details;
    }).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};