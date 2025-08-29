import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { forwardTracking, forwardTrackingDownload } from "../services";

export const getForwardTrackingList =
  (queryParams: any): any =>
    async (dispatch: Dispatch) => {
      return forwardTracking
        .getForwardTrackingList(queryParams)
        .then((responseAxios: any) => responseAxios.details)
        .catch((error: any) => {
          handleApiError(error.message, dispatch);
        });
    };

export const getCountList =
  (queryParams: any): any =>
    async (dispatch: Dispatch) => {
      return forwardTracking
        .getCountList(queryParams)
        .then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
          handleApiError(error.message, dispatch);
        });
    };

export const getCsvLink =
  (params?: any): any =>
    async (appDispatch: Dispatch) => {
      return forwardTrackingDownload
        .getCsvLink(params)
        .then((responseAxios: any) => {
          return responseAxios;
        })
        .catch((error: any) => {
          handleApiError(error.message, appDispatch);
        });
    };
