import PlacementEfficiencyTypes from "../types/PlacementEfficiencyTypes";
import { PlacementEfficiency } from "../storeStates/PlacementEfficiencyInterface";

export const toggleFilter = () => ({
    type: PlacementEfficiencyTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: PlacementEfficiencyTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: PlacementEfficiency | undefined) => ({
    type: PlacementEfficiencyTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: PlacementEfficiencyTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: PlacementEfficiencyTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: PlacementEfficiencyTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: PlacementEfficiencyTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: PlacementEfficiencyTypes.SET_ROW_PER_PAGE,
    value
});

export const setFilter = (chips: any, params: any) => ({
    type: PlacementEfficiencyTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: PlacementEfficiencyTypes.REMOVE_FILTER,
    key
});