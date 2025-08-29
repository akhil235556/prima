import { ForwardTracking } from "../storeStates/ForwardTrackingInterface";
import ForwardTrackingTypes from "../types/ForwardTrackingTypes";

export const toggleFilter = () => ({
  type: ForwardTrackingTypes.TOGGLE_FILTER,
});

export const toggleModal = () => ({
  type: ForwardTrackingTypes.TOGGLE_MODAL,
});

export const setSelectedElement = (value: ForwardTracking | undefined) => ({
  type: ForwardTrackingTypes.SELECTED_ELEMENT,
  value,
});

export const setResponse = (response: any) => ({
  type: ForwardTrackingTypes.SET_RESPONSE,
  response,
});

export const setCurrentPage = (value: any) => ({
  type: ForwardTrackingTypes.SET_CURRENT_PAGE,
  value
});

export const refreshList = () => ({
  type: ForwardTrackingTypes.REFRESH_LIST,
});

export const searchQuery = (value: string) => ({
  type: ForwardTrackingTypes.SEARCH_QUERY,
  value
});

export const setRowPerPage = (value: any) => ({
  type: ForwardTrackingTypes.SET_ROW_PER_PAGE,
  value
});

export const setFilter = (chips: any, params: any) => ({
  type: ForwardTrackingTypes.USER_FILTER,
  chips,
  params,
});

export const removeFilter = (key: any) => ({
  type: ForwardTrackingTypes.REMOVE_FILTER,
  key
});