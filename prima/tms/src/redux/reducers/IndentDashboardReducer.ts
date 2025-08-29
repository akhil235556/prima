import _ from "lodash";
import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { IndentDashboardState } from "../storeStates/IndentDashbordStoreInterface";
import IndentDashboardTypes from "../types/IndentDashboardTypes";

export const INDENT_DASHBOARD_STATE: IndentDashboardState = {
    openFilter: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    openModal: false,
    currentPage: 1,
    pageSize: rowsPerPageOptions[0],
    refreshList: false,
    loading: false,
    openPointModal: false,
    filterParams: {},
    filterChips: {},
}

const toggleFilterReducer = (state = INDENT_DASHBOARD_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = INDENT_DASHBOARD_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const togglePointsModalReducer = (state = INDENT_DASHBOARD_STATE) => ({
    ...state,
    openPointModal: !state.openPointModal
});

const setSelectedElementReducer = (state = INDENT_DASHBOARD_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = INDENT_DASHBOARD_STATE, action: any) => {
    let listCollect = _.map(action.response, (data: any) => ({ ...data, "sortKey": data.laneCode + data.vehicleTypeCode }))
    let results = _.groupBy(listCollect, "sortKey");
    let resultsArray = Object.keys(results).map((key: any) => ({
        ...results[key][0],
        childArr: _.sortBy(results[key], "level")
    }))
    return {
        ...state,
        listData: isMobile ?
            (state.listData ? [...state.listData, resultsArray] : resultsArray)
            : resultsArray,
        pagination: action.response && action.response.pagination,
        loading: false,
    }
};

const setCurrentPageReducer = (state = INDENT_DASHBOARD_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = INDENT_DASHBOARD_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const refreshListReducer = (state = INDENT_DASHBOARD_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const setFilterReducer = (state = INDENT_DASHBOARD_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = INDENT_DASHBOARD_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];
    switch (action.key) {
        case 'laneName':
            state.filterParams && state.filterParams['laneCode'] && delete state.filterParams['laneCode'];
            break;
        case 'vehicleTypeName':
            state.filterParams && state.filterParams['vehicleTypeCode'] && delete state.filterParams['vehicleTypeCode'];
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
const showLoadingReducer = (state = INDENT_DASHBOARD_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = INDENT_DASHBOARD_STATE) => ({
    ...state,
    loading: false
});
const ACTION_HANDLERS = {
    [IndentDashboardTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [IndentDashboardTypes.TOGGLE_MODAL]: toggleModalReducer,
    [IndentDashboardTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [IndentDashboardTypes.SET_RESPONSE]: setResponseReducer,
    [IndentDashboardTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [IndentDashboardTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [IndentDashboardTypes.REFRESH_LIST]: refreshListReducer,
    [IndentDashboardTypes.TOGGLE_POINTS_MODAL]: togglePointsModalReducer,
    [IndentDashboardTypes.USER_FILTER]: setFilterReducer,
    [IndentDashboardTypes.REMOVE_FILTER]: removeFilterReducer,
    [IndentDashboardTypes.SHOW_LOADING]: showLoadingReducer,
    [IndentDashboardTypes.HIDE_LOADING]: hideLoadingReducer,

}

export default createReducer(INDENT_DASHBOARD_STATE, ACTION_HANDLERS);