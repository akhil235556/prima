import { createReducer } from "reduxsauce";
import ServiceabilityTypes from "../types/ServiceabilityTypes";
import { ServiceabilityState } from '../storeStates/ServiceabilityStoreInterface';
import { rowsPerPageOptions } from '../../base/constant/ArrayList';
import { isMobile } from "../../base/utility/ViewUtils";
// import _ from "lodash"

export const SERVICEABILITY_STATE: ServiceabilityState = {
    openModal: false,
    openPointsModal: false,
    openBulkUpload: false,
    refreshList: false,
    loading: false,
    listData: undefined,
    pagination: undefined,
    selectedElement: undefined,
    currentPage: 1,
    pageSize: rowsPerPageOptions[0],
    filterParams: {},
    filterChips: {},
    openFilter: false,
}

const toggleModalReducer = (state = SERVICEABILITY_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const toggleLaneModalReducer = (state = SERVICEABILITY_STATE) => ({
    ...state,
    openPointsModal: !state.openPointsModal
});

const toggleFilterReducer = (state = SERVICEABILITY_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleBulkModalReducer = (state = SERVICEABILITY_STATE) => ({
    ...state,
    openBulkUpload: !state.openBulkUpload
});

const setFilterReducer = (state = SERVICEABILITY_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = SERVICEABILITY_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];
    switch (action.key) {
        case 'laneName':
            state.filterParams && state.filterParams['laneCode'] && delete state.filterParams['laneCode'];
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

// const setResponseReducer = (state = SERVICEABILITY_STATE, action: any) => ({
    
//     ...state,
//     listData: isMobile ?
//         (state.listData ? [...state.listData, ...action.response && action.response.results] : action.response && action.response.results)
//         : action.response && action.response.results,
//     pagination: action.response && action.response.pagination,
//     loading: false,
// });

const setResponseReducer = (state = SERVICEABILITY_STATE, action: any) => {
    if (action.response && action.response.results) {
        // let results = _.groupBy(action.response.results, "laneCode");
        // let resultsArray = Object.keys(results).map((key: any) => ({
        //     ...results[key][0],
        //     childArr: _.sortBy(results[key], "tat")
        // }))
        return {
            ...state,
            listData: isMobile ?
                (state.listData ? [...state.listData, action.response.results] : action.response.results)
                : action.response.results,
            pagination: action.response && action.response.pagination,
            loading: false,
        }
    }

    return {
        ...state
    }
    
}
const setSelectedElementReducer = (state = SERVICEABILITY_STATE, action: any) => ({
    ...state,
    selectedElement: action.value
});

const setCurrentPageReducer = (state = SERVICEABILITY_STATE, action: any) => ({
    ...state,
    currentPage: action.value,
});

const refreshListReducer = (state = SERVICEABILITY_STATE) => ({
    ...state,
    refreshList: !state.refreshList,
    currentPage: 1,
    listData: undefined,
});

const setRowPerPageReducer = (state = SERVICEABILITY_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const toggleLoadingReducer = (state = SERVICEABILITY_STATE) => ({
    ...state,
    loading: !state.loading
});

const showLoadingReducer = (state = SERVICEABILITY_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = SERVICEABILITY_STATE) => ({
    ...state,
    loading: false
});

const ACTION_HANDLERS = {
    [ServiceabilityTypes.TOGGLE_MODAL]: toggleModalReducer,
    [ServiceabilityTypes.TOGGLE_LANE_MODAL]: toggleLaneModalReducer,
    [ServiceabilityTypes.SET_RESPONSE]: setResponseReducer,
    [ServiceabilityTypes.SET_SELECTED_ELEMENT]: setSelectedElementReducer,
    [ServiceabilityTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [ServiceabilityTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [ServiceabilityTypes.REFRESH_LIST]: refreshListReducer,
    [ServiceabilityTypes.TOGGLE_LOADING]: toggleLoadingReducer,
    [ServiceabilityTypes.SHOW_LOADING]: showLoadingReducer,
    [ServiceabilityTypes.HIDE_LOADING]: hideLoadingReducer,
    [ServiceabilityTypes.USER_FILTER]: setFilterReducer,
    [ServiceabilityTypes.REMOVE_FILTER]: removeFilterReducer,
    [ServiceabilityTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [ServiceabilityTypes.TOGGLE_BULK_MODAL]: toggleBulkModalReducer
}

export default createReducer(SERVICEABILITY_STATE, ACTION_HANDLERS);