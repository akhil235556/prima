export function getBasePrice(userParams: any) {
    if (userParams.freightType && userParams.freightType.value === "PTL" && userParams.biddingRateCriteria && userParams.biddingRateCriteria.value === "Per KG" && userParams.load) {
        return userParams.basePrice * userParams.load
    }
    return userParams.basePrice;
}