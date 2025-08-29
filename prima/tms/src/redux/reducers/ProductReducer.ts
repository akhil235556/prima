import { createReducer } from "reduxsauce";
import { rowsPerPageOptions } from "../../base/constant/ArrayList";
import { isMobile } from "../../base/utility/ViewUtils";
import { ProductState } from '../storeStates/ProductStoreInterface';
import ProductTypes from "../types/ProductTypes";

export const PRODUCT_STATE: ProductState = {
    openFilter: false,
    selectedItem: undefined,
    pagination: undefined,
    listData: undefined,
    openModal: false,
    openBulkUpload: false,
    loading: false,
    currentPage: 1,
    refresh_list: false,
    searchQuery: "",
    pageSize: rowsPerPageOptions[0],
    filterParams: {},
    filterChips: {},
}

const toggleFilterReducer = (state = PRODUCT_STATE) => ({
    ...state,
    openFilter: !state.openFilter
});

const toggleModalReducer = (state = PRODUCT_STATE) => ({
    ...state,
    openModal: !state.openModal
});

const toggleBulkUploadReducer = (state = PRODUCT_STATE) => ({
    ...state,
    openBulkUpload: !state.openBulkUpload
});

const setSelectedElementReducer = (state = PRODUCT_STATE, action: any) => ({
    ...state,
    selectedItem: action.value
});

const setResponseReducer = (state = PRODUCT_STATE, action: any) => ({
    ...state,
    pagination: action.response && action.response.pagination,
    listData: isMobile ?
        (state.listData ? [...state.listData, ...action.response && action.response.results] : action.response && action.response.results)
        : action.response && action.response.results,
    loading: false,
});

const setCurrentPageReducer = (state = PRODUCT_STATE, action: any) => ({
    ...state,
    currentPage: action.value
});

const setRefreshListReducer = (state = PRODUCT_STATE) => ({
    ...state,
    refresh_list: !state.refresh_list,
    currentPage: 1,
    listData: undefined,
});

const searchQueryReducer = (state = PRODUCT_STATE, action: any) => ({
    ...state,
    searchQuery: action.value
});

const setRowPerPageReducer = (state = PRODUCT_STATE, action: any) => ({
    ...state,
    pageSize: action.value,
    currentPage: 1,
});

const showLoadingReducer = (state = PRODUCT_STATE) => ({
    ...state,
    loading: true
});

const hideLoadingReducer = (state = PRODUCT_STATE) => ({
    ...state,
    loading: false
});

const setFilterReducer = (state = PRODUCT_STATE, action: any) => ({
    ...state,
    filterChips: action.chips,
    filterParams: action.params,
    currentPage: 1,
    listData: undefined,
});

const removeFilterReducer = (state = PRODUCT_STATE, action: any) => {
    state.filterChips && state.filterChips[action.key] && delete state.filterChips[action.key];
    switch (action.key) {
        case "name":
            state.filterParams && state.filterParams["sku"] && delete state.filterParams["sku"];
            break;
        case "productTypeLabel":
            state.filterParams && state.filterParams["productTypeCode"] && delete state.filterParams["productTypeCode"];
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
        refresh_list: !state.refresh_list,
    }
};

const ACTION_HANDLERS = {
    [ProductTypes.TOGGLE_FILTER]: toggleFilterReducer,
    [ProductTypes.TOGGLE_MODAL]: toggleModalReducer,
    [ProductTypes.SELECTED_ELEMENT]: setSelectedElementReducer,
    [ProductTypes.SET_RESPONSE]: setResponseReducer,
    [ProductTypes.SET_CURRENT_PAGE]: setCurrentPageReducer,
    [ProductTypes.REFRESH_LIST]: setRefreshListReducer,
    [ProductTypes.SEARCH_QUERY]: searchQueryReducer,
    [ProductTypes.SET_ROW_PER_PAGE]: setRowPerPageReducer,
    [ProductTypes.SHOW_LOADING]: showLoadingReducer,
    [ProductTypes.HIDE_LOADING]: hideLoadingReducer,
    [ProductTypes.SET_FILTER]: setFilterReducer,
    [ProductTypes.REMOVE_FILTER]: removeFilterReducer,
    [ProductTypes.BULK_UPLOAD]: toggleBulkUploadReducer,
}

export default createReducer(PRODUCT_STATE, ACTION_HANDLERS);