import { createReducer } from "reduxsauce";
import { isMobile } from "../../../../base/utility/ViewUtils";
import { rowsPerPageOptions } from '../base/ArrayList';
import { DriverState } from '../masterDriverRedux/MasterDriverStoreInterface';
import MasterDriverTypes from "./MasterDriverTypes";

export const MASTER_DRIVER_STATE: DriverState = {
  openModal: false,
  refreshList: false,
  loading: false,
  listData: undefined,
  pagination: undefined,
  selectedElement: {
    certificateList: [{
      index: 0
    }]
  },
  currentPage: 1,
  pageSize: rowsPerPageOptions[0],
  filterParams: {},
  filterChips: {},
  openFilter: false,
  openBulkUpload: false,
}

const toggleModalReducer = (state = MASTER_DRIVER_STATE) => ({
  ...state,
  openModal: !state.openModal
});

const toggleFilterReducer = (state = MASTER_DRIVER_STATE) => ({
  ...state,
  openFilter: !state.openFilter
});

const setFilterReducer = (state = MASTER_DRIVER_STATE, action: any) => ({
  ...state,
  filterChips: action.chips,
  filterParams: action.params,
  currentPage: 1,
  listData: undefined,
});

const removeFilterReducer = (state = MASTER_DRIVER_STATE, action: any) => {
  state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];
  switch (action.key) {
    case 'partnerName':
      state.filterParams && state.filterParams['partnerCode'] && delete state.filterParams['partnerCode'];
      break;
    default:
      state.filterParams && state.filterParams[action.key] && delete state.filterParams[action.key];
      break;
  }
  return {
    ...state,
    filterChips: state.filterChips,
    filterParams: state.filterParams,
    currentPage: 1,
    listData: undefined,
    refreshList: !state.refreshList,
  }
};

const setResponseReducer = (state = MASTER_DRIVER_STATE, action: any) => ({
  ...state,
  listData: isMobile ?
    (state.listData ? [...state.listData, ...action.response && action.response.result] : action.response && action.response.result)
    : action.response && action.response.result,
  pagination: action.response && action.response.pagination,
  loading: false,
});

const setSelectedElementReducer = (state = MASTER_DRIVER_STATE, action: any) => ({
  ...state,
  selectedElement: action.value
});

const setCurrentPageReducer = (state = MASTER_DRIVER_STATE, action: any) => ({
  ...state,
  currentPage: action.value,
});

const refreshListReducer = (state = MASTER_DRIVER_STATE) => ({
  ...state,
  refreshList: !state.refreshList,
  currentPage: 1,
  listData: undefined,
});

const setRowPerPageReducer = (state = MASTER_DRIVER_STATE, action: any) => ({
  ...state,
  pageSize: action.value,
  currentPage: 1,
  listData: undefined,
});

const toggleLoadingReducer = (state = MASTER_DRIVER_STATE) => ({
  ...state,
  loading: !state.loading
});

const showLoadingReducer = (state = MASTER_DRIVER_STATE) => ({
  ...state,
  loading: true
});

const hideLoadingReducer = (state = MASTER_DRIVER_STATE) => ({
  ...state,
  loading: false
});

const toggleBulkUploadReducer = (state = MASTER_DRIVER_STATE) => ({
  ...state,
  openBulkUpload: !state.openBulkUpload
});

const ACTION_HANDLERS = {
  [MasterDriverTypes.TOGGLE_MODAL]: toggleModalReducer,
  [MasterDriverTypes.SET_RESPONSE]: setResponseReducer,
  [MasterDriverTypes.SET_SELECTED_ELEMENT]: setSelectedElementReducer,
  [MasterDriverTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
  [MasterDriverTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
  [MasterDriverTypes.REFRESH_LIST]: refreshListReducer,
  [MasterDriverTypes.TOGGLE_LOADING]: toggleLoadingReducer,
  [MasterDriverTypes.SHOW_LOADING]: showLoadingReducer,
  [MasterDriverTypes.HIDE_LOADING]: hideLoadingReducer,
  [MasterDriverTypes.USER_FILTER]: setFilterReducer,
  [MasterDriverTypes.REMOVE_FILTER]: removeFilterReducer,
  [MasterDriverTypes.TOGGLE_FILTER]: toggleFilterReducer,
  [MasterDriverTypes.TOGGLE_BULK_UPLOAD]: toggleBulkUploadReducer,
}

export default createReducer(MASTER_DRIVER_STATE, ACTION_HANDLERS);