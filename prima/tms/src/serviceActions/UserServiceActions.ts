import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { hideLoader, setUserInfo } from '../redux/actions/AppActions';
import { setResponse } from "../redux/actions/RolesAction";
import { hideLoading } from '../redux/actions/UserActions';
import { users } from "../services";

export const getUserList = (reactDispatch: any, queryParams: any): any => async (dispatch: Dispatch) => {
    users.getUserList(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    }).catch((error: any) => {
        reactDispatch(hideLoading());
        handleApiError(error.message, dispatch)
    });
};

export const getUsers = (query: any): any => async (dispatch: Dispatch) => {
    return users.getUser(query).then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, dispatch)
        });
};

export const getLoggedInUserInfo = (): any => async (dispatch: Dispatch) => {
    return users.getLoggedInUserInfo().then((responseAxios: any) => {
        responseAxios && dispatch(setUserInfo(responseAxios.details));
        dispatch(hideLoader());
        return responseAxios.details;
    }).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const createUser = (params: any): any => async (dispatch: Dispatch) => {
    return users.createUser(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const checkUserCreate = (params?: any): any => async (dispatch: Dispatch) => {
    return users.checkUserCreate(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        if (error?.status === 400 && error?.code === 3) {
            return;
        }
        handleApiError(error.message, dispatch);
    });
};

export const setUserRolePermission = (params: any): any => async (dispatch: Dispatch) => {
    return users.setUserRolePermission(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};


export const getUserRolePermissionsList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return users.getUserRolePermissionList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getUserEnableLocations = (queryParams?: any): any => async (dispatch: Dispatch) => {
    return users.getUserEnableLocations(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const setUserLocation = (queryParams?: any): any => async (dispatch: Dispatch) => {
    return users.setUserLocation(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const updateUserLocation = (queryParams?: any): any => async (dispatch: Dispatch) => {
    return users.updateUserLocation(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};