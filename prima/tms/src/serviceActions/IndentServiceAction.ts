import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { hideLoading, setResponse } from "../redux/actions/IndentAction";
import { indent } from "../services";

export const getIndentList = (
  reactDispatch: any,
  queryParams: any
): any => async (dispatch: Dispatch) => {
  indent
    .getIndentList(queryParams)
    .then((responseAxios: any) => {
      reactDispatch(setResponse(responseAxios.details));
      reactDispatch(hideLoading());
    })
    .catch((error: any) => {
      reactDispatch(hideLoading());
      handleApiError(error.message, dispatch);
    });
};

export const createIndent = (params: any): any => async (
  dispatch: Dispatch
) => {
  return indent
    .createIndent(params)
    .then((responseAxios: any) => responseAxios)
    .catch((error: any) => {
      handleApiError(error.message, dispatch);
    });
};

export const getIndentDetails = (queryParams: any): any =>
  async (dispatch: Dispatch) => {
    return indent.getIndentDetails(queryParams)
      .then((responseAxios: any) => responseAxios)
      .catch((error: any) => {
        handleApiError(error.message, dispatch);
      });
  };

export const updateReferenceIds = (params: any): any =>
  async (dispatch: Dispatch) => {
    return indent.updateReferenceIds(params)
      .then((responseAxios: any) => responseAxios)
      .catch((error: any) => {
        handleApiError(error.message, dispatch);
      });
  };

export const cancelIndentOrder = (params: any): any =>
  async (dispatch: Dispatch) => {
    return indent.cancelIndentOrder(params)
      .then((responseAxios: any) => responseAxios)
      .catch((error: any) => {
        handleApiError(error.message, dispatch);
      });
  };

export const getIndentContracts = (queryParams: any): any =>
  async (dispatch: Dispatch) => {
    return indent.getIndentContracts(queryParams)
      .then((responseAxios: any) => responseAxios.details)
      .catch((error: any) => {
        handleApiError(error.message, dispatch);
      });
  };

export const getIndentSOB = (queryParams: any): any =>
  async (dispatch: Dispatch) => {
    return indent.getIndentSOB(queryParams)
      .then((responseAxios: any) => responseAxios.details && responseAxios.details[0])
      .catch((error: any) => {
        handleApiError(error.message, dispatch);
      });
  };

export const getIndentVehicleTypes = (params: any): any => async (dispatch: Dispatch) => {
  return indent.getIndentVehicleTypes(params).then((responseAxios: any) => responseAxios && responseAxios.details
  ).catch((error: any) => {
    handleApiError(error.message, dispatch)
  });
};

