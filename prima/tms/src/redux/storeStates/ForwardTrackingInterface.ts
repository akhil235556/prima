export interface ForwardTrackingState {
  openFilter: boolean;
  selectedItem: ForwardTracking | undefined;
  pagination: any;
  listData: Array<ForwardTracking> | undefined;
  openModal: boolean;
  currentPage: number;
  refresh_list: boolean;
  searchQuery: string;
  pageSize: number;
  filterParams: any;
  filterChips: any;
}

export interface ForwardTracking {
  transporter: string;
  vehicleNumber: string;
  tat: string;
  lane: string;
  laneCode: string;
  vehicleType: string;
  freightType: string;
  driverInfo: string;
  startedAt: string;
  filterParams: any;
  filterChips: any;
}
