function onPermissionSelection(selectedPermissionList: any, groupValue: any, userParams: any) {
    let changedPermissionList = [...userParams.permissionList]
    let newListData = ((changedPermissionList && changedPermissionList.map((element: any) => {
        if (element.value === groupValue.value) {
            let newElement = {
                ...element,
                data: {
                    ...element.data,
                    permission: element.data.permission &&
                        element.data.permission.map((permissionInfo: any) => {
                            if (permissionInfo.id === selectedPermissionList.value) {
                                return {
                                    ...permissionInfo,
                                    isChecked: permissionInfo.isChecked ? false : true
                                }
                            } else {
                                return permissionInfo;
                            }
                        })
                }
            }
            let isAllChecked = newElement.data.permission.some((data: any) => data.isChecked !== true);
            newElement.data.isGroupChecked = !isAllChecked;
            return newElement;
        } else {
            return element;
        }
    })) || []);
    return newListData;
}

function onGroupSelection(groupValue: any, userParams: any) {
    let changedPermissionList = [...userParams.permissionList]
    let newListData = changedPermissionList && changedPermissionList.map((element: any) => {
        if (element.value === groupValue.value) {
            return {
                ...element,
                data: {
                    ...element.data,
                    isGroupChecked: element.data.isGroupChecked ? false : true,
                    permission: element.data.permission &&
                        element.data.permission.map((permissionInfo: any) => {
                            return {
                                ...permissionInfo,
                                isChecked: element.data.isGroupChecked ? false : true
                            }
                        })

                }
            }
        } else {
            return element;
        }
    });
    return newListData;
}

function uniquePermissionOnGroupSelection(groupValue: any, userParams: any) {
    let userSelectedPermission = (userParams.userPermissions && [...userParams.userPermissions]) || []
    let selectedIds = groupValue.data && groupValue.data.permission && groupValue.data.permission.map((element: any) => element.id);
    if (groupValue.data.isGroupChecked) {
        userSelectedPermission = userSelectedPermission.filter((element: any) => !selectedIds.includes(element.id))
    } else {
        userSelectedPermission = (groupValue.data && groupValue.data.permission && userSelectedPermission) ? [...userSelectedPermission, ...groupValue.data.permission] : [...groupValue.data.permission]
    }
    return userSelectedPermission
}

function uniquePermissionOnSingleSelection(selectedPermission: any, userParams: any) {
    let userSelectedPermission = (userParams.userPermissions && [...userParams.userPermissions]) || [];
    if (selectedPermission.data.isChecked) {
        userSelectedPermission = userSelectedPermission.filter((element: any) => selectedPermission.data.id !== element.id)
    } else {
        userSelectedPermission = (userSelectedPermission) ? [...userSelectedPermission, selectedPermission.data] : [selectedPermission.data]
    }
    return userSelectedPermission
}

function getUserSelectedPermission(userParams: any) {
    let selectedPermission: any = [];
    // eslint-disable-next-line
    userParams.userPermissions && userParams.userPermissions.map((element: any) => {
        selectedPermission.push(element.id)
    });
    return selectedPermission;
}

function getSelectedPermission(allPermissions: Array<any>, selectedPermissions: Array<any>) {
    let selectedIds = (selectedPermissions && selectedPermissions.filter(element => element.isActive).map((element) => element.id)) || [];
    let allPermissionsIds = allPermissions.filter(element => element.permission && element.permission.isActive === true);
    let changedPermissionList = [...allPermissions]
    let newListData = ((allPermissionsIds && changedPermissionList && changedPermissionList.map((element: any) => {
        let newElement = {
            ...element,
            data: {
                ...element.data,
                permission: element.data.permission &&
                    element.data.permission.map((permissionInfo: any) => {
                        return {
                            ...permissionInfo,
                            isChecked: selectedIds.includes(permissionInfo.id)
                        }
                    })
            }
        }
        let isAllChecked = newElement.data.permission.some((data: any) => data.isChecked !== true);
        newElement.data.isGroupChecked = !isAllChecked;
        return newElement;
    })) || []);
    return newListData;
}

export {
    onPermissionSelection,
    onGroupSelection,
    getUserSelectedPermission,
    getSelectedPermission,
    uniquePermissionOnGroupSelection,
    uniquePermissionOnSingleSelection
};
