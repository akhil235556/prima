import { createReducer } from "reduxsauce";
import ForecastTypes from "../types/ForecastTypes";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { ForecastState } from "../storeStates/ForecastInterface";
import { isMobile } from "../../base/utility/ViewUtils";

export const Forecast_STATE: ForecastState = {
    openFilter: false,
    loading: false,
    refreshList: false,
    openPointModal: false,
    openModal: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    currentPage: 1,
    pageSize: rowsPerPageOptions[0],
    searchQuery: "",
    filterParams: {},
    filterChips: {},
}

const toggleFilterReducer = (state = Forecast_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

// const refreshListReducer = (state = Forecast_STATE) => ({
//     ...state,
//     refreshList: !state.refreshList,
//     currentPage: 1,
//     listData: undefined,
// });

const toggleModalReducer = (state = Forecast_STATE) => ({
    ...state,
    openModal: !state.openModal
});

// const setSelectedElementReducer = (state = Forecast_STATE, action: any) => ({
//     ...state,
//     selectedItem: action.value
// });

const setResponseReducer = (state = Forecast_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.stocks] : action.response && action.response.stocks)
        : action.response && action.response.stocks,

    loading: false,
});


const setCurrentPageReducer = (state = Forecast_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRowPerPageReducer = (state = Forecast_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
    listData: undefined,
});

const setFilterReducer = (state = Forecast_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = Forecast_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];

    switch (action.key) {
        case "locationName":
            state.filterParams && state.filterParams["location"] && delete state.filterParams["location"];
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

// const togglePointsModalReducer = (state = Forecast_STATE) => ({
//     ...state,
//     openPointModal: !state.openPointModal
// });

const showLoadingReducer = (state = Forecast_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = Forecast_STATE) => ({
    ...state,
    loading: false
});


const ACTION_HANDLERS = {
    [ForecastTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [ForecastTypes.TOGGLE_MODAL]: toggleModalReducer,
    [ForecastTypes.SET_RESPONSE]: setResponseReducer,
    [ForecastTypes.SET_FILTER]: setFilterReducer,
    [ForecastTypes.REMOVE_FILTER]: removeFilterReducer,
    [ForecastTypes.SHOW_LOADING]: showLoadingReducer,
    [ForecastTypes.HIDE_LOADING]: hideLoadingReducer,
    [ForecastTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [ForecastTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,


}

export default createReducer(Forecast_STATE, ACTION_HANDLERS);