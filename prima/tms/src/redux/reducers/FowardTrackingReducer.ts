import { createReducer } from "reduxsauce";
import { lastWeek, rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { ForwardTrackingState } from "../storeStates/ForwardTrackingInterface";
import ForwardTrackingTypes from "../types/ForwardTrackingTypes";

export const FORWARD_TRACKING_STATE: ForwardTrackingState = {
  openFilter: false,
  selectedItem: undefined,
  pagination: undefined,
  listData: undefined,
  openModal: false,
  currentPage: 1,
  refresh_list: false,
  searchQuery: "",
  pageSize: rowsPerPageOptions[0],
  filterParams: {
    fromDate: lastWeek.fromDate,
    toDate: lastWeek.toDate,
  },
  filterChips: {},
};

const toggleFilterReducer = (state = FORWARD_TRACKING_STATE) => ({
  ...state,
  openFilter: !state.openFilter,
});

const toggleModalReducer = (state = FORWARD_TRACKING_STATE) => ({
  ...state,
  openModal: !state.openModal,
});

const setSelectedElementReducer = (
  state = FORWARD_TRACKING_STATE,
  action: any
) => ({
  ...state,
  selectedItem: action.value,
});

const setResponseReducer = (state = FORWARD_TRACKING_STATE, action: any) => ({
  ...state,
  pagination: action.response && action.response.pagination,
  listData: isMobile
    ? state.listData
      ? [...state.listData, ...(action.response && action.response.results)]
      : action.response && action.response.results
    : action.response && action.response.results,
});

const setCurrentPageReducer = (
  state = FORWARD_TRACKING_STATE,
  action: any
) => ({
  ...state,
  currentPage: action.value,
});

const setRefreshListReducer = (state = FORWARD_TRACKING_STATE) => ({
  ...state,
  refresh_list: !state.refresh_list,
  currentPage: 1,
  listData: undefined,
});

const searchQueryReducer = (state = FORWARD_TRACKING_STATE, action: any) => ({
  ...state,
  searchQuery: action.value,
});

const setRowPerPageReducer = (state = FORWARD_TRACKING_STATE, action: any) => ({
  ...state,
  pageSize: action.value,
  currentPage: 1,
});

const setFilterReducer = (state = FORWARD_TRACKING_STATE, action: any) => ({
  ...state,
  filterChips: action.chips,
  filterParams: action.params,
  currentPage: 1,
  listData: undefined,
  refresh_list: !state.refresh_list,
  // chartData: [],
  // dashboardCount: {}
});

const removeFilterReducer = (state = FORWARD_TRACKING_STATE, action: any) => {
  state.filterChips &&
    state.filterChips[action.key] &&
    delete state.filterChips[action.key];
  switch (action.key) {
    case "period":
      state.filterParams &&
        state.filterParams["period"] &&
        delete state.filterParams["period"];

      state.filterParams &&
        state.filterParams["fromDate"] &&
        delete state.filterParams["fromDate"];

      state.filterParams &&
        state.filterParams["toDate"] &&
        delete state.filterParams["toDate"];

      state.filterChips &&
        state.filterChips["fromDate"] &&
        delete state.filterChips["fromDate"];

      state.filterChips &&
        state.filterChips["toDate"] &&
        delete state.filterChips["toDate"];
      break;

    case "partnerName":
      state.filterParams &&
        state.filterParams["partnerCode"] &&
        delete state.filterParams["partnerCode"];
      break;

    case "laneName":
      state.filterParams &&
        state.filterParams["laneCode"] &&
        delete state.filterParams["laneCode"];
      break;

    case "destinationLocationName":
      state.filterParams &&
        state.filterParams["originLocationCode"] &&
        delete state.filterParams["originLocationCode"];
      break;

    default:
      state.filterParams &&
        state.filterParams[action.key] &&
        delete state.filterParams[action.key];
      break;
  }

  return {
    ...state,
    filterChips: state.filterChips,
    filterParams: state.filterParams,
    currentPage: 1,
    listData: undefined,
    refresh_list: !state.refresh_list,
  };
};

const ACTION_HANDLERS = {
  [ForwardTrackingTypes.TOGGLE_FILTER]: toggleFilterReducer,
  [ForwardTrackingTypes.TOGGLE_MODAL]: toggleModalReducer,
  [ForwardTrackingTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
  [ForwardTrackingTypes.SET_RESPONSE]: setResponseReducer,
  [ForwardTrackingTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
  [ForwardTrackingTypes.REFRESH_LIST]: setRefreshListReducer,
  [ForwardTrackingTypes.SEARCH_QUERY]: searchQueryReducer,
  [ForwardTrackingTypes.USER_FILTER]: setFilterReducer,
  [ForwardTrackingTypes.REMOVE_FILTER]: removeFilterReducer,
  [ForwardTrackingTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
};

export default createReducer(FORWARD_TRACKING_STATE, ACTION_HANDLERS);
