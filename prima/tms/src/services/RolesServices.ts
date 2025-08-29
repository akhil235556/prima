import { AxiosInstance } from "axios";
import { rolesListUrl, permissionListUrl, setRolesPermissionUrl, createRoleUrl, getRolesPermissionUrl, allRolesUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getRolesList(queryParams: any) {
        return api.get(rolesListUrl, { params: queryParams });
    }
    function getAllRoles() {
        return api.get(allRolesUrl);
    }
    function getPermissionList(queryParams: any) {
        return api.get(permissionListUrl, { params: queryParams });
    }
    function setRolePermissionList(params: any) {
        return api.put(setRolesPermissionUrl, params);
    }

    function getRolePermissionList(queryParams: any) {
        return api.get(getRolesPermissionUrl, { params: queryParams });
    }
    function createRole(params: any) {
        return api.post(createRoleUrl, params);
    }
    return {
        getRolesList,
        getPermissionList,
        setRolePermissionList,
        createRole,
        getRolePermissionList,
        getAllRoles,
    }
}