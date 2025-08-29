import { AnalyticsDateGroup } from "../base/constant/ArrayList";

export function getDateFormatter(key: string) {
    switch (key) {
        case AnalyticsDateGroup.DAY:
            return "ddd"
        case AnalyticsDateGroup.WEEK:
            return "DD-MMM"
        case AnalyticsDateGroup.MONTH:
            return "MMM"
        default:
            return "ddd"
    }
}