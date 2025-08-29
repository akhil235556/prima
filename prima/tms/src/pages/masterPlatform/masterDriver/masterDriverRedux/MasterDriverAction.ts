import MasterDriverTypes from "./MasterDriverTypes";

export const toggleModal = () => ({
  type: MasterDriverTypes.TOGGLE_MODAL,
});

export const toggleFilter = () => ({
  type: MasterDriverTypes.TOGGLE_FILTER,
});

export const setResponse = (response: any) => ({
  type: MasterDriverTypes.SET_RESPONSE,
  response,
});

export const setSelectedElement = (value: any) => ({
  type: MasterDriverTypes.SET_SELECTED_ELEMENT,
  value,
});

export const setCurrentPage = (value: any) => ({
  type: MasterDriverTypes.SET_CURRENT_PAGE,
  value
});

export const refreshList = () => ({
  type: MasterDriverTypes.REFRESH_LIST,
});

export const setRowPerPage = (value: any) => ({
  type: MasterDriverTypes.SET_ROW_PER_PAGE,
  value
});

export const showLoading = () => ({
  type: MasterDriverTypes.SHOW_LOADING,
});

export const hideLoading = () => ({
  type: MasterDriverTypes.HIDE_LOADING,
});

export const setFilter = (chips: any, params: any) => ({
  type: MasterDriverTypes.USER_FILTER,
  chips,
  params,
});

export const removeFilter = (key: any) => ({
  type: MasterDriverTypes.REMOVE_FILTER,
  key
});

export const toggleBulkUpload = () => ({
  type: MasterDriverTypes.TOGGLE_BULK_UPLOAD,
});