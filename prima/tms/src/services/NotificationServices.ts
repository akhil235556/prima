import { AxiosInstance } from 'axios';
import {
    notificationList, subscriptionList, subscribeTopicUrl, unsubscribeTopicUrl, idUrl,
    groupedNotificationList, markReadUrl, getChannelLatestUrl, countUrl, updateTokenUrl
} from '../base/api/ServiceUrl';


export default (api: AxiosInstance) => {
    function subscribeTopic(params: any) {
        return api.post(subscribeTopicUrl, params);
    }
    function unsubscribeTopic(params: any) {
        return api.post(unsubscribeTopicUrl, params);
    }
    function getNotificationList(params: any) {
        return api.get(notificationList, { params: params });
    }
    function getSubscriptionList(params: any) {
        return api.get(subscriptionList, { params: params });
    }
    function getID() {
        return api.get(idUrl);
    }
    function getCount(params: any) {
        return api.get(countUrl, { params: params });
    }
    function getGroupedNotifications(params: any) {
        return api.get(groupedNotificationList, { params: params });
    }
    function markRead(params: any) {
        return api.put(markReadUrl, params);
    }
    function getChannelLatest(params: any) {
        return api.get(getChannelLatestUrl, { params: params });
    }
    function updateToken(params: any) {
        return api.put(updateTokenUrl, params);
    }
    return {
        getNotificationList,
        getSubscriptionList,
        subscribeTopic,
        unsubscribeTopic,
        getID,
        getGroupedNotifications,
        markRead,
        getChannelLatest,
        getCount,
        updateToken,
    }
}

