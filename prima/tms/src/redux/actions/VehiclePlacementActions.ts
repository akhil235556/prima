import { VehiclePlacement } from "../storeStates/VehiclePlacementInterface";
import VehiclePlacementTypes from "../types/VehiclePlacementTypes";

export const toggleFilter = () => ({
    type: VehiclePlacementTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
    type: VehiclePlacementTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: VehiclePlacement | undefined) => ({
    type: VehiclePlacementTypes.SELECTED_ELEMENT,
    value,
});

export const setResponse = (response: any) => ({
    type: VehiclePlacementTypes.SET_RESPONSE,
    response,
});

export const setCurrentPage = (value: any) => ({
    type: VehiclePlacementTypes.SET_CURRENT_PAGE,
    value
});

export const refreshList = () => ({
    type: VehiclePlacementTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
    type: VehiclePlacementTypes.SEARCH_QUERY,
    value
});

export const setRowPerPage = (value: any) => ({
    type: VehiclePlacementTypes.SET_ROW_PER_PAGE,
    value
});

export const setFilter = (chips: any, params: any) => ({
    type: VehiclePlacementTypes.USER_FILTER,
    chips,
    params,
});

export const removeFilter = (key: any) => ({
    type: VehiclePlacementTypes.REMOVE_FILTER,
    key
});