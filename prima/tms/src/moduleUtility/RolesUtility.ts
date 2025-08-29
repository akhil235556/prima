import { isEmptyArray, isNullValue } from "../base/utility/StringUtils";
import { showAlert } from "../redux/actions/AppActions";

export function validateRoleData(userParams: any, appDispatch: any) {
    if (isNullValue(userParams.name)) {
        return {
            name: "enter valid name"
        }
    } else if (isNullValue(userParams.description)) {
        return {
            description: "enter valid description"
        }
    } else if (isEmptyArray(userParams.permission)) {
        appDispatch(showAlert("Select role permissions", false))
        return {}
    }
    return true;
}

export function createRolesParams(userParams: any) {
    return {
        name: userParams.name,
        description: userParams.description
    }
}

export function createRolesPermissionParams(userParams: any, roleId: string) {
    return {
        roleId: roleId,
        permissionIds: userParams.permission.map((element: any) => element.value),
    }
}

export function getSelectedPermission(allPermissions: Array<any>, selectedPermissions: Array<any>) {
    let selectedIds = selectedPermissions.filter(element => element.isActive).map((element) => element.permissionId);
    let allPermissionsIds = allPermissions.filter(element => element.isActive === true);
    return allPermissionsIds && selectedPermissions && allPermissions.filter((value) => selectedIds.indexOf(value.id) !== -1);
}