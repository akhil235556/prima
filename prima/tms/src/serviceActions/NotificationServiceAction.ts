import { notification } from "../services";
import { Dispatch } from 'redux';
import { handleApiError } from "../base/utility/ErrorHandleUtils";

export const subscribeNotificationTopic = (params: any): any => async (appDispatch: Dispatch) => {
    return notification.subscribeTopic(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, appDispatch);
    });
};

export const unsubscribeNotificationTopic = (params: any): any => async (appDispatch: Dispatch) => {
    return notification.unsubscribeTopic(params).then((responseAxios: any) => responseAxios
    ).catch((error: any) => {
        handleApiError(error.message, appDispatch);
    });
};

export const getNotificationList = (params: any): any => async (appDispatch: Dispatch) => {
    return notification.getNotificationList(params).then((responseAxios: any) => responseAxios && responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, appDispatch);
        });
};

export const getSubscriptionList = (params: any): any => async (appDispatch: Dispatch) => {
    return notification.getSubscriptionList(params).then((responseAxios: any) => responseAxios && responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, appDispatch);
        });
};

export const getID = (): any => async (appDispatch: Dispatch) => {
    return notification.getID().then((responseAxios: any) => responseAxios && responseAxios.details)
        .catch((error: any) => {
            handleApiError(error.message, appDispatch);
        });
};

export const getCount = (params: any): any => async (appDispatch: Dispatch) => {
    return notification.getCount(params).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, appDispatch);
        });
};


export const getGroupedNotifications = (params: any): any => async (appDispatch: Dispatch) => {
    return notification.getGroupedNotifications(params).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, appDispatch);
        });
};

export const getChannelLatest = (params: any): any => async (appDispatch: Dispatch) => {
    return notification.getChannelLatest(params).then((responseAxios: any) => responseAxios)
        .catch((error: any) => {
            handleApiError(error.message, appDispatch);
        });
};

export const markRead = (params: any): any => async (appDispatch: Dispatch) => {
    return notification.markRead(params).then((responseAxios: any) => {
        return responseAxios;
    }).catch((error: any) => {
        handleApiError(error.message, appDispatch);
    });
};

export const updateToken = (params: any): any => async (appDispatch: Dispatch) => {
    notification.updateToken(params).then((responseAxios: any) => {
        return responseAxios;
    }).catch((error: any) => {
        handleApiError(error.message, appDispatch);
    });
};