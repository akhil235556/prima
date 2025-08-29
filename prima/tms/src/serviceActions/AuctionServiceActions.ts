import { Dispatch } from "redux";
import { handleApiError } from "../base/utility/ErrorHandleUtils";
import { auction } from "../services";

export const getAuctionList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return auction.getAuctionList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const createAuction = (queryParams: any): any => async (dispatch: Dispatch) => {
    return auction.createAuction(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const cancelAuction = (params: any): any => async (appDispatch: Dispatch) => {
    return auction.cancelAuction(params).then((responseAxios: any) => {
        return responseAxios;
    }).catch((error: any) => {
        handleApiError(error.message, appDispatch)
    });
};

export const getAuctionDetails = (queryParams: any): any => async (dispatch: Dispatch) => {
    return auction.getAuctionDetails(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const getBidList = (queryParams: any): any => async (dispatch: Dispatch) => {
    return auction.getBidList(queryParams).then((responseAxios: any) => responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const updateAuction = (queryParams: any): any => async (dispatch: Dispatch) => {
    return auction.updateAuction(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const selectBid = (queryParams: any): any => async (dispatch: Dispatch) => {
    return auction.selectBid(queryParams).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const getScore = (): any => async (dispatch: Dispatch) => {
    return auction.getScore().then((responseAxios: any) => responseAxios && responseAxios.details
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};

export const terminateAuction = (params: any): any => async (dispatch: Dispatch) => {
    return auction.terminateAuction(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, dispatch);
    });
};