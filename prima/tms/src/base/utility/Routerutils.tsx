import moment from 'moment';
import { useLocation } from 'react-router-dom';
import { DispatchPeriodsEnum } from '../constant/ArrayList';
import { convertDateToServerFromDate, convertDateToServerToDate, getPastDate } from './DateUtils';
import { isNullValue } from './StringUtils';
import { isMobile } from './ViewUtils';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function createQueryParams(searchParams: any, chips: any, params: any, filterKeySet: any) {
    // eslint-disable-next-line
    filterKeySet && Object.entries(filterKeySet).map((element) => {
        searchParams.delete(element[0]);
        searchParams.delete(element[1]);
    });

    if (chips) {
        // eslint-disable-next-line
        Object.entries(chips).map((p: any) => {
            searchParams.delete(p[0]);
            if (!isNullValue(p[1])) {
                searchParams.append(p[0], p[1])
            }
        })
    }
    if (params) {
        // eslint-disable-next-line
        Object.entries(params).map((p: any) => {
            searchParams.delete(p[0]);
            if (!isNullValue(p[1])) {
                searchParams.append(p[0], p[1])
            }
        })
    }
    return searchParams;
}
export function getDefaultDateParams(url: any) {

    let lastWeek = {
        fromDate: convertDateToServerFromDate(getPastDate(moment(new Date()).add(1, "day"), 1, "weeks")),
        toDate: convertDateToServerToDate(new Date()),
    }
    let fromDate = lastWeek && lastWeek.fromDate;
    let toDate = lastWeek && lastWeek.toDate;
    return url + "?fromDate=" + encodeURIComponent(fromDate) + "&toDate=" + encodeURIComponent(toDate);
}


function getFilterChipsAndParams(queryParams: any, filterKeys: any) {
    let chips: any = {};
    let params: any = {}
    if (queryParams) {
        // eslint-disable-next-line
        Object.keys(filterKeys).map((key: any) => {
            let paramsKey = filterKeys[key];
            if (queryParams.get(key)) {
                chips[key] = queryParams.get(key);
            }
            if (queryParams.get(paramsKey)) {
                params[paramsKey] = queryParams.get(paramsKey)
            }
        });
    }
    return {
        chips,
        params
    }

}

function removeQueryFilter(appliedFilters: any, chipKey: string, paramsKey: any) {
    appliedFilters && appliedFilters.chips && appliedFilters.chips[chipKey] && delete appliedFilters.chips[chipKey];
    appliedFilters && appliedFilters.params && appliedFilters.params[paramsKey] && delete appliedFilters.params[paramsKey];
    return appliedFilters;
}

function getSearchDateFilter(appliedFilters: any) {
    let filters: any = {};
    if (appliedFilters && appliedFilters.fromDate) {
        filters.fromDate = appliedFilters.fromDate
    }
    if (appliedFilters && appliedFilters.toDate) {
        filters.toDate = appliedFilters.toDate
    }
    if (appliedFilters && appliedFilters.fromDatetime) {
        filters.fromDate = appliedFilters.fromDatetime
    }
    if (appliedFilters && appliedFilters.toDatetime) {
        filters.toDate = appliedFilters.toDatetime
    }
    return filters;
}

function removeSearchDateFilter(appliedFilters: any) {
    let filters: any = Object.assign({}, appliedFilters);
    if (filters && filters.fromDate) {
        delete filters.fromDate;
    }
    if (filters && filters.toDate) {
        delete filters.toDate;
    }
    return filters;
}

function getAdvanceFilterChips(filterChips: any) {
    let chips: any = Object.assign({}, filterChips);
    if (chips && chips.queryField) {
        delete chips["queryField"]
    }
    if (chips && chips.queryFieldLabel) {
        delete chips["queryFieldLabel"]
    }
    if (chips && chips.query && !isMobile) {
        delete chips["query"]
    }
    if (chips && chips.periodLabel && chips.periodLabel === DispatchPeriodsEnum.Custom) {
        chips = {
            ...chips,
            periodLabel: chips.fromDateLabel + " to " + chips.toDateLabel,
            fromDateLabel: "",
            toDateLabel: "",
        }
    }
    return chips;
}

function createObjectQueryParams(obj: any) {
    return new URLSearchParams(obj).toString();
}

export {
    useQuery,
    createQueryParams,
    getFilterChipsAndParams,
    removeQueryFilter,
    getSearchDateFilter,
    removeSearchDateFilter,
    getAdvanceFilterChips,
    createObjectQueryParams
};
