import { AxiosInstance } from "axios";
import { TrackingAssetsListUrl, createTrackingAssetUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getTrackingAssetsList() {
        return api.get(TrackingAssetsListUrl);
    }
    function createTrackingAsset(params: any, isUpdate: boolean) {
        return (isUpdate ? api.put(createTrackingAssetUrl, params) : api.post(createTrackingAssetUrl, params));
    }

    return {
        getTrackingAssetsList,
        createTrackingAsset
    }
}