
export interface MaterialState {
    openFilter: boolean,
    openBulkUpload: boolean,
    refreshList: boolean,
    loading: boolean,
    openCreateLocation: boolean,
    selectedItem: Material | undefined,
    pagination: any
    listData: Array<Material> | undefined,
    currentPage: number,
    pageSize: number,
    searchQuery: string,
    filterParams: any,
    filterChips: any,
}

export interface Material {
    name: string,
    code: string,
    description: string,
    packaging?: string,
    weightUom?: string,
    volumeUom?: string,
    skuCode: string,
    isBulk: boolean,
    units?: number,
    height?: number,
    width?: number,
    length?: number,
    weight?: number,
    volume?: number,
    maxWeight?: number
}

export interface Consignee {
    name: string,
    Address: string,
    email: string,
    card: number,
    number: number,
    gstnumber: number
}