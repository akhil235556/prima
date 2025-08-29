import { AxiosInstance } from "axios";
import { checkUserCreateUrl, createUserUrl, enabledUserLocationUrl, getLoggedInUserInfoUrl, getUserRolesAndPermissionUrl, getUserUrl, setUserLocationUrl, setUserRolesAndPermissionUrl, updateUserLocationUrl, userListUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getUserList(queryParams: any) {
        return api.get(userListUrl, { params: queryParams });
    }
    function createUser(params: any) {
        return api.post(createUserUrl, params);
    }
    function getUser(queryParams: any) {
        return api.get(getUserUrl, { params: queryParams });
    }
    function setUserRolePermission(params: any) {
        return api.put(setUserRolesAndPermissionUrl, params);
    }
    function getUserRolePermissionList(queryParams: any) {
        return api.get(getUserRolesAndPermissionUrl, { params: queryParams });
    }
    function getUserEnableLocations(queryParams?: any) {
        return api.get(enabledUserLocationUrl, { params: queryParams });
    }
    function setUserLocation(queryParams?: any) {
        return api.put(setUserLocationUrl, queryParams);
    }
    function updateUserLocation(queryParams?: any) {
        return api.put(updateUserLocationUrl, queryParams);
    }
    function getLoggedInUserInfo() {
        return api.get(getLoggedInUserInfoUrl);
    }
    function checkUserCreate(queryParams?: any) {
        return api.get(checkUserCreateUrl, queryParams);
    }
    return {
        getUserList,
        createUser,
        getUser,
        setUserRolePermission,
        getUserRolePermissionList,
        getUserEnableLocations,
        setUserLocation,
        getLoggedInUserInfo,
        updateUserLocation,
        checkUserCreate
    }
}