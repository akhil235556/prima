import { AxiosInstance } from "axios";
import { auctionBidListUrl, auctionDetailUrl, auctionListUrl, cancelAuctionUrl, createAuctionUrl, getScoreUrl, selectBidUrl, terminateAuctionUrl, updateAuctionUrl } from '../base/api/ServiceUrl';

export default (api: AxiosInstance) => {
    function getAuctionList(queryParams: any) {
        return api.get(auctionListUrl, { params: queryParams });
    }
    function createAuction(queryParams: any) {
        return api.post(createAuctionUrl, queryParams);
    }
    function cancelAuction(queryParams: any) {
        return api.put(cancelAuctionUrl, queryParams);
    }
    function getAuctionDetails(queryParams: any) {
        return api.get(auctionDetailUrl, { params: queryParams });
    }
    function getBidList(queryParams: any) {
        return api.get(auctionBidListUrl, { params: queryParams });
    }
    function updateAuction(queryParams: any) {
        return api.put(updateAuctionUrl, queryParams);
    }
    function selectBid(queryParams: any) {
        return api.post(selectBidUrl, queryParams);
    }
    function getScore() {
        return api.get(getScoreUrl);
    }
    function terminateAuction(params: any) {
        return api.put(terminateAuctionUrl, params);
    }
    return {
        getAuctionList,
        createAuction,
        cancelAuction,
        getAuctionDetails,
        getBidList,
        updateAuction,
        selectBid,
        getScore,
        terminateAuction,
    }
}