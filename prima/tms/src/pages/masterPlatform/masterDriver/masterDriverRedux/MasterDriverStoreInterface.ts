export interface DriverState {
  openModal: boolean,
  refreshList: boolean,
  pagination: any,
  listData: any,
  selectedElement: any | undefined,
  currentPage: number,
  pageSize: number,
  loading: boolean,
  filterParams: any,
  filterChips: any,
  openFilter: boolean,
  openBulkUpload: boolean,
}

export interface MasterDriverType {
  driverName: string,
  contactNumber: string,
  driverAddress: string | null,
  licenseExpiry: string,
  licenseNumber: string,
  partition: string | null,
  tenant: string | null,
  extDriverId: string | null,
}


