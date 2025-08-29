import { Dispatch } from "redux";
import Api from "../../../../base/api/ApiMethods";
import DownloadApi from "../../../../base/api/DownloadApiMethods";
import { handleApiError } from "../../../../base/utility/ErrorHandleUtils";
import { hideLoader } from "../../../../redux/actions/AppActions";
import { hideLoading, setResponse } from "../masterDriverRedux/MasterDriverAction";
import MasterDriverServices from "./MasterDriverServices";


const drivers = MasterDriverServices(Api);
const driversDownload = MasterDriverServices(DownloadApi);

export const getDriversList = (reactDispatch: any, queryParams: any): any => async (dispatch: Dispatch) => {
  drivers.getDriversList(queryParams).then((responseAxios: any) => {
    reactDispatch(setResponse(responseAxios.details));
    reactDispatch(hideLoading());
    dispatch(hideLoader());
  }).catch((error: any) => {
    reactDispatch(hideLoading());
    handleApiError(error.message, dispatch)
  });
};

export const createDriver = (params: any): any => async (dispatch: Dispatch) => {
  return drivers.createDriver(params).then((responseAxios: any) => responseAxios)
    .catch((error: any) => {
      handleApiError(error.message, dispatch)
    });
};

export const updateDriver = (params: any): any => async (dispatch: Dispatch) => {
  return drivers.updateDriver(params).then((responseAxios: any) => responseAxios)
    .catch((error: any) => {
      handleApiError(error.message, dispatch)
    });
};

export const searchDriverList = (params: any): any => async (dispatch: Dispatch) => {
  return drivers.searchDriverList(params).then((responseAxios: any) => responseAxios.details)
    .catch((error: any) => {
      handleApiError(error.message, dispatch)
    });
};

export const getDriversTemplate = (): any => async (dispatch: Dispatch) => {
  return drivers.getDriversTemplate().then((responseAxios: any) => responseAxios.details)
    .catch((error: any) => {
      handleApiError(error.message, dispatch)
    });
};

export const getDriversDetail = (params: any): any => async (dispatch: Dispatch) => {
  return drivers.getDriversDetail(params).then((responseAxios: any) => responseAxios.details)
    .catch((error: any) => {
      handleApiError(error.message, dispatch)
    });
};

export const updateDriverStatus = (params: any): any => async (dispatch: Dispatch) => {
  return drivers.updateDriverStatus(params).then((responseAxios: any) => responseAxios)
    .catch((error: any) => {
      handleApiError(error.message, dispatch)
    });
};

export const getCsvLink = (params?: any): any => async (appDispatch: Dispatch) => {
  return driversDownload.getCsvLink(params).then((responseAxios: any) => {
    return responseAxios && responseAxios.details;
  }).catch((error: any) => {
    handleApiError(error.message, appDispatch)
  });
};