export interface RoleState {
    openModal: boolean,
    refreshList: boolean,
    loading: boolean,
    pagination: any,
    listData: Array<Role> | undefined,
    selectedElement: Role | undefined,
    currentPage: number,
    pageSize: number,
}
export interface Role {
    roles: {
        roleId: string,
        roleName: number,
        permissions: {
            actionName: string,
            code: string,
            name: string,
            resourceName: string,
            serviceName: string,
            id: number,
            isActive: boolean,

        }
    },
    userId: string,
}
