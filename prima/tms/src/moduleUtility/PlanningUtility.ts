import { DispatchPeriodsEnum } from "../base/constant/ArrayList";

export function getPlanningChipsObject(filterChips: any) {
    let chips: any = Object.assign({}, filterChips);
    if (filterChips && filterChips.period && filterChips.period === DispatchPeriodsEnum.Custom) {
        chips = {
            ...chips,
            period: filterChips.fromDatetime + " to " + filterChips.toDatetime,
            fromDatetime: "",
            toDatetime: "",
        }
        return chips;
    } else {
        return chips;
    }
}