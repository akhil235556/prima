import { AxiosInstance } from "axios";
import {
    createUserUrl,
    dispatchFreightListUrl, dispatchManagementListingUrl, getUserRolesAndPermissionUrl, setUserLocationUrl, setUserRolesAndPermissionUrl
} from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getDispatchList(queryParams: any) {
        return api.get(dispatchManagementListingUrl, { params: queryParams });
    }
    function createUser(params: any) {
        return api.post(createUserUrl, params);
    }
    function setUserRolePermission(params: any) {
        return api.put(setUserRolesAndPermissionUrl, params);
    }
    function getUserRolePermissionList(queryParams: any) {
        return api.get(getUserRolesAndPermissionUrl, { params: queryParams });
    }
    function setUserLocation(queryParams?: any) {
        return api.put(setUserLocationUrl, queryParams);
    }
    function getDispatchOrderList(queryParams: any) {
        return api.get(dispatchFreightListUrl, { params: queryParams });
    }

    return {
        getDispatchList,
        createUser,
        setUserRolePermission,
        getUserRolePermissionList,
        setUserLocation,
        getDispatchOrderList
    }
}