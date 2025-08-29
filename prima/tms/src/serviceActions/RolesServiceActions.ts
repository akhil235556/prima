import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { hideLoader, setPermissionsList, setRolesList } from '../redux/actions/AppActions';
import { hideLoading, setResponse } from "../redux/actions/RolesAction";
import { roles } from "../services";

export const getRolesList = (reactDispatch: any, queryParams: any): any => async (dispatch: Dispatch) => {
    roles.getRolesList(queryParams).then((responseAxios: any) => {
        reactDispatch(setResponse(responseAxios.details));
        reactDispatch(hideLoading());
        dispatch(hideLoader());
    }).catch((error: any) => {
        reactDispatch(hideLoading());
        handleApiError(error.message, dispatch)
    });
};

export const getAllRoles = (): any => async (dispatch: Dispatch) => {
    roles.getAllRoles().then((responseAxios: any) => {
        dispatch(setRolesList(responseAxios.details));
        // dispatch(hideLoader());
    }).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getPermissionsList = (queryParams?: any): any => async (dispatch: Dispatch) => {
    return roles.getPermissionList(queryParams).then((responseAxios: any) => {
        dispatch(setPermissionsList(responseAxios.details));
        return responseAxios.details;
    }).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const createRole = (params: any): any => async (dispatch: Dispatch) => {
    return roles.createRole(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

// permissionIds
// roleId
export const setRolePermissionsList = (params: any): any => async (dispatch: Dispatch) => {
    return roles.setRolePermissionList(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};

export const getRolePermissionsList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return roles.getRolePermissionList(queryParams).then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch)
    });
};